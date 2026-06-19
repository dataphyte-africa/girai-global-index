/**
 * Build-time data pipeline. Reads the 2026 GIRAI xlsx workbooks, validates
 * with Zod, and emits typed JSON artifacts.
 *
 * Outputs:
 *   src/data/2026/generated/taxonomy.json
 *   src/data/2026/generated/countries.json
 *   src/data/2026/generated/rankings.json
 *   src/data/2026/generated/country-edition-evidence-status.json
 *   public/data/2026/evidence.json
 *   public/data/2026/indicator-adoption.json
 *   public/data/2026/country-pillar-highlights.json
 *   public/data/2026/csv/{frameworks,initiatives,cse_initiatives,gmc_cse,urai,all_evidences,ranking_and_scores}.csv
 *   public/data/2026/csv/link-template.csv
 *
 * Run:  pnpm build:data
 */

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import * as XLSX from "xlsx";
import { z } from "zod";
import {
  DIMENSIONS,
  PILLARS,
  INDICATORS,
  findIndicator,
  findDimension,
  findPillar,
  type DimensionSlug,
  type PillarSlug,
} from "../src/data/2026/taxonomy.js";
import { buildEditionComparisonArtifact } from "./build-edition-comparison.js";

// ---------------------------------------------------------------------------
// Paths

const ROOT = path.resolve(__dirname, "..");
const SRC_DIR = path.join(ROOT, "src/data/2026");
const OUT_GENERATED = path.join(ROOT, "src/data/2026/generated");
const OUT_PUBLIC = path.join(ROOT, "public/data/2026");
const OUT_CSV = path.join(OUT_PUBLIC, "csv");

const DATASET_FILE = path.join(SRC_DIR, "GIRAI_dataset.xlsx");
const SCORING_FILE = path.join(SRC_DIR, "scoring_output.xlsx");
const DICTIONARY_FILE = path.join(SRC_DIR, "GIRAI_dataset_data_dictionary.xlsx");

// ---------------------------------------------------------------------------
// Helpers

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function readSheet(file: string, sheetName: string): Record<string, unknown>[] {
  const wb = XLSX.readFile(file, { cellDates: false });
  const sheet = wb.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in ${path.basename(file)}`);
  }
  return XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });
}

/**
 * Read a sheet with a 2-row merged header (e.g. `ranking_and_scores`).
 * Row 1 carries section labels with merged cells; row 2 carries the real
 * column names. We pick whichever row supplies a non-empty value for each
 * column, with row 2 taking precedence.
 */
function readSheetMergedHeader(file: string, sheetName: string): Record<string, unknown>[] {
  const wb = XLSX.readFile(file, { cellDates: false });
  const sheet = wb.Sheets[sheetName];
  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found in ${path.basename(file)}`);
  }
  const matrix = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1, defval: "" });
  if (matrix.length < 3) return [];
  const top = matrix[0].map((v) => String(v ?? "").trim());
  const sub = matrix[1].map((v) => String(v ?? "").trim());
  const headers = top.map((t, i) => sub[i] || t);
  // Disambiguate empty/duplicate headers.
  const seen = new Map<string, number>();
  for (let i = 0; i < headers.length; i++) {
    const h = headers[i] || `col_${i}`;
    const n = (seen.get(h) ?? 0) + 1;
    seen.set(h, n);
    headers[i] = n === 1 ? h : `${h}__${n}`;
  }
  return matrix.slice(2).map((row) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((h, i) => (obj[h] = row[i] ?? ""));
    return obj;
  });
}

function sha256OfFiles(files: string[]): string {
  const hash = crypto.createHash("sha256");
  for (const f of files) hash.update(fs.readFileSync(f));
  return hash.digest("hex");
}

function writeJson(file: string, data: unknown) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

function writeCsv(file: string, rows: Record<string, unknown>[]) {
  ensureDir(path.dirname(file));
  const ws = XLSX.utils.json_to_sheet(rows);
  fs.writeFileSync(file, XLSX.utils.sheet_to_csv(ws));
}

/** Coerce raw cell to number or null. */
function num(v: unknown): number | null {
  if (v === null || v === undefined || v === "" || v === "n/a" || v === "N/A") return null;
  const n = typeof v === "number" ? v : parseFloat(String(v));
  return Number.isFinite(n) ? n : null;
}

/** Coerce raw cell to trimmed string or null. */
function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" || s === "n/a" || s === "N/A" ? null : s;
}

/**
 * Convert Excel serial date to ISO 8601 (yyyy-mm-dd). Excel epoch is
 * 1899-12-30 (accounting for the 1900 leap-year bug). Returns the raw
 * value untouched if it doesn't look like a serial date.
 */
function excelDateToIso(v: unknown): string | null {
  const s = str(v);
  if (!s) return null;
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s; // already ISO
  const n = Number(s);
  if (!Number.isFinite(n) || n < 10000 || n > 80000) return s;
  const ms = (n - 25569) * 86400 * 1000; // 25569 = days between 1899-12-30 and 1970-01-01
  const d = new Date(ms);
  if (Number.isNaN(d.getTime())) return s;
  return d.toISOString().slice(0, 10);
}

/** Coerce to non-null string (returns empty string for null). */
function strOr(v: unknown, fallback = ""): string {
  return str(v) ?? fallback;
}

// ---------------------------------------------------------------------------
// Provenance

const SOURCE_HASH = sha256OfFiles([DATASET_FILE, SCORING_FILE, DICTIONARY_FILE]);
const GENERATED_AT = new Date().toISOString();
const PROVENANCE = { generatedAt: GENERATED_AT, sourceHash: SOURCE_HASH };

console.log(`[build-data] generatedAt=${GENERATED_AT}`);
console.log(`[build-data] sourceHash=${SOURCE_HASH.slice(0, 16)}…`);

// ---------------------------------------------------------------------------
// 1. Taxonomy → JSON

const taxonomyJson = {
  ...PROVENANCE,
  dimensions: DIMENSIONS,
  pillars: PILLARS,
  indicators: INDICATORS,
};
writeJson(path.join(OUT_GENERATED, "taxonomy.json"), taxonomyJson);
console.log(`[build-data] wrote taxonomy.json (${INDICATORS.length} indicators)`);

// ---------------------------------------------------------------------------
// 2. Countries + Rankings

const RankingRow = z.object({
  ranking: z.coerce.number().nullable().optional(),
  iso3: z.string().min(3).max(3),
  country: z.string(),
  region: z.string(),
  subregion: z.string(),
  developing: z.string(),
  WB_region: z.string(),
  WB_income_group: z.string(),
  GDP_per_capita_PPP: z.union([z.number(), z.string()]).nullable().optional(),
  girai: z.coerce.number().nullable().optional(),
  girai_raw: z.coerce.number().nullable().optional(),
  urai_penalty: z.coerce.number().nullable().optional(),
});

const rankingRowsRaw = readSheetMergedHeader(SCORING_FILE, "ranking_and_scores").filter((r) =>
  str(r["iso3"])
);

const allIndicatorsRows = readSheet(SCORING_FILE, "all_indicators").filter((r) =>
  str(r["iso3"])
);

