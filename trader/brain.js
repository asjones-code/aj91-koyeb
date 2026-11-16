/**
 * The model side of the trader: one structured-output call per decision run,
 * plus a short daily recap. Uses the official Anthropic SDK.
 */
import Anthropic from "@anthropic-ai/sdk";

const FALLBACK_BETA = "server-side-fallback-2026-07-01";

// Structured-output schema. Numeric bounds can't be expressed here (not
// supported by structured outputs), so engine.js enforces every limit in code.
export function decisionSchema(universe) {
	const nullableNumber = { anyOf: [{ type: "number" }, { type: "null" }] };
	return {
		type: "object",
		additionalProperties: false,
		required: ["market_note", "journal", "opens", "closes", "adjusts"],
		properties: {
			market_note: { type: "string", description: "One sentence of broader crypto market context." },
			journal: { type: "string", description: "2-4 sentence first-person trading journal entry for this run: what you see, what you did and why, or why you stayed flat." },
			opens: {
				type: "array",
				items: {
					type: "object",
					additionalProperties: false,
					required: ["asset", "conviction", "horizon", "size_pct", "take_profit_pct", "stop_loss_pct", "max_hold_hours", "momentum_score", "signal_basis", "invalidation"],
					properties: {
						asset: { type: "string", enum: universe },
						conviction: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
						horizon: { type: "string", enum: ["intraday", "swing"] },
						size_pct: { type: "number", description: "Position size as % of fund equity." },
						take_profit_pct: { type: "number", description: "Take-profit distance above entry, in %." },
						stop_loss_pct: { type: "number", description: "Stop-loss distance below entry, in %." },
						max_hold_hours: { type: "number", description: "Time stop: close after this many hours." },
						momentum_score: { type: "integer", description: "1-10 momentum score per the framework." },
						signal_basis: { type: "string", description: "The specific, falsifiable signal (cite numbers from the data)." },
						invalidation: { type: "string", description: "Specific price/volume condition that invalidates the trade." },
					},
				},
			},
			closes: {
				type: "array",
				items: {
					type: "object",
					additionalProperties: false,
					required: ["trade_id", "reason"],
					properties: { trade_id: { type: "integer" }, reason: { type: "string" } },
				},
			},
			adjusts: {
				type: "array",
				items: {
					type: "object",
					additionalProperties: false,
					required: ["trade_id", "new_stop_loss", "new_take_profit", "reason"],
					properties: {
						trade_id: { type: "integer" },
						new_stop_loss: { ...nullableNumber, description: "New stop price (may only be raised), or null." },
						new_take_profit: { ...nullableNumber, description: "New take-profit price, or null." },
						reason: { type: "string" },
					},
				},
			},
		},
	};
}

export function tradingMandate(cfg, feePct) {
	const rt = feePct * 2 * 100;
	return `
TRADING MANDATE (this overrides the generic portfolio advice above where they differ)
You run a small, real-money, SPOT-ONLY crypto fund on Kraken as a public experiment: "can an AI beat just holding BTC?"
- Spot only. You can only buy with the fund's USD cash and sell coins the fund bought. No leverage, margin, shorting or derivatives exist for you.
- Tradable universe (liquid majors, no memecoins): ${cfg.universe.join(", ")}.
- Horizon: same-day ("intraday") to one week ("swing"). Every position needs a take-profit, a stop-loss and a time stop (max ${cfg.maxHoldHours}h).
- At most ${cfg.maxPositions} open positions, one per asset. Size as % of fund equity: LOW ≤ 10, MEDIUM ≤ 15, HIGH ≤ 20, never above ${cfg.maxPositionPct}.
- Costs are real: taker fee ≈ ${(feePct * 100).toFixed(2)}% per side (≈ ${rt.toFixed(2)}% round trip). A take-profit must be at least 3× the round trip (≥ ${(rt * 3).toFixed(2)}%) and at least 1.5× the stop distance. Stops between 0.75% and 12%; size stops off ATR/realized volatility, not round numbers.
- Doing nothing is a valid and often correct decision. Only trade when momentum, volume and timeframe alignment agree. Weak or conflicting signals → stay in cash.
- Protect the fund: if recent trades are losing, reduce size or stand down. The fund halts automatically at a ${(cfg.maxDrawdown * 100).toFixed(0)}% drawdown.
- You may close open positions early (thesis broken) or tighten stops to lock in profit. Stops can only be raised, never lowered.
- Learn from the recent closed trades you are shown: name what worked and what didn't in your journal.
- Use the exact numbers in the market data; do not invent prices or news.
Return ONLY the JSON object described by the schema.`.trim();
}

export function createBrain({ apiKey, quantSystem, log = console }) {
	const client = apiKey ? new Anthropic({ apiKey, timeout: 5 * 60_000, maxRetries: 2 }) : null;

	async function call(params) {
		if (!client) throw new Error("ANTHROPIC_API_KEY not set");
		try {
			// Server-side refusal fallback: if the model declines, the API retries on a fallback model in the same call.
			return await client.beta.messages.create({ ...params, betas: [FALLBACK_BETA], fallbacks: "default" });
		} catch (e) {
			if (e instanceof Anthropic.BadRequestError && /fallback/i.test(e.message || "")) {
				log.warn?.("[ai-trader] fallbacks rejected; retrying without:", e.message);
				return client.messages.create(params);
			}
			throw e;
		}
	}
	const textOf = (resp) => (resp.content || []).filter((b) => b.type === "text").map((b) => b.text).join("").trim();

	async function decide({ cfg, feePct, userContent }) {
		const resp = await call({
			model: cfg.model,
			max_tokens: 16000,
			system: `${quantSystem}\n\n${tradingMandate(cfg, feePct)}`,
			messages: [{ role: "user", content: userContent }],
			output_config: { effort: cfg.effort, format: { type: "json_schema", schema: decisionSchema(cfg.universe) } },
		});
		if (resp.stop_reason === "refusal") throw new Error(`model refused (${resp.stop_details?.category || "unknown"})`);
		if (resp.stop_reason === "max_tokens") throw new Error("model output truncated (max_tokens)");
		const text = textOf(resp);
		let parsed;
		try { parsed = JSON.parse(text); } catch { throw new Error("model returned invalid JSON"); }
		return { parsed, model: resp.model, usage: resp.usage };
	}

	async function recap({ cfg, summary }) {
		const resp = await call({
			model: cfg.model,
			max_tokens: 2000,
			system: "You are the AI running a small public spot-crypto trading experiment (\"can an AI beat just holding BTC?\"). Write candid, specific daily recaps in first person. No hype, no financial advice, no emojis. Mention the numbers that matter and compare against BTC. Plain text, 3-5 sentences.",
			messages: [{ role: "user", content: `Write today's recap from this data:\n${JSON.stringify(summary, null, 2)}` }],
			output_config: { effort: "low" },
		});
		if (resp.stop_reason === "refusal") return "";
		return textOf(resp);
	}

	return { decide, recap, enabled: Boolean(client) };
}
