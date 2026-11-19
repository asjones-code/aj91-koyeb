/**
 * YOLO: discovery + paper day trades. NEVER places orders.
 *
 *   1. Screen (free): one Ticker call covers every Kraken pair. Keep liquid USD pairs outside the
 *      main universe, with tight spreads, that are up on the day; rank by move × liquidity.
 *   2. Enrich (free): hourly OHLC for the top candidates → the same indicators the main bot uses
 *      (24h/7d/30d, volume vs 7d average, 4h structure, strength vs BTC).
 *   3. Pick (one small model call): up to N long day-trade calls with target / stop / horizon.
 *   4. Score (free, every monitor tick): 15-min bars since entry decide target, stop or expiry.
 */
const HOUR = 3600_000;
const r2 = (v) => (v == null || !Number.isFinite(v) ? null : Math.round(v * 100) / 100);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

// Stablecoins, fiat, gold and wrapped/pegged tokens: no upside to discover.
const EXCLUDE = new Set(["USDT", "USDC", "DAI", "PYUSD", "TUSD", "USDG", "RLUSD", "FDUSD", "USDS", "USDE", "USDD", "EURC", "EURT", "EUR", "GBP", "CAD", "AUD", "CHF", "JPY",
	"PAXG", "XAUT", "WBTC", "TBTC", "CBBTC", "LSETH", "METH", "STETH", "WSTETH", "CBETH", "RETH", "BSOL", "JITOSOL", "MSOL"]);

