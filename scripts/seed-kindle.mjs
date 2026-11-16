#!/usr/bin/env node
/**
 * Load Kindle highlights for /reading-notes.
 *
 *   node scripts/seed-kindle.mjs "<path to My Clippings.txt>"        # -> data/kindle-highlights.json (local dev, gitignored)
 *   node scripts/seed-kindle.mjs "<path to My Clippings.txt>" --db   # -> kindle_highlights table in DATABASE_URL (production)
 *   add --no-covers to skip the Open Library cover lookup (cached in data/kindle-covers.json)
 *
 * The repo is public, so highlights live in Postgres or a gitignored file, never in git.
 * Re-running replaces the previous load.
 */
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { parseClippings } from "../kindle/clippings.js";
import { attachCovers } from "../kindle/covers.js";

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const src = args.find((a) => !a.startsWith("--"));
const toDb = args.includes("--db");
const withCovers = !args.includes("--no-covers");

if (!src) {
	console.error('Usage: node scripts/seed-kindle.mjs "<My Clippings.txt>" [--db]');
	process.exit(1);
}

const entries = parseClippings(await fs.readFile(src, "utf8"));
const books = new Set(entries.map((e) => e.title)).size;
const notes = entries.filter((e) => e.kind === "note").length;
console.log(`Parsed ${entries.length - notes} highlights + ${notes} notes from ${books} books`);
if (withCovers) {
	await fs.mkdir(path.join(ROOT, "data"), { recursive: true });
	await attachCovers(entries, path.join(ROOT, "data", "kindle-covers.json"));
}

if (!toDb) {
	const out = path.join(ROOT, "data", "kindle-highlights.json");
	await fs.mkdir(path.dirname(out), { recursive: true });
	const slim = entries.map(({ locStart, ...e }) => e);
	await fs.writeFile(out, JSON.stringify(slim));
	console.log(`Wrote ${out}`);
	process.exit(0);
}

const dbUrl = (process.env.DATABASE_URL || "").trim();
if (!dbUrl) {
	console.error("DATABASE_URL is not set (put it in .env or the environment).");
	process.exit(1);
}
const pool = new pg.Pool({ connectionString: dbUrl, ssl: dbUrl.includes("localhost") ? false : { rejectUnauthorized: false } });
const client = await pool.connect();
try {
	await client.query(`
		CREATE TABLE IF NOT EXISTS kindle_highlights (
			id         SERIAL PRIMARY KEY,
			title      TEXT NOT NULL,
			author     TEXT,
			kind       TEXT NOT NULL DEFAULT 'highlight',
			content    TEXT NOT NULL,
			location   TEXT,
			added_at   TIMESTAMPTZ
		);
		ALTER TABLE kindle_highlights ADD COLUMN IF NOT EXISTS cover_id INTEGER`);
	await client.query("BEGIN");
	await client.query("DELETE FROM kindle_highlights");
	for (let i = 0; i < entries.length; i += 500) {
		const batch = entries.slice(i, i + 500);
		await client.query(
			`INSERT INTO kindle_highlights (title, author, kind, content, location, added_at, cover_id)
			 SELECT * FROM unnest($1::text[], $2::text[], $3::text[], $4::text[], $5::text[], $6::timestamptz[], $7::int[])`,
			[
				batch.map((e) => e.title),
				batch.map((e) => e.author),
				batch.map((e) => e.kind),
				batch.map((e) => e.content),
				batch.map((e) => e.location),
				batch.map((e) => e.addedAt),
				batch.map((e) => e.coverId ?? null),
			],
		);
	}
	await client.query("COMMIT");
	console.log(`Loaded ${entries.length} rows into kindle_highlights. Restart/redeploy the server to pick them up.`);
} catch (err) {
	await client.query("ROLLBACK").catch(() => {});
	console.error("Seed failed:", err.message);
	process.exitCode = 1;
} finally {
	client.release();
	await pool.end();
}
