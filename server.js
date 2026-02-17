/**
 * Optional production server: serves static build and injects OPENAI_API_KEY at runtime
 * so the terminal "ask" command works when the key is set in Koyeb runtime env (not build).
 *
 * Run after build: npm run build && node server.js
 * Set OPENAI_API_KEY in Koyeb environment (runtime).
 */
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(__dirname, "dist");
const PORT = process.env.PORT || 3000;

const app = express();

// Expose key to frontend at runtime (no key in bundle)
app.get("/api/env.js", (req, res) => {
  const key = process.env.OPENAI_API_KEY || "";
  res.setHeader("Content-Type", "application/javascript");
  res.setHeader("Cache-Control", "no-store");
  res.send(`window.__OPENAI_API_KEY=${JSON.stringify(key)};`);
});

app.use(express.static(dist));

app.use((req, res) => {
  res.sendFile(path.join(dist, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Serving on port ${PORT}`);
});
