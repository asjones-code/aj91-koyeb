/**
 * CMS database access. Uses the shared pg pool from server.js.
 * Call setPool(pool) during server init.
 */
let pool = null;

export function setPool(p) {
	pool = p;
}

export function getPool() {
	return pool;
}
