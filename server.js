/**
 * Koyeb Web Service: serves static /dist, POST /api/ask (OpenAI), POST /api/subscribe (email capture).
 * Node 18+ native http and fetch. OPENAI_API_KEY and DATABASE_URL from env (Koyeb) or .env (dev).
 */
import "dotenv/config";
import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { XMLParser } from "fast-xml-parser";
const { Pool } = pg;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.join(__dirname, "dist");
const PORT = Number(process.env.PORT) || 3000;

let dbPool = null;
async function initDatabase() {
	const dbUrl = (process.env.DATABASE_URL || "").trim();
	if (!dbUrl) {
		console.warn("[db] DATABASE_URL not set; email capture disabled");
		return null;
	}
	try {
		const pool = new Pool({ connectionString: dbUrl, ssl: dbUrl.includes("localhost") ? false : { rejectUnauthorized: false } });
		await pool.query(`
			CREATE TABLE IF NOT EXISTS email_subscriptions (
				id SERIAL PRIMARY KEY,
				email VARCHAR(255) NOT NULL UNIQUE,
				source VARCHAR(50) DEFAULT 'website',
				created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
			);
			CREATE INDEX IF NOT EXISTS idx_email_subscriptions_email ON email_subscriptions(email);
		`);
		console.log("[db] Database initialized");
		return pool;
	} catch (err) {
		console.error("[db] Failed to initialize:", err.message);
		return null;
	}
}

async function saveEmail(email, source = "website") {
	if (!dbPool) return { error: "Database not available." };
	const normalized = email.trim().toLowerCase();
	if (!normalized || !normalized.includes("@")) return { error: "Invalid email address." };
	try {
		await dbPool.query("INSERT INTO email_subscriptions (email, source) VALUES ($1, $2) ON CONFLICT (email) DO NOTHING", [normalized, source]);
		return { success: true };
	} catch (err) {
		console.error("[db] Save email error:", err.message);
		return { error: "Failed to save email." };
	}
}

async function handleApiSubscribe(req, body) {
	let parsed;
	try {
		parsed = JSON.parse(body);
	} catch {
		return { error: "Invalid JSON body." };
	}
	let email = "";
	let source = "website";
	if (parsed.email && typeof parsed.email === "string") {
		email = parsed.email;
	} else if (parsed.data && parsed.data.email && typeof parsed.data.email === "string") {
		email = parsed.data.email;
		source = "tally";
	} else if (parsed.fields && Array.isArray(parsed.fields)) {
		const emailField = parsed.fields.find((f) => f.type === "EMAIL" || f.key === "email" || f.label?.toLowerCase().includes("email"));
		if (emailField && emailField.value) email = emailField.value;
		source = "tally";
	}
	if (!email) {
		return { error: "Email address not found in request." };
	}
	return await saveEmail(email, source);
}

function corsHeaders(origin, allowAll = false) {
	if (allowAll) {
		return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" };
	}
	const o = origin && (origin.startsWith("http://localhost:") || origin.startsWith("https://localhost:") || origin.includes("tally.so"));
	return o ? { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type" } : {};
}

const MIME = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "application/javascript; charset=utf-8",
	".json": "application/json",
	".ico": "image/x-icon",
	".png": "image/png",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".gif": "image/gif",
	".svg": "image/svg+xml",
	".webp": "image/webp",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".ttf": "font/ttf",
	".txt": "text/plain; charset=utf-8",
};

function extractResponsesAnswer(data) {
	if (!data || typeof data !== "object") return "";
	if (typeof data.output === "string") return data.output.trim();
	if (typeof data.text === "string") return data.text.trim();
	const output = data.output;
	if (!Array.isArray(output) || output.length === 0) return "";
	const parts = [];
	for (const item of output) {
		if (item && item.content && Array.isArray(item.content)) {
			for (const block of item.content) {
				if (block && block.type === "output_text" && typeof block.text === "string") {
					parts.push(block.text);
				}
			}
		}
	}
	return parts.join("").trim();
}

function safePath(relative) {
	const normalized = path.normalize(relative).replace(/^(\.\.(\/|\\|$))+/, "");
	return path.join(DIST, normalized);
}

function isInsideDist(resolved) {
	const distReal = path.resolve(DIST);
	const resolvedReal = path.resolve(resolved);
	return resolvedReal === distReal || resolvedReal.startsWith(distReal + path.sep);
}

function jsonResponse(res, status, data, extraHeaders = {}) {
	res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...extraHeaders });
	res.end(JSON.stringify(data));
}

