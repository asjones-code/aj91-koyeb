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
		required: ["market_note", "journal", "opens", "adds", "closes", "adjusts", "watch"],
		properties: {
			market_note: { type: "string", description: "One sentence of broader crypto market context." },
			journal: { type: "string", description: "2-4 sentence first-person trading journal entry for this run: what you see, what you did and why, or why you stayed flat." },
			opens: {
				type: "array",
				items: {
					type: "object",
					additionalProperties: false,
					required: ["asset", "entry_type", "conviction", "horizon", "size_pct", "take_profit_pct", "stop_loss_pct", "max_hold_hours", "momentum_score", "signal_basis", "invalidation"],
					properties: {
						asset: { type: "string", enum: universe },
						entry_type: { type: "string", enum: ["full", "starter"], description: "\"starter\" = half-size early entry on a change of character before full confirmation; \"full\" = confirmed setup." },
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
			adds: {
				type: "array",
				description: "Add to an open STARTER position once its retest has held, bringing it up to a full position. Only into a winning starter; never average down.",
				items: {
					type: "object",
					additionalProperties: false,
					required: ["trade_id", "conviction", "size_pct", "reason"],
					properties: {
						trade_id: { type: "integer" },
						conviction: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
						size_pct: { type: "number", description: "TOTAL position size after the add, as % of fund equity." },
						reason: { type: "string", description: "What confirmed it, e.g. 'retest of 41.99 held on lower volume'." },
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
			watch: {
				type: "array",
				description: "Price levels to watch until the next run. If price crosses one, you are called again early. Replaces the previous watch list; use [] for none.",
				items: {
					type: "object",
					additionalProperties: false,
					required: ["asset", "direction", "price", "reason"],
					properties: {
						asset: { type: "string", enum: universe },
						direction: { type: "string", enum: ["above", "below"] },
						price: { type: "number" },
						reason: { type: "string", description: "What crossing this level would mean, e.g. 'reclaims 4h SMA20'." },
					},
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
- Losing streaks: "risk_mode" in the data says whether sizes are halved. After 2 losing trades in a row, the next 2 trades are capped at half size (the code enforces this; starters are already half size and are not cut further). That is the whole penalty: do NOT stand down or raise your bar for entries because of recent losses. Judge each setup on its own merits at the reduced size. The fund halts automatically at a ${(cfg.maxDrawdown * 100).toFixed(0)}% drawdown.
- Starter positions (entry_type "starter"): you don't have to wait for a higher high or a tested spring to get in. A 4h close above the reference pivot (change of character) with volume_vs_7d_avg ≥ 1.0 and up_vs_down_volume_48h ≥ 1.0, or a spring that has held but isn't tested yet, qualifies for a STARTER even before the trend is confirmed. This is the one exception to "only buy in an uptrend / never buy a bounce in a downtrend". A starter is half size (the code caps it at half the conviction limit) and may use a volatility stop of about 1–1.5× realized_vol_daily_pct instead of the deeper structural stop, with a take-profit of at least 1.25× the stop (full entries need 1.5×). Never open a starter into an upthrust, a buying climax, or with 1h RSI above ~78.
- Adding (the "adds" list): once a starter's retest holds (spring tested_on_lower_volume, or price holds above the broken pivot on a quieter pullback) and the position is in profit, add to bring it up to a full position for its conviction. Raise the stop to the structural level in "adjusts" at the same time. Each starter can be added to once. Never add to a losing position.
- You may close open positions early (thesis broken) or tighten stops to lock in profit. Stops can only be raised, never lowered.
- Learn from the recent closed trades you are shown: name what worked and what didn't in your journal.
- You have memory. "track_record" says how many runs you have made; "previous_runs" holds your last runs (trigger, what you wrote, what you did) and "price_change_since_pct" shows how each coin moved after each one. Grade your earlier calls against it: if you stayed flat and the coins fell, say staying flat was right; if a setup you passed on ran, say what you missed and whether your rule should change. Refer back to levels you set before. Never describe a run as a first run or say you have no history unless previous_runs is empty.
- Use the exact numbers in the market data; do not invent prices or news.
- Each coin's "structure_4h" applies Step 2b on completed 4h bars: "trend" (up/down/range from the last two swing highs and lows), "impulses" (expanding/contracting legs), "reference_pivot" (the change-of-character level and whether a close has broken it), "last_bar.effort" (normal, buying_climax, selling_climax, effort_no_result, no_demand, no_supply), "up_vs_down_volume_48h", and "spring"/"upthrust" (a false break of a pivot in the last 6 bars: "held" = the extreme hasn't been revisited; "tested_on_lower_volume" = a quieter retest of the level; null = too recent to tell). You are spot-only, so an upthrust means don't buy or consider exiting, never short. Use spring lows and swing lows for structural stops, set just beyond the level.
- Between scheduled runs a free price check watches the levels you put in "watch" (at most 6) and screens every coin for alignment (above 4h SMA20, volume above its 7d average, positive 24h). If either fires you are called again early, so set concrete re-entry or breakdown levels instead of only describing them.
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

	/**
	 * YOLO: pick up to `maxPicks` paper day trades from a pre-screened shortlist.
	 * Paper only — nothing here can place an order. Small prompt, low effort.
	 */
	async function yoloPick({ cfg, shortlist, track, feePct }) {
		const assets = shortlist.map((c) => c.asset);
		const schema = {
			type: "object", additionalProperties: false, required: ["note", "picks"],
			properties: {
				note: { type: "string", description: "One or two sentences: what the screen shows today and why you picked (or skipped) what you did." },
				picks: {
					type: "array",
					items: {
						type: "object", additionalProperties: false,
						required: ["asset", "confidence", "target_pct", "stop_pct", "horizon_hours", "thesis", "invalidation"],
						properties: {
							asset: { type: "string", enum: assets },
							confidence: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
							target_pct: { type: "number", description: "Target above entry, in %." },
							stop_pct: { type: "number", description: "Stop below entry, in %." },
							horizon_hours: { type: "number", description: "Hours until the call expires (1-24)." },
							thesis: { type: "string", description: "The specific signal, citing numbers from the data." },
							invalidation: { type: "string" },
						},
					},
				},
			},
		};
		const rt = feePct * 2 * 100;
		const system = `You scout higher-risk crypto on Kraken for a PAPER day-trading log. Nothing you pick is bought; each call is scored automatically against real prices and the record is emailed daily.
- Long-only day trades: entry is the current price, horizon 1-24h. Give a target and a stop in %; target ≥ 1.5× stop and ≥ ${(rt * 3).toFixed(2)}% (3× the ${rt.toFixed(2)}% round-trip fee). Stops 2-15%, sized off the coin's ATR/realized volatility.
- Pick at most ${cfg.yoloMaxPicks}. Zero picks is fine when nothing is clean. Prefer fresh attention (volume well above its 7d average), strength vs BTC, price at or breaking recent highs, and an up or range 4h structure. Avoid blow-off moves already far above their 4h SMA20, upthrusts, and coins with little history.
- Learn from your track record: say what has and hasn't worked and adjust (e.g. tighter stops, fewer picks, different setups).
Return ONLY the JSON object.`;
		const resp = await call({
			model: cfg.yoloModel,
			max_tokens: 8000,
			system,
			messages: [{ role: "user", content: `Shortlist (pre-screened from every Kraken USD pair):\n${JSON.stringify(shortlist)}\n\nYour paper track record:\n${JSON.stringify(track)}` }],
			output_config: { effort: cfg.yoloEffort, format: { type: "json_schema", schema } },
		});
		if (resp.stop_reason === "refusal") throw new Error(`model refused (${resp.stop_details?.category || "unknown"})`);
		if (resp.stop_reason === "max_tokens") throw new Error("model output truncated (max_tokens)");
		let parsed;
		try { parsed = JSON.parse(textOf(resp)); } catch { throw new Error("model returned invalid JSON"); }
		return { parsed, model: resp.model, usage: resp.usage };
	}

	return { decide, recap, yoloPick, enabled: Boolean(client) };
}
