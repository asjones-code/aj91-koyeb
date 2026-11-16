/**
 * Postgres persistence for the AI trader: the fund, its trades (positions),
 * daily snapshots, decision log, and scheduler job claims.
 * A database is required — fund accounting must survive restarts.
 */

let ready = null;

const SCHEMA = `
CREATE TABLE IF NOT EXISTS ai_fund (
	id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
	status TEXT NOT NULL DEFAULT 'unseeded',          -- unseeded | seeding | active
	seed_usd DOUBLE PRECISION,
	cash_usd DOUBLE PRECISION NOT NULL DEFAULT 0,
	peak_equity DOUBLE PRECISION,
	halted BOOLEAN NOT NULL DEFAULT false,
	halted_reason TEXT,
	seeded_at TIMESTAMPTZ,
	seed_btc_price DOUBLE PRECISION,
	seed_basket JSONB,                                 -- [{asset, qty, price}] sold at seed (hold benchmark)
	fees_paid DOUBLE PRECISION NOT NULL DEFAULT 0,
	updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
INSERT INTO ai_fund (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

CREATE TABLE IF NOT EXISTS ai_trades (
	id SERIAL PRIMARY KEY,
	asset TEXT NOT NULL,
	pair TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'open',               -- open | closed
	opened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	qty DOUBLE PRECISION NOT NULL,
	entry_price DOUBLE PRECISION NOT NULL,
	cost_usd DOUBLE PRECISION NOT NULL,                -- quote spent, excl. fee
	entry_fee DOUBLE PRECISION NOT NULL DEFAULT 0,
	take_profit DOUBLE PRECISION NOT NULL,
	stop_loss DOUBLE PRECISION NOT NULL,
	max_hold_until TIMESTAMPTZ NOT NULL,
	conviction TEXT,
	horizon TEXT,
	thesis TEXT,
	invalidation TEXT,
	decision_id INT,
	realized_usd DOUBLE PRECISION NOT NULL DEFAULT 0,  -- proceeds from partial exits
	closed_at TIMESTAMPTZ,
	exit_price DOUBLE PRECISION,
	exit_value_usd DOUBLE PRECISION,
	exit_fee DOUBLE PRECISION,
	exit_reason TEXT,                                  -- take_profit | stop_loss | time | ai | manual
	exit_note TEXT,
	pnl_usd DOUBLE PRECISION,
	pnl_pct DOUBLE PRECISION,
	entry_txid TEXT,
	exit_txid TEXT
);
CREATE INDEX IF NOT EXISTS ai_trades_status_idx ON ai_trades (status);

CREATE TABLE IF NOT EXISTS ai_snapshots (
	day DATE PRIMARY KEY,
	equity_usd DOUBLE PRECISION NOT NULL,
	cash_usd DOUBLE PRECISION NOT NULL,
	positions_usd DOUBLE PRECISION NOT NULL,
	btc_price DOUBLE PRECISION,
	basket_value_usd DOUBLE PRECISION,
	recap TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_decisions (
	id SERIAL PRIMARY KEY,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	mode TEXT NOT NULL,
	model TEXT,
	market_note TEXT,
	journal TEXT,
	actions JSONB,
	results JSONB,
	error TEXT
);

CREATE TABLE IF NOT EXISTS ai_jobs (
	job TEXT NOT NULL,
	slot TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
	PRIMARY KEY (job, slot)
);
`;

