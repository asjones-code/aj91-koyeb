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
	// Public: GET /api/posts (list published)
	if (pathname === "/api/posts" && method === "GET") {
		const result = await routes.handleListPublishedPosts();
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// Public: GET /api/projects (list published)
	if (pathname === "/api/projects" && method === "GET") {
		const result = await routes.handleListPublishedProjects();
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// Public: GET /api/projects/:slug (single project)
	const projectSlugMatch = pathname.match(/^\/api\/projects\/([^/]+)$/);
	if (projectSlugMatch && method === "GET") {
		const result = await routes.handleGetProjectBySlug(projectSlugMatch[1]);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// Public: GET /api/posts/:slug (single post)
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

	// Public: GET /api/career-dots
	if (pathname === "/api/career-dots" && method === "GET") {
		const result = await routes.handleListCareerDots();
		jsonResponse(res, result.error ? result.status || 500 : 200, result.error ? { error: result.error } : result);
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
	const deletePostMatch = pathname.match(/^\/api\/admin\/posts\/([^/]+)$/);
	if (deletePostMatch && method === "DELETE") {
		const result = await routes.handleDeletePost(req, deletePostMatch[1]);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// GET /api/admin/projects
	if (pathname === "/api/admin/projects" && method === "GET") {
		const result = await routes.handleGetProjects(req);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// GET /api/admin/projects/:id
	const getProjectMatch = pathname.match(/^\/api\/admin\/projects\/([^/]+)$/);
	if (getProjectMatch && method === "GET") {
		const result = await routes.handleGetProject(req, getProjectMatch[1]);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// POST /api/admin/projects
	if (pathname === "/api/admin/projects" && method === "POST") {
		let body;
		try {
			body = await collectBody();
		} catch {
			jsonResponse(res, 500, { error: "Request failed." }, cors);
			return true;
		}
		const result = await routes.handleCreateProject(req, body);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 201, result, cors);
		}
		return true;
	}

	// PUT /api/admin/projects/:id
	const putProjectMatch = pathname.match(/^\/api\/admin\/projects\/([^/]+)$/);
	if (putProjectMatch && method === "PUT") {
		let body;
		try {
			body = await collectBody();
		} catch {
			jsonResponse(res, 500, { error: "Request failed." }, cors);
			return true;
		}
		const result = await routes.handleUpdateProject(req, body, putProjectMatch[1]);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// DELETE /api/admin/projects/:id
	const deleteProjectMatch = pathname.match(/^\/api\/admin\/projects\/([^/]+)$/);
	if (deleteProjectMatch && method === "DELETE") {
		const result = await routes.handleDeleteProject(req, deleteProjectMatch[1]);
		if (result.error) {
			jsonResponse(res, result.status || 500, { error: result.error }, cors);
		} else {
			jsonResponse(res, 200, result, cors);
		}
		return true;
	}

	// POST /api/admin/career-dots
	if (pathname === "/api/admin/career-dots" && method === "POST") {
		let body;
		try { body = await collectBody(); } catch { jsonResponse(res, 500, { error: "Request failed." }); return true; }
		const result = await routes.handleCreateCareerDot(req, body);
		jsonResponse(res, result.error ? result.status || 500 : 201, result.error ? { error: result.error } : result);
		return true;
	}

	// PUT /api/admin/career-dots/:id
	const putDotMatch = pathname.match(/^\/api\/admin\/career-dots\/(\d+)$/);
	if (putDotMatch && method === "PUT") {
		let body;
		try { body = await collectBody(); } catch { jsonResponse(res, 500, { error: "Request failed." }); return true; }
		const result = await routes.handleUpdateCareerDot(req, body, putDotMatch[1]);
		jsonResponse(res, result.error ? result.status || 500 : 200, result.error ? { error: result.error } : result);
		return true;
	}

	// DELETE /api/admin/career-dots/:id
	const deleteDotMatch = pathname.match(/^\/api\/admin\/career-dots\/(\d+)$/);
	if (deleteDotMatch && method === "DELETE") {
		const result = await routes.handleDeleteCareerDot(req, deleteDotMatch[1]);
		jsonResponse(res, result.error ? result.status || 500 : 200, result.error ? { error: result.error } : result);
		return true;
	}

	return false;
}