// Build per-country indicator score map keyed by ISO3.
const indicatorScoresByIso = new Map<string, Record<string, number | null>>();
for (const row of allIndicatorsRows) {
  const iso3 = str(row["iso3"])!;
  const scores: Record<string, number | null> = {};
  for (const ind of INDICATORS) {
    // Try every alias to find the column in this sheet.
    let val: number | null = null;
    for (const alias of [ind.name, ...ind.aliases]) {
      if (alias in row) {
        val = num(row[alias]);
        break;
      }
    }
    scores[ind.slug] = val;
  }
  indicatorScoresByIso.set(iso3, scores);
}

// Build dim×pillar matrix from pillar_scores_by_dimension.
const pillarByDimRows = readSheet(SCORING_FILE, "pillar_scores_by_dimension").filter((r) =>
  str(r["iso3"])
);
const dimPillarMatrixByIso = new Map<
  string,
  Record<DimensionSlug, Record<PillarSlug, number | null>>
>();
for (const row of pillarByDimRows) {
  const iso3 = str(row["iso3"])!;
  const matrix = {} as Record<DimensionSlug, Record<PillarSlug, number | null>>;
  for (const dim of DIMENSIONS) {
    matrix[dim.slug] = { "ai-policy": null, "cso-engagement": null, "enabling-conditions": null };
    for (const pillar of PILLARS) {
      // Column header pattern: "{Pillar} in {Dimension} (0-100)"
      const candidates = [
        `${pillar.name} in ${dim.name} (0-100)`,
        ...dim.aliases.flatMap((da) =>
          pillar.aliases.map((pa) => `${pa} in ${da} (0-100)`)
        ),
      ];
      for (const key of candidates) {
        if (key in row) {
          matrix[dim.slug][pillar.slug] = num(row[key]);
          break;
        }
      }
    }
  }
  dimPillarMatrixByIso.set(iso3, matrix);
}

// Evidence counts per (country, indicator) and per country (for URAI).
const allEvidencesRows = readSheet(DATASET_FILE, "all_evidences");
type EvCounts = { fr: number; init: number; cse: number };
const evCountsByIsoIndicator = new Map<string, EvCounts>();
const uraiCountByIso = new Map<string, number>();
for (const row of allEvidencesRows) {
  const iso3 = str(row["ISO3"]);
  const indicatorName = str(row["indicator"]);
  if (!iso3 || !indicatorName) continue;
  const ind = findIndicator(indicatorName);
  if (!ind) {
    throw new Error(
      `Unknown indicator in all_evidences: ${JSON.stringify(indicatorName)} (country=${iso3}). ` +
        `Add it as an alias in src/data/2026/taxonomy.ts.`
    );
  }
  const key = `${iso3}::${ind.slug}`;
  const fr = num(row["fr_counts"]) ?? 0;
  const init = num(row["init_counts"]) ?? 0;
  const cse = num(row["cse_counts"]) ?? 0;
  const urai = num(row["urai_counts"]) ?? 0;
  evCountsByIsoIndicator.set(key, { fr, init, cse });
  if (urai > 0) uraiCountByIso.set(iso3, urai);
}

// Region / income / global aggregates.
function average(xs: (number | null)[]): number | null {
  const ys = xs.filter((x): x is number => x !== null && Number.isFinite(x));
  if (ys.length === 0) return null;
  return ys.reduce((a, b) => a + b, 0) / ys.length;
}

const countriesArr = rankingRowsRaw.map((row) => {
  const parsed = RankingRow.parse(row);
  const iso3 = parsed.iso3;
  const indicatorScores = indicatorScoresByIso.get(iso3) ?? {};
  const dimPillarMatrix = dimPillarMatrixByIso.get(iso3) ?? {};

  // Dimension/pillar scores from the wide sheet.
  const dimensionScores: Record<DimensionSlug, number | null> = {
    "inclusion-diversity": num(row["Inclusion and Diversity (0-100)"]),
    "ethics-sustainability": num(row["Ethics and Sustainability (0-100)"]),
    "labour-skills": num(row["Labour and Skills (0-100)"]),
    "trust-safety": num(row["Trust and Safety (0-100)"]),
    "ai-use-public-service": num(row["AI Use in Public Service (0-100)"]),
  };
  const pillarScores: Record<PillarSlug, number | null> = {
    "ai-policy": num(row["AI Policy (0-100)"]),
    "cso-engagement": num(row["CSO Engagement (0-100)"]),
    "enabling-conditions": num(row["Enabling Conditions (0-100)"]),
  };

  // Per-indicator evidence counts.
  const evidenceCounts: Record<string, EvCounts> = {};
  for (const ind of INDICATORS) {
    const c = evCountsByIsoIndicator.get(`${iso3}::${ind.slug}`);
    if (c) evidenceCounts[ind.slug] = c;
  }

  return {
    iso3,
    name: parsed.country,
    region: parsed.region,
    subregion: parsed.subregion,
    developing: parsed.developing,
    wbRegion: parsed.WB_region,
    incomeGroup: parsed.WB_income_group,
    gdpPerCapitaPpp: num(row["GDP_per_capita_PPP"] ?? row["GDP per capita PPP"]),

    girai: parsed.girai ?? null,
    giraiRaw: parsed.girai_raw ?? null,
    uraiPenalty: parsed.urai_penalty ?? null,
    uraiCount: uraiCountByIso.get(iso3) ?? 0,
    rankGlobal: parsed.ranking ?? null,

    dimensionScores,
    pillarScores,
    dimPillarMatrix,
    indicatorScores,
    evidenceCounts,
  };
});

// ---------------------------------------------------------------------------
// Derived AI-Policy sub-scores: Framework + Implementation.
//
// The dataset publishes pillar-level scores (AI Policy / CSO Engagement /
// Enabling Conditions) but not the two informal halves of AI Policy that
// the country-overview surface wants to display side-by-side:
//
//   • Framework score      → how thoroughly the country's documented
//     frameworks cover indicator substance. Mean of every thematic-element
//     rating attached to the country's frameworks on AI Policy indicators
//     (Yes=100, Partially=50, No=0).
//
//   • Implementation score → how concretely the policy is being executed.
//     50% mean of `plan`/`budget`/`monitoring` flags across the country's
//     frameworks (Yes/Partially/No → 100/50/0); 50% initiative coverage —
//     share of the country's AI Policy indicators with at least one
//     initiative on file.
//
// These are *display-only* aggregates, not part of the official GIRAI
// methodology. If GIRAI ever publishes its own decomposition, replace
// these formulas with the official numbers.

function ynpToScore(v: string | null | undefined): number | null {
  if (!v) return null;
  const s = v.trim().toLowerCase();
  if (s === "yes") return 100;
  if (s === "partially" || s === "partial") return 50;
  if (s === "no") return 0;
  return null;
}

const AI_POLICY_INDICATORS = INDICATORS.filter((i) => i.pillar === "ai-policy");
const AI_POLICY_INDICATOR_NAMES = new Set(
  AI_POLICY_INDICATORS.flatMap((i) => [i.name, ...i.aliases])
);

const _frameworksRows = readSheet(DATASET_FILE, "frameworks");
const _thematicRows = readSheet(DATASET_FILE, "thematic_coverage");
const _initiativesRows = readSheet(DATASET_FILE, "initiatives");

