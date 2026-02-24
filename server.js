/**
 * Koyeb Web Service: serves static /dist, POST /api/ask (OpenAI), POST /api/subscribe (email capture).
 * Node 18+ native http and fetch. OPENAI_API_KEY and DATABASE_URL from env (Koyeb) or .env (dev).
 */
import "dotenv/config";
import http from "node:http";
import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";
import { WebSocketServer } from "ws";
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
			CREATE TABLE IF NOT EXISTS messages (
				id BIGSERIAL PRIMARY KEY,
				event_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
				ip INET NOT NULL,
				anonymized_email TEXT NOT NULL,
				message TEXT NOT NULL
			);
			CREATE TABLE IF NOT EXISTS live_visitors (
				session_id UUID PRIMARY KEY,
				latitude DOUBLE PRECISION NOT NULL,
				longitude DOUBLE PRECISION NOT NULL,
				accuracy_meters INTEGER,
				country TEXT,
				region TEXT,
				user_agent TEXT,
				connected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				is_active BOOLEAN NOT NULL DEFAULT TRUE
			);
			CREATE TABLE IF NOT EXISTS pm_projects (
				id TEXT PRIMARY KEY,
				name TEXT NOT NULL,
				description TEXT,
				cover TEXT,
				icon TEXT,
				is_archived BOOLEAN NOT NULL DEFAULT FALSE,
				created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
			);
			CREATE TABLE IF NOT EXISTS pm_task_statuses (
				id TEXT PRIMARY KEY,
				project_id TEXT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
				name TEXT NOT NULL,
				color TEXT,
				"order" INTEGER NOT NULL DEFAULT 0,
				type TEXT
			);
			CREATE TABLE IF NOT EXISTS pm_project_views (
				id TEXT PRIMARY KEY,
				project_id TEXT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
				type TEXT NOT NULL,
				name TEXT,
				data JSONB,
				"order" INTEGER NOT NULL DEFAULT 0
			);
			CREATE TABLE IF NOT EXISTS pm_tasks (
				id TEXT PRIMARY KEY,
				project_id TEXT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
				task_status_id TEXT REFERENCES pm_task_statuses(id) ON DELETE SET NULL,
				title TEXT NOT NULL,
				description TEXT,
				due_date DATE,
				"order" INTEGER NOT NULL DEFAULT 0,
				priority TEXT,
				assignee TEXT,
				type TEXT,
				created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
				updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
			);
			ALTER TABLE pm_tasks ADD COLUMN IF NOT EXISTS assignee TEXT;
			ALTER TABLE pm_tasks ADD COLUMN IF NOT EXISTS type TEXT;
			CREATE TABLE IF NOT EXISTS pm_tags (
				id TEXT PRIMARY KEY,
				project_id TEXT NOT NULL REFERENCES pm_projects(id) ON DELETE CASCADE,
				name TEXT NOT NULL,
				color TEXT
			);
			CREATE INDEX IF NOT EXISTS idx_pm_task_statuses_project ON pm_task_statuses(project_id);
			CREATE INDEX IF NOT EXISTS idx_pm_project_views_project ON pm_project_views(project_id);
			CREATE INDEX IF NOT EXISTS idx_pm_tasks_project ON pm_tasks(project_id);
			CREATE INDEX IF NOT EXISTS idx_pm_tags_project ON pm_tags(project_id);
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

async function saveMessage(ip, anonymizedEmail, message) {
	if (!dbPool) return;
	try {
		await dbPool.query(
			"INSERT INTO messages (ip, anonymized_email, message) VALUES ($1::inet, $2, $3)",
			[ip, anonymizedEmail, message]
		);
	} catch (err) {
		console.error("[db] Save message error:", err.message);
	}
}

