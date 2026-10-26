/**
 * Keeps the public 2026 dataset download identical to the dataset the site is
 * built from.
 *
 *   Source: src/data/2026/GIRAI_dataset.xlsx
 *   Target: public/downloads/GIRAI_2026_dataset.xlsx  (served at DATASET_2026_PUBLIC_PATH)
 *
 * Run:  pnpm sync:downloads   copy source -> target if missing or different
 *       pnpm check:downloads  fail (non-zero exit) if missing or different; never copies
 *
 * `--target=<path>` overrides the target file (for testing the check).
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { DATASET_2026_PUBLIC_PATH } from "../src/lib/data-download/config";

const ROOT = path.resolve(__dirname, "..");
const SOURCE = path.join(ROOT, "src/data/2026/GIRAI_dataset.xlsx");

const args = process.argv.slice(2);
const checkOnly = args.includes("--check");
const targetArg = args.find((a) => a.startsWith("--target="));
const TARGET = targetArg
  ? path.resolve(targetArg.slice("--target=".length))
  : path.join(ROOT, "public", DATASET_2026_PUBLIC_PATH);

function sha256(file: string): string | null {
  if (!fs.existsSync(file)) return null;
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

const rel = (p: string) => path.relative(ROOT, p) || p;

function main() {
  const sourceHash = sha256(SOURCE);
  if (!sourceHash) throw new Error(`Source dataset not found: ${rel(SOURCE)}`);

  let targetHash = sha256(TARGET);

  if (targetHash !== sourceHash) {
    if (checkOnly) {
      const problem = targetHash ? `differs from ${rel(SOURCE)}` : "is missing";
      console.error(
        `[downloads] ${rel(TARGET)} ${problem}. Run \`pnpm sync:downloads\` and commit the result.`
      );
      process.exit(1);
    }
    fs.mkdirSync(path.dirname(TARGET), { recursive: true });
    fs.copyFileSync(SOURCE, TARGET);
    console.log(
      `[downloads] Copied ${rel(SOURCE)} -> ${rel(TARGET)} (target ${targetHash ? "was out of date" : "was missing"})`
    );
    targetHash = sha256(TARGET);
    if (targetHash !== sourceHash) {
      throw new Error(`[downloads] ${rel(TARGET)} still differs from ${rel(SOURCE)} after copy`);
    }
  }

  const size = fs.statSync(TARGET).size;
  console.log(`[downloads] ${rel(TARGET)} in sync (sha256 ${sourceHash}, ${size} bytes)`);
}

main();
