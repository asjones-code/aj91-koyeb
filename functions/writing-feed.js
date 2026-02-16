/**
 * Serverless function to fetch YouTube and GoodGrow feeds with caching.
 * Works with Koyeb, Netlify, Vercel, etc.
 * 
 * Query params:
 *   ?source=youtube - fetch YouTube latest video
 *   ?source=goodgrow - fetch GoodGrow latest project
 */

const YOUTUBE_CHANNEL_ID = "UCy1T4MetuPZMfHj-wGFIWHg";
const GOODGROW_RSS_URL = "https://www.goodgrow.io/projects/rss.xml";
const GOODGROW_PROJECTS_URL = "https://www.goodgrow.io/our-projects";
const CACHE_TTL_SECONDS = 600; // 10 minutes

// Simple in-memory cache (for serverless, consider Redis/Upstash for multi-instance)
const cache = new Map();

function getCacheKey(source) {
  return `writing-feed-${source}`;
}

function getCached(source) {
  const key = getCacheKey(source);
  const cached = cache.get(key);
  if (cached && Date.now() < cached.expiresAt) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCache(source, data) {
  const key = getCacheKey(source);
  cache.set(key, {
    data,
    expiresAt: Date.now() + CACHE_TTL_SECONDS * 1000,
  });
}

async function fetchYouTube() {
  try {
    const rssUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${YOUTUBE_CHANNEL_ID}`;
    const res = await fetch(rssUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WritingFeed/1.0)",
      },
    });
    if (!res.ok) throw new Error(`YouTube RSS failed: ${res.status}`);
    const xml = await res.text();
    // Simple regex-based parsing (works without XML parser)
    const titleMatch = xml.match(/<title[^>]*>([^<]+)<\/title>/i);
    const linkMatch = xml.match(/<link[^>]*href=["']([^"']+)["']/i) || xml.match(/<link[^>]*>([^<]+)<\/link>/i);
    const publishedMatch = xml.match(/<published[^>]*>([^<]+)<\/published>/i) || xml.match(/<pubDate[^>]*>([^<]+)<\/pubDate>/i);
    const descMatch = xml.match(/<media:description[^>]*>([^<]+)<\/media:description>/i) || xml.match(/<summary[^>]*>([^<]+)<\/summary>/i);
    const thumbMatch = xml.match(/<media:thumbnail[^>]*url=["']([^"']+)["']/i);
    const link = (linkMatch?.[1] || "").trim();
    const videoId = link.match(/[?&]v=([^&]+)/)?.[1] || link.split("/").pop();
    const title = (titleMatch?.[1] || "").trim();
    const description = (descMatch?.[1] || "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
    const thumbnail = thumbMatch?.[1] || (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : "");
    return {
      source: "YouTube",
      title: title || "Video",
      excerpt: description.slice(0, 140) || "Latest video",
      url: link.startsWith("http") ? link : `https://www.youtube.com/watch?v=${videoId}`,
      thumbnail,
      publishedAt: (publishedMatch?.[1] || "").trim(),
    };
  } catch (error) {
    console.error("YouTube fetch error:", error);
    return null;
  }
}

async function fetchGoodgrow() {
  try {
    // Get first project URL from RSS
    let projectUrl = null;
    try {
      const rssRes = await fetch(GOODGROW_RSS_URL, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; WritingFeed/1.0)",
        },
      });
      if (rssRes.ok) {
        const xml = await rssRes.text();
        const linkMatch = xml.match(/<link[^>]*>([^<]+)<\/link>/i) || xml.match(/<link[^>]*href=["']([^"']+)["']/i);
        projectUrl = (linkMatch?.[1] || "").trim();
      }
    } catch {
      // Fallback: scrape our-projects page
      const htmlRes = await fetch(GOODGROW_PROJECTS_URL, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; WritingFeed/1.0)",
        },
      });
      if (htmlRes.ok) {
        const html = await htmlRes.text();
        const match = html.match(/href=["']([^"']*\/projects\/[^"']+)["']/i);
        if (match) {
          projectUrl = match[1].startsWith("http") ? match[1] : `https://www.goodgrow.io${match[1]}`;
        }
      }
    }
    if (!projectUrl) return null;
    // Fetch project page
    const pageRes = await fetch(projectUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; WritingFeed/1.0)",
      },
    });
    if (!pageRes.ok) return null;
    const html = await pageRes.text();
    // Extract title from meta tags
    const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
    const twitterTitleMatch = html.match(/<meta\s+name=["']twitter:title["']\s+content=["']([^"']+)["']/i);
    const titleTagMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = (ogTitleMatch?.[1] || twitterTitleMatch?.[1] || titleTagMatch?.[1] || "").trim();
    // Extract first <p> as excerpt
    const firstPMatch = html.match(/<p[^>]*>([^<]+)<\/p>/i);
    const excerpt = (firstPMatch?.[1] || "").replace(/\s+/g, " ").trim().slice(0, 140);
    const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
    return {
      source: "GoodGrow",
      title: title || "Project",
      excerpt: excerpt || "Latest from GoodGrow",
      url: projectUrl,
      thumbnail: ogImageMatch?.[1] || "",
      publishedAt: "",
    };
  } catch (error) {
    console.error("GoodGrow fetch error:", error);
    return null;
  }
}

async function handleRequest(req) {
  let url;
  try {
    url = new URL(req.url || req.originalUrl || "", `http://${req.headers?.host || req.get?.("host") || "localhost"}`);
  } catch {
    url = { searchParams: { get: () => null } };
  }
  const source = url.searchParams?.get?.("source") || req.query?.source;
  if (!source || !["youtube", "goodgrow"].includes(source)) {
    return {
      status: 400,
      body: JSON.stringify({ error: "Invalid source. Use ?source=youtube or ?source=goodgrow" }),
      headers: { "Content-Type": "application/json" },
    };
  }
  // Check cache
  const cached = getCached(source);
  if (cached) {
    return {
      status: 200,
      body: JSON.stringify(cached),
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
        "X-Cache": "HIT",
      },
    };
  }
  // Fetch fresh data
  const data = source === "youtube" ? await fetchYouTube() : await fetchGoodgrow();
  if (!data) {
    return {
      status: 500,
      body: JSON.stringify({ error: "Failed to fetch data" }),
      headers: { "Content-Type": "application/json" },
    };
  }
  // Cache and return
  setCache(source, data);
  return {
    status: 200,
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": `public, max-age=${CACHE_TTL_SECONDS}`,
      "X-Cache": "MISS",
    },
  };
}

// Web API Response format (Cloudflare Workers, Deno, etc.)
export default async function handler(req) {
  const result = await handleRequest(req);
  return new Response(result.body, {
    status: result.status,
    headers: result.headers,
  });
}

// Express/Node.js HTTP format (Koyeb, Vercel, Netlify)
export async function expressHandler(req, res) {
  const result = await handleRequest(req);
  res.status(result.status).set(result.headers).send(result.body);
}

// Koyeb/Node.js runtime compatibility
if (typeof module !== "undefined" && module.exports) {
  module.exports = expressHandler;
  module.exports.default = handler;
}