const NEWS_SOURCES = [
	{ name: "NYT", rssUrl: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml" },
	{ name: "WSJ", rssUrl: "https://feeds.content.dowjones.io/public/rss/RSSWorldNews" },
	{ name: "FT", rssUrl: "https://www.ft.com/?format=rss" },
	{ name: "Al Jazeera", rssUrl: "https://www.aljazeera.com/xml/rss/all.xml" },
];

function extractArticleText(html) {
	if (!html || typeof html !== "string") return "";
	const stripped = html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	return stripped.slice(0, 12000);
}

async function fetchFirstRssItem(rssUrl) {
	try {
		const res = await fetch(rssUrl, { headers: { "User-Agent": "NewsDigest/1.0" } });
		if (!res.ok) return null;
		const xml = await res.text();
		const parser = new XMLParser();
		const parsed = parser.parse(xml);
		const channel = parsed?.rss?.channel || parsed?.feed;
		if (!channel) return null;
		let item = channel.item;
		if (Array.isArray(item)) item = item[0];
		else if (!item) item = channel["rss:item"]?.[0] || channel.entry?.[0];
		if (!item) return null;
		const link = item.link || item.guid || (typeof item.link === "object" ? item.link["#text"] : null);
		const title = (item.title && typeof item.title === "string") ? item.title : (item.title?.["#text"]) || "";
		return { title: title.trim(), link: typeof link === "string" ? link.trim() : null };
	} catch (e) {
		console.error("[news] RSS fetch failed", rssUrl, e.message);
		return null;
	}
}

async function fetchArticleWithBypass(articleUrl) {
	try {
		const bypassUrl = `https://removepaywalls.com/${articleUrl}`;
		const res = await fetch(bypassUrl, {
			headers: { "User-Agent": "Mozilla/5.0 (compatible; NewsDigest/1.0)" },
			redirect: "follow",
		});
		if (!res.ok) return null;
		return await res.text();
	} catch (e) {
		console.error("[news] Bypass fetch failed", articleUrl, e.message);
		return null;
	}
}

async function summarizeArticle(apiKey, articleText, sourceName) {
	if (!articleText || articleText.length < 100) return null;
	const instructions = `You are a news summarizer. Given article text, respond with exactly:
1. Three bullet-point key takeaways (one line each).
2. One short notable quote from the article in quotes.
3. A line: "Comments: Not available for this source."
Keep the response concise. Use plain text, no markdown.`;
	try {
		const res = await fetch("https://api.openai.com/v1/responses", {
			method: "POST",
			headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
			body: JSON.stringify({
				model: "gpt-4.1-nano",
				instructions,
				input: `Source: ${sourceName}\n\nArticle text:\n${articleText.slice(0, 10000)}`,
			}),
		});
		const data = await res.json().catch(() => ({}));
		if (!res.ok) return null;
		return extractResponsesAnswer(data);
	} catch (e) {
		console.error("[news] Summarize failed", e.message);
		return null;
	}
}

async function handleApiNews() {
	const apiKey = (process.env.OPENAI_API_KEY || "").trim();
	if (!apiKey) {
		return { error: "Server configuration error. OPENAI_API_KEY not set." };
	}
	const results = [];
	for (const source of NEWS_SOURCES) {
		const item = await fetchFirstRssItem(source.rssUrl);
		if (!item?.link) {
			results.push({ source: source.name, title: item?.title || "—", error: "No headline" });
			continue;
		}
		const html = await fetchArticleWithBypass(item.link);
		const text = html ? extractArticleText(html) : "";
		const summary = text ? await summarizeArticle(apiKey, text, source.name) : null;
		results.push({
			source: source.name,
			title: item.title,
			link: item.link,
			summary: summary || "Could not fetch or summarize article.",
		});
	}
	return { articles: results };
}

async function handleApiAsk(req, body) {
	let parsed;
	try {
		parsed = JSON.parse(body);
	} catch {
		return { error: "Invalid JSON body." };
	}
	const instructions = typeof parsed.instructions === "string" ? parsed.instructions : "";
	const input = typeof parsed.input === "string" ? parsed.input.trim() : "";
	if (!input) {
		return { error: "Missing or empty input." };
	}

	const apiKey = (process.env.OPENAI_API_KEY || "").trim();
	if (!apiKey) {
		console.error("[api/ask] OPENAI_API_KEY is not set. Add it in Koyeb Service → Environment or Secrets.");
		return { error: "Server configuration error. Please try again later." };
	}

	try {
		const res = await fetch("https://api.openai.com/v1/responses", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify({
				model: "gpt-4.1-nano",
				instructions: instructions || undefined,
				input,
			}),
		});

		const data = await res.json().catch(() => ({}));

		if (!res.ok) {
			const msg =
				(data && data.error && typeof data.error.message === "string")
					? data.error.message
					: (data && typeof data.error === "string")
						? data.error
						: "Something went wrong. Please try again.";
			console.error("[api/ask] OpenAI error", res.status, data.error || data);
			return { error: msg };
		}

		const answer = extractResponsesAnswer(data);
		return { answer: answer || "No response." };
	} catch (err) {
		console.error("[api/ask] Request failed:", err.message || err);
		if (err.cause && (err.cause.code === "ENOTFOUND" || err.cause.code === "ECONNREFUSED")) {
			return { error: "Service temporarily unavailable. Please try again." };
		}
		return { error: "Something went wrong. Please try again." };
	}
}

