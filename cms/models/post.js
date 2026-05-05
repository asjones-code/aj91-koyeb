/**
 * Post model for CMS.
 */
import { getPool } from "../db.js";

const COLS = "id, slug, title, excerpt, content, thumbnail, published, created_at, updated_at";

export async function findAll(includeUnpublished = false) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	try {
		const q = includeUnpublished
			? `SELECT ${COLS} FROM cms_posts ORDER BY updated_at DESC`
			: `SELECT ${COLS} FROM cms_posts WHERE published = true ORDER BY updated_at DESC`;
		const r = await p.query(q);
		return { posts: r.rows };
	} catch (err) {
		console.error("[cms/post] findAll:", err);
		return { error: "Failed to fetch posts." };
	}
}

export async function findBySlug(slug) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	try {
		const r = await p.query(
			`SELECT ${COLS} FROM cms_posts WHERE slug = $1 AND published = true`,
			[slug]
		);
		if (r.rows.length === 0) return { error: "Not found.", status: 404 };
		return { post: r.rows[0] };
	} catch (err) {
		console.error("[cms/post] findBySlug:", err);
		return { error: "Failed to fetch post." };
	}
}

export async function findById(id) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	try {
		const r = await p.query(`SELECT ${COLS} FROM cms_posts WHERE id = $1`, [id]);
		if (r.rows.length === 0) return { error: "Not found.", status: 404 };
		return { post: r.rows[0] };
	} catch (err) {
		console.error("[cms/post] findById:", err);
		return { error: "Failed to fetch post." };
	}
}

export async function create({ slug, title, excerpt, content, thumbnail, published }) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	if (!slug || !title) return { error: "Slug and title required.", status: 400 };
	try {
		const r = await p.query(
			`INSERT INTO cms_posts (slug, title, excerpt, content, thumbnail, published)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING ${COLS}`,
			[slug.trim(), title.trim(), excerpt?.trim() || null, content?.trim() || null, thumbnail?.trim() || null, !!published]
		);
		return { post: r.rows[0] };
	} catch (err) {
		if (err.code === "23505") return { error: "Slug already exists.", status: 400 };
		console.error("[cms/post] create:", err);
		return { error: "Failed to create post." };
	}
}

export async function update(id, { slug, title, excerpt, content, thumbnail, published }) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	if (!slug || !title) return { error: "Slug and title required.", status: 400 };
	try {
		const r = await p.query(
			`UPDATE cms_posts SET slug=$1, title=$2, excerpt=$3, content=$4, thumbnail=$5, published=$6, updated_at=NOW()
       WHERE id = $7
       RETURNING ${COLS}`,
			[slug.trim(), title.trim(), excerpt?.trim() || null, content?.trim() || null, thumbnail?.trim() || null, !!published, id]
		);
		if (r.rows.length === 0) return { error: "Not found.", status: 404 };
		return { post: r.rows[0] };
	} catch (err) {
		if (err.code === "23505") return { error: "Slug already exists.", status: 400 };
		console.error("[cms/post] update:", err);
		return { error: "Failed to update post." };
	}
}

export async function remove(id) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	try {
		const r = await p.query("DELETE FROM cms_posts WHERE id = $1 RETURNING id", [id]);
		if (r.rows.length === 0) return { error: "Not found.", status: 404 };
		return { success: true };
	} catch (err) {
		console.error("[cms/post] remove:", err);
		return { error: "Failed to delete post." };
	}
}
