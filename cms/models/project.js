/**
 * Project model for CMS.
 */
import { getPool } from "../db.js";

const COLS = "id, slug, title, excerpt, hero_image, about_text, gallery_images, gallery_caption, footer_cta, footer_email, tags, published, created_at, updated_at";

export async function findAll(includeUnpublished = false) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	try {
		const query = includeUnpublished
			? `SELECT ${COLS} FROM cms_projects ORDER BY updated_at DESC`
			: `SELECT ${COLS} FROM cms_projects WHERE published = true ORDER BY updated_at DESC`;
		const r = await p.query(query);
		return { projects: r.rows.map(normalize) };
	} catch (err) {
		console.error("[cms/project] findAll:", err);
		return { error: "Failed to fetch projects." };
	}
}

export async function findBySlug(slug) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	try {
		const r = await p.query(
			`SELECT ${COLS} FROM cms_projects WHERE slug = $1 AND published = true`,
			[slug]
		);
		if (r.rows.length === 0) return { error: "Not found.", status: 404 };
		return { project: normalize(r.rows[0]) };
	} catch (err) {
		console.error("[cms/project] findBySlug:", err);
		return { error: "Failed to fetch project." };
	}
}

function normalize(row) {
	const galleryImages = Array.isArray(row.gallery_images) ? row.gallery_images : (typeof row.gallery_images === "string" ? JSON.parse(row.gallery_images || "[]") : []);
	const tags = Array.isArray(row.tags) ? row.tags : (typeof row.tags === "string" ? JSON.parse(row.tags || "[]") : []);
	return { ...row, galleryImages, tags };
}
