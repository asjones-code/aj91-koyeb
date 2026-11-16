/**
 * Kraken access for the AI trader: pair metadata, spot-only market orders with
 * fill capture, fee tier, and OHLC-derived indicators.
 *
 * SAFETY: every order goes through buildSpotOrder(), which emits a fixed set of
 * parameters. It never sends `leverage`, `reduce_only`, `margin` or any other
 * field — so the trader can only buy with cash it has and sell coins it holds.
 */
import { UNIVERSE } from "./config.js";

const ALIAS = { BTC: "XBT", DOGE: "XDG" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function createKraken({ krakenPrivatePost, krakenPublicGet, krakenUsdPrices, normalizeAsset }) {
	const json = async (resPromise) => (await resPromise).json();
	const priv = async (path, params) => {
		const data = await json(krakenPrivatePost(path, params));
		if (data.error?.length) throw new Error(`Kraken ${path}: ${data.error[0]}`);
		return data.result;
	};
	const pub = async (path, params) => {
		const data = await json(krakenPublicGet(path, params));
		if (data.error?.length) throw new Error(`Kraken ${path}: ${data.error[0]}`);
		return data.result;
	};

	// ── pair metadata (cached 6h) ─────────────────────────────────────────────
	const pairCache = new Map(); // asset -> { info, at }
	const altFor = (asset) => UNIVERSE[asset] || `${ALIAS[asset] || asset}USD`;
	const parsePair = (info) => ({
		pair: info.altname,
		lotDecimals: Number(info.lot_decimals ?? 8),
		ordermin: Number(info.ordermin ?? 0),
		costmin: Number(info.costmin ?? 0),
		online: !info.status || info.status === "online",
	});
	/** { asset: {pair, lotDecimals, ordermin, costmin, online} } for assets that have a USD pair. */
	async function pairInfo(assets) {
		const out = {};
		const need = [];
		for (const a of new Set(assets)) {
			const c = pairCache.get(a);
			if (c && Date.now() - c.at < 6 * 3600_000) out[a] = c.info; else need.push(a);
		}
		const ingest = (result, list) => {
			const byAlt = Object.fromEntries(Object.values(result || {}).map((i) => [i.altname, i]));
			for (const a of list) {
				const i = byAlt[altFor(a)];
				if (!i) continue;
				out[a] = parsePair(i);
				pairCache.set(a, { info: out[a], at: Date.now() });
			}
		};
		if (need.length) {
			try { ingest(await pub("/0/public/AssetPairs", { pair: need.map(altFor).join(",") }), need); }
			catch {
				// One unknown pair fails the whole batch — fall back to one call per asset.
				for (const a of need) {
					try { ingest(await pub("/0/public/AssetPairs", { pair: altFor(a) }), [a]); } catch { /* no USD pair */ }
				}
			}
		}
		return out;
	}

	const floorTo = (qty, decimals) => {
		const f = 10 ** decimals;
		return Math.floor(qty * f + 1e-9) / f;
	};

	// ── spot-only orders ──────────────────────────────────────────────────────
	const ALLOWED_KEYS = ["pair", "type", "ordertype", "volume", "oflags"];
	/** The ONLY way an order is built. Fixed keys; no leverage/margin fields can exist. */
	function buildSpotOrder({ pair, side, volume, lotDecimals }) {
		if (side !== "buy" && side !== "sell") throw new Error(`invalid side ${side}`);
		if (typeof pair !== "string" || !/^[A-Z0-9]{5,12}$/.test(pair)) throw new Error(`invalid pair ${pair}`);
		if (!(volume > 0) || !Number.isFinite(volume)) throw new Error(`invalid volume ${volume}`);
		const params = {
			pair,
			type: side,
			ordertype: "market",
			volume: volume.toFixed(lotDecimals ?? 8),
			// Charge the fee in USD on both sides so coin quantities stay exact.
			oflags: "fciq",
		};
		if (Object.keys(params).some((k) => !ALLOWED_KEYS.includes(k))) throw new Error("order guard: unexpected field");
		return params;
	}

	/** Poll QueryOrders until closed; returns {status, volExec, cost, fee, avgPrice} or null. */
	async function getFill(txid, { tries = 8, delayMs = 1000 } = {}) {
		let last = null;
		for (let i = 0; i < tries; i++) {
			if (i) await sleep(delayMs);
			let o;
			try { o = (await priv("/0/private/QueryOrders", { txid, trades: "false" }))?.[txid]; }
			catch (e) { if (i === tries - 1) throw e; continue; }
			if (!o) continue;
			last = {
				status: o.status,
				volExec: Number(o.vol_exec) || 0,
				cost: Number(o.cost) || 0,
				fee: Number(o.fee) || 0,
				avgPrice: Number(o.price) || 0,
			};
			if (["closed", "canceled", "expired"].includes(o.status)) return last;
		}
		return last;
	}

	/** Place a spot market order and return the actual fill. */
	async function marketOrder({ pair, side, volume, lotDecimals }) {
		const params = buildSpotOrder({ pair, side, volume, lotDecimals });
		const result = await priv("/0/private/AddOrder", params);
		const txid = result?.txid?.[0];
		if (!txid) throw new Error("Kraken returned no txid");
		const fill = await getFill(txid);
		if (!fill) throw new Error(`order ${txid} sent but fill could not be read — reconcile manually`);
		return { txid, ...fill };
	}

	async function balances() {
		const res = await priv("/0/private/Balance");
		const out = {};
		for (const [raw, v] of Object.entries(res || {})) {
			const a = normalizeAsset(raw);
			out[a] = (out[a] || 0) + Number(v);
		}
		return out;
	}

	/** Taker fee as a fraction (e.g. 0.004). Falls back to 0.4% if unavailable. */
	let feeCache = null;
	async function takerFee() {
		if (feeCache && Date.now() - feeCache.at < 6 * 3600_000) return feeCache.fee;
		let fee = 0.004;
		try {
			const r = await priv("/0/private/TradeVolume", { pair: "XBTUSD" });
			const f = Object.values(r?.fees || {})[0];
			if (f?.fee) fee = Number(f.fee) / 100;
		} catch { /* keep default */ }
		feeCache = { fee, at: Date.now() };
		return fee;
	}

	const prices = (assets) => krakenUsdPrices(assets);

	// ── indicators from hourly OHLC ───────────────────────────────────────────
	async function ohlcHourly(pair) {
		const res = await pub("/0/public/OHLC", { pair, interval: 60 });
		const key = Object.keys(res).find((k) => k !== "last");
		return (res[key] || []).map((b) => ({
			t: Number(b[0]), o: Number(b[1]), h: Number(b[2]), l: Number(b[3]), c: Number(b[4]), v: Number(b[6]),
		}));
	}

	async function marketData(assets) {
		const out = {};
		for (const a of assets) {
			try { out[a] = indicators(await ohlcHourly(UNIVERSE[a] || altFor(a))); }
			catch (e) { out[a] = { error: e.message }; }
			await sleep(350); // stay well under Kraken's public rate limit
		}
		const btc7 = out.BTC?.ret_7d_pct;
		for (const a of Object.keys(out)) {
			if (out[a].ret_7d_pct != null && btc7 != null) out[a].rel_strength_vs_btc_7d_pct = round(out[a].ret_7d_pct - btc7, 2);
		}
		return out;
	}

	return { pairInfo, floorTo, buildSpotOrder, marketOrder, getFill, balances, takerFee, prices, marketData };
}

// ── pure indicator math (exported for tests) ─────────────────────────────────
const round = (v, d = 2) => (v == null || !Number.isFinite(v) ? null : Math.round(v * 10 ** d) / 10 ** d);
const pct = (a, b) => (a > 0 && b > 0 ? (a / b - 1) * 100 : null);
const mean = (xs) => xs.reduce((s, x) => s + x, 0) / (xs.length || 1);
function stdev(xs) { const m = mean(xs); return Math.sqrt(mean(xs.map((x) => (x - m) ** 2))); }
function sma(xs, n) { return xs.length >= n ? mean(xs.slice(-n)) : null; }
function rsi(closes, n = 14) {
	if (closes.length < n + 1) return null;
	let gain = 0, loss = 0;
	for (let i = closes.length - n; i < closes.length; i++) {
		const d = closes[i] - closes[i - 1];
		if (d >= 0) gain += d; else loss -= d;
	}
	if (loss === 0) return 100;
	const rs = gain / n / (loss / n);
	return 100 - 100 / (1 + rs);
}
/** Group hourly bars into N-hour bars, aligned to the most recent bar. */
function aggregate(bars, n) {
	const out = [];
	for (let end = bars.length; end - n >= 0; end -= n) {
		const g = bars.slice(end - n, end);
		out.unshift({ o: g[0].o, h: Math.max(...g.map((b) => b.h)), l: Math.min(...g.map((b) => b.l)), c: g[g.length - 1].c, v: g.reduce((s, b) => s + b.v, 0) });
	}
	return out;
}

export function indicators(bars) {
	if (!bars || bars.length < 48) return { error: "not enough history" };
	const closes = bars.map((b) => b.c);
	const last = closes[closes.length - 1];
	const at = (hoursAgo) => closes[Math.max(0, closes.length - 1 - hoursAgo)];
	const vol24 = bars.slice(-24).reduce((s, b) => s + b.v, 0);
	const prior = bars.slice(-24 * 8, -24);
	const avgDailyVolPrior = prior.length >= 24 ? prior.reduce((s, b) => s + b.v, 0) / (prior.length / 24) : null;
	const logRets = closes.slice(-169).map((c, i, arr) => (i ? Math.log(c / arr[i - 1]) : null)).filter((x) => x != null);
	const daily = aggregate(bars, 24);
	const atr = daily.length >= 15
		? mean(daily.slice(-14).map((d, i, arr) => {
			const prevC = i ? arr[i - 1].c : daily[daily.length - 15].c;
			return Math.max(d.h - d.l, Math.abs(d.h - prevC), Math.abs(d.l - prevC));
		}))
		: null;
	const h4 = aggregate(bars, 4).map((b) => b.c);
	const last7d = bars.slice(-168);
	const high7 = Math.max(...last7d.map((b) => b.h));
	const low7 = Math.min(...last7d.map((b) => b.l));
	return {
		price: last,
		ret_1h_pct: round(pct(last, at(1)), 2),
		ret_24h_pct: round(pct(last, at(24)), 2),
		ret_7d_pct: round(pct(last, at(168)), 2),
		ret_30d_pct: round(pct(last, closes[0]), 2),
		volume_24h_usd: round(vol24 * last, 0),
		volume_vs_7d_avg: avgDailyVolPrior ? round(vol24 / avgDailyVolPrior, 2) : null,
		realized_vol_daily_pct: round(stdev(logRets) * Math.sqrt(24) * 100, 2),
		atr_14d_pct: atr ? round((atr / last) * 100, 2) : null,
		rsi_14_1h: round(rsi(closes), 1),
		rsi_14_4h: round(rsi(h4), 1),
		vs_sma20_4h_pct: round(pct(last, sma(h4, 20)), 2),
		vs_sma50_4h_pct: round(pct(last, sma(h4, 50)), 2),
		high_7d: high7,
		low_7d: low7,
		from_7d_high_pct: round(pct(last, high7), 2),
		from_7d_low_pct: round(pct(last, low7), 2),
	};
}
