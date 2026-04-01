/**
 * JWT auth middleware for CMS admin routes.
 * Uses HS256 with CMS_JWT_SECRET env var.
 */
import crypto from "node:crypto";

const JWT_HEADER = Buffer.from(JSON.stringify({ alg: "HS256", typ: "JWT" })).toString("base64url");
const TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

function getSecret() {
	return (process.env.CMS_JWT_SECRET || "").trim();
}

function hasSecret() {
	return !!getSecret();
}

function sign(data) {
	const payload = Buffer.from(
		JSON.stringify({ ...data, exp: Math.floor(Date.now() / 1000) + TTL_MS / 1000 })
	).toString("base64url");
	const msg = `${JWT_HEADER}.${payload}`;
	const sig = crypto.createHmac("sha256", getSecret()).update(msg).digest("base64url");
	return `${msg}.${sig}`;
}

function verify(token) {
	if (!token) return null;
	const parts = token.split(".");
	if (parts.length !== 3) return null;
	const [header, payload, sig] = parts;
	const msg = `${header}.${payload}`;
	const expected = crypto.createHmac("sha256", getSecret()).update(msg).digest("base64url");
	if (!crypto.timingSafeEqual(Buffer.from(sig, "base64url"), Buffer.from(expected, "base64url"))) {
		return null;
	}
	try {
		const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
		if (data.exp && data.exp < Math.floor(Date.now() / 1000)) return null;
		return data;
	} catch {
		return null;
	}
}

export function createToken(adminId) {
	if (!hasSecret()) return null;
	return sign({ sub: adminId });
}

export function verifyToken(token) {
	return verify(token);
}

export function getBearerToken(req) {
	const auth = req.headers["authorization"];
	if (auth && auth.startsWith("Bearer ")) return auth.slice(7).trim();
	return null;
}

export function requireAuth(req) {
	const token = getBearerToken(req);
	if (!token) return { error: "Unauthorized", status: 401 };
	const payload = verifyToken(token);
	if (!payload || !payload.sub) return { error: "Invalid or expired token", status: 401 };
	return { adminId: payload.sub };
}
