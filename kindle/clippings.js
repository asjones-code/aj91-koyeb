/**
 * Parse a Kindle "My Clippings.txt" export into clean highlight/note records.
 *
 * Entry format:
 *   Title (Author)
 *   - Your Highlight on Location 51-52 | Added on Sunday, January 1, 2017 5:34:27 PM
 *
 *   text...
 *   ==========
 */

const TITLE_RE = /^(.*?)\s*\(([^()]*)\)\s*$/;

function cleanAuthor(raw) {
	const a = (raw || "").trim();
	// "Last, First" -> "First Last" (only when there's exactly one comma and no semicolon)
	if (a.split(",").length === 2 && !a.includes(";")) {
		const [last, first] = a.split(",").map((s) => s.trim());
		if (first && last) return `${first} ${last}`;
	}
	return a.replace(/\s*;\s*/g, ", ");
}

// Sideloaded files often have junk metadata. Entries with these titles look like
// personal documents or web clippings, so they're left out of the public demo.
const JUNK_TITLES = new Set(["test", "book", "[no data]", "(type a title for your page here)", "untitled"]);
const PUBLISHER_RE = /\b(press|publishing|publishers|books|wiley|verso|penguin|random house|university|group|inc|ltd|media|semiotext|harper|knopf|routledge|springer|palgrave|doubleday|hachette)\b/i;

function stripLeadingSeries(t) {
	// "(Series (nested) name) Rest" or "[Series] Rest" -> "Rest"
	const open = t[0];
	const close = open === "(" ? ")" : open === "[" ? "]" : null;
	if (!close) return t;
	let depth = 0;
	for (let i = 0; i < t.length; i++) {
		if (t[i] === open) depth++;
		else if (t[i] === close && --depth === 0) return t.slice(i + 1).trim() || t;
	}
	return t;
}

const looseTokens = (s) => new Set(s.toLowerCase().split(/[^a-zà-ÿ]+/).filter((w) => w.length > 2));
const overlaps = (a, b) => {
	const A = looseTokens(a);
	return [...looseTokens(b)].some((w) => A.has(w));
};

function badAuthor(a) {
	return !a || /^\d{4}$/.test(a) || /unknown|^verso \d{4}$/i.test(a);
}

/** Best-effort cleanup of sideloaded-file titles. Returns { title, author } or null to drop. */
export function tidyBook(rawTitle, rawAuthor) {
	let title = rawTitle.trim();
	let author = badAuthor(rawAuthor) ? "" : rawAuthor.trim();
	if (JUNK_TITLES.has(title.toLowerCase())) return null;

	// Anna's Archive: "Title -- Author -- Year -- Publisher -- ISBN -- hash -- Anna's Archive"
	if (title.includes(" -- ")) {
		const parts = title.split(" -- ");
		title = parts[0];
		if (!author && parts[1]) author = cleanAuthor(parts[1].replace(/,\s*author\b/gi, "").split(";")[0]);
	}

	title = stripLeadingSeries(title);

	// libgen style: "Author(s) - Title-Publisher (Year)"
	const dash = title.indexOf(" - ");
	if (dash > 0) {
		const left = title.slice(0, dash);
		const right = title.slice(dash + 3);
		const leftIsAuthor = (author && overlaps(left, author)) || (!author && left.split(/\s+/).length <= 6 && /^[A-Z]/.test(left));
		const rightIsAuthor = author && overlaps(right, author) && right.split(/\s+/).length <= 4;
		if (rightIsAuthor) {
			title = left; // "Title - Author"
		} else if (leftIsAuthor) {
			if (!author) author = cleanAuthor(left.replace(/_/g, ";").split(";")[0]);
			title = right;
		}
	}

	// Trailing "-Publisher (Year)" / "-Publisher"
	title = title.replace(/-([^-]*)$/, (m, tail) => (PUBLISHER_RE.test(tail) || /\(\d{4}\)\s*$/.test(tail) ? "" : m));
	title = title.replace(/\s*\(\d{4}\)\s*$/, "");
	title = title.replace(/\s+-\s+(libgen\.\w+|unknown|z-lib\.\w+)\s*$/i, "");
	title = title.replace(/\s*\((?:[^()]*\b(?:edition|classics|series|book \d+|paperback|essay books|supplement|edt|editor)\b[^()]*)\)\s*/gi, " ");
	title = title.replace(/\s+paperback\s*$/i, "");

	// slug-style names: "A-Grammar-of-the-Multitude-" / "african_political_systems"
	if (!/\s/.test(title)) title = title.replace(/[-_]+/g, " ").trim();
	title = title.replace(/\s*_\s+/g, ": ").replace(/_/g, " ").replace(/\s{2,}/g, " ").replace(/^[\s:-]+|[\s:-]+$/g, "");
	if (title) title = title[0].toUpperCase() + title.slice(1);

	return title ? { title, author } : null;
}

const norm = (s) => s.toLowerCase().replace(/[“”"‘’'`]/g, "").replace(/\s+/g, " ").trim();

export function parseClippings(text) {
	const out = [];
	for (const block of text.replace(/﻿/g, "").split(/^==========\s*$/m)) {
		const lines = block.split(/\r?\n/).map((l) => l.trim());
		while (lines.length && !lines[0]) lines.shift();
		if (lines.length < 3) continue;

		const [titleLine, meta, ...rest] = lines;
		const kindMatch = meta.match(/Your (Highlight|Note|Bookmark)/i);
		if (!kindMatch) continue;
		const kind = kindMatch[1].toLowerCase();
		if (kind === "bookmark") continue;

		const content = rest.join("\n").trim();
		if (!content) continue;

		const t = titleLine.match(TITLE_RE);
		const book = tidyBook((t ? t[1] : titleLine).trim(), t ? cleanAuthor(t[2]) : "");
		if (!book) continue;
		const { title, author } = book;
		const loc = meta.match(/Location (\d+)(?:-(\d+))?/i);
		const page = meta.match(/page (\d+)/i);
		const added = meta.match(/Added on (.+)$/i);
		const addedAt = added ? new Date(added[1].replace(/^[A-Za-z]+,\s*/, "")) : null;

		out.push({
			title,
			author,
			kind,
			content,
			location: loc ? loc[0].replace(/^Location /i, "") : page ? `p. ${page[1]}` : "",
			locStart: loc ? Number(loc[1]) : page ? Number(page[1]) : 0,
			addedAt: addedAt && !Number.isNaN(addedAt.getTime()) ? addedAt.toISOString() : null,
		});
	}
	return dedupe(out);
}

/**
 * Kindle re-saves a highlight every time you extend or re-select it.
 * Per book, keep the longest version and drop any highlight whose text is
 * contained in one already kept. Notes are always kept.
 */
function dedupe(entries) {
	const byBook = new Map();
	for (const e of entries) {
		if (!byBook.has(e.title)) byBook.set(e.title, []);
		byBook.get(e.title).push(e);
	}
	const kept = [];
	for (const list of byBook.values()) {
		const highlights = list.filter((e) => e.kind === "highlight").sort((a, b) => b.content.length - a.content.length);
		const keptNorm = [];
		for (const h of highlights) {
			const n = norm(h.content);
			if (keptNorm.some((k) => k.includes(n))) continue;
			keptNorm.push(n);
			kept.push(h);
		}
		kept.push(...list.filter((e) => e.kind === "note"));
	}
	return kept.sort((a, b) => (a.title === b.title ? a.locStart - b.locStart : a.title.localeCompare(b.title)));
}
