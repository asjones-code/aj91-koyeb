/**
 * Project model for CMS.
 */
import { getPool } from "../db.js";

const COLS = "id, slug, title, excerpt, thumbnail, hero_image, hero_video, about_text, gallery_images, gallery_caption, footer_cta, footer_email, tags, star_situation, star_task, star_action, star_result, demo_config, published, created_at, updated_at";

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
		const demoConfig = JSON.stringify(data.demo_config && typeof data.demo_config === "object" ? data.demo_config : {});
		const r = await p.query(
			`INSERT INTO cms_projects (slug, title, excerpt, thumbnail, hero_image, hero_video, about_text, gallery_images, gallery_caption, footer_cta, footer_email, tags, star_situation, star_task, star_action, star_result, demo_config, published)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
       RETURNING ${COLS}`,
			[
				data.slug.trim(),
				data.title.trim(),
				data.excerpt?.trim() || null,
				data.thumbnail?.trim() || null,
				data.hero_image?.trim() || null,
				data.hero_video?.trim() || null,
				data.about_text?.trim() || null,
				gallery,
				data.gallery_caption?.trim() || null,
				data.footer_cta?.trim() || null,
				data.footer_email?.trim() || null,
				tags,
				data.star_situation?.trim() || null,
				data.star_task?.trim() || null,
				data.star_action?.trim() || null,
				data.star_result?.trim() || null,
				demoConfig,
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
		const demoConfig = JSON.stringify(data.demo_config && typeof data.demo_config === "object" ? data.demo_config : {});
		const r = await p.query(
			`UPDATE cms_projects SET slug = $1, title = $2, excerpt = $3, thumbnail = $4, hero_image = $5, hero_video = $6, about_text = $7, gallery_images = $8, gallery_caption = $9, footer_cta = $10, footer_email = $11, tags = $12, star_situation = $13, star_task = $14, star_action = $15, star_result = $16, demo_config = $17, published = $18, updated_at = NOW()
       WHERE id = $19 RETURNING ${COLS}`,
			[
				data.slug.trim(),
				data.title.trim(),
				data.excerpt?.trim() || null,
				data.thumbnail?.trim() || null,
				data.hero_image?.trim() || null,
				data.hero_video?.trim() || null,
				data.about_text?.trim() || null,
				gallery,
				data.gallery_caption?.trim() || null,
				data.footer_cta?.trim() || null,
				data.footer_email?.trim() || null,
				tags,
				data.star_situation?.trim() || null,
				data.star_task?.trim() || null,
				data.star_action?.trim() || null,
				data.star_result?.trim() || null,
				demoConfig,
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
	const demo_config = row.demo_config && typeof row.demo_config === "object" ? row.demo_config : (typeof row.demo_config === "string" ? JSON.parse(row.demo_config || "{}") : {});
	return { ...row, galleryImages, tags, demo_config };
}
