/**
 * POST /api/ask — AI assistant using only site content. Key stays on server.
 * Body: { question: string }
 * Returns: { answer: string }
 * Requires OPENAI_API_KEY in process.env (Koyeb runtime).
 */

import { OpenAI } from "openai";

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

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
let siteContentCache = null;
let siteContentCacheTime = 0;

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
      const res = await fetch(url, {
        headers: { "User-Agent": "AJ91-Ask/1.0" },
      });
      if (res.ok) {
        const html = await res.text();
        parts.push(extractVisibleText(html));
      }
    } catch {
      // skip failed page
    }
  }
  siteContentCache = parts.filter(Boolean).join("\n\n");
  siteContentCacheTime = Date.now();
  return siteContentCache;
}

function jsonResponse(res, status, data) {
  res.setHeader("Content-Type", "application/json");
  res.status(status).json(data);
}

async function handleAsk(req, res) {
  let body = req.body;
  if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body);
    } catch {
      jsonResponse(res, 400, { error: "Invalid JSON body" });
      return;
    }
  }

  const question = body && typeof body.question === "string" ? body.question.trim() : "";
  if (!question) {
    jsonResponse(res, 400, { error: "Missing or empty question" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    jsonResponse(res, 500, { error: "Server configuration error. Please try again later." });
    return;
  }

  try {
    const baseUrl = process.env.SITE_ORIGIN || (req.protocol + "://" + req.get("host"));
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

    jsonResponse(res, 200, { answer: answer || "I couldn't generate a response. Please try again." });
  } catch (err) {
    if (err.status === 401) {
      jsonResponse(res, 500, { error: "Server configuration error. Please try again later." });
      return;
    }
    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED" || err.code === "ECONNRESET") {
      jsonResponse(res, 503, { error: "Service temporarily unavailable. Please try again." });
      return;
    }
    jsonResponse(res, 500, { error: "Something went wrong. Please try again." });
  }
}

export async function expressHandler(req, res) {
  if (req.method !== "POST") {
    jsonResponse(res, 405, { error: "Method not allowed" });
    return;
  }
  await handleAsk(req, res);
}

export default expressHandler;
