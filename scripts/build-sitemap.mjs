/**
 * Writes dist/sitemap.xml after `parcel build`.
 * Ensures /sitemap.xml is a real file so static hosts and SPA fallbacks do not return index.html.
 * Loads .env when present. If DATABASE_URL is set, includes published CMS projects and posts.
 */
import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const distDir = path.join(root, "dist");

function xmlEscapeLoc(url) {
	return String(url).replace(/&/g, "&amp;");
}

function lastmodYmd(value) {
	if (!value) return null;
	const d = value instanceof Date ? value : new Date(value);
	if (Number.isNaN(d.getTime())) return null;
	return d.toISOString().slice(0, 10);
}

function buildXml(base, urls) {
	const urlElements = urls
		.map((u) => {
			let block = `  <url>\n    <loc>${xmlEscapeLoc(u.loc)}</loc>`;
			if (u.lastmod) block += `\n    <lastmod>${u.lastmod}</lastmod>`;
			if (u.changefreq) block += `\n    <changefreq>${u.changefreq}</changefreq>`;
			if (u.priority) block += `\n    <priority>${u.priority}</priority>`;
			block += "\n  </url>";
			return block;
		})
		.join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>
`;
}

async function main() {
	let base = (process.env.APP_BASE_URL || process.env.SITE_URL || "").trim().replace(/\/$/, "");
	if (!base) {
		console.warn("[build-sitemap] APP_BASE_URL or SITE_URL not set; using https://aj91.online (set env for production builds)");
		base = "https://aj91.online";
	}

	const urls = [
		{ loc: `${base}/`, changefreq: "weekly", priority: "1.0" },
		{ loc: `${base}/about.html`, changefreq: "monthly", priority: "0.8" },
		{ loc: `${base}/work.html`, changefreq: "monthly", priority: "0.8" },
		{ loc: `${base}/projects`, changefreq: "weekly", priority: "0.9" },
		{ loc: `${base}/blog`, changefreq: "weekly", priority: "0.9" },
	];

	const dbUrl = (process.env.DATABASE_URL || "").trim();
	if (dbUrl) {
		const pool = new Pool({
			connectionString: dbUrl,
			ssl: dbUrl.includes("localhost") ? false : { rejectUnauthorized: false },
		});
		try {
			const [proj, posts] = await Promise.all([
				pool.query(
					`SELECT slug, updated_at FROM cms_projects WHERE published = true ORDER BY updated_at DESC`
				),
				pool.query(`SELECT slug, updated_at FROM cms_posts WHERE published = true ORDER BY updated_at DESC`),
			]);
			for (const row of proj.rows) {
				if (!row.slug) continue;
				urls.push({
					loc: `${base}/project?slug=${encodeURIComponent(row.slug)}`,
					lastmod: lastmodYmd(row.updated_at),
					changefreq: "monthly",
					priority: "0.7",
				});
			}
			for (const row of posts.rows) {
				if (!row.slug) continue;
				urls.push({
					loc: `${base}/blog?slug=${encodeURIComponent(row.slug)}`,
					lastmod: lastmodYmd(row.updated_at),
					changefreq: "monthly",
					priority: "0.7",
				});
			}
		} catch (e) {
			console.warn("[build-sitemap] DB query skipped:", e.message);
		} finally {
			await pool.end().catch(() => {});
		}
	} else {
		console.warn("[build-sitemap] DATABASE_URL not set; sitemap will only list static pages (re-run build with DB for CMS URLs)");
	}

	const xml = buildXml(base, urls);
	await fs.mkdir(distDir, { recursive: true });
	await fs.writeFile(path.join(distDir, "sitemap.xml"), xml, "utf8");
	console.log("[build-sitemap] wrote dist/sitemap.xml (" + urls.length + " URLs)");
}

main().catch((e) => {
	console.error("[build-sitemap]", e);
	process.exit(1);
});
