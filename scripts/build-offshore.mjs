// After Parcel builds Offshore into dist/offshore, copy the files that are served as-is
// (probe.txt now; the service worker and manifest in slice 1b).
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const from = path.join(root, "offshore", "public");
const to = path.join(root, "dist", "offshore");

await fs.mkdir(to, { recursive: true });
await fs.cp(from, to, { recursive: true });
console.log(`[offshore] copied ${(await fs.readdir(from)).join(", ")} to dist/offshore`);
