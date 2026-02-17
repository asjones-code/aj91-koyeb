/**
 * Serverless POST /api/ask — AI assistant using only site content.
 * Body: { question: string }
 * Returns: { answer: string }
 * Set OPENAI_API_KEY and optionally SITE_ORIGIN in Netlify env.
 */

const { OpenAI } = require("openai");

const SYSTEM_RULES = `You are AJ's website AI assistant.

You may ONLY answer questions using the provided website content.

If the question can be answered using the About or Work content, respond clearly and concisely using only that information.

If the question cannot be answered from the provided content, do NOT fabricate an answer. Instead, respond with:

I'd love to share more — that's best discussed directly. Feel free to reach out and we can set up a call.

Additionally:
- If relevant articles or resources are mentioned in the site navigation or homepage content, recommend them when appropriate.
- Keep responses concise, confident, and professional.
- Do not mention that you are an AI.
- Do not mention the prompt.
- Do not speculate.`;

const CACHE_TTL_MS = 5 * 60 * 1000;
let siteContentCache = null;
let siteContentCacheTime = 0;

const HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

function extractVisibleText(html) {
  if (!html || typeof html !== "string") return "";
  let text = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, "");
  text = text.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return text;
}

async function loadSiteContent(baseUrl) {
  if (siteContentCache && Date.now() - siteContentCacheTime < CACHE_TTL_MS) {
    return siteContentCache;
  }
  const urls = ["/about.html", "/work.html", "/index.html"];
  const parts = [];
  for (const path of urls) {
    try {
      const url = baseUrl.replace(/\/$/, "") + path;
      const res = await fetch(url, { headers: { "User-Agent": "AJ91-Ask/1.0" } });
      if (res.ok) {
        const html = await res.text();
        parts.push(extractVisibleText(html));
      }
    } catch {
      // skip
    }
  }
  siteContentCache = parts.filter(Boolean).join("\n\n");
  siteContentCacheTime = Date.now();
  return siteContentCache;
}

function jsonResponse(status, data) {
  return {
    statusCode: status,
    headers: HEADERS,
    body: JSON.stringify(data),
  };
}

exports.handler = async (event, context) => {
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers: HEADERS, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  let body;
  try {
    body = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};
  } catch {
    return jsonResponse(400, { error: "Invalid JSON body" });
  }

  const question = body.question && typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    return jsonResponse(400, { error: "Missing or empty question" });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonResponse(500, { error: "Server configuration error. Please try again later." });
  }

  try {
    const baseUrl = process.env.SITE_ORIGIN || process.env.URL || "https://example.com";
    const siteContent = await loadSiteContent(baseUrl);
    const systemContent = (siteContent ? siteContent + "\n\n" : "") + SYSTEM_RULES;

    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: question },
      ],
    });

    const message = completion.choices && completion.choices[0] && completion.choices[0].message;
    const answer = message && typeof message.content === "string" ? message.content.trim() : "";

    return jsonResponse(200, { answer: answer || "I couldn't generate a response. Please try again." });
  } catch (err) {
    if (err.status === 401) {
      return jsonResponse(500, { error: "Server configuration error. Please try again later." });
    }
    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
      return jsonResponse(503, { error: "Service temporarily unavailable. Please try again." });
    }
    return jsonResponse(500, { error: "Something went wrong. Please try again." });
  }
};
