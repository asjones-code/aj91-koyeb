#!/usr/bin/env node
/**
 * Create the first CMS admin user.
 * Add to .env: CMS_ADMIN_EMAIL, CMS_ADMIN_PASSWORD (min 8 chars), DATABASE_URL
 * Then: npm run cms:create-admin
 *
 * Or inline (Unix): CMS_ADMIN_EMAIL=x CMS_ADMIN_PASSWORD=y npm run cms:create-admin
 */
import "dotenv/config";
import pg from "pg";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import * as adminModel from "../models/admin.js";
import { setPool } from "../db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const email = process.env.CMS_ADMIN_EMAIL?.trim();
const password = process.env.CMS_ADMIN_PASSWORD?.trim();

if (!email || !password) {
	console.error("Missing CMS_ADMIN_EMAIL or CMS_ADMIN_PASSWORD.");
	console.error("Add to .env or run: CMS_ADMIN_EMAIL=admin@example.com CMS_ADMIN_PASSWORD=yourpassword npm run cms:create-admin");
	console.error("Password must be at least 8 characters.");
	process.exit(1);
}

if (password.length < 8) {
	console.error("Password must be at least 8 characters.");
	process.exit(1);
}

const dbUrl = process.env.DATABASE_URL?.trim();
if (!dbUrl) {
	console.error("DATABASE_URL required (add to .env)");
	process.exit(1);
}

const pool = new pg.Pool({
	connectionString: dbUrl,
	ssl: dbUrl.includes("localhost") ? false : { rejectUnauthorized: false },
});
setPool(pool);

// Ensure CMS tables exist
const migrationPath = path.join(__dirname, "../migrations/001_cms_init.sql");
const migration = fs.readFileSync(migrationPath, "utf8");
await pool.query(migration);

const result = await adminModel.createAdmin(email, password);
if (result.error) {
	console.error("Error:", result.error);
	process.exit(1);
}
console.log("Admin user created:", email);
await pool.end();