const _thematicByKey = new Map<string, (string | null)[]>();
for (const row of _thematicRows) {
  const ik = str(row["interview_key"]);
  const source = str(row["source"]);
  if (!ik || !source) continue;
  const values: (string | null)[] = [];
  for (let i = 1; i <= 4; i++) values.push(str(row[`element${i}_value`]));
  _thematicByKey.set(`${ik}::${source}`, values);
}

{
  const thematicSamples = new Map<string, number[]>();
  const execSamples = new Map<string, number[]>();
  const indicatorsWithInit = new Map<string, Set<string>>();

  const pushVal = (map: Map<string, number[]>, iso3: string, v: number) => {
    if (!map.has(iso3)) map.set(iso3, []);
    map.get(iso3)!.push(v);
  };

  for (const row of _frameworksRows) {
    const ik = str(row["interview_key"]);
    const iso3 = str(row["ISO3"]);
    const indicatorName = str(row["indicator"]);
    if (!ik || !iso3 || !indicatorName) continue;
    if (!AI_POLICY_INDICATOR_NAMES.has(indicatorName)) continue;

    for (const slot of [1, 2] as const) {
      const title = str(row[`fr${slot}_title`]);
      if (!title) continue;
      const thematic = _thematicByKey.get(`${ik}::fr${slot}`) ?? [];
      for (const v of thematic) {
        const s = ynpToScore(v);
        if (s !== null) pushVal(thematicSamples, iso3, s);
      }
      for (const field of ["plan", "budget", "monitoring"] as const) {
        const s = ynpToScore(str(row[`fr${slot}_${field}`]));
        if (s !== null) pushVal(execSamples, iso3, s);
      }
    }
  }

  for (const row of _initiativesRows) {
    const iso3 = str(row["ISO3"]);
    const indicatorName = str(row["indicator"]);
    if (!iso3 || !indicatorName) continue;
    if (!AI_POLICY_INDICATOR_NAMES.has(indicatorName)) continue;
    const ind = findIndicator(indicatorName);
    if (!ind) continue;
    let hasInit = false;
    outer: for (const body of [1, 2] as const) {
      for (const item of [1, 2, 3] as const) {
        if (str(row[`init${body}_name${item}`])) {
          hasInit = true;
          break outer;
        }
      }
    }
    if (!hasInit) continue;
    if (!indicatorsWithInit.has(iso3)) indicatorsWithInit.set(iso3, new Set());
    indicatorsWithInit.get(iso3)!.add(ind.slug);
  }

  const aiPolicyCount = AI_POLICY_INDICATORS.length;
  for (const c of countriesArr) {
    const iso3 = c.iso3;
    const them = thematicSamples.get(iso3) ?? [];
    const exec = execSamples.get(iso3) ?? [];
    const initSet = indicatorsWithInit.get(iso3) ?? new Set<string>();

    const framework =
      them.length > 0 ? them.reduce((a, b) => a + b, 0) / them.length : null;
    const execMean =
      exec.length > 0 ? exec.reduce((a, b) => a + b, 0) / exec.length : null;
    const coverage = aiPolicyCount > 0 ? (initSet.size / aiPolicyCount) * 100 : null;

    let impl: number | null;
    if (execMean === null && coverage === null) impl = null;
    else if (execMean === null) impl = coverage;
    else if (coverage === null) impl = execMean;
    else impl = 0.5 * execMean + 0.5 * coverage;

    (c as unknown as { frameworkScore: number | null }).frameworkScore = framework;
    (c as unknown as { implementationScore: number | null }).implementationScore = impl;
  }
}

// Compute regional / income / global aggregates and per-country ranks.
function buildRanks(values: { iso3: string; v: number | null }[]) {
  // Higher score = better rank (1). Nulls go to last (no rank).
  const sorted = [...values]
    .filter((x) => x.v !== null)
    .sort((a, b) => (b.v as number) - (a.v as number));
  const ranks = new Map<string, number>();
  let lastVal: number | null = null;
  let lastRank = 0;
  sorted.forEach((x, i) => {
    if (x.v !== lastVal) lastRank = i + 1;
    ranks.set(x.iso3, lastRank);
    lastVal = x.v;
  });
  return ranks;
}

// Global ranks per dimension and per pillar.
const globalDimRanks: Record<DimensionSlug, Map<string, number>> = {} as never;
for (const dim of DIMENSIONS) {
  globalDimRanks[dim.slug] = buildRanks(
    countriesArr.map((c) => ({ iso3: c.iso3, v: c.dimensionScores[dim.slug] }))
  );
}
const globalPillarRanks: Record<PillarSlug, Map<string, number>> = {} as never;
for (const pillar of PILLARS) {
  globalPillarRanks[pillar.slug] = buildRanks(
    countriesArr.map((c) => ({ iso3: c.iso3, v: c.pillarScores[pillar.slug] }))
  );
}

// Group ranks (regional, income).
function groupRanks<K extends string>(getKey: (c: (typeof countriesArr)[number]) => K) {
  const buckets = new Map<K, typeof countriesArr>();
  for (const c of countriesArr) {
    const k = getKey(c);
    if (!buckets.has(k)) buckets.set(k, []);
    buckets.get(k)!.push(c);
  }
  return buckets;
}

const byRegion = groupRanks((c) => c.region);
const byIncome = groupRanks((c) => c.incomeGroup);

const regionalGiraiRank = new Map<string, number>();
const incomeGiraiRank = new Map<string, number>();

for (const [, group] of byRegion) {
  const ranks = buildRanks(group.map((c) => ({ iso3: c.iso3, v: c.girai })));
  for (const [iso3, r] of ranks) regionalGiraiRank.set(iso3, r);
}
for (const [, group] of byIncome) {
  const ranks = buildRanks(group.map((c) => ({ iso3: c.iso3, v: c.girai })));
  for (const [iso3, r] of ranks) incomeGiraiRank.set(iso3, r);
}

// Per-dimension regional ranks.
const regionalDimRanks: Record<DimensionSlug, Map<string, number>> = {} as never;
for (const dim of DIMENSIONS) {
  regionalDimRanks[dim.slug] = new Map();
  for (const [, group] of byRegion) {
    const ranks = buildRanks(
      group.map((c) => ({ iso3: c.iso3, v: c.dimensionScores[dim.slug] }))
    );
    for (const [iso3, r] of ranks) regionalDimRanks[dim.slug].set(iso3, r);
  }
}

// Per-pillar regional ranks.
const regionalPillarRanks: Record<PillarSlug, Map<string, number>> = {} as never;
for (const pillar of PILLARS) {
  regionalPillarRanks[pillar.slug] = new Map();
  for (const [, group] of byRegion) {
    const ranks = buildRanks(
      group.map((c) => ({ iso3: c.iso3, v: c.pillarScores[pillar.slug] }))
    );
    for (const [iso3, r] of ranks) regionalPillarRanks[pillar.slug].set(iso3, r);
  }
}

