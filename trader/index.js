/**
 * AI trader — wiring, HTTP routes and scheduler.
 *
 * Routes (premium = signal token or PM session):
 *   GET  /api/ai/kraken/state           premium  fund, positions, trades, decisions
 *   POST /api/ai/kraken/seed/preview    premium  what the one-time seed sale would sell
 *   POST /api/ai/kraken/seed/execute    premium  body {confirm:true}; sells half of each coin once
 *   POST /api/ai/kraken/run             premium  body {dry_run?:bool}; one decision run now
 *   POST /api/ai/kraken/monitor         premium  run the risk monitor now
 *   POST /api/ai/kraken/pause           premium  body {paused:bool}
 *   POST /api/ai/kraken/report          premium  send the daily report now
 *   POST /api/ai/kraken/test-email      premium  send a test email; returns MailerSend's response
 *   GET  /api/ai/kraken/public          public   % only, no dollar amounts
 */
import { traderConfig } from "./config.js";
import { createStore } from "./store.js";
import { createKraken } from "./kraken.js";
import { createBrain } from "./brain.js";
import { createEngine } from "./engine.js";
import { createReporter } from "./report.js";

export function createTrader(deps) {
	const log = deps.log || console;
	const cfgFn = () => traderConfig(process.env);
	const store = createStore(deps.getPool);
	const kraken = createKraken(deps);
	const brain = createBrain({ apiKey: process.env.ANTHROPIC_API_KEY, quantSystem: deps.quantSystem, log });
	let reporter;
	const notify = {
		alert: (...a) => reporter.notify.alert(...a),
		info: (...a) => reporter.notify.info(...a),
		trades: (...a) => reporter.notify.trades(...a),
		exits: (...a) => reporter.notify.exits(...a),
	};
	const engine = createEngine({ cfgFn, store, kraken, brain, notify, log });
	reporter = createReporter({ cfgFn, store, engine, brain, sendEmail: deps.sendEmail, emailTo: deps.emailTo, log });

	// ── scheduler ────────────────────────────────────────────────────────────
	let timer = null;
	const memClaims = new Set();
	async function claim(job, slot) {
		if (!store.hasDb()) { const k = `${job}:${slot}`; if (memClaims.has(k)) return false; memClaims.add(k); return true; }
		return store.claimJob(job, slot);
	}
	async function tick() {
		const cfg = cfgFn();
		if (!cfg.enabled || !store.hasDb() || !process.env.KRAKEN_API_KEY) return;
		const now = new Date();
		const day = now.toISOString().slice(0, 10);
		const h = now.getUTCHours();
		const jobs = [];
		const monitorSlot = Math.floor(now.getTime() / (cfg.monitorMinutes * 60_000));
		jobs.push(["monitor", String(monitorSlot), async () => {
			const r = await engine.monitor({ checkTriggers: cfg.maxEarlyRunsPerDay > 0 });
			if (r?.trigger) r.early = await maybeEarlyRun(r.trigger, cfg, day);
			return r;
		}]);
		if (cfg.decisionHoursUtc.includes(h) && now.getUTCMinutes() >= 5) {
			jobs.push(["decision", `${day}T${h}`, async () => {
				const fund = await store.getFund();
				if (fund.status !== "active") return { skipped: "not seeded" };
				return engine.runDecision({ trigger: `scheduled ${h}:05 UTC` });
			}]);
		}
		if (h === cfg.reportHourUtc) jobs.push(["report", day, () => reporter.dailyReport()]);
		for (const [job, slot, fn] of jobs) {
			try {
				if (!(await claim(job, slot))) continue;
				const r = await fn();
				if (job !== "monitor" || r?.exits?.length || r?.trigger) log.log?.(`[ai-trader] ${job} ${slot}:`, JSON.stringify(r).slice(0, 300));
			} catch (e) {
				log.error?.(`[ai-trader] ${job} ${slot} failed:`, e.message);
			}
		}
	}
	/** Run the model early on a trigger, at most maxEarlyRunsPerDay and earlyRunGapHours apart. */
	async function maybeEarlyRun(trigger, cfg, day) {
		const last = (await store.recentDecisions(1))[0];
		if (last && Date.now() - new Date(last.created_at).getTime() < cfg.earlyRunGapHours * 3600_000)
			return { skipped: `last decision under ${cfg.earlyRunGapHours}h ago` };
		for (let n = 0; n < cfg.maxEarlyRunsPerDay; n++) {
			if (await claim("early", `${day}#${n}`)) {
				const r = await engine.runDecision({ trigger: `early — ${trigger.reason}` });
				return { ran: true, n: n + 1, ok: r.ok, opened: (r.results || []).filter((x) => x.status === "opened").length, error: r.error };
			}
		}
		return { skipped: `daily cap of ${cfg.maxEarlyRunsPerDay} early runs reached` };
	}

	function start() {
		if (timer) return;
		const cfg = cfgFn();
		if (!cfg.enabled) { log.log?.("[ai-trader] disabled (KRAKEN_AI_ENABLED=false)"); return; }
		if (!store.hasDb()) { log.log?.("[ai-trader] no DATABASE_URL; scheduler not started"); return; }
		timer = setInterval(() => { tick().catch((e) => log.error?.("[ai-trader] tick:", e.message)); }, 60_000);
		log.log?.(`[ai-trader] scheduler on · mode=${cfg.mode} · model=${cfg.model} · decisions ${cfg.decisionHoursUtc.map((x) => `${x}:05`).join(", ")} UTC · report ${cfg.reportHourUtc}:00 UTC · monitor every ${cfg.monitorMinutes}m · early runs ≤${cfg.maxEarlyRunsPerDay}/day`);
	}

	// ── routes ───────────────────────────────────────────────────────────────
	async function handle(req, res, pathname, method, { isAuthed, jsonResponse, corsHeaders, readJson }) {
		if (!pathname.startsWith("/api/ai/kraken/")) return false;
		const cors = corsHeaders(req.headers.origin, true);
		const send = (status, body) => { jsonResponse(res, status, body, cors); return true; };
		if (method === "OPTIONS") { res.writeHead(204, { ...cors, "Access-Control-Max-Age": "86400" }); res.end(); return true; }

		if (pathname === "/api/ai/kraken/public" && method === "GET") {
			try {
				res.setHeader("Cache-Control", "public, max-age=120");
				return send(200, store.hasDb() ? await reporter.publicView() : { status: "offline" });
			} catch (e) { return send(500, { error: "unavailable" }); }
		}

		if (!isAuthed(req)) return send(401, { error: "Premium feature — invalid or missing token." });
		if (!store.hasDb()) return send(503, { error: "DATABASE_URL is required for the AI trader" });
		try {
			const body = method === "POST" ? await readJson() : {};
			if (pathname === "/api/ai/kraken/state" && method === "GET") return send(200, await reporter.state());
			if (pathname === "/api/ai/kraken/seed/preview" && method === "POST") return send(200, await engine.seedPreview());
			if (pathname === "/api/ai/kraken/seed/execute" && method === "POST") {
				if (body.confirm !== true) return send(400, { error: "Send {\"confirm\": true} to run the one-time seed sale" });
				const r = await engine.seedExecute();
				return send(r.ok ? 200 : 400, r);
			}
			if (pathname === "/api/ai/kraken/run" && method === "POST") {
				const r = await engine.runDecision({ dryRun: body.dry_run === true, trigger: "manual" });
				return send(r.ok ? 200 : 400, r);
			}
			if (pathname === "/api/ai/kraken/monitor" && method === "POST") return send(200, await engine.monitor());
			if (pathname === "/api/ai/kraken/pause" && method === "POST") {
				const fund = await engine.setPaused(body.paused !== false);
				return send(200, { ok: true, halted: fund.halted, halted_reason: fund.halted_reason });
			}
			if (pathname === "/api/ai/kraken/report" && method === "POST") return send(200, await reporter.dailyReport({ send: true }));
			if (pathname === "/api/ai/kraken/test-email" && method === "POST") {
				// Always 200: the hosting edge replaces 5xx bodies with its own page, which hid the reason.
				return send(200, await reporter.testEmail());
			}
			return send(404, { error: "Not found" });
		} catch (e) {
			log.error?.("[ai-trader] route error:", e);
			return send(500, { error: e.message });
		}
	}

	return { start, handle, config: cfgFn, tick, engine, reporter, store };
}