async function serveStatic(res, pathname, method = "GET") {
	const file = pathname === "/" || pathname === "" ? "/index.html" : pathname;
	const resolved = safePath(file);
	if (!isInsideDist(resolved)) {
		return 403;
	}

	let stat;
	try {
		stat = await fs.stat(resolved);
	} catch (e) {
		if (e.code === "ENOENT") return 404;
		return 500;
	}

	if (!stat.isFile()) {
		const indexCandidate = path.join(resolved, "index.html");
		try {
			await fs.access(indexCandidate);
			const subPath = (pathname.endsWith("/") ? pathname : pathname + "/") + "index.html";
			return serveStatic(res, subPath, method);
		} catch {
			return 404;
		}
	}

	const ext = path.extname(resolved);
	const contentType = MIME[ext] || "application/octet-stream";
	const buf = await fs.readFile(resolved);
	res.writeHead(200, {
		"Content-Type": contentType,
		"Content-Length": Buffer.byteLength(buf),
	});
	if (method !== "HEAD") {
		res.end(buf);
	} else {
		res.end();
	}
	return 200;
}

function collectBody(req) {
	return new Promise((resolve, reject) => {
		const chunks = [];
		req.on("data", (chunk) => chunks.push(chunk));
		req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
		req.on("error", reject);
	});
}

const server = http.createServer(async (req, res) => {
	const method = req.method || "GET";
	const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
	const pathname = url.pathname;

	if (pathname === "/api/ask") {
		const origin = req.headers.origin;
		const cors = corsHeaders(origin);
		if (method === "OPTIONS") {
			res.writeHead(204, { ...cors, "Access-Control-Max-Age": "86400" });
			res.end();
			return;
		}
		if (method === "POST") {
			let body;
			try {
				body = await collectBody(req);
			} catch {
				jsonResponse(res, 500, { error: "Something went wrong. Please try again." }, cors);
				return;
			}
			const result = await handleApiAsk(req, body);
			if (result.error) {
				const status =
					result.error === "Invalid JSON body." || result.error === "Missing or empty input."
						? 400
						: 500;
				jsonResponse(res, status, { error: result.error }, cors);
			} else {
				jsonResponse(res, 200, { answer: result.answer }, cors);
			}
			return;
		}
	}

	if (pathname === "/api/news") {
		const origin = req.headers.origin;
		const cors = corsHeaders(origin, true);
		if (method === "OPTIONS") {
			res.writeHead(204, { ...cors, "Access-Control-Max-Age": "86400" });
			res.end();
			return;
		}
		if (method === "GET" || method === "POST") {
			try {
				const result = await handleApiNews();
				if (result.error) {
					jsonResponse(res, 500, { error: result.error }, cors);
				} else {
					jsonResponse(res, 200, result, cors);
				}
			} catch (err) {
				console.error("[api/news]", err);
				jsonResponse(res, 500, { error: "News digest failed. Try again later." }, cors);
			}
			return;
		}
	}

	if (pathname === "/api/subscribe") {
		const origin = req.headers.origin;
		const cors = corsHeaders(origin, true);
		if (method === "OPTIONS") {
			res.writeHead(204, { ...cors, "Access-Control-Max-Age": "86400" });
			res.end();
			return;
		}
		if (method === "POST") {
			let body;
			try {
				body = await collectBody(req);
			} catch {
				jsonResponse(res, 500, { error: "Something went wrong. Please try again." }, cors);
				return;
			}
			const result = await handleApiSubscribe(req, body);
			if (result.error) {
				const status = result.error === "Invalid JSON body." || result.error === "Email address not found in request." || result.error === "Invalid email address." ? 400 : 500;
				jsonResponse(res, status, { error: result.error }, cors);
			} else {
				jsonResponse(res, 200, { success: true, message: "Email saved successfully." }, cors);
			}
			return;
		}
	}

	if (method !== "GET" && method !== "HEAD") {
		res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("Method Not Allowed");
		return;
	}

	const status = await serveStatic(res, pathname, method);
	if (status !== 200) {
		const code = status === 404 ? 404 : status === 403 ? 403 : 500;
		const msg = code === 404 ? "Not Found" : code === 403 ? "Forbidden" : "Internal Server Error";
		res.writeHead(code, { "Content-Type": "text/plain; charset=utf-8" });
		res.end(msg);
	}
});

initDatabase().then((pool) => {
	dbPool = pool;
	server.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
});
