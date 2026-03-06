/**
 * CMS API route handlers.
 */
import * as postModel from "./models/post.js";
import * as projectModel from "./models/project.js";
import * as adminModel from "./models/admin.js";
import { createToken, requireAuth } from "./middleware.js";

export async function handleLogin(body) {
	let parsed;
	try {
		parsed = JSON.parse(body);
	} catch {
		return { error: "Invalid JSON.", status: 400 };
	}
	const { email, password } = parsed;
	if (!email || !password) return { error: "Email and password required.", status: 400 };
	const admin = await adminModel.findByEmail(email);
	if (!admin || !adminModel.verifyPassword(password, admin.password_hash)) {
		return { error: "Invalid credentials.", status: 401 };
	}
	const token = createToken(admin.id);
	if (!token) return { error: "CMS not configured.", status: 503 };
	return { token, adminId: admin.id };
}

export async function handleGetPosts(req) {
	const auth = requireAuth(req);
	if (auth.error) return auth;
	const result = await postModel.findAll(true);
	if (result.error) return { error: result.error, status: 500 };
	return result;
}

export async function handleGetPost(req, postId) {
	const auth = requireAuth(req);
	if (auth.error) return auth;
	const result = await postModel.findById(postId);
	if (result.error) return { error: result.error, status: result.status || 500 };
	return result;
}

export async function handleCreatePost(req, body) {
	const auth = requireAuth(req);
	if (auth.error) return auth;
	let parsed;
	try {
		parsed = JSON.parse(body);
	} catch {
		return { error: "Invalid JSON.", status: 400 };
	}
	const result = await postModel.create(parsed);
	if (result.error) return { error: result.error, status: result.status || 500 };
	return result;
}

export async function handleUpdatePost(req, body, postId) {
	const auth = requireAuth(req);
	if (auth.error) return auth;
	let parsed;
	try {
		parsed = JSON.parse(body);
	} catch {
		return { error: "Invalid JSON.", status: 400 };
	}
	const result = await postModel.update(postId, parsed);
	if (result.error) return { error: result.error, status: result.status || 500 };
	return result;
}

export async function handleDeletePost(req, postId) {
	const auth = requireAuth(req);
	if (auth.error) return auth;
	const result = await postModel.remove(postId);
	if (result.error) return { error: result.error, status: result.status || 500 };
	return result;
}

export async function handleGetPostBySlug(slug) {
	const result = await postModel.findBySlug(slug);
	if (result.error) return { error: result.error, status: result.status || 500 };
	return result;
}

export async function handleListPublishedPosts() {
	const result = await postModel.findAll(false);
	if (result.error) return { error: result.error, status: 500 };
	return result;
}

export async function handleListPublishedProjects() {
	const result = await projectModel.findAll(false);
	if (result.error) return { error: result.error, status: 500 };
	return result;
}

export async function handleGetProjectBySlug(slug) {
	const result = await projectModel.findBySlug(slug);
	if (result.error) return { error: result.error, status: result.status || 500 };
	return result;
}

export async function handleGetProjects(req) {
	const auth = requireAuth(req);
	if (auth.error) return auth;
	const result = await projectModel.findAll(true);
	if (result.error) return { error: result.error, status: 500 };
	return result;
}

export async function handleGetProject(req, projectId) {
	const auth = requireAuth(req);
	if (auth.error) return auth;
	const result = await projectModel.findById(projectId);
	if (result.error) return { error: result.error, status: result.status || 500 };
	return result;
}

export async function handleCreateProject(req, body) {
	const auth = requireAuth(req);
	if (auth.error) return auth;
	let parsed;
	try {
		parsed = JSON.parse(body);
	} catch {
		return { error: "Invalid JSON.", status: 400 };
	}
	const result = await projectModel.create(parsed);
	if (result.error) return { error: result.error, status: result.status || 500 };
	return result;
}

export async function handleUpdateProject(req, body, projectId) {
	const auth = requireAuth(req);
	if (auth.error) return auth;
	let parsed;
	try {
		parsed = JSON.parse(body);
	} catch {
		return { error: "Invalid JSON.", status: 400 };
	}
	const result = await projectModel.update(projectId, parsed);
	if (result.error) return { error: result.error, status: result.status || 500 };
	return result;
}

export async function handleDeleteProject(req, projectId) {
	const auth = requireAuth(req);
	if (auth.error) return auth;
	const result = await projectModel.remove(projectId);
	if (result.error) return { error: result.error, status: result.status || 500 };
	return result;
}
