#!/usr/bin/env node
/**
 * Reset an existing CMS admin password, or list all admin emails.
 *
 * List admins:  npm run cms:reset-admin
 * Reset password:
 *   CMS_ADMIN_EMAIL=you@example.com CMS_ADMIN_PASSWORD=newpassword npm run cms:reset-admin
 */
import "dotenv/config";
import crypto from "node:crypto";
import pg from "pg";

const dbUrl = process.env.DATABASE_URL?.trim();
if (!dbUrl) {
	console.error("DATABASE_URL required (add to .env or export it)");
	process.exit(1);
}

const pool = new pg.Pool({
	connectionString: dbUrl,
	ssl: dbUrl.includes("localhost") ? false : { rejectUnauthorized: false },
});

const email = process.env.CMS_ADMIN_EMAIL?.trim();
const password = process.env.CMS_ADMIN_PASSWORD?.trim();

if (!email && !password) {
	const { rows } = await pool.query("SELECT id, email, created_at FROM cms_admin_users ORDER BY id");
	if (rows.length === 0) {
		console.log("No admin users found. Run: npm run cms:create-admin");
	} else {
		console.log("Admin users:");
		rows.forEach(r => console.log(`  id=${r.id}  email=${r.email}  created=${r.created_at}`));
	}
	await pool.end();
	process.exit(0);
}

if (!email || !password) {
	console.error("Provide both CMS_ADMIN_EMAIL and CMS_ADMIN_PASSWORD to reset.");
	process.exit(1);
}
if (password.length < 8) {
	console.error("Password must be at least 8 characters.");
	process.exit(1);
}

const salt = crypto.randomBytes(16).toString("hex");
const hash = crypto.scryptSync(password, salt, 64).toString("hex");
const passwordHash = `${salt}:${hash}`;

const { rowCount } = await pool.query(
	"UPDATE cms_admin_users SET password_hash = $1 WHERE email = $2",
	[passwordHash, email.toLowerCase()]
);

if (rowCount === 0) {
	console.error(`No admin found with email: ${email}`);
	console.error("Run without args to list admins, or use npm run cms:create-admin to create one.");
	process.exit(1);
}

console.log(`Password reset for: ${email}`);
await pool.end();