// Framework / Implementation ranks (global + regional).
type WithDerived = (typeof countriesArr)[number] & {
  frameworkScore: number | null;
  implementationScore: number | null;
};
const countriesWithDerived = countriesArr as WithDerived[];
const globalFrameworkRanks = buildRanks(
  countriesWithDerived.map((c) => ({ iso3: c.iso3, v: c.frameworkScore }))
);
const globalImplementationRanks = buildRanks(
  countriesWithDerived.map((c) => ({ iso3: c.iso3, v: c.implementationScore }))
);
const regionalFrameworkRanks = new Map<string, number>();
const regionalImplementationRanks = new Map<string, number>();
for (const [, group] of byRegion) {
  const groupTyped = group as WithDerived[];
  const fr = buildRanks(groupTyped.map((c) => ({ iso3: c.iso3, v: c.frameworkScore })));
  const im = buildRanks(
    groupTyped.map((c) => ({ iso3: c.iso3, v: c.implementationScore }))
  );
  for (const [iso3, r] of fr) regionalFrameworkRanks.set(iso3, r);
  for (const [iso3, r] of im) regionalImplementationRanks.set(iso3, r);
}

// Aggregate averages.
function aggAverages(group: typeof countriesArr) {
  const dimensions: Record<DimensionSlug, number | null> = {} as never;
  for (const dim of DIMENSIONS) {
    dimensions[dim.slug] = average(group.map((c) => c.dimensionScores[dim.slug]));
  }
  const pillars: Record<PillarSlug, number | null> = {} as never;
  for (const pillar of PILLARS) {
    pillars[pillar.slug] = average(group.map((c) => c.pillarScores[pillar.slug]));
  }
  const indicators: Record<string, number | null> = {};
  for (const ind of INDICATORS) {
    indicators[ind.slug] = average(group.map((c) => c.indicatorScores[ind.slug] ?? null));
  }
  const groupTyped = group as WithDerived[];
  return {
    girai: average(group.map((c) => c.girai)),
    dimensions,
    pillars,
    indicators,
    frameworkScore: average(groupTyped.map((c) => c.frameworkScore)),
    implementationScore: average(groupTyped.map((c) => c.implementationScore)),
  };
}

const globalAverages = aggAverages(countriesArr);
const regionAverages: Record<string, ReturnType<typeof aggAverages>> = {};
for (const [region, group] of byRegion) {
  regionAverages[region] = aggAverages(group);
}
const incomeAverages: Record<string, ReturnType<typeof aggAverages>> = {};
for (const [income, group] of byIncome) {
  incomeAverages[income] = aggAverages(group);
}

// Final per-country shape including ranks.
const countriesFinal = countriesArr.map((c) => ({
  ...c,
  rankRegional: regionalGiraiRank.get(c.iso3) ?? null,
  rankIncomeGroup: incomeGiraiRank.get(c.iso3) ?? null,
  dimensionRanksGlobal: Object.fromEntries(
    DIMENSIONS.map((d) => [d.slug, globalDimRanks[d.slug].get(c.iso3) ?? null])
  ) as Record<DimensionSlug, number | null>,
  dimensionRanksRegional: Object.fromEntries(
    DIMENSIONS.map((d) => [d.slug, regionalDimRanks[d.slug].get(c.iso3) ?? null])
  ) as Record<DimensionSlug, number | null>,
  pillarRanksGlobal: Object.fromEntries(
    PILLARS.map((p) => [p.slug, globalPillarRanks[p.slug].get(c.iso3) ?? null])
  ) as Record<PillarSlug, number | null>,
  pillarRanksRegional: Object.fromEntries(
    PILLARS.map((p) => [p.slug, regionalPillarRanks[p.slug].get(c.iso3) ?? null])
  ) as Record<PillarSlug, number | null>,
  frameworkRankGlobal: globalFrameworkRanks.get(c.iso3) ?? null,
  frameworkRankRegional: regionalFrameworkRanks.get(c.iso3) ?? null,
  implementationRankGlobal: globalImplementationRanks.get(c.iso3) ?? null,
  implementationRankRegional: regionalImplementationRanks.get(c.iso3) ?? null,
}));

const countriesJson = {
  ...PROVENANCE,
  countries: countriesFinal.map((c) => ({
    iso3: c.iso3,
    name: c.name,
    region: c.region,
    subregion: c.subregion,
    developing: c.developing,
    wbRegion: c.wbRegion,
    incomeGroup: c.incomeGroup,
    gdpPerCapitaPpp: c.gdpPerCapitaPpp,
  })),
};
writeJson(path.join(OUT_GENERATED, "countries.json"), countriesJson);
console.log(`[build-data] wrote countries.json (${countriesFinal.length} countries)`);

const rankingsJson = {
  ...PROVENANCE,
  countries: countriesFinal,
  aggregates: {
    global: globalAverages,
    byRegion: regionAverages,
    byIncomeGroup: incomeAverages,
  },
};
writeJson(path.join(OUT_GENERATED, "rankings.json"), rankingsJson);
console.log(`[build-data] wrote rankings.json`);

// ---------------------------------------------------------------------------
// 3. Evidence (discriminated-union)

type EvidenceItem = {
  id: string;
  kind: string;
  country: {
    iso3: string;
    name: string;
    region: string;
    subregion: string;
    developing: string;
    incomeGroup: string;
  };
  dimensionSlug: DimensionSlug;
  pillarSlug: PillarSlug;
  indicatorSlug: string;
  contributesTo?: string[];
  title: string;
  link?: string | null;
  drive?: string | null;
  type?: string | null;
  justification: string;
  enforceability?: string | null;
  reach?: string | null;
  scope?: string | null;
  approval?: string | null;
  defenceAndSecurity?: { value: string; justification: string } | null;
  consultation?: string | null;
  body?: { exists: string; name: string | null } | null;
  plan?: string | null;
  budget?: string | null;
  monitoring?: string | null;
  thematicElements?:
    | {
        text: string;
        value: string;
        justification: string;
      }[]
    | null;
};

// Country lookup (we already have countriesFinal).
const countryByIso = new Map<string, (typeof countriesFinal)[number]>();
for (const c of countriesFinal) countryByIso.set(c.iso3, c);

function countryRef(iso3: string) {
  const c = countryByIso.get(iso3);
  if (!c) throw new Error(`Unknown country ISO3: ${iso3}`);
  return {
    iso3: c.iso3,
    name: c.name,
    region: c.region,
    subregion: c.subregion,
    developing: c.developing,
    incomeGroup: c.incomeGroup,
  };
}

const evidence: EvidenceItem[] = [];

// 3a. Frameworks
const frameworksRows = readSheet(DATASET_FILE, "frameworks");
const thematicRows = readSheet(DATASET_FILE, "thematic_coverage");

// Build thematic-coverage lookup keyed by interview_key + source ("fr1"/"fr2"/"gmc")
const thematicByKey = new Map<
  string,
  { text: string; value: string; justification: string }[]
>();
for (const row of thematicRows) {
  const ik = str(row["interview_key"]);
  const source = str(row["source"]);
  if (!ik || !source) continue;
  const key = `${ik}::${source}`;
  const elems: { text: string; value: string; justification: string }[] = [];
  for (let i = 1; i <= 4; i++) {
    const text = str(row[`element${i}_text`]);
    const value = str(row[`element${i}_value`]);
    const just = str(row[`element${i}_justif`]);
    if (text && value) elems.push({ text, value, justification: just ?? "" });
  }
  if (elems.length) thematicByKey.set(key, elems);
}

