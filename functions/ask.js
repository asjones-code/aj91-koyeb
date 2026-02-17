/**
 * POST /api/ask — AI assistant that answers using only provided site content.
 * Expects JSON body: { question: string, context: string }
 * Returns JSON: { answer: string }
 * Requires OPENAI_API_KEY in process.env.
 */

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

async function handleAsk(req, res) {
  res.setHeader("Content-Type", "application/json");

  let body = req.body;
  if (typeof req.body === "string") {
    try {
      body = JSON.parse(req.body);
    } catch (e) {
      res.status(400).json({ error: "Invalid JSON body" });
      return;
    }
  }

  const question = body && typeof body.question === "string" ? body.question.trim() : "";
  const context = body && typeof body.context === "string" ? body.context : "";

  if (!question) {
    res.status(400).json({ error: "Missing or empty question" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "Server configuration error. Please try again later." });
    return;
  }

  try {
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({ apiKey });

    const systemContent = (context ? context + "\n\n" : "") + SYSTEM_RULES;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemContent },
        { role: "user", content: question }
      ]
    });

    const message = completion.choices && completion.choices[0] && completion.choices[0].message;
    const answer = message && typeof message.content === "string" ? message.content.trim() : "";

    res.status(200).json({ answer: answer || "I couldn't generate a response. Please try again." });
  } catch (err) {
    if (err.status === 401) {
      res.status(500).json({ error: "Server configuration error. Please try again later." });
      return;
    }
    if (err.code === "ENOTFOUND" || err.code === "ECONNREFUSED") {
      res.status(503).json({ error: "Service temporarily unavailable. Please try again." });
      return;
    }
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}

export async function expressHandler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Content-Type", "application/json");
    res.status(405).json({ error: "Method not allowed" });
    return;
  }
  await handleAsk(req, res);
}

export default expressHandler;

if (typeof module !== "undefined" && module.exports) {
  module.exports = expressHandler;
}
