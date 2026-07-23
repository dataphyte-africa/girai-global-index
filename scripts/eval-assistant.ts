/**
 * Headless eval harness for the GIRAI assistant.
 *
 * Runs every case in scripts/eval/cases.ts against the real agent — same
 * instructions, same tools, same data as /api/chat — grades the replies
 * deterministically, and writes a CSV alongside a console summary.
 *
 *   pnpm eval:assistant                          # default model
 *   pnpm eval:assistant --model gpt-5-nano       # benchmark another model
 *   pnpm eval:assistant --out results/run.csv --repeat 3
 *
 * Grading is deterministic on purpose: the expected answers are numbers and
 * country names, so a judge model would only add cost and variance. Numeric
 * checks accept 2, 1 or 0 decimal places because the site renders one.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { createGiraiAgent } from "../src/lib/ai/agent";
import { CASES, CONSISTENCY_PAIRS, type Check, type EvalCase } from "./eval/cases";

/**
 * "Error" is not a quality verdict — the generation never completed (rate
 * limit, transport failure). Scoring it as Null would blame the assistant for
 * the API, so it is tallied and excluded from the accuracy denominator.
 */
type Grade = "Full" | "Partial" | "Null" | "Error";

interface CaseResult {
  case: EvalCase;
  run: number;
  answer: string;
  grade: Grade;
  passedChecks: string[];
  failedChecks: string[];
  redFlags: string[];
  toolsUsed: string[];
  latencyMs: number;
  error?: string;
}

// ---------------------------------------------------------------------------
// CLI args

function arg(name: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 && process.argv[i + 1] ? process.argv[i + 1] : fallback;
}

const MODEL = arg("model");
const REPEAT = Number(arg("repeat", "1"));
const CONCURRENCY = Number(arg("concurrency", "4"));
const ONLY = arg("only");
const OUT = resolve(
  arg("out", `results/eval-${(MODEL ?? "default").replace(/[^a-z0-9.-]/gi, "-")}.csv`)!
);

// ---------------------------------------------------------------------------
// Grading

/**
 * Fold accents and curly quotes so "Côte d'Ivoire" matches a check written
 * as "ivoire", and strip markdown emphasis so "**45.9**" matches "45.9".
 */
