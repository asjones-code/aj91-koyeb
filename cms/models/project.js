/**
 * Project model for CMS.
 */
import { getPool } from "../db.js";

const COLS = "id, slug, title, excerpt, hero_image, hero_video, about_text, gallery_images, gallery_caption, footer_cta, footer_email, tags, published, created_at, updated_at";

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

export async function findById(id) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	try {
		const r = await p.query(`SELECT ${COLS} FROM cms_projects WHERE id = $1`, [id]);
		if (r.rows.length === 0) return { error: "Not found.", status: 404 };
		return { project: normalize(r.rows[0]) };
	} catch (err) {
		console.error("[cms/project] findById:", err);
		return { error: "Failed to fetch project." };
	}
}

export async function create(data) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	if (!data.slug || !data.title) return { error: "Slug and title required.", status: 400 };
	try {
		const gallery = JSON.stringify(Array.isArray(data.galleryImages) ? data.galleryImages : (data.gallery_images || []));
		const tags = JSON.stringify(Array.isArray(data.tags) ? data.tags : []);
		const r = await p.query(
			`INSERT INTO cms_projects (slug, title, excerpt, hero_image, hero_video, about_text, gallery_images, gallery_caption, footer_cta, footer_email, tags, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING ${COLS}`,
			[
				data.slug.trim(),
				data.title.trim(),
				data.excerpt?.trim() || null,
				data.hero_image?.trim() || null,
				data.hero_video?.trim() || null,
				data.about_text?.trim() || null,
				gallery,
				data.gallery_caption?.trim() || null,
				data.footer_cta?.trim() || null,
				data.footer_email?.trim() || null,
				tags,
				!!data.published,
			]
		);
		return { project: normalize(r.rows[0]) };
	} catch (err) {
		if (err.code === "23505") return { error: "Slug already exists.", status: 400 };
		console.error("[cms/project] create:", err);
		return { error: "Failed to create project." };
	}
}

export async function update(id, data) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	if (!data.slug || !data.title) return { error: "Slug and title required.", status: 400 };
	try {
		const gallery = JSON.stringify(Array.isArray(data.galleryImages) ? data.galleryImages : (data.gallery_images || []));
		const tags = JSON.stringify(Array.isArray(data.tags) ? data.tags : []);
		const r = await p.query(
			`UPDATE cms_projects SET slug = $1, title = $2, excerpt = $3, hero_image = $4, hero_video = $5, about_text = $6, gallery_images = $7, gallery_caption = $8, footer_cta = $9, footer_email = $10, tags = $11, published = $12, updated_at = NOW()
       WHERE id = $13 RETURNING ${COLS}`,
			[
				data.slug.trim(),
				data.title.trim(),
				data.excerpt?.trim() || null,
				data.hero_image?.trim() || null,
				data.hero_video?.trim() || null,
				data.about_text?.trim() || null,
				gallery,
				data.gallery_caption?.trim() || null,
				data.footer_cta?.trim() || null,
				data.footer_email?.trim() || null,
				tags,
				!!data.published,
				id,
			]
		);
		if (r.rows.length === 0) return { error: "Not found.", status: 404 };
		return { project: normalize(r.rows[0]) };
	} catch (err) {
		if (err.code === "23505") return { error: "Slug already exists.", status: 400 };
		console.error("[cms/project] update:", err);
		return { error: "Failed to update project." };
	}
}

export async function remove(id) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	try {
		const r = await p.query("DELETE FROM cms_projects WHERE id = $1 RETURNING id", [id]);
		if (r.rows.length === 0) return { error: "Not found.", status: 404 };
		return { success: true };
	} catch (err) {
		console.error("[cms/project] remove:", err);
		return { error: "Failed to delete project." };
	}
}

function normalize(row) {
	const galleryImages = Array.isArray(row.gallery_images) ? row.gallery_images : (typeof row.gallery_images === "string" ? JSON.parse(row.gallery_images || "[]") : []);
	const tags = Array.isArray(row.tags) ? row.tags : (typeof row.tags === "string" ? JSON.parse(row.tags || "[]") : []);
	return { ...row, galleryImages, tags };
}
