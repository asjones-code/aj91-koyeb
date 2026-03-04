#!/usr/bin/env node
/**
 * Create the first CMS admin user.
 * Usage: CMS_ADMIN_EMAIL=admin@example.com CMS_ADMIN_PASSWORD=secret node cms/scripts/create-admin.js
 * Or with dotenv: node -r dotenv/config cms/scripts/create-admin.js
 */
import "dotenv/config";
import pg from "pg";
import * as adminModel from "../models/admin.js";
import { setPool } from "../db.js";

const email = process.env.CMS_ADMIN_EMAIL?.trim();
const password = process.env.CMS_ADMIN_PASSWORD?.trim();

if (!email || !password) {
	console.error("Usage: CMS_ADMIN_EMAIL=... CMS_ADMIN_PASSWORD=... node cms/scripts/create-admin.js");
	console.error("Password must be at least 8 characters.");
	process.exit(1);
}

const dbUrl = process.env.DATABASE_URL?.trim();
if (!dbUrl) {
	console.error("DATABASE_URL required");
	process.exit(1);
}

const pool = new pg.Pool({
	connectionString: dbUrl,
	ssl: dbUrl.includes("localhost") ? false : { rejectUnauthorized: false },
});
setPool(pool);

const result = await adminModel.createAdmin(email, password);
if (result.error) {
	console.error("Error:", result.error);
	process.exit(1);
}
console.log("Admin user created:", email);
await pool.end();
