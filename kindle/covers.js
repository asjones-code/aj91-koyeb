/**
 * Book cover lookup, run at seed time (never per visitor). Sources, in order:
 *   1. kindle/cover-overrides.json  (hand-picked image URLs, committed; no personal data)
 *   2. Open Library search          (free, no key)
 *   3. Apple iTunes Search API      (free, no key; Apple Books ebooks, then audiobooks)
 *   4. Open Library, loose          (closest edition by the same author, possibly a translation)
 * Results are cached in data/kindle-covers.json (title -> image URL | null), so
 * re-seeding is fast. Delete an entry from the cache to retry it.
 */
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const OVERRIDES = path.join(path.dirname(fileURLToPath(import.meta.url)), "cover-overrides.json");
const UA = { "User-Agent": "reading-notes-seed/1.0 (+https://aj91.online)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const STOP = new Set("a an and the of to in for on with from by at or how why what your my our its".split(" "));

async function getJson(url) {
	for (let attempt = 0; attempt < 3; attempt++) {
		try {
			const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(15000) });
			// Apple answers 403 when rate-limited (~20 req/min); Open Library uses 429.
			if (res.status === 403 || res.status === 429 || res.status >= 500) {
				await sleep(res.status === 403 ? 65000 : 2000 * (attempt + 1));
				continue;
			}
			return await res.json();
		} catch {
			await sleep(1000);
		}
	}
	return null;
}

/** A search-friendly version of a messy title. */
export function searchTitle(title) {
	let t = title
		.replace(/\[[^\]]*\]/g, " ") // "[1948, 1976]"
		.replace(/\([^)]*\)/g, " ") // "(A Book Apart #34)"
		.replace(/[®™*]/g, "")
		.replace(/,?\s*Volume \d+.*$/i, "");
	// "Author, Author - Title-Publisher" -> "Title"
	const dash = t.indexOf(" - ");
	if (dash > 0 && t.slice(0, dash).split(/\s+/).length <= 8) t = t.slice(dash + 3);
	t = t.split(/[:–—]|--/)[0].replace(/-[^-]*$/, (m) => (m.length > 12 ? "" : m));
	return t.replace(/\s{2,}/g, " ").trim();
}

const keyWords = (s) =>
	s
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[̀-ͯ]/g, "")
		.split(/[^a-z0-9]+/)
		.filter((w) => w.length > 1 && !STOP.has(w));

/** True if most of the query title's key words appear in the candidate title. */
function titleMatches(query, candidate) {
	const q = keyWords(query).slice(0, 5);
	if (!q.length) return false;
	const c = new Set(keyWords(candidate));
	return q.filter((w) => c.has(w)).length / q.length >= 0.7;
}

async function openLibrary(title, author) {
	const params = author ? { title, author } : { title };
	const data = await getJson("https://openlibrary.org/search.json?" + new URLSearchParams({ ...params, limit: "8", fields: "cover_i,title" }));
	const doc = data?.docs?.find((d) => d.cover_i && titleMatches(title, d.title || ""));
	return doc ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null;
}

/** Last resort: the top Open Library result for "title + author's last name", even if it's a
 *  translated edition (e.g. "Critique de la raison nègre"). Only used when the query includes
 *  the author, which keeps it from grabbing an unrelated book with a similar title. */
async function openLibraryLoose(title, author) {
	const last = (author || "").split(/[\s,]+/).filter(Boolean).pop();
	if (!last || last.length < 3) return null;
	const data = await getJson("https://openlibrary.org/search.json?" + new URLSearchParams({ q: `${title} ${last}`, limit: "5", fields: "cover_i,author_name" }));
	const doc = data?.docs?.find((d) => d.cover_i && (d.author_name || []).some((n) => n.toLowerCase().includes(last.toLowerCase())));
	return doc ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg` : null;
}

async function itunes(title, author) {
	const last = (author || "").split(/[\s,]+/).filter(Boolean).pop() || "";
	for (const media of ["ebook", "audiobook"]) {
		for (const term of [`${title} ${last}`.trim(), title]) {
			const data = await getJson("https://itunes.apple.com/search?" + new URLSearchParams({ term, media, limit: "10" }));
			await sleep(3500); // stay under Apple's ~20 requests/minute
			const hit = data?.results?.find((r) => r.artworkUrl100 && titleMatches(title, r.trackName || r.collectionName || ""));
			if (hit) return hit.artworkUrl100.replace(/\/\d+x\d+bb\./, "/600x900bb.");
		}
	}
	return null;
}

export async function lookupCover(rawTitle, author) {
	const title = searchTitle(rawTitle);
	if (keyWords(title).length === 0) return null;
	return (
		(await openLibrary(title, author)) ||
		(author && (await openLibrary(title, ""))) ||
		(await itunes(title, author)) ||
		(await openLibraryLoose(title, author)) ||
		null
	);
}

/** Adds `cover` (image URL or null) to every entry. Uses/updates the cache file. */
export async function attachCovers(entries, cachePath, { retryMissing = false } = {}) {
	let cache = {};
	let overrides = {};
	try {
		cache = JSON.parse(await fs.readFile(cachePath, "utf8"));
	} catch {}
	try {
		overrides = JSON.parse(await fs.readFile(OVERRIDES, "utf8"));
	} catch {}
	// Migrate old cache values (Open Library cover ids) to URLs.
	for (const [k, v] of Object.entries(cache)) if (typeof v === "number") cache[k] = `https://covers.openlibrary.org/b/id/${v}-L.jpg`;

	const books = [...new Map(entries.map((e) => [e.title, e.author])).entries()];
	const todo = books.filter(([t]) => !overrides[t] && (!(t in cache) || (retryMissing && !cache[t])));
	if (todo.length) console.log(`Looking up ${todo.length} covers (Open Library, then Apple Books)...`);
	let n = 0;
	for (const [title, author] of todo) {
		cache[title] = await lookupCover(title, author);
		if (++n % 25 === 0) {
			console.log(`  ${n}/${todo.length}`);
			await fs.writeFile(cachePath, JSON.stringify(cache, null, 1));
		}
		await sleep(250);
	}
	await fs.writeFile(cachePath, JSON.stringify(cache, null, 1));

	const coverFor = (t) => overrides[t] || cache[t] || null;
	const missing = books.filter(([t]) => !coverFor(t)).map(([t]) => t);
	console.log(`Covers: ${books.length - missing.length}/${books.length} books`);
	if (missing.length) {
		console.log(`No cover found for ${missing.length} (add image URLs to kindle/cover-overrides.json):`);
		for (const t of missing) console.log(`  - ${t}`);
	}
	for (const e of entries) e.cover = coverFor(e.title);
	return entries;
}