function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[*_`]/g, "")
    .toLowerCase();
}

function numberVariants(value: number): string[] {
  const variants = [value.toFixed(2), value.toFixed(1)];
  if (Number.isInteger(value)) variants.push(value.toFixed(0));
  return Array.from(new Set(variants));
}

/**
 * `exactNumber` is used for red flags. Rounding makes near-misses collide —
 * a wrong 45.87 and a right 45.93 both render as "45.9" — so a red flag only
 * fires on the wrong value spelled out in full, never on a rounded form that
 * the correct answer would also produce.
 */
function checkPasses(check: Check, answer: string, exactNumber = false): boolean {
  if (check.kind === "text") {
    return check.any.some((s) => answer.includes(normalize(s)));
  }
  if (check.kind === "regex") {
    return new RegExp(check.pattern, "i").test(answer);
  }
  const variants = exactNumber
    ? [check.value.toFixed(2)]
    : numberVariants(check.value);
  // Digits either side would mean we matched a fragment of a longer number.
  return variants.some((v) =>
    new RegExp(`(?<![\\d.])${v.replace(".", "\\.")}(?![\\d])`).test(answer)
  );
}

function grade(testCase: EvalCase, rawAnswer: string) {
  const answer = normalize(rawAnswer);
  const passedChecks: string[] = [];
  const failedChecks: string[] = [];
  for (const check of testCase.must) {
    (checkPasses(check, answer) ? passedChecks : failedChecks).push(check.label);
  }
  const redFlags = testCase.forbid
    .filter((check) => checkPasses(check, answer, true))
    .map((check) => check.label);

  let verdict: Grade;
  if (redFlags.length > 0 || passedChecks.length === 0) verdict = "Null";
  else if (failedChecks.length === 0) verdict = "Full";
  else verdict = "Partial";

  return { grade: verdict, passedChecks, failedChecks, redFlags };
}

// ---------------------------------------------------------------------------
// Runner

async function runCase(
  agent: ReturnType<typeof createGiraiAgent>,
  testCase: EvalCase,
  run: number
): Promise<CaseResult> {
  const started = Date.now();
  let lastError = "";

  // Transient 429s and stream hiccups are common enough that a single attempt
  // would report model flakiness as an assistant failure.
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const result = await agent.generate({ prompt: testCase.prompt });
      const toolsUsed = result.steps
        .flatMap((step) => step.toolCalls ?? [])
        .map((call) => call.toolName);
      const answer = result.text.trim();
      return {
        case: testCase,
        run,
        answer,
        ...grade(testCase, answer),
        toolsUsed: Array.from(new Set(toolsUsed)),
        latencyMs: Date.now() - started,
      };
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error);
      // A bad model id fails identically on every retry — surface it at once
      // rather than burning three attempts per case on a typo.
      if (/does not exist|model_not_found|invalid.*model/i.test(lastError)) break;
      // Rate limits need real backoff, not the 2s a transport blip wants.
      const rateLimited = /rate limit|429/i.test(lastError);
      if (attempt < 3) {
        await new Promise((r) =>
          setTimeout(r, (rateLimited ? 20000 : 2000) * attempt)
        );
      }
    }
  }

  return {
    case: testCase,
    run,
    answer: "",
    grade: "Error",
    passedChecks: [],
    failedChecks: testCase.must.map((c) => c.label),
    redFlags: [],
    toolsUsed: [],
    latencyMs: Date.now() - started,
    error: lastError,
  };
}

async function mapWithConcurrency<T, R>(
  items: T[],
  limit: number,
  fn: (item: T, index: number) => Promise<R>
): Promise<R[]> {
  const results = new Array<R>(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const index = cursor++;
        results[index] = await fn(items[index], index);
      }
    })
  );
  return results;
}

// ---------------------------------------------------------------------------
// Output

function csvCell(value: string | number): string {
  const s = String(value ?? "");
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(results: CaseResult[], model: string): string {
  const header = [
    "Prompt",
    "Expected Answer",
    "Difficulty",
    "Test Type",
    "Model",
    "Run",
    "Bot Answer",
    "Accuracy (Full / Partial / Null)",
    "Checks Passed",
    "Failed Checks",
    "Red Flags",
    "Tools Used",
    "Latency (ms)",
    "Observations",
  ];
  const rows = results.map((r) => [
    r.case.prompt,
    r.case.expected,
    r.case.difficulty,
    r.case.testType,
    model,
    r.run,
    r.answer,
    r.grade,
    `${r.passedChecks.length}/${r.case.must.length}`,
    r.failedChecks.join("; "),
    r.redFlags.join("; "),
    r.toolsUsed.join("; "),
    r.latencyMs,
    r.error ? `ERROR: ${r.error}` : (r.case.notes ?? ""),
  ]);
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
}

// ---------------------------------------------------------------------------

async function main() {
  if (!process.env.OPENAI_API_KEY) {
    console.error("OPENAI_API_KEY is not set — run via `pnpm eval:assistant`.");
    process.exit(1);
  }

  const agent = createGiraiAgent(MODEL ? { model: MODEL } : {});
  const modelLabel = MODEL ?? "default (gpt-5.1)";
  const selected = ONLY ? CASES.filter((c) => c.id.includes(ONLY)) : CASES;

  const jobs = selected.flatMap((testCase) =>
    Array.from({ length: REPEAT }, (_, i) => ({ testCase, run: i + 1 }))
  );

  console.log(
    `Running ${jobs.length} generation(s) — ${selected.length} case(s) × ${REPEAT} run(s) on ${modelLabel}\n`
  );

  const results = await mapWithConcurrency(jobs, CONCURRENCY, async (job) => {
    const result = await runCase(agent, job.testCase, job.run);
    const mark = result.grade === "Full" ? "PASS" : result.grade === "Partial" ? "PART" : "FAIL";
    console.log(
      `  ${mark}  ${job.testCase.id}${REPEAT > 1 ? ` #${job.run}` : ""} ` +
        `(${result.passedChecks.length}/${job.testCase.must.length}, ${result.latencyMs}ms)` +
        (result.failedChecks.length ? `  missing: ${result.failedChecks.join(", ")}` : "") +
        (result.redFlags.length ? `  RED FLAG: ${result.redFlags.join(", ")}` : "")
    );
    return result;
  });

  results.sort(
    (a, b) =>
      selected.indexOf(a.case) - selected.indexOf(b.case) || a.run - b.run
  );

  const tally = { Full: 0, Partial: 0, Null: 0, Error: 0 };
  for (const r of results) tally[r.grade]++;
  const total = results.length;
  const scored = total - tally.Error;
  const pct = (n: number) =>
    scored ? `${((n / scored) * 100).toFixed(1)}%` : "n/a";

  console.log(`\nModel: ${modelLabel}`);
  console.log(`  Full    ${tally.Full}\t${pct(tally.Full)}`);
  console.log(`  Partial ${tally.Partial}\t${pct(tally.Partial)}`);
  console.log(`  Null    ${tally.Null}\t${pct(tally.Null)}`);
  console.log(`  Scored  ${scored} of ${total}`);
  if (tally.Error) {
    console.log(`  Error   ${tally.Error}\t(API failures, excluded from accuracy)`);
  }

  for (const [a, b] of CONSISTENCY_PAIRS) {
    const left = results.filter((r) => r.case.id === a);
    const right = results.filter((r) => r.case.id === b);
    if (!left.length || !right.length) continue;
    const consistent = left.every((l, i) => right[i] && l.grade === right[i].grade);
    console.log(`  Consistency ${a} ↔ ${b}: ${consistent ? "OK" : "MISMATCH"}`);
  }

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, toCsv(results, modelLabel), "utf8");
  console.log(`\nWrote ${OUT}`);

  if (tally.Full < scored || tally.Error) process.exitCode = 1;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
