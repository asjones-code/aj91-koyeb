import { getPool } from "../db.js";

export async function findAll() {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	try {
		const r = await p.query("SELECT * FROM career_dots ORDER BY sort_order, id");
		return { dots: r.rows };
	} catch (err) {
		console.error("[cms/careerDot] findAll:", err.message);
		return { error: "Failed to load career dots." };
	}
}

export async function create(data) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	const { lat, lng, label, year, text, sort_order } = data;
	if (typeof lat !== "number" || typeof lng !== "number" || !label?.trim()) {
		return { error: "lat, lng, and label are required.", status: 400 };
	}
	try {
		const r = await p.query(
			`INSERT INTO career_dots (lat, lng, label, year, text, sort_order)
			 VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
			[lat, lng, label.trim(), year?.trim() || null, text?.trim() || null, sort_order ?? 0]
		);
		return { dot: r.rows[0] };
	} catch (err) {
		console.error("[cms/careerDot] create:", err.message);
		return { error: "Failed to create career dot." };
	}
}

export async function update(id, data) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	const { lat, lng, label, year, text, sort_order } = data;
	if (typeof lat !== "number" || typeof lng !== "number" || !label?.trim()) {
		return { error: "lat, lng, and label are required.", status: 400 };
	}
	try {
		const r = await p.query(
			`UPDATE career_dots
			 SET lat=$1, lng=$2, label=$3, year=$4, text=$5, sort_order=$6
			 WHERE id=$7 RETURNING *`,
			[lat, lng, label.trim(), year?.trim() || null, text?.trim() || null, sort_order ?? 0, id]
		);
		if (r.rowCount === 0) return { error: "Not found.", status: 404 };
		return { dot: r.rows[0] };
	} catch (err) {
		console.error("[cms/careerDot] update:", err.message);
		return { error: "Failed to update career dot." };
	}
}

export async function remove(id) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	try {
		const r = await p.query("DELETE FROM career_dots WHERE id=$1", [id]);
		if (r.rowCount === 0) return { error: "Not found.", status: 404 };
		return { success: true };
	} catch (err) {
		console.error("[cms/careerDot] remove:", err.message);
		return { error: "Failed to delete career dot." };
	}
}
