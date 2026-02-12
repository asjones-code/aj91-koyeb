/**
 * Bundles src/hero-globe.js (using three from node_modules) into public/hero-globe.js.
 * Run before parcel so the page loads the bundled file from public/.
 * Resolve esbuild from project root so we use the project's binary (correct arch), not a parent node_modules.
 */
const path = require("path");
const projectRoot = path.join(__dirname, "..");
const esbuild = require(require.resolve("esbuild", { paths: [projectRoot] }));

esbuild
  .build({
    entryPoints: [path.join(__dirname, "../src/hero-globe.js")],
    bundle: true,
    format: "esm",
    outfile: path.join(__dirname, "../public/hero-globe.js"),
    minify: process.env.NODE_ENV === "production",
    sourcemap: process.env.NODE_ENV !== "production",
    target: ["es2020"],
  })
  .then(() => console.log("hero-globe.js bundled to public/"))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
