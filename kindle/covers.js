/**
 * Book cover lookup via Open Library (free, no key). Run at seed time, not per
 * visitor. Results are cached in data/kindle-covers.json so re-seeding is fast.
 * Returns an Open Library cover id (image: https://covers.openlibrary.org/b/id/<id>-M.jpg) or null.
 */
import fs from "node:fs/promises";

const UA = { "User-Agent": "reading-notes-seed/1.0 (+https://aj91.online/reading-notes)" };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function search(params) {
	const url = "https://openlibrary.org/search.json?" + new URLSearchParams({ ...params, limit: "8", fields: "cover_i,title" });
	for (let attempt = 0; attempt < 3; attempt++) {
		try {
			const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(15000) });
			if (res.status === 429 || res.status >= 500) {
				await sleep(2000 * (attempt + 1));
				continue;
			}
			const data = await res.json();
			return data.docs?.find((d) => d.cover_i)?.cover_i || null;
		} catch {
			await sleep(1000);
		}
	}
	return null;
}

export async function lookupCover(title, author) {
	const main = title.split(/[:(]/)[0].trim();
	const last = (author || "").split(/[\s,]+/).filter(Boolean).pop() || "";
	return (
		(author && (await search({ title: main, author }))) ||
		(last && (await search({ q: `${main} ${last}` }))) ||
		(main.split(/\s+/).length >= 2 && (await search({ title: main }))) ||
		null
	);
}

/** Adds `coverId` to every entry. Uses/updates the cache file. */
export async function attachCovers(entries, cachePath) {
	let cache = {};
	try {
		cache = JSON.parse(await fs.readFile(cachePath, "utf8"));
	} catch {}

	const books = [...new Map(entries.map((e) => [e.title, e.author])).entries()];
	const todo = books.filter(([t]) => !(t in cache));
	if (todo.length) console.log(`Looking up ${todo.length} covers on Open Library (cached: ${books.length - todo.length})...`);
	let n = 0;
	for (const [title, author] of todo) {
		cache[title] = await lookupCover(title, author);
		if (++n % 25 === 0) {
			console.log(`  ${n}/${todo.length}`);
			await fs.writeFile(cachePath, JSON.stringify(cache, null, 1));
		}
		await sleep(250); // be polite to Open Library
	}
	await fs.writeFile(cachePath, JSON.stringify(cache, null, 1));

	const found = books.filter(([t]) => cache[t]).length;
	console.log(`Covers: ${found}/${books.length} books`);
	for (const e of entries) e.coverId = cache[e.title] || null;
	return entries;
}