export function createStore(getPool) {
	const pool = () => {
		const p = getPool();
		if (!p) throw new Error("DATABASE_URL is required for the AI trader");
		return p;
	};
	const q = async (sql, params) => {
		if (!ready) ready = pool().query(SCHEMA).catch((e) => { ready = null; throw e; });
		await ready;
		return pool().query(sql, params);
	};
	const num = (v) => (v == null ? null : Number(v));
	const fundRow = (r) => r && ({
		...r,
		seed_usd: num(r.seed_usd), cash_usd: num(r.cash_usd), peak_equity: num(r.peak_equity),
		seed_btc_price: num(r.seed_btc_price), fees_paid: num(r.fees_paid),
	});
	const tradeRow = (r) => r && Object.fromEntries(Object.entries(r).map(([k, v]) =>
		[k, typeof v === "string" && /^(qty|entry_price|cost_usd|entry_fee|take_profit|stop_loss|realized_usd|exit_price|exit_value_usd|exit_fee|pnl_usd|pnl_pct)$/.test(k) ? Number(v) : v]));

	return {
		hasDb: () => Boolean(getPool()),
		query: q,

		async getFund() {
			const r = await q("SELECT * FROM ai_fund WHERE id = 1");
			return fundRow(r.rows[0]);
		},
		async updateFund(fields) {
			const keys = Object.keys(fields);
			if (!keys.length) return this.getFund();
			const sets = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");
			const vals = keys.map((k) => (k === "seed_basket" && fields[k] != null ? JSON.stringify(fields[k]) : fields[k]));
			const r = await q(`UPDATE ai_fund SET ${sets}, updated_at = now() WHERE id = 1 RETURNING *`, vals);
			return fundRow(r.rows[0]);
		},
		/** Atomically move status from `from` to `to`; returns false if it wasn't `from`. */
		async transitionFund(from, to) {
			const r = await q("UPDATE ai_fund SET status = $2, updated_at = now() WHERE id = 1 AND status = $1 RETURNING id", [from, to]);
			return r.rowCount === 1;
		},
		async adjustCash(delta, feeDelta = 0) {
			const r = await q("UPDATE ai_fund SET cash_usd = cash_usd + $1, fees_paid = fees_paid + $2, updated_at = now() WHERE id = 1 RETURNING *", [delta, feeDelta]);
			return fundRow(r.rows[0]);
		},

		async openTrades() {
			const r = await q("SELECT * FROM ai_trades WHERE status = 'open' ORDER BY opened_at");
			return r.rows.map(tradeRow);
		},
		async getTrade(id) {
			const r = await q("SELECT * FROM ai_trades WHERE id = $1", [id]);
			return tradeRow(r.rows[0]);
		},
		async closedTrades(limit = 50) {
			const r = await q("SELECT * FROM ai_trades WHERE status = 'closed' ORDER BY closed_at DESC LIMIT $1", [limit]);
			return r.rows.map(tradeRow);
		},
		async allClosedStats() {
			const r = await q(`SELECT count(*)::int AS n,
				count(*) FILTER (WHERE pnl_usd > 0)::int AS wins,
				coalesce(sum(pnl_usd), 0) AS realized,
				coalesce(avg(pnl_pct) FILTER (WHERE pnl_usd > 0), 0) AS avg_win_pct,
				coalesce(avg(pnl_pct) FILTER (WHERE pnl_usd <= 0), 0) AS avg_loss_pct
				FROM ai_trades WHERE status = 'closed'`);
			const s = r.rows[0];
			return { n: s.n, wins: s.wins, realized: Number(s.realized), avgWinPct: Number(s.avg_win_pct), avgLossPct: Number(s.avg_loss_pct) };
		},
		async closedSince(ts) {
			const r = await q("SELECT * FROM ai_trades WHERE status = 'closed' AND closed_at >= $1 ORDER BY closed_at", [ts]);
			return r.rows.map(tradeRow);
		},
		async openedSince(ts) {
			const r = await q("SELECT * FROM ai_trades WHERE opened_at >= $1 ORDER BY opened_at", [ts]);
			return r.rows.map(tradeRow);
		},
		async insertTrade(t) {
			const cols = Object.keys(t);
			const r = await q(`INSERT INTO ai_trades (${cols.join(",")}) VALUES (${cols.map((_, i) => `$${i + 1}`).join(",")}) RETURNING *`, cols.map((c) => t[c]));
			return tradeRow(r.rows[0]);
		},
		async updateTrade(id, fields) {
			const keys = Object.keys(fields);
			const r = await q(`UPDATE ai_trades SET ${keys.map((k, i) => `${k} = $${i + 2}`).join(", ")} WHERE id = $1 RETURNING *`, [id, ...keys.map((k) => fields[k])]);
			return tradeRow(r.rows[0]);
		},

		async insertDecision(d) {
			const r = await q(`INSERT INTO ai_decisions (mode, model, market_note, journal, actions, results, error)
				VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING id, created_at`,
				[d.mode, d.model, d.market_note || null, d.journal || null, JSON.stringify(d.actions || null), JSON.stringify(d.results || null), d.error || null]);
			return r.rows[0];
		},
		async updateDecisionResults(id, results) {
			await q("UPDATE ai_decisions SET results = $2 WHERE id = $1", [id, JSON.stringify(results)]);
		},
		async recentDecisions(limit = 10) {
			const r = await q("SELECT * FROM ai_decisions ORDER BY created_at DESC LIMIT $1", [limit]);
			return r.rows;
		},
		async decisionsSince(ts) {
			const r = await q("SELECT * FROM ai_decisions WHERE created_at >= $1 ORDER BY created_at", [ts]);
			return r.rows;
		},

		async upsertSnapshot(s) {
			await q(`INSERT INTO ai_snapshots (day, equity_usd, cash_usd, positions_usd, btc_price, basket_value_usd, recap)
				VALUES ($1,$2,$3,$4,$5,$6,$7)
				ON CONFLICT (day) DO UPDATE SET equity_usd=$2, cash_usd=$3, positions_usd=$4, btc_price=$5, basket_value_usd=$6, recap=coalesce($7, ai_snapshots.recap), created_at=now()`,
				[s.day, s.equity_usd, s.cash_usd, s.positions_usd, s.btc_price, s.basket_value_usd, s.recap || null]);
		},
		async snapshots(limit = 400) {
			const r = await q("SELECT * FROM ai_snapshots ORDER BY day DESC LIMIT $1", [limit]);
			return r.rows.reverse().map((s) => ({
				...s, day: s.day instanceof Date ? s.day.toISOString().slice(0, 10) : String(s.day).slice(0, 10),
				equity_usd: num(s.equity_usd), cash_usd: num(s.cash_usd), positions_usd: num(s.positions_usd),
				btc_price: num(s.btc_price), basket_value_usd: num(s.basket_value_usd),
			}));
		},

		/** Claim a scheduler slot exactly once (survives restarts / multiple instances). */
		async claimJob(job, slot) {
			const r = await q("INSERT INTO ai_jobs (job, slot) VALUES ($1,$2) ON CONFLICT DO NOTHING RETURNING job", [job, slot]);
			return r.rowCount === 1;
		},
	};
}