async function upsertLiveVisitor(sessionId, lat, lng, accuracy, userAgent, country = null, region = null) {
	if (!dbPool) return;
	try {
		await dbPool.query(
			`INSERT INTO live_visitors (session_id, latitude, longitude, accuracy_meters, user_agent, country, region, connected_at, last_seen_at, is_active)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), TRUE)
			 ON CONFLICT (session_id) DO UPDATE SET
			   latitude = EXCLUDED.latitude,
			   longitude = EXCLUDED.longitude,
			   accuracy_meters = EXCLUDED.accuracy_meters,
			   user_agent = EXCLUDED.user_agent,
			   last_seen_at = NOW(),
			   is_active = TRUE`,
			[sessionId, lat, lng, accuracy ?? null, userAgent || null, country, region]
		);
	} catch (err) {
		console.error("[db] Upsert live_visitor error:", err.message);
	}
}

async function setLiveVisitorInactive(sessionId) {
	if (!dbPool) return;
	try {
		await dbPool.query("UPDATE live_visitors SET is_active = FALSE WHERE session_id = $1", [sessionId]);
	} catch (err) {
		console.error("[db] Set live_visitor inactive error:", err.message);
	}
}

async function touchLiveVisitorsLastSeen(sessionIds) {
	if (!dbPool || sessionIds.length === 0) return;
	try {
		await dbPool.query(
			"UPDATE live_visitors SET last_seen_at = NOW() WHERE session_id = ANY($1::uuid[])",
			[sessionIds]
		);
	} catch (err) {
		console.error("[db] Touch live_visitors error:", err.message);
	}
}

