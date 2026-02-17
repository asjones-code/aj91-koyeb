/**
 * Koyeb (or any Node host): serves static build + POST /api/ask.
 * Run after build: npm run build && npm run serve
 * Set OPENAI_API_KEY and SITE_ORIGIN (e.g. https://your-app.koyeb.app) in env.
 */
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { expressHandler as askHandler } from "./functions/ask.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "dist");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: "1mb" }));

app.post("/api/ask", askHandler);
app.use(express.static(dist));
app.use((req, res) => res.sendFile(path.join(dist, "index.html")));

app.listen(PORT, () => console.log(`Serving on port ${PORT}`));
