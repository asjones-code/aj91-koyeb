/**
 * AI trader engine: seed sale, decision runs, risk monitor, valuation.
 * All state-changing work runs through one lock so jobs never overlap.
 */
import { CONVICTION_CAP_PCT } from "./config.js";

const HOUR = 3600_000;
const r2 = (v) => Math.round(v * 100) / 100;

/** Fund units outstanding: the seed bought `seed_usd` units at 1.00; top-ups buy more at the current price. */
export const fundUnits = (fund) => fund?.units ?? fund?.seed_usd ?? 0;
/** Price per unit (1.00 at the seed). Return since inception = nav − 1, unaffected by deposits. */
export const fundNav = (fund, equity) => { const u = fundUnits(fund); return u > 0 ? equity / u : null; };

export function createEngine({ cfgFn, store, kraken, brain, notify, log = console }) {
	// ── lock ─────────────────────────────────────────────────────────────────
	let chain = Promise.resolve();
	let busy = null;
	function withLock(name, fn) {
		const run = chain.then(async () => {
			busy = name;
			try { return await fn(); } finally { busy = null; }
		});
		chain = run.catch(() => {});
		return run;
	}

	// ── valuation ────────────────────────────────────────────────────────────
	async function priceMap(assets) {
		const p = await kraken.prices([...new Set(assets)]);
		return Object.fromEntries(Object.entries(p).map(([a, v]) => [a, v.last]));
	}
	function valuation(fund, open, prices) {
		const positions = open.map((t) => {
			const price = prices[t.asset] ?? t.entry_price;
			const value = t.qty * price;
			const basis = t.cost_usd + t.entry_fee;
			return {
				...t, price, value,
				unrealized_usd: value + t.realized_usd - basis,
				unrealized_pct: basis > 0 ? ((value + t.realized_usd) / basis - 1) * 100 : 0,
				hours_open: (Date.now() - new Date(t.opened_at).getTime()) / HOUR,
				hours_left: (new Date(t.max_hold_until).getTime() - Date.now()) / HOUR,
			};
		});
		const positionsUsd = positions.reduce((s, p) => s + p.value, 0);
		const equity = (fund?.cash_usd || 0) + positionsUsd;
		return { positions, positionsUsd, equity };
	}
	const basketValue = (fund, prices) =>
		(fund?.seed_basket || []).reduce((s, b) => s + b.qty * (prices[b.asset] ?? b.price), 0);

	async function checkDrawdown(fund, equity) {
		if (fund.status !== "active") return fund;
		const peak = Math.max(fund.peak_equity || 0, equity);
		const dd = peak > 0 ? 1 - equity / peak : 0;
		const fields = {};
		if (peak !== fund.peak_equity) fields.peak_equity = peak;
		if (!fund.halted && dd >= cfgFn().maxDrawdown) {
			fields.halted = true;
			fields.halted_reason = `Drawdown ${(dd * 100).toFixed(1)}% hit the ${(cfgFn().maxDrawdown * 100).toFixed(0)}% limit`;
			await notify.alert(`AI trader halted — ${fields.halted_reason}`,
				`The AI trader stopped opening new trades. Equity $${equity.toFixed(2)} vs peak $${peak.toFixed(2)}. Open positions keep their stops. Resume from the AI Trader panel once you've reviewed it.`);
		}
		return Object.keys(fields).length ? store.updateFund(fields) : fund;
	}

	// ── closing a position ───────────────────────────────────────────────────
	async function closeTrade(trade, reason, note) {
		const info = (await kraken.pairInfo([trade.asset]))[trade.asset];
		if (!info) throw new Error(`no USD pair for ${trade.asset}`);
		const held = (await kraken.balances())[trade.asset] || 0;
		const qty = kraken.floorTo(Math.min(trade.qty, held), info.lotDecimals);
		const basis = trade.cost_usd + trade.entry_fee;
		if (qty <= 0 || qty < info.ordermin) {
			// Coins are gone (sold manually?) or below Kraken's minimum: close the record at what was realized.
			const exitValue = trade.realized_usd;
			return store.updateTrade(trade.id, {
				status: "closed", closed_at: new Date(), exit_reason: reason, exit_value_usd: exitValue, exit_fee: 0,
				exit_note: `${note || ""} [exchange balance ${held} < minimum ${info.ordermin}; closed without an order]`.trim(),
				pnl_usd: exitValue - basis, pnl_pct: basis > 0 ? (exitValue / basis - 1) * 100 : 0,
			});
		}
		const fill = await kraken.marketOrder({ pair: info.pair, side: "sell", volume: qty, lotDecimals: info.lotDecimals });
		const proceeds = fill.cost - fill.fee;
		await store.adjustCash(proceeds, fill.fee);
		const remaining = trade.qty - fill.volExec;
		if (remaining > trade.qty * 0.001 && remaining * (fill.avgPrice || trade.entry_price) >= 1) {
			// Partial exit: keep the rest open, remember what was realized.
			return store.updateTrade(trade.id, {
				qty: remaining, realized_usd: trade.realized_usd + proceeds,
				exit_note: `partial ${reason}: sold ${fill.volExec} (${fill.status})`,
			});
		}
		const exitValue = trade.realized_usd + proceeds;
		return store.updateTrade(trade.id, {
			status: "closed", closed_at: new Date(), exit_price: fill.avgPrice, exit_value_usd: exitValue,
			exit_fee: fill.fee, exit_reason: reason, exit_note: note || null, exit_txid: fill.txid,
			pnl_usd: exitValue - basis, pnl_pct: basis > 0 ? (exitValue / basis - 1) * 100 : 0,
		});
	}

	// ── seed ─────────────────────────────────────────────────────────────────
	async function buildSeedPlan() {
		const cfg = cfgFn();
		const bal = await kraken.balances();
		const assets = Object.keys(bal).filter((a) => bal[a] > 0 && !a.includes(".") && !["USD", "EUR", "GBP", "CAD", "JPY", "AUD", "CHF", "USDT", "USDC"].includes(a));
		const [info, prices] = await Promise.all([kraken.pairInfo(assets), priceMap(assets)]);
		const rows = assets.map((asset) => {
			const pi = info[asset];
			const price = prices[asset];
			const sellQty = pi ? kraken.floorTo(bal[asset] * cfg.seedFraction, pi.lotDecimals) : 0;
			const est = price ? sellQty * price : 0;
			let skip = null;
			if (!pi) skip = "no USD market on Kraken";
			else if (!pi.online) skip = "market not online";
			else if (!price) skip = "no price";
			else if (sellQty < pi.ordermin) skip = `below Kraken minimum (${pi.ordermin} ${asset})`;
			else if (est < Math.max(pi.costmin || 0, 1)) skip = "dust (under $1)";
			return { asset, pair: pi?.pair || null, lotDecimals: pi?.lotDecimals, balance: bal[asset], sell_qty: sellQty, price: price || null, est_usd: r2(est), skip };
		}).sort((a, b) => b.est_usd - a.est_usd);
		const sells = rows.filter((r) => !r.skip);
		return { rows, est_total_usd: r2(sells.reduce((s, r) => s + r.est_usd, 0)), sells };
	}

	const seedPreview = () => withLock("seed-preview", async () => {
		const fund = await store.getFund();
		const plan = await buildSeedPlan();
		return { fund_status: fund.status, fraction: cfgFn().seedFraction, rows: plan.rows, est_total_usd: plan.est_total_usd };
	});

	const seedExecute = () => withLock("seed", async () => {
		if (!(await store.transitionFund("unseeded", "seeding")))
			return { ok: false, error: `Fund is already ${(await store.getFund()).status} — the seed sale runs once` };
		const results = [];
		try {
			const plan = await buildSeedPlan();
			if (!plan.sells.length) throw new Error("Nothing sellable — every holding is dust or has no USD market");
			let proceeds = 0, fees = 0;
			const basket = [];
			for (const s of plan.sells) {
				try {
					const fill = await kraken.marketOrder({ pair: s.pair, side: "sell", volume: s.sell_qty, lotDecimals: s.lotDecimals });
					proceeds += fill.cost - fill.fee;
					fees += fill.fee;
					if (fill.volExec > 0) basket.push({ asset: s.asset, qty: fill.volExec, price: fill.avgPrice || s.price });
					results.push({ asset: s.asset, ok: true, qty: fill.volExec, usd: r2(fill.cost - fill.fee), txid: fill.txid });
				} catch (e) {
					results.push({ asset: s.asset, ok: false, error: e.message });
				}
			}
			if (proceeds <= 0) throw new Error("No sells filled");
			const btc = (await priceMap(["BTC"])).BTC || null;
			const fund = await store.updateFund({
				status: "active", seed_usd: proceeds, cash_usd: proceeds, peak_equity: proceeds,
				seeded_at: new Date(), seed_btc_price: btc, seed_basket: basket, fees_paid: fees,
				halted: false, halted_reason: null,
			});
			await notify.info(`AI trader funded with $${proceeds.toFixed(2)}`,
				`Seed sale complete. Sold half of: ${results.filter((r) => r.ok).map((r) => `${r.asset} ($${r.usd})`).join(", ")}.` +
				(results.some((r) => !r.ok) ? ` Failed: ${results.filter((r) => !r.ok).map((r) => `${r.asset} (${r.error})`).join(", ")}.` : "") +
				` Fees $${fees.toFixed(2)}. The AI now trades this fund.`);
			return { ok: true, fund, results };
		} catch (e) {
			// Roll back to unseeded only if nothing was sold; otherwise keep 'seeding' for manual review.
			const sold = results.some((r) => r.ok);
			if (!sold) await store.transitionFund("seeding", "unseeded");
			return { ok: false, error: e.message, results, needs_review: sold };
		}
	});

	// ── top-ups ──────────────────────────────────────────────────────────────
	/**
	 * USD on Kraken that the fund doesn't account for yet: exchange USD minus fund cash.
	 * A deposit made on Kraken shows up here until it's added to the fund.
	 */
	async function depositState() {
		const fund = await store.getFund();
		const krakenUsd = (await kraken.balances()).USD || 0;
		const open = await store.openTrades();
		const prices = open.length ? await priceMap(open.map((t) => t.asset)) : {};
		const { equity } = valuation(fund, open, prices);
		return { fund, krakenUsd, equity, available: Math.max(0, krakenUsd - (fund.cash_usd || 0)) };
	}

	const depositPreview = () => withLock("deposit-preview", async () => {
		const { fund, krakenUsd, equity, available } = await depositState();
		return {
			fund_status: fund.status, kraken_usd: r2(krakenUsd), fund_cash_usd: r2(fund.cash_usd),
			available_usd: Math.floor(available * 100) / 100, equity_usd: r2(equity),
			nav: fund.status === "active" ? fundNav(fund, equity) : null, deposits_usd: r2(fund.deposits_usd || 0),
		};
	});

	/** Add `usd` of unallocated Kraken USD to the fund at the current price per unit. */
	const deposit = (usd) => withLock("deposit", async () => {
		const amount = Math.floor(Number(usd) * 100) / 100;
		if (!(amount > 0)) return { ok: false, error: "Amount must be a positive number of dollars" };
		const { fund, krakenUsd, equity, available } = await depositState();
		if (fund.status !== "active") return { ok: false, error: "Fund isn't seeded yet — top-ups apply to an active fund" };
		if (amount > available + 0.01)
			return { ok: false, error: `Only $${available.toFixed(2)} on Kraken isn't already in the fund (Kraken USD $${krakenUsd.toFixed(2)} − fund cash $${fund.cash_usd.toFixed(2)}). Wait for the deposit to clear on Kraken.` };
		const units = fundUnits(fund);
		const nav = fundNav(fund, equity);
		if (!(nav > 0)) return { ok: false, error: "Fund equity is zero — can't price a top-up" };
		const newUnits = amount / nav;
		await store.adjustCash(amount);
		const after = await store.updateFund({
			units: units + newUnits,
			deposits_usd: (fund.deposits_usd || 0) + amount,
			// Scale the drawdown peak so a deposit neither creates nor hides a drawdown.
			peak_equity: (fund.peak_equity || equity) * (units + newUnits) / units,
		});
		const rec = await store.insertDeposit({ usd: amount, nav, units: newUnits, equity_before: equity, kraken_usd: krakenUsd });
		log.log?.(`[ai-trader] top-up $${amount} at nav ${nav.toFixed(4)} (${newUnits.toFixed(4)} units)`);
		return { ok: true, deposit: rec, fund: { cash_usd: r2(after.cash_usd), equity_usd: r2(equity + amount), deposits_usd: r2(after.deposits_usd), nav } };
	});

	// ── decision run ─────────────────────────────────────────────────────────
	/**
	 * Losing-streak sizing: after 2 losing trades in a row, the next 2 trades opened
	 * are capped at half size. That's the whole penalty — no stand-down.
	 */
	async function riskMode() {
		const closed = await store.closedTrades(20); // newest first
		const lost = (t) => t.pnl_usd != null && Number(t.pnl_usd) <= 0;
		let streak = 0;
		for (const t of closed) { if (lost(t)) streak++; else break; }
		const i = closed.findIndex((t, k) => k + 1 < closed.length && lost(t) && lost(closed[k + 1]));
		if (i < 0) return { losing_streak: streak, size_multiplier: 1, halved_trades_left: 0 };
		const openedAfter = (await store.openedSince(closed[i].closed_at)).length;
		const left = Math.max(0, 2 - openedAfter);
		return { losing_streak: streak, size_multiplier: left > 0 ? 0.5 : 1, halved_trades_left: left };
	}

	async function buildContext(fund, open, cfg, hypotheticalCash) {
		const assets = [...new Set([...cfg.universe, ...open.map((t) => t.asset)])];
		const [market, prices, feePct, recentClosed, prevRuns, history, closedStats, risk] = await Promise.all([
			kraken.marketData(cfg.universe), priceMap(assets), kraken.takerFee(), store.closedTrades(10),
			store.recentDecisions(6), store.decisionCount(), store.allClosedStats(), riskMode(),
		]);
		for (const a of cfg.universe) if (market[a]?.price) prices[a] = market[a].price;
		const effFund = hypotheticalCash != null ? { ...fund, cash_usd: hypotheticalCash } : fund;
		const val = valuation(effFund, open, prices);
		const units = fund.status === "active" ? fundUnits(fund) : (hypotheticalCash || val.equity);
		const peak = Math.max(fund.peak_equity || 0, val.equity);
		const ctx = {
			now_utc: new Date().toISOString(),
			fund: {
				status: fund.status === "active" ? "active" : "hypothetical (not funded yet)",
				equity_usd: r2(val.equity), cash_usd: r2(effFund.cash_usd), positions_usd: r2(val.positionsUsd),
				since_inception_pct: r2((val.equity / units - 1) * 100),
				drawdown_from_peak_pct: r2(peak > 0 ? (1 - val.equity / peak) * 100 : 0),
				halted: fund.halted, open_slots: cfg.maxPositions - open.length,
				min_trade_usd: cfg.minTradeUsd,
			},
			risk_mode: {
				...risk,
				note: risk.size_multiplier < 1
					? `Full entries capped at half size for the next ${risk.halved_trades_left} trade(s) after ${risk.losing_streak >= 2 ? risk.losing_streak : 2} losses in a row. Starters are unaffected. Do not stand down.`
					: "Normal sizing.",
			},
			open_positions: val.positions.map((p) => ({
				trade_id: p.id, asset: p.asset, conviction: p.conviction, horizon: p.horizon,
				entry_type: p.entry_type || "full", adds: p.adds || 0,
				hours_open: r2(p.hours_open), hours_left: r2(p.hours_left),
				entry_price: p.entry_price, price_now: p.price, unrealized_pct: r2(p.unrealized_pct),
				stop_loss: p.stop_loss, take_profit: p.take_profit, thesis: p.thesis, invalidation: p.invalidation,
			})),
			recent_closed_trades: recentClosed.map((t) => ({
				asset: t.asset, pnl_pct: r2(t.pnl_pct), exit_reason: t.exit_reason,
				held_hours: r2((new Date(t.closed_at) - new Date(t.opened_at)) / HOUR), conviction: t.conviction, thesis: t.thesis,
			})),
			// Memory: what you saw and did on earlier runs, and how prices moved since (hindsight).
			track_record: {
				decision_runs_so_far: history?.n ?? 0,
				first_run_at: history?.first ?? null,
				trades_closed_total: closedStats.n, wins: closedStats.wins,
			},
			previous_runs: prevRuns.filter((d) => !d.error).map((d) => previousRun(d, prices)),
			market_data_hourly_kraken: market,
		};
		return { ctx, val, prices, feePct, risk };
	}

	/** Compact view of an earlier decision + how each coin moved since, so the model can grade its own calls. */
	function previousRun(d, pricesNow) {
		const results = Array.isArray(d.results) ? d.results : [];
		const then = d.prices || null;
		const moves = then ? Object.fromEntries(Object.entries(then)
			.filter(([a, p]) => p > 0 && pricesNow[a] > 0)
			.map(([a, p]) => [a, r2((pricesNow[a] / p - 1) * 100)])) : null;
		return {
			at: d.created_at, hours_ago: r2((Date.now() - new Date(d.created_at).getTime()) / HOUR),
			trigger: d.trigger || null, mode: d.mode,
			market_note: d.market_note, journal: d.journal,
			actions: results.map((x) => `${x.action} ${x.asset || "#" + x.trade_id}: ${x.status}${x.reason ? ` (${String(x.reason).slice(0, 120)})` : ""}`),
			price_change_since_pct: moves,
		};
	}

	function validateOpen(o, { cfg, val, cash, feePct, openAssets, slots, info, price, risk }) {
		if (!cfg.universe.includes(o.asset)) return "asset not in universe";
		if (openAssets.has(o.asset)) return "already holding this asset";
		if (slots <= 0) return "no free position slots";
		if (!info) return "no Kraken pair info";
		if (!price) return "no price";
		const rtPct = feePct * 2 * 100;
		const sl = Number(o.stop_loss_pct), tp = Number(o.take_profit_pct), hold = Number(o.max_hold_hours);
		if (!(sl >= 0.75 && sl <= 12)) return `stop ${sl}% outside 0.75–12%`;
		const starter = o.entry_type === "starter";
		const rr = starter ? 1.25 : 1.5; // starters use a tighter volatility stop and a nearer target
		if (!(tp >= Math.max(rr * sl, 3 * rtPct))) return `take-profit ${tp}% < max(${rr}× stop, 3× fees ${(3 * rtPct).toFixed(2)}%)`;
		if (tp > 40) return `take-profit ${tp}% unrealistic for ≤1 week`;
		if (!(hold >= 1 && hold <= cfg.maxHoldHours)) return `hold ${hold}h outside 1–${cfg.maxHoldHours}h`;
		// Half size if this is a starter OR a losing streak is in effect — applied once, never stacked.
		const halve = starter || (risk?.size_multiplier ?? 1) < 1;
		const capPct = Math.min(Number(o.size_pct) || 0, (CONVICTION_CAP_PCT[o.conviction] ?? 10) * (halve ? 0.5 : 1), cfg.maxPositionPct);
		if (!(capPct > 0)) return "size must be > 0";
		let usd = val.equity * capPct / 100;
		usd = Math.min(usd, cash * (1 - feePct) * 0.995);
		let qty = Math.floor((usd / price) * 10 ** info.lotDecimals) / 10 ** info.lotDecimals;
		// Small funds: a half-size starter can land under Kraken's per-coin minimum. Bump it up to
		// that minimum if it still fits inside the conviction's FULL cap and the cash available.
		const fullCapUsd = val.equity * Math.min(CONVICTION_CAP_PCT[o.conviction] ?? 10, cfg.maxPositionPct) / 100;
		const minCost = info.ordermin * price;
		if (starter && qty < info.ordermin && minCost <= fullCapUsd && minCost * (1 + feePct) <= cash * 0.995) {
			qty = Math.ceil(info.ordermin * 10 ** info.lotDecimals) / 10 ** info.lotDecimals;
		}
		const cost = qty * price;
		if (qty < info.ordermin) return `size below Kraken minimum (${info.ordermin} ${o.asset})`;
		if (cost < Math.max(cfg.minTradeUsd, info.costmin || 0)) return `size $${cost.toFixed(2)} below $${Math.max(cfg.minTradeUsd, info.costmin || 0)} minimum`;
		return { qty, cost, sizePct: capPct, sl, tp, hold, starter, halved: halve };
	}

	const runDecision = ({ dryRun = false, trigger = "manual" } = {}) => withLock("decision", async () => {
		const cfg = cfgFn();
		const live = cfg.mode === "live" && !dryRun;
		let fund = await store.getFund();
		let hypothetical = null;
		if (fund.status !== "active") {
			if (live) return { ok: false, error: "Fund isn't seeded yet — run the seed sale first" };
			hypothetical = (await buildSeedPlan().catch(() => ({ est_total_usd: 0 }))).est_total_usd || 1000;
		}
		const open = fund.status === "active" ? await store.openTrades() : [];
		const { ctx, val, prices, feePct, risk } = await buildContext(fund, open, cfg, hypothetical);

		let decision, model;
		try {
			({ parsed: decision, model } = await brain.decide({
				cfg, feePct,
				userContent: `Decide this run's trades (trigger: ${trigger}). Data:\n${JSON.stringify(ctx, null, 1)}`,
			}));
		} catch (e) {
			await store.insertDecision({ mode: live ? "live" : "dry_run", model: cfg.model, error: e.message, trigger });
			return { ok: false, error: e.message };
		}

		const results = [];
		const rec = await store.insertDecision({
			mode: live ? "live" : "dry_run", model, market_note: decision.market_note, journal: decision.journal,
			actions: { opens: decision.opens, adds: decision.adds, closes: decision.closes, adjusts: decision.adjusts },
			trigger, prices: Object.fromEntries(cfg.universe.filter((a) => prices[a]).map((a) => [a, prices[a]])),
		});
		const byId = Object.fromEntries(open.map((t) => [t.id, t]));

		// 1) closes
		for (const c of decision.closes || []) {
			const t = byId[c.trade_id];
			if (!t) { results.push({ action: "close", trade_id: c.trade_id, status: "rejected", reason: "no such open trade" }); continue; }
			if (!live) { results.push({ action: "close", trade_id: t.id, asset: t.asset, status: "would_close", reason: c.reason }); continue; }
			try {
				const closed = await closeTrade(t, "ai", c.reason);
				delete byId[t.id];
				results.push({ action: "close", trade_id: t.id, asset: t.asset, status: closed.status === "closed" ? "closed" : "partial", pnl_pct: closed.pnl_pct != null ? r2(closed.pnl_pct) : null });
			} catch (e) { results.push({ action: "close", trade_id: t.id, asset: t.asset, status: "failed", reason: e.message }); }
		}

		// 2) adjusts (stops may only be raised)
		for (const a of decision.adjusts || []) {
			const t = byId[a.trade_id];
			if (!t) { results.push({ action: "adjust", trade_id: a.trade_id, status: "rejected", reason: "no such open trade" }); continue; }
			const px = prices[t.asset];
			const fields = {};
			if (a.new_stop_loss != null) {
				if (a.new_stop_loss > t.stop_loss && a.new_stop_loss < px) fields.stop_loss = a.new_stop_loss;
				else { results.push({ action: "adjust", trade_id: t.id, status: "rejected", reason: `stop ${a.new_stop_loss} must be above ${t.stop_loss} and below price ${px}` }); continue; }
			}
			if (a.new_take_profit != null) {
				if (a.new_take_profit > px) fields.take_profit = a.new_take_profit;
				else { results.push({ action: "adjust", trade_id: t.id, status: "rejected", reason: `take-profit ${a.new_take_profit} must be above price ${px}` }); continue; }
			}
			if (!Object.keys(fields).length) continue;
			if (live) await store.updateTrade(t.id, fields);
			byId[t.id] = { ...t, ...fields }; // later adjusts in this run see the new levels
			results.push({ action: "adjust", trade_id: t.id, asset: t.asset, status: live ? "adjusted" : "would_adjust", ...fields, reason: a.reason });
		}

		// 3) opens
		fund = await store.getFund();
		let cash = hypothetical ?? fund.cash_usd;
		const openAssets = new Set(Object.values(byId).map((t) => t.asset));
		let slots = cfg.maxPositions - openAssets.size;
		const info = await kraken.pairInfo(cfg.universe);
		let exchangeUsd = live ? ((await kraken.balances()).USD || 0) : Infinity;

		// 2b) adds: bring a winning starter up to a full position (once; never average down)
		for (const a of decision.adds || []) {
			const t = byId[a.trade_id];
			const base = { action: "add", trade_id: a.trade_id, asset: t?.asset, conviction: a.conviction };
			const reject = (reason) => results.push({ ...base, status: "rejected", reason });
			if (!t) { reject("no such open trade"); continue; }
			if (fund.halted && fund.status === "active") { reject(`fund halted: ${fund.halted_reason}`); continue; }
			if ((t.entry_type || "full") !== "starter" || (t.adds || 0) >= 1) { reject("only a starter that hasn't been added to can be added to"); continue; }
			// Live ticker, not the hourly close in the market data, so "only add to a winner" holds right now.
			const px = (await priceMap([t.asset]).catch(() => ({})))[t.asset] || prices[t.asset], pi = info[t.asset];
			if (!px || !pi) { reject("no price or pair info"); continue; }
			if (!(px > t.entry_price)) { reject(`only add to a winner: price ${px} ≤ entry ${t.entry_price}`); continue; }
			const capPct = Math.min(Number(a.size_pct) || 0, CONVICTION_CAP_PCT[a.conviction] ?? 10, cfg.maxPositionPct) * ((risk?.size_multiplier ?? 1) < 1 ? 0.5 : 1);
			const usd = Math.min(val.equity * capPct / 100 - t.qty * px, cash * (1 - feePct) * 0.995);
			if (!(usd > 0)) { reject(`position already at or above ${capPct}% of equity`); continue; }
			const qty = Math.floor((usd / px) * 10 ** pi.lotDecimals) / 10 ** pi.lotDecimals;
			const cost = qty * px;
			const min = Math.max(cfg.minTradeUsd, pi.costmin || 0);
			if (qty < pi.ordermin || cost < min) { reject(`add of $${cost.toFixed(2)} below the $${min} / ${pi.ordermin} ${t.asset} minimum`); continue; }
			if (!live) {
				results.push({ ...base, status: "would_add", usd: r2(cost), size_pct: capPct, reason: a.reason });
				cash -= cost * (1 + feePct);
				continue;
			}
			if (cost * (1 + feePct) > exchangeUsd) { reject(`exchange USD balance $${exchangeUsd.toFixed(2)} too low`); continue; }
			try {
				const fill = await kraken.marketOrder({ pair: pi.pair, side: "buy", volume: qty, lotDecimals: pi.lotDecimals });
				if (!(fill.volExec > 0)) throw new Error(`order ${fill.status}, nothing filled`);
				await store.adjustCash(-(fill.cost + fill.fee), fill.fee);
				const newQty = t.qty + fill.volExec, newCost = t.cost_usd + fill.cost;
				const updated = await store.updateTrade(t.id, {
					qty: newQty, cost_usd: newCost, entry_fee: t.entry_fee + fill.fee,
					entry_price: newCost / newQty, conviction: a.conviction, entry_type: "full", adds: (t.adds || 0) + 1,
				});
				byId[t.id] = updated;
				cash -= fill.cost + fill.fee; exchangeUsd -= fill.cost + fill.fee;
				results.push({ ...base, status: "added", usd: r2(fill.cost), qty: fill.volExec, new_entry: r2(newCost / newQty), reason: a.reason });
			} catch (e) { results.push({ ...base, status: "failed", reason: e.message }); }
		}

		for (const o of decision.opens || []) {
			const base = { action: "open", asset: o.asset, conviction: o.conviction, horizon: o.horizon, entry_type: o.entry_type || "full" };
			if (fund.halted && fund.status === "active") { results.push({ ...base, status: "rejected", reason: `fund halted: ${fund.halted_reason}` }); continue; }
			const v = validateOpen(o, { cfg, val, cash, feePct, openAssets, slots, info: info[o.asset], price: prices[o.asset], risk });
			if (typeof v === "string") { results.push({ ...base, status: "rejected", reason: v }); continue; }
			if (!live) {
				results.push({ ...base, status: "would_open", usd: r2(v.cost), size_pct: v.sizePct, halved: v.halved, stop_loss_pct: v.sl, take_profit_pct: v.tp, max_hold_hours: v.hold, signal_basis: o.signal_basis });
				cash -= v.cost * (1 + feePct); slots--; openAssets.add(o.asset);
				continue;
			}
			if (v.cost * (1 + feePct) > exchangeUsd) { results.push({ ...base, status: "rejected", reason: `exchange USD balance $${exchangeUsd.toFixed(2)} too low` }); continue; }
			try {
				const fill = await kraken.marketOrder({ pair: info[o.asset].pair, side: "buy", volume: v.qty, lotDecimals: info[o.asset].lotDecimals });
				if (!(fill.volExec > 0)) throw new Error(`order ${fill.status}, nothing filled`);
				const entry = fill.avgPrice || prices[o.asset];
				await store.adjustCash(-(fill.cost + fill.fee), fill.fee);
				const t = await store.insertTrade({
					asset: o.asset, pair: info[o.asset].pair, qty: fill.volExec, entry_price: entry,
					cost_usd: fill.cost, entry_fee: fill.fee,
					take_profit: entry * (1 + v.tp / 100), stop_loss: entry * (1 - v.sl / 100),
					max_hold_until: new Date(Date.now() + v.hold * HOUR),
					conviction: o.conviction, horizon: o.horizon, thesis: o.signal_basis, invalidation: o.invalidation,
					decision_id: rec.id, entry_txid: fill.txid, entry_type: v.starter ? "starter" : "full",
				});
				cash -= fill.cost + fill.fee; exchangeUsd -= fill.cost + fill.fee; slots--; openAssets.add(o.asset);
				results.push({ ...base, status: "opened", trade_id: t.id, usd: r2(fill.cost), qty: fill.volExec, entry, stop_loss: t.stop_loss, take_profit: t.take_profit });
			} catch (e) { results.push({ ...base, status: "failed", reason: e.message }); }
		}

		await store.updateDecisionResults(rec.id, results);
		const watch = sanitizeWatch(decision.watch, cfg);
		if (live) await store.updateFund({ watchlist: watch });
		if (live) {
			const after = valuation(await store.getFund(), await store.openTrades(), prices);
			await checkDrawdown(await store.getFund(), after.equity);
			const traded = results.filter((r) => ["opened", "added", "closed", "partial"].includes(r.status));
			if (traded.length) await notify.trades(decision, results);
		}
		return { ok: true, decision_id: rec.id, mode: live ? "live" : "dry_run", hypothetical_cash: hypothetical, market_note: decision.market_note, journal: decision.journal, results, watch };
	});

	function sanitizeWatch(list, cfg) {
		return (Array.isArray(list) ? list : [])
			.filter((w) => cfg.universe.includes(w.asset) && (w.direction === "above" || w.direction === "below") && Number(w.price) > 0)
			.slice(0, 6)
			.map((w) => ({ asset: w.asset, direction: w.direction, price: Number(w.price), reason: String(w.reason || "").slice(0, 200), set_at: new Date().toISOString() }));
	}

	/**
	 * Free (no model call) check for a reason to run the AI early:
	 *  1. a price level the AI asked to watch has been crossed, or
	 *  2. a coin passes the alignment screen: above 4h SMA20, volume ≥ 7d average, 24h positive.
	 * Only when the fund could actually open something.
	 */
	async function findTrigger(fund, open, prices) {
		const cfg = cfgFn();
		if (fund.status !== "active" || fund.halted) return null;
		if (open.length >= cfg.maxPositions || fund.cash_usd < cfg.minTradeUsd) return null;
		const held = new Set(open.map((t) => t.asset));
		const watch = (fund.watchlist || []).filter((w) => !held.has(w.asset));
		if (watch.length) {
			const px = { ...prices, ...(await priceMap(watch.map((w) => w.asset))) };
			const hit = watch.find((w) => px[w.asset] && (w.direction === "above" ? px[w.asset] >= w.price : px[w.asset] <= w.price));
			if (hit) {
				await store.updateFund({ watchlist: (fund.watchlist || []).filter((w) => w !== hit && !(w.asset === hit.asset && w.price === hit.price && w.direction === hit.direction)) });
				return { kind: "watch", asset: hit.asset, reason: `${hit.asset} crossed ${hit.direction} ${hit.price} (now ${px[hit.asset]}): ${hit.reason}` };
			}
		}
		const market = await kraken.marketData(cfg.universe.filter((a) => !held.has(a)));
		const aligned = Object.entries(market)
			.filter(([, m]) => !m.error && m.vs_sma20_4h_pct > 0 && m.volume_vs_7d_avg >= 1 && m.ret_24h_pct > 0)
			.map(([a, m]) => `${a} (24h ${m.ret_24h_pct}%, vol ${m.volume_vs_7d_avg}x, ${m.vs_sma20_4h_pct}% above 4h SMA20)`);
		if (aligned.length) return { kind: "screen", reason: `alignment screen: ${aligned.join("; ")}` };
		return null;
	}

	// ── risk monitor (no model calls) ────────────────────────────────────────
	const monitor = ({ checkTriggers = true } = {}) => withLock("monitor", async () => {
		const fund = await store.getFund();
		if (fund.status !== "active") return { ok: true, skipped: "not seeded" };
		const open = await store.openTrades();
		const prices = open.length ? await priceMap(open.map((t) => t.asset)) : {};
		const live = cfgFn().mode === "live";
		const exits = [];
		for (const t of open) {
			const px = prices[t.asset];
			if (!px) continue;
			const reason = px <= t.stop_loss ? "stop_loss"
				: px >= t.take_profit ? "take_profit"
				: Date.now() >= new Date(t.max_hold_until).getTime() ? "time" : null;
			if (!reason) continue;
			if (!live) { exits.push({ trade_id: t.id, asset: t.asset, reason, status: "would_close" }); continue; }
			try {
				const c = await closeTrade(t, reason, `price ${px}`);
				exits.push({ trade_id: t.id, asset: t.asset, reason, status: c.status, pnl_pct: c.pnl_pct != null ? r2(c.pnl_pct) : null });
			} catch (e) { exits.push({ trade_id: t.id, asset: t.asset, reason, status: "failed", error: e.message }); }
		}
		const stillOpen = await store.openTrades();
		const val = valuation(await store.getFund(), stillOpen, prices);
		const fundNow = await checkDrawdown(await store.getFund(), val.equity);
		if (exits.some((e) => e.status === "closed" || e.status === "failed")) await notify.exits(exits);
		let trigger = null;
		if (checkTriggers) {
			try { trigger = await findTrigger(fundNow, stillOpen, prices); }
			catch (e) { log.warn?.("[ai-trader] trigger check failed:", e.message); }
		}
		return { ok: true, exits, equity: r2(val.equity), trigger };
	});

	const setPaused = (paused) => withLock("pause", async () => {
		const fund = await store.getFund();
		if (paused) return store.updateFund({ halted: true, halted_reason: "Paused manually" });
		// Resuming resets the drawdown peak to current equity, otherwise it would re-halt immediately.
		const open = await store.openTrades();
		const prices = open.length ? await priceMap(open.map((t) => t.asset)) : {};
		const { equity } = valuation(fund, open, prices);
		return store.updateFund({ halted: false, halted_reason: null, peak_equity: equity || fund.peak_equity });
	});

	return { withLock, isBusy: () => busy, valuation, basketValue, priceMap, seedPreview, seedExecute, depositPreview, deposit, runDecision, monitor, setPaused, closeTrade };
}
