/**
 * CMS module - lightweight admin + posts.
 * Integrates with the main server's request handler.
 */
import { setPool } from "./db.js";
import * as routes from "./routes.js";

export function init(pool) {
	setPool(pool);
}

const cors = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Authorization",
};

function jsonResponse(res, status, data, headers = {}) {
	const body = JSON.stringify(data);
	res.writeHead(status, {
		"Content-Type": "application/json; charset=utf-8",
		"Content-Length": Buffer.byteLength(body),
		...cors,
		...headers,
	});
	res.end(body);
}

/**
 * Handle CMS routes. Returns true if handled, false otherwise.
 * @param {import('http').IncomingMessage} req
 * @param {import('http').ServerResponse} res
 * @param {string} pathname
 * @param {string} method
 * @param {() => Promise<string>} collectBody
 */
export async function handle(req, res, pathname, method, collectBody) {
	// Public: GET /api/posts/:slug
	const publicPostMatch = pathname.match(/^\/api\/posts\/([^/]+)$/);
	if (publicPostMatch && method === "GET") {
		const result = await routes.handleGetPostBySlug(publicPostMatch[1]);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// Admin routes
	if (!pathname.startsWith("/api/admin/")) return false;

	if (method === "OPTIONS") {
		res.writeHead(204, { ...cors, "Access-Control-Max-Age": "86400" });
		res.end();
		return true;
	}

	// POST /api/admin/login
	if (pathname === "/api/admin/login" && method === "POST") {
		if (!(process.env.CMS_JWT_SECRET || "").trim()) {
			jsonResponse(res, 503, { error: "CMS not configured (CMS_JWT_SECRET required)." }, cors);
			return true;
		}
		let body;
		try {
			body = await collectBody();
		} catch {
			jsonResponse(res, 500, { error: "Request failed." }, cors);
			return true;
		}
		const result = await routes.handleLogin(body);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// GET /api/admin/posts
	if (pathname === "/api/admin/posts" && method === "GET") {
		const result = await routes.handleGetPosts(req);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// GET /api/admin/posts/:id
	const getPostMatch = pathname.match(/^\/api\/admin\/posts\/([^/]+)$/);
	if (getPostMatch && method === "GET") {
		const result = await routes.handleGetPost(req, getPostMatch[1]);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// POST /api/admin/posts
	if (pathname === "/api/admin/posts" && method === "POST") {
		let body;
		try {
			body = await collectBody();
		} catch {
			jsonResponse(res, 500, { error: "Request failed." }, cors);
			return true;
		}
		const result = await routes.handleCreatePost(req, body);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 201, result, cors);
		}
		return true;
	}

	// PUT /api/admin/posts/:id
	const putMatch = pathname.match(/^\/api\/admin\/posts\/([^/]+)$/);
	if (putMatch && method === "PUT") {
		let body;
		try {
			body = await collectBody();
		} catch {
			jsonResponse(res, 500, { error: "Request failed." }, cors);
			return true;
		}
		const result = await routes.handleUpdatePost(req, body, putMatch[1]);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// DELETE /api/admin/posts/:id
	const deleteMatch = pathname.match(/^\/api\/admin\/posts\/([^/]+)$/);
	if (deleteMatch && method === "DELETE") {
		const result = await routes.handleDeletePost(req, deleteMatch[1]);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	return false;
}
