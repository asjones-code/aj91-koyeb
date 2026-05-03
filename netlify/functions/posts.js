const { Pool } = require("pg");

let pool = null;

function getPool() {
  if (pool) return pool;
  const url = (process.env.DATABASE_URL || "").trim();
  if (!url) return null;
  pool = new Pool({
    connectionString: url,
    ssl: url.includes("localhost") ? false : { rejectUnauthorized: false },
    max: 3,
  });
  return pool;
}

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

exports.handler = async function (event) {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: CORS, body: "" };
  }
  if (event.httpMethod !== "GET") {
    return { statusCode: 405, headers: CORS, body: JSON.stringify({ error: "Method not allowed." }) };
  }

  const p = getPool();
  if (!p) {
    return {
      statusCode: 503,
      headers: { "Content-Type": "application/json", ...CORS },
      body: JSON.stringify({ error: "Database not configured." }),
    };
  }

  // Single post: /api/posts/some-slug
  const slugMatch = (event.path || "").match(/\/api\/posts\/([^/]+)$/);
  if (slugMatch) {
    const slug = decodeURIComponent(slugMatch[1]);
    try {
      const r = await p.query(
        "SELECT id, slug, title, excerpt, content, created_at, updated_at FROM cms_posts WHERE slug = $1 AND published = true",
        [slug]
      );
      if (r.rows.length === 0) {
        return {
          statusCode: 404,
          headers: { "Content-Type": "application/json", ...CORS },
          body: JSON.stringify({ error: "Post not found." }),
        };
      }
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json", ...CORS },
        body: JSON.stringify({ post: r.rows[0] }),
      };
    } catch (err) {
      console.error("[posts fn] single post:", err);
      return {
        statusCode: 500,
        headers: { "Content-Type": "application/json", ...CORS },
        body: JSON.stringify({ error: "Failed to fetch post." }),
      };
    }
  }

  // List: /api/posts
  try {
    const r = await p.query(
      "SELECT id, slug, title, excerpt, created_at, updated_at FROM cms_posts WHERE published = true ORDER BY created_at DESC"
    );
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json", ...CORS },
      body: JSON.stringify({ posts: r.rows }),
    };
  } catch (err) {
    console.error("[posts fn] list:", err);
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json", ...CORS },
      body: JSON.stringify({ error: "Failed to fetch posts." }),
    };
  }
};
