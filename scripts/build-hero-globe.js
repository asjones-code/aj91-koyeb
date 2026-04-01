/**
 * Bundles src/hero-globe.js (using three from node_modules) into public/hero-globe.js.
 * Run before parcel so the page loads the bundled file from public/.
 * Resolve esbuild from project root so we use the project's binary (correct arch), not a parent node_modules.
 */
import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const projectRoot = path.join(__dirname, "..");
const esbuild = require(require.resolve("esbuild", { paths: [projectRoot] }));

const outDir = path.join(__dirname, "../public");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

esbuild
  .build({
    entryPoints: [path.join(__dirname, "../src/hero-globe.js")],
    bundle: true,
    format: "esm",
    outfile: path.join(outDir, "hero-globe.js"),
    minify: process.env.NODE_ENV === "production",
    sourcemap: process.env.NODE_ENV !== "production",
    target: ["es2020"],
  })
  .then(() => console.log("hero-globe.js bundled to public/"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
