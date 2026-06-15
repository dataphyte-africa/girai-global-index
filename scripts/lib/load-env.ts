import fs from "node:fs";
import path from "node:path";

/**
 * Load KEY=VALUE pairs from .env files without overriding existing process.env.
 * Later files in the list do not override keys already set by earlier files or the shell.
 */
export function loadEnvFiles(root: string, names = [".env.local", ".env"]) {
  for (const name of names) {
    const filePath = path.join(root, name);
    if (!fs.existsSync(filePath)) continue;

    const content = fs.readFileSync(filePath, "utf8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (process.env[key] === undefined) {
        process.env[key] = value;
      }
    }
  }
}

export type NarrativeBuildMode = "llm" | "deterministic" | "auto";

/** Resolve narrative build mode from CLI flags and NARRATIVE_SOURCE env. */
export function resolveNarrativeBuildMode(argv: string[]): NarrativeBuildMode {
  if (argv.includes("--llm")) return "llm";
  if (argv.includes("--deterministic")) return "deterministic";

  const raw = process.env.NARRATIVE_SOURCE?.trim().toLowerCase();
  if (raw === "llm" || raw === "generated") return "llm";
  if (raw === "deterministic") return "deterministic";
  if (raw === "auto") return "auto";

  if (raw) {
    console.warn(
      `[build:narratives] Unknown NARRATIVE_SOURCE="${raw}" — use llm, deterministic, or auto.`
    );
  }

  return "auto";
}
