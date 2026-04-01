/**
 * Admin user model for CMS.
 */
import crypto from "node:crypto";
import { getPool } from "../db.js";

function hashPassword(password) {
	const salt = crypto.randomBytes(16).toString("hex");
	const hash = crypto.scryptSync(password, salt, 64).toString("hex");
	return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
	const [salt, hash] = (stored || "").split(":");
	if (!salt || !hash) return false;
	const computed = crypto.scryptSync(password, salt, 64).toString("hex");
	return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(computed, "hex"));
}

export async function findByEmail(email) {
	const p = getPool();
	if (!p) return null;
	const r = await p.query(
		"SELECT id, email, password_hash FROM cms_admin_users WHERE email = $1",
		[email?.toLowerCase().trim()]
	);
	return r.rows[0] || null;
}

export async function createAdmin(email, password) {
	const p = getPool();
	if (!p) return { error: "Database not available." };
	if (!email || !password || password.length < 8) {
		return { error: "Email and password (min 8 chars) required.", status: 400 };
	}
	try {
		const passwordHash = hashPassword(password);
		await p.query(
			"INSERT INTO cms_admin_users (email, password_hash) VALUES ($1, $2)",
			[email.toLowerCase().trim(), passwordHash]
		);
		return { success: true };
	} catch (err) {
		if (err.code === "23505") return { error: "Email already exists.", status: 400 };
		console.error("[cms/admin] create:", err);
		return { error: "Failed to create admin." };
	}
}