// Framework adoption status per indicator (includes "No framework" rows).
type FrameworkAdoptionCounts = {
  adopted: number;
  draft: number;
  notAdopted: number;
  total: number;
};
const frameworkAdoptionBySlug = new Map<string, FrameworkAdoptionCounts>();
for (const ind of INDICATORS.filter((i) => i.family === "ai-policy")) {
  frameworkAdoptionBySlug.set(ind.slug, { adopted: 0, draft: 0, notAdopted: 0, total: 0 });
}
const frameworkCountryIso3 = new Set<string>();
// Per-indicator, per-country framework status — lets the client recompute
// the indicator-adoption table when page filters (e.g. region) are active.
type FrameworkStatus = "adopted" | "draft" | "notAdopted";
const frameworkStatusBySlug = new Map<string, Map<string, FrameworkStatus>>();
// Region of every country in the framework universe (for region filtering).
const frameworkRegionByIso3 = new Map<string, string>();

for (const row of frameworksRows) {
  const ik = str(row["interview_key"]);
  const iso3 = str(row["ISO3"]);
  const indicatorName = str(row["indicator"]);
  if (!ik || !iso3 || !indicatorName) continue;
  const ind = findIndicator(indicatorName);
  if (!ind) {
    throw new Error(
      `Unknown indicator in frameworks: ${JSON.stringify(indicatorName)} (interview_key=${ik})`
    );
  }
  frameworkCountryIso3.add(iso3);
  const frStatus = str(row["fr_status"]);
  const adoption = frameworkAdoptionBySlug.get(ind.slug)!;
  adoption.total += 1;
  let statusKey: FrameworkStatus | null = null;
  if (frStatus === "Adopted") {
    adoption.adopted += 1;
    statusKey = "adopted";
  } else if (frStatus === "Draft") {
    adoption.draft += 1;
    statusKey = "draft";
  } else if (frStatus === "No framework") {
    adoption.notAdopted += 1;
    statusKey = "notAdopted";
  }

  const country = countryRef(iso3);
  frameworkRegionByIso3.set(iso3, country.region);
  if (statusKey) {
    let statusByCountry = frameworkStatusBySlug.get(ind.slug);
    if (!statusByCountry) {
      statusByCountry = new Map<string, FrameworkStatus>();
      frameworkStatusBySlug.set(ind.slug, statusByCountry);
    }
    statusByCountry.set(iso3, statusKey);
  }

  for (const slot of [1, 2] as const) {
    const title = str(row[`fr${slot}_title`]);
    if (!title) continue;
    const dsValue = str(row[`fr${slot}_defence_and_security`]);
    const bodyExists = str(row[`fr${slot}_body`]);
    evidence.push({
      id: `${ik}:framework:${slot}`,
      kind: "framework",
      country,
      dimensionSlug: ind.dimension,
      pillarSlug: ind.pillar,
      indicatorSlug: ind.slug,
      title,
      link: str(row[`fr${slot}_link`]),
      drive: str(row[`fr${slot}_drive`]),
      type: str(row[`fr${slot}_type`]),
      justification: strOr(row[`fr${slot}_justif`]),
      enforceability: str(row[`fr${slot}_enforceability`]),
      reach: str(row[`fr${slot}_reach`]),
      scope: str(row[`fr${slot}_scope`]),
      approval: excelDateToIso(row[`fr${slot}_approval`]),
      defenceAndSecurity: dsValue
        ? { value: dsValue, justification: strOr(row[`fr${slot}_defence_and_security_justif`]) }
        : null,
      consultation: str(row[`fr${slot}_consultation`]),
      body: bodyExists
        ? { exists: bodyExists, name: str(row[`fr${slot}_body_name`]) }
        : null,
      plan: str(row[`fr${slot}_plan`]),
      budget: str(row[`fr${slot}_budget`]),
      monitoring: str(row[`fr${slot}_monitoring`]),
      thematicElements: thematicByKey.get(`${ik}::fr${slot}`) ?? null,
    });
  }
}

// 3b. Initiatives
const initiativesRows = readSheet(DATASET_FILE, "initiatives");
for (const row of initiativesRows) {
  const ik = str(row["interview_key"]);
  const iso3 = str(row["ISO3"]);
  const indicatorName = str(row["indicator"]);
  if (!ik || !iso3 || !indicatorName) continue;
  const ind = findIndicator(indicatorName);
  if (!ind) throw new Error(`Unknown indicator in initiatives: ${indicatorName}`);
  const country = countryRef(iso3);

  for (const body of [1, 2] as const) {
    const bodyName = str(row[`imp${body}_body_name`]);
    for (const item of [1, 2, 3] as const) {
      const name = str(row[`init${body}_name${item}`]);
      if (!name) continue;
      evidence.push({
        id: `${ik}:initiative:b${body}-i${item}`,
        kind: "initiative",
        country,
        dimensionSlug: ind.dimension,
        pillarSlug: ind.pillar,
        indicatorSlug: ind.slug,
        title: name,
        link: str(row[`init${body}_link${item}`]),
        drive: str(row[`init${body}_drive${item}`]),
        type:
          [str(row[`init${body}_category${item}`]), str(row[`init${body}_type${item}`])]
            .filter(Boolean)
            .join(" — ") || null,
        justification: strOr(row[`init${body}_justif${item}`]),
        body: bodyName ? { exists: "Yes", name: bodyName } : null,
      });
    }
  }
}

// 3c. CSO initiatives
const cseRows = readSheet(DATASET_FILE, "cse_initiatives");
for (const row of cseRows) {
  const ik = str(row["interview_key"]);
  const iso3 = str(row["ISO3"]);
  const indicatorName = str(row["indicator"]);
  if (!ik || !iso3 || !indicatorName) continue;
  const ind = findIndicator(indicatorName);
  if (!ind) throw new Error(`Unknown indicator in cse_initiatives: ${indicatorName}`);
  const country = countryRef(iso3);

  for (const slot of [1, 2, 3, 4, 5, 6] as const) {
    const name = str(row[`cse${slot}_name`]);
    if (!name) continue;
    const contribRaw = str(row[`cse${slot}_contributions`]);
    const contributesTo = contribRaw
      ? contribRaw
          .split(/[;,\n]/)
          .map((s) => findIndicator(s.trim())?.slug)
          .filter((x): x is string => Boolean(x))
      : undefined;
    evidence.push({
      id: `${ik}:cso-initiative:${slot}`,
      kind: "cso-initiative",
      country,
      dimensionSlug: ind.dimension,
      pillarSlug: ind.pillar,
      indicatorSlug: ind.slug,
      contributesTo,
      title: name,
      link: str(row[`cse${slot}_link`]),
      drive: str(row[`cse${slot}_drive`]),
      type: str(row[`cse${slot}_type`]),
      justification: strOr(row[`cse${slot}_justif`]),
    });
  }
}

