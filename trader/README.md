# AI trader

A small, real-money, **spot-only** crypto fund on Kraken run by Claude, framed as a public experiment: *can an AI beat just holding BTC?*

## How it works

1. **Seed (once).** From the desk on `/crypto` (unlocked), *Seed preview* lists half of each coin in the account (dust, staked balances and coins without a USD market are skipped). *Execute seed sale* market-sells them; the USD proceeds become the fund. The coins sold are remembered as the "hold seed coins" benchmark.
2. **Decisions (13:05 and 21:05 UTC).** The server computes indicators from Kraken hourly OHLC for the 9-coin universe (24h/7d/30d returns, volume vs 7d average, realized vol, ATR, RSI 1h/4h, distance from 4h SMA20/50, 7d high/low, strength vs BTC) and asks the model, using the `quant-analyst` framework plus a trading mandate, for opens, closes and stop/target adjustments as structured JSON.
3. **Guardrails in code** (the model can't override them): universe only, one position per coin, ≤ `KRAKEN_AI_MAX_POSITIONS`, size ≤ 10/15/20% by LOW/MEDIUM/HIGH conviction and ≤ `KRAKEN_AI_MAX_POSITION_PCT`, stop 0.75–12%, target ≥ 1.5× stop and ≥ 3× round-trip fees, time stop ≤ `KRAKEN_AI_MAX_HOLD_HOURS`, stops can only be raised, buys capped by fund cash *and* the real exchange USD balance.
4. **Risk monitor (every 15 min, no model call).** Sells on stop-loss, take-profit or time stop, and halts new trades at a `KRAKEN_AI_MAX_DRAWDOWN` drawdown from peak (email alert; resume from the panel).
5. **Early runs (free checks, capped model calls).** Each decision returns a `watch` list of price levels (e.g. "BTC above 66,700 — reclaims 4h SMA20"). Every monitor tick checks those levels with a plain ticker call and screens the universe for alignment (above 4h SMA20, volume ≥ 7d average, 24h positive). If either fires and the fund could open a trade, the model is called early with the trigger as context — at most `KRAKEN_AI_MAX_EARLY_RUNS_PER_DAY` times a day and no sooner than `KRAKEN_AI_EARLY_RUN_GAP_HOURS` after the previous decision.
6. **Daily report (12:00 UTC).** Email with equity, 24h / since-start return vs BTC and vs holding the seed coins, drawdown, win rate, fees, open positions, trades closed, the AI's journal, a short AI-written recap, and progress to $1M. A daily snapshot feeds the public page.

**Spot only, by construction:** every order is built by `buildSpotOrder()` in `kraken.js`, which emits exactly `pair, type, ordertype=market, volume, oflags=fciq` — there is no code path that sends `leverage`, margin or short parameters. Fees are charged in USD so coin quantities stay exact.

## Pages and endpoints

- `/crypto` — the AI Trader page. Public view is **percentages only** (no dollar amounts): returns vs BTC and holding the seed coins, current posture and latest journal entry, the 9-coin screen with 4h structure, tripwire levels, and the method. Data: `GET /api/ai/kraken/public`.
- Unlocked with the signal token, `/crypto` shows the desk: $ balances, controls (dry run, run now, pause/resume, send report, test email, seed preview/execute), 4h candles per coin with watch/stop/target lines, growth-of-100, positions, closed trades and the decision log. `/ai-trader` redirects here; `/portfolio` (stocks) is deprecated and redirects here too.
- Private API (signal token): `GET state`, `POST seed/preview`, `POST seed/execute {confirm:true}`, `POST run {dry_run?}`, `POST monitor`, `POST pause {paused}`, `POST report`, `POST test-email` under `/api/ai/kraken/`.
- Email outcomes are recorded (`last_email` in state, shown in the panel); MailerSend errors such as an unverified sender domain show up there instead of failing silently.

## Configuration

| Env var | Default | |
|---|---|---|
| `KRAKEN_AI_MODE` | `dry_run` | `live` places real orders |
| `KRAKEN_AI_ENABLED` | `true` | `false` stops the scheduler |
| `KRAKEN_AI_MODEL` | `claude-opus-5-5` | |
| `KRAKEN_AI_EFFORT` | `high` | decision effort; the recap uses `low` |
| `KRAKEN_AI_MAX_POSITIONS` | `3` | |
| `KRAKEN_AI_MAX_POSITION_PCT` | `25` | hard cap per position, % of equity |
| `KRAKEN_AI_MIN_TRADE_USD` | `10` | |
| `KRAKEN_AI_MAX_HOLD_HOURS` | `168` | time stop ceiling (1 week) |
| `KRAKEN_AI_MAX_DRAWDOWN` | `0.15` | halt new trades at this drawdown |
| `KRAKEN_AI_DECISION_HOURS_UTC` | `13,21` | decision runs at :05 |
| `KRAKEN_AI_REPORT_HOUR_UTC` | `12` | |
| `KRAKEN_AI_MONITOR_MIN` | `15` | |
| `KRAKEN_AI_MAX_EARLY_RUNS_PER_DAY` | `2` | trigger-driven model calls per UTC day; `0` disables |
| `KRAKEN_AI_EARLY_RUN_GAP_HOURS` | `3` | minimum time since the last decision |

Requires `DATABASE_URL` (tables `ai_fund`, `ai_trades`, `ai_snapshots`, `ai_decisions`, `ai_jobs` are created automatically), `KRAKEN_API_KEY`/`SECRET` with **Query Funds, Query Open & Closed Orders & Trades, Create & Modify Orders** (no withdrawal permission needed — leave it off), `ANTHROPIC_API_KEY`, and MailerSend for email.