export function createYolo({ cfgFn, store, kraken, brain, log = console }) {
	let running = null;

	async function screen(cfg) {
		const [pairs, tick] = await Promise.all([kraken.usdPairs(), kraken.tickerAll()]);
		const universe = new Set(cfg.universe);
		const rows = [];
		for (const p of pairs) {
			const t = tick[p.key];
			if (!t || universe.has(p.asset) || EXCLUDE.has(p.asset.toUpperCase()) || /x$/.test(p.asset)) continue; // trailing lowercase x = tokenized stocks
			const last = Number(t.c[0]), bid = Number(t.b[0]), ask = Number(t.a[0]), open = Number(t.o);
			const volUsd = Number(t.v[1]) * Number(t.p[1]);
			if (!(last > 0 && bid > 0 && ask > 0 && open > 0)) continue;
			const spreadPct = ((ask - bid) / ((ask + bid) / 2)) * 100;
			const dayPct = (last / open - 1) * 100;
			if (volUsd < cfg.yoloMinVolumeUsd || spreadPct > cfg.yoloMaxSpreadPct || dayPct <= 0) continue;
			rows.push({ ...p, last, spread_pct: r2(spreadPct), day_pct: r2(dayPct), volume_24h_usd: Math.round(volUsd), pre: dayPct * Math.log10(volUsd) });
		}
		return { scanned: pairs.length, passed: rows.sort((a, b) => b.pre - a.pre) };
	}

	async function enrich(rows, btc7d) {
		const out = [];
		for (const c of rows) {
			try {
				const m = await kraken.indicatorsFor(c.pair);
				if (m.error || m.hours_of_history < 24 * 20) continue;          // < ~20 days listed: skip fresh listings
				const s = m.structure_4h && !m.structure_4h.error ? m.structure_4h : null;
				const score = Math.min(m.volume_vs_7d_avg || 0, 5) * 2 + clamp(m.ret_24h_pct || 0, 0, 30) / 3
					+ (s?.trend === "up" ? 3 : s?.trend === "range" ? 1 : 0) + ((m.vs_sma20_4h_pct || 0) > 0 ? 1 : 0)
					- ((m.vs_sma20_4h_pct || 0) > 25 ? 3 : 0) - (s?.upthrust ? 2 : 0);
				out.push({
					asset: c.asset, pair: c.pair, price: m.price, spread_pct: c.spread_pct, volume_24h_usd: c.volume_24h_usd,
					ret_24h_pct: m.ret_24h_pct, ret_7d_pct: m.ret_7d_pct, ret_30d_pct: m.ret_30d_pct,
					rel_strength_vs_btc_7d_pct: btc7d != null && m.ret_7d_pct != null ? r2(m.ret_7d_pct - btc7d) : null,
					volume_vs_7d_avg: m.volume_vs_7d_avg, realized_vol_daily_pct: m.realized_vol_daily_pct, atr_14d_pct: m.atr_14d_pct,
					rsi_14_4h: m.rsi_14_4h, vs_sma20_4h_pct: m.vs_sma20_4h_pct, from_7d_high_pct: m.from_7d_high_pct,
					structure_4h: s ? { trend: s.trend, effort: s.last_bar?.effort, spring: Boolean(s.spring), upthrust: Boolean(s.upthrust) } : null,
					screen_score: r2(score),
				});
			} catch (e) { log.warn?.(`[yolo] ${c.asset}: ${e.message}`); }
			await kraken.sleep(350);
		}
		return out.sort((a, b) => b.screen_score - a.screen_score);
	}

	async function trackRecord() {
		const [stats, recent] = await Promise.all([store.paperStats(), store.closedPaper(15)]);
		return {
			closed: stats.n, wins: stats.wins, targets: stats.targets, stops: stats.stops, expired: stats.expired,
			avg_net_pct: r2(stats.avgPct),
			recent: recent.map((p) => ({ asset: p.asset, confidence: p.confidence, outcome: p.status, net_pct: r2(p.pnl_pct), best_move_pct: r2(p.max_up_pct), thesis: String(p.thesis || "").slice(0, 160) })),
		};
	}

	/** Discovery + paper picks. Returns the run with its shortlist and calls. */
	function run({ force = false } = {}) {
		if (running) return running;
		running = (async () => {
			const cfg = cfgFn();
			const last = await store.lastYoloRun();
			if (!force && last && !last.error && Date.now() - new Date(last.created_at).getTime() < cfg.yoloCooldownMinutes * 60_000) {
				return { ok: true, cached: true, run: last, picks: await store.paperForRun(last.id) };
			}
			const btc7d = (await kraken.marketSnapshot(["BTC"]))?.BTC?.ret_7d_pct ?? null;
			const { scanned, passed } = await screen(cfg);
			const shortlist = (await enrich(passed.slice(0, 12), btc7d)).slice(0, 8);
			if (!shortlist.length) {
				const rec = await store.insertYoloRun({ model: null, scanned, shortlist: [], note: `Nothing passed the screen (${passed.length} liquid gainers, none with clean data).` });
				return { ok: true, run: rec, picks: [], passed: passed.length };
			}
			const feePct = await kraken.takerFee().catch(() => 0.004);
			let parsed, model;
			try { ({ parsed, model } = await brain.yoloPick({ cfg, shortlist, track: await trackRecord(), feePct })); }
			catch (e) {
				const rec = await store.insertYoloRun({ model: cfg.yoloModel, scanned, shortlist, error: e.message });
				return { ok: false, error: e.message, run: rec };
			}
			const rec = await store.insertYoloRun({ model, scanned, shortlist, note: parsed.note });
			const byAsset = Object.fromEntries(shortlist.map((c) => [c.asset, c]));
			const picks = [], rejected = [];
			const seen = new Set();
			for (const p of (parsed.picks || []).slice(0, cfg.yoloMaxPicks)) {
				const c = byAsset[p.asset];
				const stop = Number(p.stop_pct), target = Number(p.target_pct), hours = Number(p.horizon_hours);
				const why = !c ? "not on the shortlist" : seen.has(p.asset) ? "duplicate"
					: !(stop >= 2 && stop <= 15) ? `stop ${stop}% outside 2–15%`
					: !(target >= 1.5 * stop && target >= feePct * 600) ? `target ${target}% too small for the stop/fees`
					: !(hours >= 1 && hours <= 24) ? `horizon ${hours}h outside 1–24h` : null;
				if (why) { rejected.push({ asset: p.asset, reason: why }); continue; }
				seen.add(p.asset);
				picks.push(await store.insertPaper({
					run_id: rec.id, asset: c.asset, pair: c.pair, confidence: p.confidence, entry: c.price,
					target: c.price * (1 + target / 100), stop: c.price * (1 - stop / 100),
					expires_at: new Date(Date.now() + hours * HOUR), thesis: p.thesis, invalidation: p.invalidation,
					fee_pct: r2(feePct * 2 * 100), max_up_pct: 0,
				}));
			}
			return { ok: true, run: rec, picks, rejected, passed: passed.length };
		})().finally(() => { running = null; });
		return running;
	}

	/** Score open paper trades on 15-min bars since entry. Same-bar target+stop counts as the stop. */
	async function resolve() {
		const open = await store.openPaper();
		const closed = [];
		for (const p of open) {
			try {
				const since = Math.floor(new Date(p.created_at).getTime() / 1000);
				const bars = (await kraken.ohlc(p.pair, 15, since)).filter((b) => b.t >= since);
				const expires = new Date(p.expires_at).getTime();
				let status = null, exit = null, best = p.max_up_pct || 0, at = null;
				for (const b of bars) {
					if (b.t * 1000 >= expires) break;
					best = Math.max(best, (b.h / p.entry - 1) * 100);
					if (b.l <= p.stop) { status = "stop"; exit = p.stop; at = b.t; break; }
					if (b.h >= p.target) { status = "target"; exit = p.target; at = b.t; break; }
				}
				if (!status && Date.now() >= expires) {
					const lastBar = [...bars].reverse().find((b) => b.t * 1000 < expires) || bars[bars.length - 1];
					if (lastBar) { status = "expired"; exit = lastBar.c; at = Math.floor(expires / 1000); }
				}
				if (status) {
					const gross = (exit / p.entry - 1) * 100;
					closed.push(await store.updatePaper(p.id, {
						status, exit_price: exit, closed_at: new Date(at * 1000), max_up_pct: r2(best), pnl_pct: r2(gross - (p.fee_pct ?? 0.8)),
					}));
				} else if (best > (p.max_up_pct || 0)) {
					await store.updatePaper(p.id, { max_up_pct: r2(best) });
				}
			} catch (e) { log.warn?.(`[yolo] resolve #${p.id} ${p.asset}: ${e.message}`); }
			await kraken.sleep(350);
		}
		return { checked: open.length, closed };
	}

	return { run, resolve, trackRecord, isRunning: () => Boolean(running) };
}