// 3d. GMC (consultations / provisions / mechanisms)
const gmcRows = readSheet(DATASET_FILE, "gmc_cse");
const GMC_INDICATOR_SLUG = "government-mechanisms-cso-inclusion";
for (const row of gmcRows) {
  const ik = str(row["interview_key"]);
  const iso3 = str(row["ISO3"]);
  if (!ik || !iso3) continue;
  const ind = INDICATORS.find((i) => i.slug === GMC_INDICATOR_SLUG)!;
  const country = countryRef(iso3);

  // Consultations
  for (const slot of [1, 2, 3] as const) {
    const name = str(row[`gmc_consult${slot}_name`]);
    if (!name) continue;
    evidence.push({
      id: `${ik}:gmc-consultation:${slot}`,
      kind: "gmc-consultation",
      country,
      dimensionSlug: ind.dimension,
      pillarSlug: ind.pillar,
      indicatorSlug: ind.slug,
      title: name,
      link: str(row[`gmc_consult${slot}_link`]),
      drive: str(row[`gmc_consult${slot}_drive`]),
      type: str(row[`gmc_consult${slot}_type`]),
      justification: strOr(row[`gmc_consult${slot}_justif`]),
    });
  }
  // Provisions
  for (const slot of [1, 2, 3, 4] as const) {
    const provType = str(row[`gmc_particip_provis${slot}_type`]);
    if (!provType) continue;
    evidence.push({
      id: `${ik}:gmc-provision:${slot}`,
      kind: "gmc-provision",
      country,
      dimensionSlug: ind.dimension,
      pillarSlug: ind.pillar,
      indicatorSlug: ind.slug,
      title: provType,
      type: provType,
      justification: strOr(row[`gmc_particip_provis${slot}_justif`]),
    });
  }
  // Mechanisms
  for (const slot of [1, 2, 3, 4] as const) {
    const name = str(row[`gmc_particip_mech${slot}_name`]);
    if (!name) continue;
    evidence.push({
      id: `${ik}:gmc-mechanism:${slot}`,
      kind: "gmc-mechanism",
      country,
      dimensionSlug: ind.dimension,
      pillarSlug: ind.pillar,
      indicatorSlug: ind.slug,
      title: name,
      link: str(row[`gmc_particip_mech${slot}_link`]),
      drive: str(row[`gmc_particip_mech${slot}_drive`]),
      type: str(row[`gmc_particip_mech${slot}_type`]),
      justification: strOr(row[`gmc_particip_mech${slot}_justif`]),
    });
  }
}

// 3e. URAI / Government Misuse
const uraiRows = readSheet(DATASET_FILE, "urai");
const URAI_INDICATOR_SLUG = "unacceptable-risks-ai-systems";
for (const row of uraiRows) {
  const iso3 = str(row["ISO3"]);
  if (!iso3) continue;
  const ind = INDICATORS.find((i) => i.slug === URAI_INDICATOR_SLUG)!;
  const country = countryRef(iso3);
  const ik = str(row["interview_key"]) ?? `urai-${iso3}`;
  for (const slot of [1, 2, 3, 4, 5, 6, 7] as const) {
    const name = str(row[`urai${slot}_name`]);
    if (!name) continue;
    evidence.push({
      id: `${ik}:government-misuse:${slot}`,
      kind: "government-misuse",
      country,
      dimensionSlug: ind.dimension,
      pillarSlug: ind.pillar,
      indicatorSlug: ind.slug,
      title: name,
      link: str(row[`urai${slot}_link`]),
      drive: str(row[`urai${slot}_drive`]),
      type: str(row[`urai${slot}_type`]),
      justification: strOr(row[`urai${slot}_justif`]),
    });
  }
}

// Sanity: no duplicate IDs.
{
  const seen = new Set<string>();
  for (const e of evidence) {
    if (seen.has(e.id))
      throw new Error(`Duplicate evidence id: ${e.id}. Item-ID grammar collision.`);
    seen.add(e.id);
  }
}

// ---------------------------------------------------------------------------
// 3e½. Country pillar highlights (country page "What Drives This Performance?")

const CSO_PILLAR_INDICATORS = INDICATORS.filter((i) => i.pillar === "cso-engagement");
const ENABLING_PILLAR_INDICATORS = INDICATORS.filter((i) => i.pillar === "enabling-conditions");
const GMC_EVIDENCE_KINDS = new Set([
  "gmc-consultation",
  "gmc-provision",
  "gmc-mechanism",
]);

