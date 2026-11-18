/**
 * Daily report (private email), trade/exit/alert notifications, and the
 * public %-only view for /ai-trader.
 */

import { CONVICTION_CAP_PCT } from "./config.js";

const HOUR = 3600_000;
const r2 = (v) => (v == null || !Number.isFinite(v) ? null : Math.round(v * 100) / 100);
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const usd = (n) => (n == null ? "—" : `${n < 0 ? "-" : ""}$${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
const pct = (n) => (n == null ? "—" : `${n >= 0 ? "+" : ""}${n.toFixed(2)}%`);
const color = (n) => (n == null ? "#555" : n >= 0 ? "#1f9d55" : "#d6336c");
const today = () => new Date().toISOString().slice(0, 10);

/** Next scheduled decision (hh:05 UTC) after `from`. */
function nextDecisionAt(hours, from = new Date()) {
	for (let d = 0; d < 2; d++) {
		for (const h of [...hours].sort((a, b) => a - b)) {
			const t = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate() + d, h, 5));
			if (t > from) return t.toISOString();
		}
	}
	return null;
}

export function createReporter({ cfgFn, store, engine, brain, kraken, sendEmail, emailTo, log = console }) {
	/** Send an email and record the outcome (MailerSend failures don't throw — they return {ok:false}). */
	async function deliver(subject, html, text) {
		let r;
		try { r = await sendEmail({ to: emailTo, subject, html, text }); }
		catch (e) { r = { ok: false, error: e.message }; }
		const ok = Boolean(r && r.ok);
		let error = ok ? null : String(r?.error || "unknown error");
		// MailerSend returns JSON like {"message": "...", "errors": {...}} — keep the readable message.
		if (error) { try { error = JSON.parse(error).message || error; } catch { /* not JSON */ } error = error.slice(0, 500); }
		if (!ok) log.warn?.(`[ai-trader] email "${subject}" failed:`, error);
		try { await store.updateFund({ last_email: { at: new Date().toISOString(), ok, subject, error } }); } catch { /* best effort */ }
		return { ok, error, to: emailTo };
	}
	async function testEmail() {
		return deliver("AI Trader — test email",
			`<div style="font-family:sans-serif">If you can read this, the AI trader's email path works. Daily reports go out at ${cfgFn().reportHourUtc}:00 UTC.</div>`,
			`If you can read this, the AI trader's email path works. Daily reports go out at ${cfgFn().reportHourUtc}:00 UTC.`);
	}

	async function metrics() {
		const fund = await store.getFund();
		const open = await store.openTrades();
		const basketAssets = (fund.seed_basket || []).map((b) => b.asset);
		const prices = await engine.priceMap([...open.map((t) => t.asset), ...basketAssets, "BTC"]);
		const val = engine.valuation(fund, open, prices);
		const basket = engine.basketValue(fund, prices);
		const seed = fund.seed_usd || 0;
		const peak = Math.max(fund.peak_equity || 0, val.equity);
		const stats = await store.allClosedStats();
		return {
			fund, open, prices, val, basket, seed,
			returnPct: seed ? (val.equity / seed - 1) * 100 : null,
			btcPct: fund.seed_btc_price && prices.BTC ? (prices.BTC / fund.seed_btc_price - 1) * 100 : null,
			holdPct: seed ? (basket / seed - 1) * 100 : null,
			drawdownPct: peak > 0 ? (1 - val.equity / peak) * 100 : 0,
			stats,
			winRate: stats.n ? (stats.wins / stats.n) * 100 : null,
			daysRunning: fund.seeded_at ? (Date.now() - new Date(fund.seeded_at).getTime()) / (24 * HOUR) : 0,
		};
	}

	// ── daily report ─────────────────────────────────────────────────────────
	async function dailyReport({ send = true } = {}) {
		const cfg = cfgFn();
		const m = await metrics();
		if (m.fund.status !== "active") return { ok: true, skipped: "fund not seeded" };
		const since = new Date(Date.now() - 24 * HOUR);
		const [closed24, opened24, decisions24, snaps] = await Promise.all([
			store.closedSince(since), store.openedSince(since), store.decisionsSince(since), store.snapshots(60),
		]);
		const prev = [...snaps].reverse().find((s) => s.day < today());
		const dayPct = prev ? (m.val.equity / prev.equity_usd - 1) * 100 : m.returnPct;
		const goalPct = (m.val.equity / cfg.goalUsd) * 100;
		const doublings = m.val.equity > 0 ? Math.log2(cfg.goalUsd / m.val.equity) : null;

		const summary = {
			day: today(), days_running: r2(m.daysRunning), mode: cfg.mode, halted: m.fund.halted ? m.fund.halted_reason : false,
			equity_usd: r2(m.val.equity), change_24h_pct: r2(dayPct), since_inception_pct: r2(m.returnPct),
			btc_since_inception_pct: r2(m.btcPct), hold_seed_coins_pct: r2(m.holdPct), drawdown_pct: r2(m.drawdownPct),
			trades_closed_total: m.stats.n, win_rate_pct: r2(m.winRate), fees_paid_usd: r2(m.fund.fees_paid),
			closed_last_24h: closed24.map((t) => ({ asset: t.asset, pnl_pct: r2(t.pnl_pct), exit: t.exit_reason, thesis: t.thesis })),
			opened_last_24h: opened24.map((t) => ({ asset: t.asset, conviction: t.conviction, thesis: t.thesis })),
			open_positions: m.val.positions.map((p) => ({ asset: p.asset, unrealized_pct: r2(p.unrealized_pct), hours_left: r2(p.hours_left) })),
			journal_entries: decisions24.filter((d) => d.journal).map((d) => d.journal),
		};
		let recap = "";
		try { recap = await brain.recap({ cfg, summary }); } catch (e) { log.warn?.("[ai-trader] recap failed:", e.message); }

		await store.upsertSnapshot({
			day: today(), equity_usd: m.val.equity, cash_usd: m.fund.cash_usd, positions_usd: m.val.positionsUsd,
			btc_price: m.prices.BTC || null, basket_value_usd: m.basket, recap,
		});

		let email = null;
		if (send) {
			const subject = `AI Trader day ${Math.max(1, Math.ceil(m.daysRunning))}: ${pct(r2(m.returnPct))} vs BTC ${pct(r2(m.btcPct))}`;
			email = await deliver(subject, reportHtml({ cfg, m, summary, recap, dayPct, goalPct, doublings, closed24, decisions24 }), reportText({ m, summary, recap, dayPct, goalPct }));
		}
		return { ok: true, summary, recap, email };
	}

	function reportHtml({ cfg, m, summary, recap, dayPct, goalPct, doublings, closed24, decisions24 }) {
		const stat = (label, value, c) => `<td style="padding:10px 12px;border:1px solid #eee"><div style="font:600 10px monospace;color:#888;text-transform:uppercase;letter-spacing:.08em">${label}</div><div style="font-size:18px;font-weight:700;color:${c || "#111"}">${value}</div></td>`;
		const posRows = m.val.positions.map((p) => `<tr>
			<td style="padding:6px 8px;font-weight:600">${esc(p.asset)}</td>
			<td style="padding:6px 8px">${usd(p.value)}</td>
			<td style="padding:6px 8px;color:${color(p.unrealized_pct)}">${pct(r2(p.unrealized_pct))}</td>
			<td style="padding:6px 8px">${pct(r2((p.stop_loss / p.price - 1) * 100))} / ${pct(r2((p.take_profit / p.price - 1) * 100))}</td>
			<td style="padding:6px 8px">${Math.max(0, p.hours_left).toFixed(0)}h</td>
			<td style="padding:6px 8px;font-size:12px;color:#555">${esc(p.thesis)}</td></tr>`).join("") ||
			`<tr><td colspan="6" style="padding:8px;color:#888">No open positions — the fund is in cash.</td></tr>`;
		const closedRows = closed24.map((t) => `<tr>
			<td style="padding:6px 8px;font-weight:600">${esc(t.asset)}</td>
			<td style="padding:6px 8px;color:${color(t.pnl_pct)}">${pct(r2(t.pnl_pct))} (${usd(t.pnl_usd)})</td>
			<td style="padding:6px 8px">${esc(t.exit_reason)}</td>
			<td style="padding:6px 8px">${((new Date(t.closed_at) - new Date(t.opened_at)) / HOUR).toFixed(1)}h</td></tr>`).join("") ||
			`<tr><td colspan="4" style="padding:8px;color:#888">No trades closed in the last 24h.</td></tr>`;
		const journal = decisions24.filter((d) => d.journal).map((d) =>
			`<p style="margin:0 0 8px;font-size:13px;color:#333"><span style="color:#888;font:11px monospace">${new Date(d.created_at).toISOString().slice(11, 16)} UTC</span> ${esc(d.journal)}</p>`).join("");
		return `<div style="font-family:-apple-system,Segoe UI,Roboto,sans-serif;max-width:680px;margin:0 auto;color:#111">
<p style="font:600 11px monospace;letter-spacing:.12em;color:#888;text-transform:uppercase;margin:0 0 4px">AI Trader · daily report · ${summary.day} · ${cfg.mode === "live" ? "LIVE" : "DRY RUN"}</p>
<h1 style="margin:0 0 4px;font-size:24px">${usd(m.val.equity)} <span style="color:${color(m.returnPct)}">${pct(r2(m.returnPct))}</span></h1>
<p style="margin:0 0 16px;color:#666;font-size:13px">Day ${Math.max(1, Math.ceil(m.daysRunning))} · seeded with ${usd(m.seed)} · ${m.fund.halted ? `<b style="color:#d6336c">HALTED: ${esc(m.fund.halted_reason)}</b>` : "trading"}</p>
${recap ? `<blockquote style="margin:0 0 18px;padding:12px 14px;border-left:3px solid #111;background:#f7f7f5;font-size:14px;line-height:1.5">${esc(recap)}</blockquote>` : ""}
<table style="width:100%;border-collapse:collapse;margin-bottom:16px"><tr>
${stat("24h", pct(r2(dayPct)), color(dayPct))}${stat("AI since start", pct(r2(m.returnPct)), color(m.returnPct))}${stat("BTC since start", pct(r2(m.btcPct)), color(m.btcPct))}${stat("Hold seed coins", pct(r2(m.holdPct)), color(m.holdPct))}
</tr><tr>
${stat("Drawdown", `${r2(m.drawdownPct).toFixed(2)}%`)}${stat("Win rate", m.winRate == null ? "—" : `${m.winRate.toFixed(0)}% (${m.stats.wins}/${m.stats.n})`)}${stat("Fees paid", usd(m.fund.fees_paid))}${stat("Cash", usd(m.fund.cash_usd))}
</tr></table>
<h3 style="margin:18px 0 6px;font-size:14px">Open positions</h3>
<table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #eee"><tr style="background:#f5f5f3;text-align:left"><th style="padding:6px 8px">Asset</th><th style="padding:6px 8px">Value</th><th style="padding:6px 8px">P&amp;L</th><th style="padding:6px 8px">Stop / Target</th><th style="padding:6px 8px">Left</th><th style="padding:6px 8px">Thesis</th></tr>${posRows}</table>
<h3 style="margin:18px 0 6px;font-size:14px">Closed in the last 24h</h3>
<table style="width:100%;border-collapse:collapse;font-size:13px;border:1px solid #eee"><tr style="background:#f5f5f3;text-align:left"><th style="padding:6px 8px">Asset</th><th style="padding:6px 8px">Result</th><th style="padding:6px 8px">Exit</th><th style="padding:6px 8px">Held</th></tr>${closedRows}</table>
${journal ? `<h3 style="margin:18px 0 6px;font-size:14px">AI journal</h3>${journal}` : ""}
<h3 style="margin:18px 0 6px;font-size:14px">Road to $1M</h3>
<p style="margin:0;font-size:13px;color:#333">${goalPct.toFixed(4)}% of the way there · ${doublings != null ? `${doublings.toFixed(1)} more doublings to go` : ""}. All-time: ${m.stats.n} trades closed, realized ${usd(m.stats.realized)}, avg win ${pct(r2(m.stats.avgWinPct))}, avg loss ${pct(r2(m.stats.avgLossPct))}.</p>
<p style="font-size:11px;color:#aaa;margin-top:20px">Spot only, no leverage. Max ${cfg.maxPositions} positions, ≤${cfg.maxPositionPct}% each, ≤${cfg.maxHoldHours}h holds, halts at ${(cfg.maxDrawdown * 100).toFixed(0)}% drawdown. Model: ${esc(cfg.model)}. "Hold seed coins" = value today of the coins sold to fund the AI.</p>
</div>`;
	}

	function reportText({ m, summary, recap, dayPct, goalPct }) {
		return [
			`AI TRADER — ${summary.day}`,
			`Equity ${usd(m.val.equity)} (${pct(r2(m.returnPct))} since start, 24h ${pct(r2(dayPct))})`,
			`BTC since start ${pct(r2(m.btcPct))} · Hold seed coins ${pct(r2(m.holdPct))} · Drawdown ${r2(m.drawdownPct)}%`,
			recap ? `\n${recap}\n` : "",
			`Open: ${m.val.positions.map((p) => `${p.asset} ${pct(r2(p.unrealized_pct))}`).join(", ") || "none"}`,
			`Win rate ${m.winRate == null ? "—" : m.winRate.toFixed(0) + "%"} over ${m.stats.n} trades · fees ${usd(m.fund.fees_paid)}`,
			`Road to $1M: ${goalPct.toFixed(4)}%`,
		].join("\n");
	}

	// ── notifications ────────────────────────────────────────────────────────
	const simple = (subject, body) => deliver(subject, `<div style="font-family:sans-serif;font-size:14px;max-width:620px">${esc(body).replace(/\n/g, "<br>")}</div>`, body);
	const notify = {
		alert: (subject, body) => simple(`⚠️ ${subject}`, body),
		info: (subject, body) => simple(subject, body),
		trades: (decision, results) => simple(
			`AI Trader — ${results.filter((r) => r.status === "opened").length} opened, ${results.filter((r) => r.status === "closed").length} closed`,
			`${decision.journal}\n\n${results.map((r) => `${r.action.toUpperCase()} ${r.asset || "#" + r.trade_id}: ${r.status}${r.usd ? ` $${r.usd}` : ""}${r.pnl_pct != null ? ` (${pct(r.pnl_pct)})` : ""}${r.reason ? ` — ${r.reason}` : ""}`).join("\n")}\n\nMarket: ${decision.market_note}`),
		exits: (exits) => simple(
			`AI Trader — ${exits.length} automatic exit(s)`,
			exits.map((e) => `${e.asset}: ${e.reason} → ${e.status}${e.pnl_pct != null ? ` (${pct(e.pnl_pct)})` : ""}${e.error ? ` — ${e.error}` : ""}`).join("\n")),
	};

	// ── private state for the panel ──────────────────────────────────────────
	async function state() {
		const cfg = cfgFn();
		const fund = await store.getFund();
		const [closed, decisions] = await Promise.all([store.closedTrades(20), store.recentDecisions(5)]);
		let m = null;
		if (fund.status === "active") m = await metrics();
		return {
			config: { ...cfg, emailTo: undefined },
			busy: engine.isBusy(),
			fund: {
				status: fund.status, halted: fund.halted, halted_reason: fund.halted_reason, seeded_at: fund.seeded_at,
				seed_usd: fund.seed_usd, cash_usd: fund.cash_usd, fees_paid: fund.fees_paid,
				equity_usd: m ? r2(m.val.equity) : null, return_pct: m ? r2(m.returnPct) : null,
				btc_pct: m ? r2(m.btcPct) : null, hold_pct: m ? r2(m.holdPct) : null, drawdown_pct: m ? r2(m.drawdownPct) : null,
				win_rate_pct: m ? r2(m.winRate) : null, trades_closed: m ? m.stats.n : 0,
				watchlist: fund.watchlist || [], last_email: fund.last_email || null,
			},
			positions: m ? m.val.positions.map((p) => ({
				id: p.id, asset: p.asset, qty: p.qty, entry_price: p.entry_price, price: p.price, value_usd: r2(p.value),
				unrealized_pct: r2(p.unrealized_pct), stop_loss: p.stop_loss, take_profit: p.take_profit,
				hours_left: r2(p.hours_left), conviction: p.conviction, horizon: p.horizon, thesis: p.thesis,
			})) : [],
			closed: closed.map((t) => ({ id: t.id, asset: t.asset, opened_at: t.opened_at, closed_at: t.closed_at, pnl_pct: r2(t.pnl_pct), pnl_usd: r2(t.pnl_usd), exit_reason: t.exit_reason, thesis: t.thesis })),
			decisions: decisions.map((d) => ({ id: d.id, at: d.created_at, mode: d.mode, journal: d.journal, market_note: d.market_note, results: d.results, error: d.error })),
		};
	}

	// ── public view: percentages only, no dollar amounts ─────────────────────
	/**
	 * What the AI is waiting for: per-coin alignment screen, watch levels with
	 * distance from price, schedule, and which conviction sizes clear the minimum.
	 */
	async function outlook(cfg, fund, equity) {
		let market = {};
		try { market = kraken ? await kraken.marketSnapshot(cfg.universe) : {}; }
		catch (e) { log.warn?.("[ai-trader] market snapshot failed:", e.message); }
		const coins = cfg.universe.map((a) => {
			const m = market[a];
			if (!m || m.error) return { asset: a };
			const checks = { trend: m.vs_sma20_4h_pct > 0, volume: m.volume_vs_7d_avg >= 1, momentum: m.ret_24h_pct > 0 };
			return {
				asset: a, price: m.price, ret_24h_pct: m.ret_24h_pct, ret_7d_pct: m.ret_7d_pct, ret_30d_pct: m.ret_30d_pct,
				vs_sma20_4h_pct: m.vs_sma20_4h_pct, vs_sma50_4h_pct: m.vs_sma50_4h_pct, volume_vs_7d_avg: m.volume_vs_7d_avg,
				rsi_14_4h: m.rsi_14_4h, rel_strength_vs_btc_7d_pct: m.rel_strength_vs_btc_7d_pct,
				checks, aligned: checks.trend && checks.volume && checks.momentum,
			};
		});
		const priceOf = Object.fromEntries(coins.filter((c) => c.price).map((c) => [c.asset, c.price]));
		const watching = (fund.watchlist || []).map((w) => ({
			asset: w.asset, direction: w.direction, price: w.price, reason: w.reason,
			distance_pct: priceOf[w.asset] ? r2((w.price / priceOf[w.asset] - 1) * 100) : null,
		}));
		const cap = (c) => Math.min(CONVICTION_CAP_PCT[c], cfg.maxPositionPct);
		const tradeable = equity ? Object.keys(CONVICTION_CAP_PCT).filter((c) => (equity * cap(c)) / 100 >= cfg.minTradeUsd) : Object.keys(CONVICTION_CAP_PCT);
		const lastDecision = fund.status === "active" ? (await store.recentDecisions(1))[0] : null;
		return {
			coins, watching,
			sizing: { caps_pct: Object.fromEntries(Object.keys(CONVICTION_CAP_PCT).map((c) => [c, cap(c)])), tradeable_convictions: tradeable },
			schedule: {
				decision_hours_utc: cfg.decisionHoursUtc, next_decision_at: nextDecisionAt(cfg.decisionHoursUtc),
				monitor_minutes: cfg.monitorMinutes, max_early_runs_per_day: cfg.maxEarlyRunsPerDay, early_run_gap_hours: cfg.earlyRunGapHours,
				last_decision_at: lastDecision?.created_at || null,
			},
			limits: { max_positions: cfg.maxPositions, max_hold_hours: cfg.maxHoldHours, max_drawdown_pct: cfg.maxDrawdown * 100 },
			market_note: lastDecision?.market_note || null,
		};
	}

	let publicCache = null;
	async function publicView() {
		if (publicCache && Date.now() - publicCache.at < 5 * 60_000) return publicCache.data;
		const cfg = cfgFn();
		const fund = await store.getFund();
		let data;
		if (fund.status !== "active") {
			data = { status: "warming_up", universe: cfg.universe, model: cfg.model, ...(await outlook(cfg, fund, null)), updated_at: new Date().toISOString() };
		} else {
			const m = await metrics();
			const [closed, snaps, decisions] = await Promise.all([store.closedTrades(30), store.snapshots(365), store.recentDecisions(8)]);
			const seed = m.seed;
			const curve = snaps.map((s) => ({
				day: s.day,
				ai: r2((s.equity_usd / seed) * 100),
				btc: fund.seed_btc_price && s.btc_price ? r2((s.btc_price / fund.seed_btc_price) * 100) : null,
				hold: s.basket_value_usd ? r2((s.basket_value_usd / seed) * 100) : null,
			}));
			curve.push({ day: "now", ai: r2((m.val.equity / seed) * 100), btc: r2(100 + (m.btcPct || 0)), hold: r2(100 + (m.holdPct || 0)) });
			data = {
				status: fund.halted ? "halted" : "trading",
				mode: cfg.mode,
				started_at: fund.seeded_at,
				days_running: r2(m.daysRunning),
				return_pct: r2(m.returnPct), btc_pct: r2(m.btcPct), hold_pct: r2(m.holdPct),
				drawdown_pct: r2(m.drawdownPct), drawdown_limit_pct: cfg.maxDrawdown * 100,
				trades_closed: m.stats.n, win_rate_pct: r2(m.winRate),
				avg_win_pct: r2(m.stats.avgWinPct), avg_loss_pct: r2(m.stats.avgLossPct),
				open_positions: m.val.positions.map((p) => ({
					asset: p.asset, opened_at: p.opened_at, conviction: p.conviction, horizon: p.horizon,
					unrealized_pct: r2(p.unrealized_pct),
					stop_pct: r2((p.stop_loss / p.entry_price - 1) * 100), target_pct: r2((p.take_profit / p.entry_price - 1) * 100),
					thesis: p.thesis,
				})),
				recent_trades: closed.map((t) => ({ asset: t.asset, opened_at: t.opened_at, closed_at: t.closed_at, pnl_pct: r2(t.pnl_pct), exit_reason: t.exit_reason, thesis: t.thesis })),
				curve,
				journal: [
					...snaps.filter((s) => s.recap).slice(-7).map((s) => ({ at: s.day, kind: "daily recap", text: s.recap })),
					...decisions.filter((d) => d.journal && d.mode === "live").map((d) => ({ at: d.created_at, kind: "decision", text: d.journal })),
				].sort((a, b) => String(b.at).localeCompare(String(a.at))).slice(0, 12),
				...(await outlook(cfg, fund, m.val.equity)),
				universe: cfg.universe,
				model: cfg.model,
				updated_at: new Date().toISOString(),
			};
		}
		publicCache = { at: Date.now(), data };
		return data;
	}

	return { dailyReport, notify, state, publicView, metrics, testEmail };
}
