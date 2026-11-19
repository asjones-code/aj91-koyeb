/**
 * AI trader configuration. Every value can be overridden with an env var;
 * defaults follow the quant-analyst skill's sizing rules.
 */

// Liquid majors only — no memecoins. Kraken pair altnames for the USD market.
export const UNIVERSE = {
	BTC: "XBTUSD", ETH: "ETHUSD", SOL: "SOLUSD", XRP: "XRPUSD", ADA: "ADAUSD",
	DOT: "DOTUSD", LINK: "LINKUSD", AVAX: "AVAXUSD", LTC: "LTCUSD",
};

// Max position size per conviction, as % of fund equity (quant-analyst skill:
// LOW ≤ 10%, HIGH ≤ 20%, never > 25% in one position).
export const CONVICTION_CAP_PCT = { LOW: 10, MEDIUM: 15, HIGH: 20 };

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export function traderConfig(env = process.env) {
	const num = (key, dflt) => {
		const raw = env[key];
		if (raw == null || String(raw).trim() === "") return dflt;
		const v = Number(raw);
		return Number.isFinite(v) ? v : dflt;
	};
	const hours = String(env.KRAKEN_AI_DECISION_HOURS_UTC || "13,21")
		.split(",").map((h) => Number(h.trim())).filter((h) => Number.isInteger(h) && h >= 0 && h < 24);
	return {
		enabled: String(env.KRAKEN_AI_ENABLED || "true").trim() !== "false",
		// "live" places real orders; anything else is a dry run (decisions logged, no orders).
		mode: String(env.KRAKEN_AI_MODE || "dry_run").trim() === "live" ? "live" : "dry_run",
		model: String(env.KRAKEN_AI_MODEL || "claude-opus-5-5").trim(),
		effort: String(env.KRAKEN_AI_EFFORT || "high").trim(),
		maxPositions: clamp(Math.round(num("KRAKEN_AI_MAX_POSITIONS", 3)), 1, 6),
		maxPositionPct: clamp(num("KRAKEN_AI_MAX_POSITION_PCT", 25), 1, 50),
		minTradeUsd: Math.max(1, num("KRAKEN_AI_MIN_TRADE_USD", 10)),
		maxHoldHours: clamp(num("KRAKEN_AI_MAX_HOLD_HOURS", 168), 1, 336),
		maxDrawdown: clamp(num("KRAKEN_AI_MAX_DRAWDOWN", 0.15), 0.02, 0.9),
		decisionHoursUtc: hours.length ? hours : [13, 21],
		reportHourUtc: clamp(Math.round(num("KRAKEN_AI_REPORT_HOUR_UTC", 12)), 0, 23),
		monitorMinutes: clamp(Math.round(num("KRAKEN_AI_MONITOR_MIN", 15)), 1, 120),
		// Early (trigger-driven) AI runs: free price/indicator checks every monitor tick
		// can call the model between scheduled runs, capped to keep API cost down.
		maxEarlyRunsPerDay: clamp(Math.round(num("KRAKEN_AI_MAX_EARLY_RUNS_PER_DAY", 2)), 0, 12),
		earlyRunGapHours: clamp(num("KRAKEN_AI_EARLY_RUN_GAP_HOURS", 3), 0.5, 24),
		// YOLO: discovery across every Kraken USD pair + paper day-trade predictions (no real orders).
		yoloModel: String(env.KRAKEN_AI_YOLO_MODEL || env.KRAKEN_AI_MODEL || "claude-opus-5-5").trim(),
		yoloEffort: String(env.KRAKEN_AI_YOLO_EFFORT || "low").trim(),
		yoloMinVolumeUsd: Math.max(0, num("KRAKEN_AI_YOLO_MIN_VOLUME_USD", 2_000_000)),
		yoloMaxSpreadPct: clamp(num("KRAKEN_AI_YOLO_MAX_SPREAD_PCT", 0.6), 0.05, 5),
		yoloCooldownMinutes: clamp(num("KRAKEN_AI_YOLO_COOLDOWN_MIN", 10), 0, 1440),
		yoloMaxPicks: clamp(Math.round(num("KRAKEN_AI_YOLO_MAX_PICKS", 3)), 1, 5),
		seedFraction: 0.5,
		goalUsd: 1_000_000,
		universe: Object.keys(UNIVERSE),
	};
}