function pluralWord(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

function evidenceByIso(iso3: string) {
  return evidence.filter((e) => e.country.iso3 === iso3);
}

const countryPillarHighlights = countriesArr.map((country) => {
  const iso = country.iso3;
  const items = evidenceByIso(iso);

  const aiPolicyItems = items.filter((e) => e.pillarSlug === "ai-policy");
  const frameworkDocs = aiPolicyItems.filter((e) => e.kind === "framework").length;
  const initiatives = aiPolicyItems.filter((e) => e.kind === "initiative").length;
  const implementingBodies = aiPolicyItems.filter(
    (e) => e.kind === "framework" && e.body?.exists === "Yes"
  ).length;

  const aiPolicyBullets: [string, string, string] = [
    `${frameworkDocs} AI Policy ${pluralWord(frameworkDocs, "indicator", "indicators")} covered by a framework`,
    `${initiatives} government ${pluralWord(initiatives, "initiative", "initiatives")} documented`,
    implementingBodies > 0
      ? `Dedicated implementing body on ${implementingBodies} ${pluralWord(implementingBodies, "indicator", "indicators")}`
      : "No dedicated implementing bodies identified on frameworks",
  ];

  const csoItems = items.filter((e) => e.pillarSlug === "cso-engagement");
  const csoInitiatives = csoItems.filter((e) => e.kind === "cso-initiative").length;
  const gmcItems = csoItems.filter((e) => GMC_EVIDENCE_KINDS.has(e.kind)).length;
  const csoIndicatorsWithEvidence = CSO_PILLAR_INDICATORS.filter(
    (ind) => country.evidenceCounts[ind.slug]
  ).length;

  const csoBullets: [string, string, string] = [
    `${csoInitiatives} civil society ${pluralWord(csoInitiatives, "initiative", "initiatives")} on file`,
    `${gmcItems} multi-stakeholder governance ${pluralWord(gmcItems, "item", "items")} documented`,
    `${csoIndicatorsWithEvidence} of ${CSO_PILLAR_INDICATORS.length} civil society indicators with documented engagement`,
  ];

  const topEnabling = ENABLING_PILLAR_INDICATORS.map((ind) => ({
    name: ind.name,
    score: country.indicatorScores[ind.slug],
  }))
    .filter((row): row is { name: string; score: number } => row.score !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  const enablingFallback = (index: number): string => {
    const row = topEnabling[index];
    if (!row) return "No scored country context indicators in this tier";
    return `${row.name} (${row.score.toFixed(1)})`;
  };

  const enablingBullets: [string, string, string] = [
    topEnabling[0]
      ? `Strongest context signal: ${topEnabling[0].name} (${topEnabling[0].score.toFixed(1)})`
      : enablingFallback(0),
    enablingFallback(1),
    enablingFallback(2),
  ];

  return {
    iso3: iso,
    pillars: {
      "ai-policy": { bullets: aiPolicyBullets },
      "cso-engagement": { bullets: csoBullets },
      "enabling-conditions": { bullets: enablingBullets },
    },
  };
});

// Sanity: bullets must match evidence corpus counts (what the explorer indexes).
for (const entry of countryPillarHighlights) {
  const items = evidenceByIso(entry.iso3);
  const ai = items.filter((e) => e.pillarSlug === "ai-policy");
  const fw = ai.filter((e) => e.kind === "framework").length;
  const init = ai.filter((e) => e.kind === "initiative").length;
  const bodies = ai.filter((e) => e.kind === "framework" && e.body?.exists === "Yes").length;
  const [b0, b1, b2] = entry.pillars["ai-policy"].bullets;
  if (b0 !== `${fw} AI Policy ${pluralWord(fw, "indicator", "indicators")} covered by a framework`) {
    throw new Error(`[build-data] ai-policy framework bullet mismatch for ${entry.iso3}`);
  }
  if (b1 !== `${init} government ${pluralWord(init, "initiative", "initiatives")} documented`) {
    throw new Error(`[build-data] ai-policy initiative bullet mismatch for ${entry.iso3}`);
  }
  const bodyBullet =
    bodies > 0
      ? `Dedicated implementing body on ${bodies} ${pluralWord(bodies, "indicator", "indicators")}`
      : "No dedicated implementing bodies identified on frameworks";
  if (b2 !== bodyBullet) {
    throw new Error(`[build-data] ai-policy body bullet mismatch for ${entry.iso3}`);
  }

  const cso = items.filter((e) => e.pillarSlug === "cso-engagement");
  const csoInit = cso.filter((e) => e.kind === "cso-initiative").length;
  const gmc = cso.filter((e) => GMC_EVIDENCE_KINDS.has(e.kind)).length;
  const [c0, c1] = entry.pillars["cso-engagement"].bullets;
  if (c0 !== `${csoInit} civil society ${pluralWord(csoInit, "initiative", "initiatives")} on file`) {
    throw new Error(`[build-data] cso initiative bullet mismatch for ${entry.iso3}`);
  }
  if (c1 !== `${gmc} multi-stakeholder governance ${pluralWord(gmc, "item", "items")} documented`) {
    throw new Error(`[build-data] cso gmc bullet mismatch for ${entry.iso3}`);
  }
}

const countryPillarHighlightsJson = {
  ...PROVENANCE,
  countries: countryPillarHighlights,
};
writeJson(path.join(OUT_PUBLIC, "country-pillar-highlights.json"), countryPillarHighlightsJson);
writeJson(path.join(OUT_GENERATED, "country-pillar-highlights.json"), countryPillarHighlightsJson);
console.log(
  `[build-data] wrote country-pillar-highlights.json (${countryPillarHighlights.length} countries)`
);

const byKind = evidence.reduce<Record<string, number>>((acc, e) => {
  acc[e.kind] = (acc[e.kind] ?? 0) + 1;
  return acc;
}, {});

function normalizeEvidenceText(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeEvidenceUrl(value: string | null | undefined): string {
  return normalizeEvidenceText(value)
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/[#?].*$/, "")
    .replace(/\/$/, "");
}

function uniqueCountByKind(resolve: (item: EvidenceItem) => string): Record<string, number> {
  const groups = new Map<string, Set<string>>();
  for (const item of evidence) {
    const key = resolve(item);
    if (!key) continue;
    const values = groups.get(item.kind) ?? new Set<string>();
    values.add(key);
    groups.set(item.kind, values);
  }
  return Object.fromEntries(
    Array.from(groups.entries()).map(([kind, values]) => [kind, values.size])
  );
}

const uniqueTitlesByKind = uniqueCountByKind((item) => normalizeEvidenceText(item.title));
const uniqueUrlOrTitleByKind = uniqueCountByKind((item) => {
  const url = normalizeEvidenceUrl(item.link);
  return url || normalizeEvidenceText(item.title);
});
const uniqueItemsByKind = {
  ...uniqueUrlOrTitleByKind,
  framework: uniqueTitlesByKind.framework ?? uniqueUrlOrTitleByKind.framework ?? 0,
};
const uniqueEvidenceItems = Object.values(uniqueItemsByKind).reduce(
  (sum, count) => sum + count,
  0
);

function distinctCountriesForKinds(kinds: string[]): number {
  return new Set(
    evidence.filter((e) => kinds.includes(e.kind)).map((e) => e.country.iso3)
  ).size;
}

const PATHWAY_KIND_GROUPS = {
  frameworks: ["framework"],
  initiatives: ["initiative"],
  nonGov: ["cso-initiative", "gmc-consultation", "gmc-provision", "gmc-mechanism"],
  misuse: ["government-misuse"],
} as const;

const countriesByPathway = Object.fromEntries(
  Object.entries(PATHWAY_KIND_GROUPS).map(([pathway, kinds]) => [
    pathway,
    distinctCountriesForKinds([...kinds]),
  ])
);

const evidenceJson = {
  ...PROVENANCE,
  totals: {
    items: evidence.length,
    uniqueItems: uniqueEvidenceItems,
    byKind,
    uniqueItemsByKind,
    uniqueTitlesByKind,
    countriesIndexed: countriesArr.length,
    countriesWithItems: new Set(evidence.map((e) => e.country.iso3)).size,
    countriesByPathway,
  },
  items: evidence,
};
writeJson(path.join(OUT_PUBLIC, "evidence.json"), evidenceJson);

const indicatorAdoptionJson = {
  ...PROVENANCE,
  totalCountries: frameworkCountryIso3.size,
  // Framework universe with region so the client can scope counts to a
  // region (or any country subset) when page filters are active.
  countries: Array.from(frameworkRegionByIso3.entries())
    .map(([iso3, region]) => ({ iso3, region }))
    .sort((a, b) => a.iso3.localeCompare(b.iso3)),
  frameworks: Object.fromEntries(
    Array.from(frameworkAdoptionBySlug.entries()).map(([slug, counts]) => [
      slug,
      {
        ...counts,
        byCountry: Object.fromEntries(frameworkStatusBySlug.get(slug) ?? []),
      },
    ])
  ),
};
writeJson(path.join(OUT_PUBLIC, "indicator-adoption.json"), indicatorAdoptionJson);
console.log(
  `[build-data] wrote indicator-adoption.json (${frameworkAdoptionBySlug.size} indicators, ${frameworkCountryIso3.size} countries)`
);
// Also mirror to src/data/2026/generated so we can statically import it
// from the data-access module (next/static SSG-friendly, type-safe).
writeJson(path.join(OUT_GENERATED, "evidence.json"), evidenceJson);
console.log(
  `[build-data] wrote evidence.json (${evidence.length} items, ${evidenceJson.totals.countriesWithItems} countries)`
);

// ---------------------------------------------------------------------------
// 3f. Evidence Explorer slim index (`evidence-index.json`)
//
// Denormalised, ~7× smaller view used by the client-side <EvidenceExplorer />
// for fuzzy search + faceted filter without shipping the full corpus.

const indicatorNameBySlug = new Map<string, string>();
for (const ind of INDICATORS) indicatorNameBySlug.set(ind.slug, ind.name);

const evidenceIndexRows = evidence.map((e) => ({
  id: e.id,
  kind: e.kind,
  title: e.title,
  link: e.link ?? null,
  type: e.type ?? null,
  enforceability: e.enforceability ?? null,
  approval: e.approval ?? null,
  country: {
    iso3: e.country.iso3,
    name: e.country.name,
    region: e.country.region,
    incomeGroup: e.country.incomeGroup,
  },
  dimensionSlug: e.dimensionSlug,
  pillarSlug: e.pillarSlug,
  indicatorSlug: e.indicatorSlug,
  indicatorName: indicatorNameBySlug.get(e.indicatorSlug) ?? e.indicatorSlug,
}));

const evidenceIndexJson = {
  ...PROVENANCE,
  totals: evidenceJson.totals,
  facets: {
    regions: Array.from(new Set(evidenceIndexRows.map((r) => r.country.region)))
      .filter(Boolean)
      .sort(),
    countries: Array.from(
      new Map(
        evidenceIndexRows.map((r) => [
          r.country.iso3,
          { iso3: r.country.iso3, name: r.country.name, region: r.country.region },
        ])
      ).values()
    ).sort((a, b) => a.name.localeCompare(b.name)),
  },
  rows: evidenceIndexRows,
};
writeJson(path.join(OUT_PUBLIC, "evidence-index.json"), evidenceIndexJson);
console.log(
  `[build-data] wrote evidence-index.json (${evidenceIndexRows.length} rows, ${evidenceIndexJson.facets.countries.length} countries, ${evidenceIndexJson.facets.regions.length} regions)`
);

// ---------------------------------------------------------------------------
// 4. CSV mirror

const csvSheets: { file: string; src: string; sheet: string }[] = [
  { file: "ranking_and_scores.csv", src: SCORING_FILE, sheet: "ranking_and_scores" },
  { file: "all_indicators.csv", src: SCORING_FILE, sheet: "all_indicators" },
  { file: "all_indicators_long.csv", src: SCORING_FILE, sheet: "all_indicators_long" },
  { file: "all_evidences.csv", src: DATASET_FILE, sheet: "all_evidences" },
  { file: "frameworks.csv", src: DATASET_FILE, sheet: "frameworks" },
  { file: "initiatives.csv", src: DATASET_FILE, sheet: "initiatives" },
  { file: "cse_initiatives.csv", src: DATASET_FILE, sheet: "cse_initiatives" },
  { file: "gmc_cse.csv", src: DATASET_FILE, sheet: "gmc_cse" },
  { file: "urai.csv", src: DATASET_FILE, sheet: "urai" },
];

for (const { file, src, sheet } of csvSheets) {
  const rows = readSheet(src, sheet);
  // Sanitize: replace problematic header `\`` (rogue backtick in all_evidences) → interview_key.
  const cleaned = rows.map((r) => {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(r)) {
      out[k === "`" ? "interview_key" : k] = v;
    }
    return out;
  });
  writeCsv(path.join(OUT_CSV, file), cleaned);
}
console.log(`[build-data] wrote ${csvSheets.length} CSV mirrors`);

// ---------------------------------------------------------------------------
// 5. Excel link-template.csv

const linkTemplate = [
  {
    description: "Country page (ISO3 in column C)",
    formula: '="https://girai.global/countries/" & C2',
  },
  {
    description: "Framework slot 1 (interview_key in column A)",
    formula: '="https://girai.global/evidence/" & A2 & ":framework:1"',
  },
  {
    description: "Framework slot 2",
    formula: '="https://girai.global/evidence/" & A2 & ":framework:2"',
  },
  {
    description: "Initiative — body 1, item N (replace N=1..3)",
    formula: '="https://girai.global/evidence/" & A2 & ":initiative:b1-i1"',
  },
  {
    description: "Initiative — body 2, item N (replace N=1..3)",
    formula: '="https://girai.global/evidence/" & A2 & ":initiative:b2-i1"',
  },
  {
    description: "CSO initiative slot N (1..6)",
    formula: '="https://girai.global/evidence/" & A2 & ":cso-initiative:1"',
  },
  {
    description: "GMC consultation slot N (1..3)",
    formula: '="https://girai.global/evidence/" & A2 & ":gmc-consultation:1"',
  },
  {
    description: "GMC provision slot N (1..4)",
    formula: '="https://girai.global/evidence/" & A2 & ":gmc-provision:1"',
  },
  {
    description: "GMC mechanism slot N (1..4)",
    formula: '="https://girai.global/evidence/" & A2 & ":gmc-mechanism:1"',
  },
  {
    description: "Government misuse / URAI slot N (1..7) — uses ISO3 in column C",
    formula: '="https://girai.global/evidence/urai-" & C2 & ":government-misuse:1"',
  },
  {
    description: "Evidence Explorer — filter by country (ISO3 in C)",
    formula: '="https://girai.global/evidence?country=" & C2',
  },
  {
    description: "Evidence Explorer — filter by indicator slug (paste slug in cell D2)",
    formula: '="https://girai.global/evidence?indicator=" & D2',
  },
];
writeCsv(path.join(OUT_CSV, "link-template.csv"), linkTemplate);
console.log(`[build-data] wrote link-template.csv`);

// ---------------------------------------------------------------------------
// 6. Edition evidence-status comparison (2024 vs 2026)

const AI_POLICY_SLUGS = new Set(
  INDICATORS.filter((i) => i.family === "ai-policy").map((i) => i.slug)
);

const editionFrameworkRows = frameworksRows
  .map((row) => {
    const iso3 = str(row["ISO3"]);
    const indicatorName = str(row["indicator"]);
    if (!iso3 || !indicatorName) return null;
    const ind = findIndicator(indicatorName);
    if (!ind || ind.family !== "ai-policy") return null;
    const enforceability =
      str(row["fr1_enforceability"]) ?? str(row["fr2_enforceability"]) ?? "";
    return {
      iso3,
      indicatorSlug: ind.slug,
      frStatus: strOr(row["fr_status"]),
      enforceability,
    };
  })
  .filter((r): r is NonNullable<typeof r> => r !== null);

const editionInitCounts = Array.from(evCountsByIsoIndicator.entries())
  .map(([key, counts]) => {
    const [iso3, indicatorSlug] = key.split("::");
    if (!AI_POLICY_SLUGS.has(indicatorSlug)) return null;
    return { iso3, indicatorSlug, initCount: counts.init };
  })
  .filter((r): r is NonNullable<typeof r> => r !== null);

const editionCsoContributions = evidence
  .filter((e) => e.kind === "cso-initiative" && e.contributesTo?.length)
  .map((e) => ({
    iso3: e.country.iso3,
    contributesTo: e.contributesTo ?? [],
  }));

buildEditionComparisonArtifact({
  generatedAt: GENERATED_AT,
  sourceHash: SOURCE_HASH,
  iso3List: countriesArr.map((c) => c.iso3),
  frameworkRows2026: editionFrameworkRows,
  initCounts2026: editionInitCounts,
  csoContributions2026: editionCsoContributions,
});

console.log(`[build-data] done.`);