async function pruneStaleLiveVisitors() {
	if (!dbPool) return;
	try {
		const r = await dbPool.query(
			"DELETE FROM live_visitors WHERE last_seen_at < NOW() - INTERVAL '60 seconds'"
		);
		if (r.rowCount > 0) console.log("[live] Pruned", r.rowCount, "stale visitors");
	} catch (err) {
		console.error("[db] Prune live_visitors error:", err.message);
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
	const lower = html.toLowerCase();
	if (lower.includes("removepaywalls") || lower.includes("searching archives") || lower.includes("install our extensions") || html.length < 1000) return "";
	const stripped = html
		.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
		.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
		.replace(/<nav\b[^<]*(?:(?!<\/nav>)<[^<]*)*<\/nav>/gi, "")
		.replace(/<header\b[^<]*(?:(?!<\/header>)<[^<]*)*<\/header>/gi, "")
		.replace(/<footer\b[^<]*(?:(?!<\/footer>)<[^<]*)*<\/footer>/gi, "")
		.replace(/<aside\b[^<]*(?:(?!<\/aside>)<[^<]*)*<\/aside>/gi, "")
		.replace(/<[^>]+>/g, " ")
		.replace(/\s+/g, " ")
		.trim();
	const cleaned = stripped
		.replace(/archive\.(is|today|ph)/gi, "")
		.replace(/wayback machine/gi, "")
		.replace(/removepaywalls\.com/gi, "")
		.trim();
	return cleaned.length > 500 ? cleaned.slice(0, 12000) : "";
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
	const bypassServices = [
		`https://archive.is/newest/${articleUrl}`,
		`https://archive.today/newest/${articleUrl}`,
		`https://archive.ph/newest/${articleUrl}`,
	];
	for (const bypassUrl of bypassServices) {
		try {
			const res = await fetch(bypassUrl, {
				headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
				redirect: "follow",
			});
			if (res.ok) {
				const html = await res.text();
				if (html && html.length > 5000 && !html.toLowerCase().includes("removepaywalls") && !html.toLowerCase().includes("searching archives") && !html.toLowerCase().includes("install our extensions")) {
					return html;
				}
			}
		} catch (e) {
			continue;
		}
	}
	try {
		const waybackUrl = `https://web.archive.org/web/${new Date().toISOString().split("T")[0]}000000/${articleUrl}`;
		const res = await fetch(waybackUrl, {
			headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
			redirect: "follow",
		});
		if (res.ok) {
			const html = await res.text();
			if (html && html.length > 5000 && !html.toLowerCase().includes("removepaywalls") && !html.toLowerCase().includes("searching archives")) {
				return html;
			}
		}
	} catch (e) {
	}
	try {
		const removePaywallsUrl = `https://removepaywalls.com/${articleUrl}`;
		const res = await fetch(removePaywallsUrl, {
			headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
			redirect: "follow",
		});
		if (res.ok) {
			const html = await res.text();
			const archiveLinkMatch = html.match(/href=["'](https?:\/\/(?:archive\.(?:is|today|ph)|web\.archive\.org)[^"']+)["']/i);
			if (archiveLinkMatch) {
				const archiveLink = archiveLinkMatch[1];
				const archiveRes = await fetch(archiveLink, {
					headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
					redirect: "follow",
				});
				if (archiveRes.ok) {
					const archiveHtml = await archiveRes.text();
					if (archiveHtml && archiveHtml.length > 5000 && !archiveHtml.toLowerCase().includes("removepaywalls") && !archiveHtml.toLowerCase().includes("searching archives")) {
						return archiveHtml;
					}
				}
			}
		}
	} catch (e) {
	}
	return null;
}

async function summarizeArticle(apiKey, articleText, sourceName) {
	if (!articleText || articleText.length < 100) return null;
	const isFT = /^FT$/i.test(String(sourceName).trim());
	const instructions = isFT
		? `You are a news summarizer. Given article text, respond with exactly:
1. Three bullet-point key takeaways (one line each).
2. Do not include a quote. Use a single dash: —.
Keep the response concise. Use plain text, no markdown.`
		: `You are a news summarizer. Given article text, respond with exactly:
1. Three bullet-point key takeaways (one line each).
2. One short notable quote from the article body in quotes.
Never use promotional or sign-up text as the quote. Keep the response concise. Use plain text, no markdown.`;
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

// ——— PM: password-protected project management (local or sync to DB) ———
const PM_PASSWORD = (process.env.PM_PASSWORD || "").trim() || "test";
const PM_SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const pmSessions = new Map(); // token -> { createdAt }

function getPmToken(req) {
	const auth = req.headers["authorization"];
	if (auth && auth.startsWith("Bearer ")) return auth.slice(7).trim();
	return (req.headers["x-pm-token"] || "").trim();
}

function isPmTokenValid(token) {
	if (!token) return false;
	const s = pmSessions.get(token);
	if (!s) return false;
	if (Date.now() - s.createdAt > PM_SESSION_TTL_MS) {
		pmSessions.delete(token);
		return false;
	}
	return true;
}

async function handlePmLogin(body) {
	let parsed;
	try {
		parsed = JSON.parse(body);
	} catch {
		return { error: "Invalid JSON." };
	}
	const password = typeof parsed.password === "string" ? parsed.password : "";
	if (password !== PM_PASSWORD) return { error: "Invalid password.", status: 401 };
	const token = crypto.randomBytes(32).toString("hex");
	pmSessions.set(token, { createdAt: Date.now() });
	return { token };
}

async function handlePmGetWorkspace() {
	if (!dbPool) return { error: "Database not available. Set DATABASE_URL to use sync (or check server logs if it is set)." };
		try {
			const [projectsRows, statusesRows, viewsRows, tasksRows, tagsRows] = await Promise.all([
			dbPool.query("SELECT id, name, description, cover, icon, is_archived, created_at, updated_at FROM pm_projects ORDER BY updated_at DESC"),
			dbPool.query("SELECT id, project_id, name, color, \"order\", type FROM pm_task_statuses ORDER BY project_id, \"order\""),
			dbPool.query("SELECT id, project_id, type, name, data, \"order\" FROM pm_project_views ORDER BY project_id, \"order\""),
			dbPool.query("SELECT id, project_id, task_status_id, title, description, due_date, \"order\", priority, assignee, type, created_at, updated_at FROM pm_tasks ORDER BY project_id, \"order\""),
			dbPool.query("SELECT id, project_id, name, color FROM pm_tags ORDER BY project_id"),
		]);
		const projects = projectsRows.rows.map((r) => ({
			id: r.id,
			name: r.name,
			description: r.description ?? "",
			cover: r.cover ?? "",
			icon: r.icon ?? "",
			isArchived: !!r.is_archived,
			createdAt: r.created_at,
			updatedAt: r.updated_at,
		}));
		const taskStatuses = statusesRows.rows.map((r) => ({
			id: r.id,
			projectId: r.project_id,
			name: r.name,
			color: r.color ?? "",
			order: r.order,
			type: r.type ?? "TODO",
		}));
		const projectViews = viewsRows.rows.map((r) => ({
			id: r.id,
			projectId: r.project_id,
			type: r.type,
			name: r.name ?? "",
			data: r.data ?? {},
			order: r.order,
		}));
		const tasks = tasksRows.rows.map((r) => ({
			id: r.id,
			projectId: r.project_id,
			taskStatusId: r.task_status_id,
			title: r.title,
			description: r.description ?? "",
			dueDate: r.due_date,
			order: r.order,
			priority: r.priority ?? "",
			assignee: r.assignee ?? "",
			type: r.type ?? "Task",
			createdAt: r.created_at,
			updatedAt: r.updated_at,
		}));
		const tags = tagsRows.rows.map((r) => ({
			id: r.id,
			projectId: r.project_id,
			name: r.name,
			color: r.color ?? "",
		}));
		return {
			version: 1,
			lastModified: new Date().toISOString(),
			projects,
			taskStatuses,
			projectViews,
			tasks,
			tags,
		};
	} catch (err) {
		console.error("[pm] Get workspace error:", err.message);
		return { error: "Failed to load workspace." };
	}
}

async function handlePmSyncWorkspace(body) {
	if (!dbPool) return { error: "Database not available. Set DATABASE_URL to use sync (or check server logs if it is set)." };
	let parsed;
	try {
		parsed = JSON.parse(body);
	} catch {
		return { error: "Invalid JSON." };
	}
	const projects = Array.isArray(parsed.projects) ? parsed.projects : [];
	const taskStatuses = Array.isArray(parsed.taskStatuses) ? parsed.taskStatuses : [];
	const projectViews = Array.isArray(parsed.projectViews) ? parsed.projectViews : [];
	const tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];
	const tags = Array.isArray(parsed.tags) ? parsed.tags : [];
	try {
		await dbPool.query("BEGIN");
		await dbPool.query("DELETE FROM pm_tags");
		await dbPool.query("DELETE FROM pm_tasks");
		await dbPool.query("DELETE FROM pm_project_views");
		await dbPool.query("DELETE FROM pm_task_statuses");
		await dbPool.query("DELETE FROM pm_projects");
		for (const p of projects) {
			await dbPool.query(
				`INSERT INTO pm_projects (id, name, description, cover, icon, is_archived, created_at, updated_at)
				 VALUES ($1, $2, $3, $4, $5, $6, COALESCE($7::timestamptz, NOW()), COALESCE($8::timestamptz, NOW()))`,
				[p.id, p.name || "", p.description ?? "", p.cover ?? "", p.icon ?? "", !!p.isArchived, p.createdAt ?? null, p.updatedAt ?? null]
			);
		}
		for (const s of taskStatuses) {
			await dbPool.query(
				`INSERT INTO pm_task_statuses (id, project_id, name, color, "order", type)
				 VALUES ($1, $2, $3, $4, $5, $6)`,
				[s.id, s.projectId, s.name || "", s.color ?? "", Number(s.order) || 0, s.type ?? "TODO"]
			);
		}
		for (const v of projectViews) {
			await dbPool.query(
				`INSERT INTO pm_project_views (id, project_id, type, name, data, "order")
				 VALUES ($1, $2, $3, $4, $5, $6)`,
				[v.id, v.projectId, v.type || "list", v.name ?? "", JSON.stringify(v.data || {}), Number(v.order) || 0]
			);
		}
		for (const t of tasks) {
			await dbPool.query(
				`INSERT INTO pm_tasks (id, project_id, task_status_id, title, description, due_date, "order", priority, assignee, type, created_at, updated_at)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, COALESCE($11::timestamptz, NOW()), COALESCE($12::timestamptz, NOW()))`,
				[t.id, t.projectId, t.taskStatusId ?? null, t.title || "", t.description ?? "", t.dueDate ?? null, Number(t.order) || 0, t.priority ?? "", t.assignee ?? "", t.type ?? "Task", t.createdAt ?? null, t.updatedAt ?? null]
			);
		}
		for (const g of tags) {
			await dbPool.query(
				`INSERT INTO pm_tags (id, project_id, name, color) VALUES ($1, $2, $3, $4)`,
				[g.id, g.projectId, g.name || "", g.color ?? ""]
			);
		}
		await dbPool.query("COMMIT");
		return { success: true, lastModified: new Date().toISOString() };
	} catch (err) {
		await dbPool.query("ROLLBACK").catch(() => {});
		console.error("[pm] Sync workspace error:", err.message);
		return { error: "Failed to sync workspace." };
	}
}

// ——— Live: WebSocket for location sharing + ephemeral chat (5 min) ———
const CHAT_TTL_MS = 5 * 60 * 1000;
const CHAT_RATE_MS = 2000;
const liveClients = new Map(); // id -> { ws, sessionId, email?, lastChatAt?, lat?, lng?, lastSeenAt?, userAgent?, ip }
const chatBuffer = []; // { id, sender, text, ts }

function maskEmail(email) {
	if (!email || !email.includes("@")) return "***";
	const [local, domain] = email.split("@");
	return (local.slice(0, 1) + "***@" + (domain || "***")).toLowerCase();
}

function pruneChatBuffer() {
	const now = Date.now();
	while (chatBuffer.length > 0 && chatBuffer[0].ts < now - CHAT_TTL_MS) {
		chatBuffer.shift();
	}
}

function getLocationsPayload() {
	const now = Date.now();
	return {
		type: "locations",
		locations: Array.from(liveClients.entries())
			.filter(([, c]) => c.lat != null && c.lng != null)
			.map(([id, c]) => ({
				id: c.sessionId || id,
				lat: c.lat,
				lng: c.lng,
				last_seen_at: c.lastSeenAt ?? now,
			})),
	};
}

function broadcastLocations() {
	const payload = JSON.stringify(getLocationsPayload());
	liveClients.forEach((c) => {
		if (c.ws.readyState === 1) c.ws.send(payload);
	});
}

function broadcastChat(msg) {
	const payload = JSON.stringify(msg);
	liveClients.forEach((c) => {
		if (c.ws.readyState === 1) c.ws.send(payload);
	});
}

function getClientIp(req) {
	const raw = req.socket && req.socket.remoteAddress;
	if (!raw) return "127.0.0.1";
	// IPv6-mapped IPv4: ::ffff:192.168.1.1 -> 192.168.1.1 for inet
	if (raw.startsWith("::ffff:")) return raw.slice(7);
	return raw;
}

const wss = new WebSocketServer({ noServer: true });
wss.on("connection", (ws, req) => {
	const id = "c" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
	const sessionId = crypto.randomUUID();
	const clientIp = getClientIp(req);
	const userAgent = (req.headers && req.headers["user-agent"]) ? req.headers["user-agent"] : null;
	liveClients.set(id, { ws, sessionId, lastChatAt: 0, ip: clientIp, userAgent });
	ws.send(JSON.stringify({ type: "welcome", id, sessionId }));

	// Send current locations and recent chat to new client
	ws.send(JSON.stringify(getLocationsPayload()));
	pruneChatBuffer();
	chatBuffer.forEach((m) => ws.send(JSON.stringify(m)));

	ws.on("message", (raw) => {
		let msg;
		try {
			msg = JSON.parse(raw.toString());
		} catch {
			return;
		}
		const client = liveClients.get(id);
		if (!client) return;

		if (msg.type === "location" && typeof msg.lat === "number" && typeof msg.lng === "number") {
			client.lat = msg.lat;
			client.lng = msg.lng;
			client.lastSeenAt = Date.now();
			const acc = typeof msg.accuracy === "number" ? Math.round(msg.accuracy) : null;
			upsertLiveVisitor(
				sessionId,
				msg.lat,
				msg.lng,
				acc,
				client.userAgent,
				msg.country || null,
				msg.region || null
			).catch(() => {});
			broadcastLocations();
			return;
		}
		if (msg.type === "email_optin" && typeof msg.email === "string") {
			const email = msg.email.trim().toLowerCase();
			if (email.includes("@")) {
				client.email = email;
				if (dbPool) saveEmail(email, "live_chat").catch(() => {});
				ws.send(JSON.stringify({ type: "email_ok" }));
			}
			return;
		}
		if (msg.type === "chat" && typeof msg.text === "string") {
			if (!client.email) return;
			const now = Date.now();
			if (now - client.lastChatAt < CHAT_RATE_MS) return;
			client.lastChatAt = now;
			const text = msg.text.slice(0, 500).trim();
			if (!text) return;
			const anonymized = maskEmail(client.email);
			pruneChatBuffer();
			const payload = { type: "chat", id, sender: anonymized, text, ts: now };
			chatBuffer.push(payload);
			broadcastChat(payload);
			saveMessage(client.ip || "127.0.0.1", anonymized, text).catch(() => {});
		}
	});

	ws.on("close", () => {
		setLiveVisitorInactive(sessionId).catch(() => {});
		liveClients.delete(id);
		broadcastLocations();
	});
});

// Periodic: touch last_seen_at for connected clients with location; prune stale rows
const LIVE_TOUCH_INTERVAL_MS = 10000;
const LIVE_PRUNE_INTERVAL_MS = 60000;
setInterval(() => {
	const sessionIds = Array.from(liveClients.values())
		.filter((c) => c.sessionId && c.lat != null)
		.map((c) => c.sessionId);
	if (sessionIds.length > 0) {
		touchLiveVisitorsLastSeen(sessionIds).catch(() => {});
		liveClients.forEach((c) => {
			if (c.lat != null) c.lastSeenAt = Date.now();
		});
		broadcastLocations();
	}
}, LIVE_TOUCH_INTERVAL_MS);
setInterval(() => pruneStaleLiveVisitors(), LIVE_PRUNE_INTERVAL_MS);

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

	// PM: password-protected project management API
	if (pathname.startsWith("/api/pm/")) {
		const origin = req.headers.origin;
		const cors = { "Access-Control-Allow-Origin": origin || "*", "Access-Control-Allow-Methods": "GET, POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type, Authorization, X-PM-Token" };
		if (method === "OPTIONS") {
			res.writeHead(204, { ...cors, "Access-Control-Max-Age": "86400" });
			res.end();
			return;
		}
		if (pathname === "/api/pm/login" && method === "POST") {
			let body;
			try {
				body = await collectBody(req);
			} catch {
				jsonResponse(res, 500, { error: "Request failed." }, cors);
				return;
			}
			const result = await handlePmLogin(body);
			if (result.error) {
				jsonResponse(res, result.status === 401 ? 401 : 400, { error: result.error }, cors);
			} else {
				jsonResponse(res, 200, { token: result.token }, cors);
			}
			return;
		}
		const token = getPmToken(req);
		if (!isPmTokenValid(token)) {
			jsonResponse(res, 401, { error: "Unauthorized or session expired." }, cors);
			return;
		}
		if (pathname === "/api/pm/workspace" && method === "GET") {
			const result = await handlePmGetWorkspace();
			if (result.error) {
				jsonResponse(res, 500, { error: result.error }, cors);
			} else {
				jsonResponse(res, 200, result, cors);
			}
			return;
		}
		if (pathname === "/api/pm/workspace" && method === "POST") {
			let body;
			try {
				body = await collectBody(req);
			} catch {
				jsonResponse(res, 500, { error: "Request failed." }, cors);
				return;
			}
			const result = await handlePmSyncWorkspace(body);
			if (result.error) {
				jsonResponse(res, 400, { error: result.error }, cors);
			} else {
				jsonResponse(res, 200, result, cors);
			}
			return;
		}
		jsonResponse(res, 404, { error: "Not found." }, cors);
		return;
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

server.on("upgrade", (request, socket, head) => {
	const pathname = new URL(request.url || "/", "http://" + (request.headers.host || "localhost")).pathname;
	if (pathname === "/live") {
		wss.handleUpgrade(request, socket, head, (ws) => {
			wss.emit("connection", ws, request);
		});
	} else {
		socket.destroy();
	}
});

initDatabase().then((pool) => {
	dbPool = pool;
	server.listen(PORT, () => {
		console.log(`Listening on port ${PORT}`);
	});
});
