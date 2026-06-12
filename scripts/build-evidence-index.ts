/**
 * One-off helper: derive `public/data/2026/evidence-index.json` from the
 * existing `evidence.json` artifact without re-running the full
 * xlsx pipeline. Idempotent. Safe to run any time; `pnpm build:data`
 * also produces this file as part of its normal output, so this script
 * is only useful when you don't want to (or can't) regenerate from the
 * source workbooks.
 *
 * Run:  pnpm tsx scripts/build-evidence-index.ts
 */

import fs from "node:fs";
import path from "node:path";
import { INDICATORS } from "../src/data/2026/taxonomy.js";

const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "src/data/2026/generated/evidence.json");
const OUT = path.join(ROOT, "public/data/2026/evidence-index.json");

type EvidenceItem = {
  id: string;
  kind: string;
  title: string;
  link?: string | null;
  type?: string | null;
  enforceability?: string | null;
  approval?: string | null;
  country: { iso3: string; name: string; region: string; incomeGroup: string };
  dimensionSlug: string;
  pillarSlug: string;
  indicatorSlug: string;
};

const raw = JSON.parse(fs.readFileSync(SRC, "utf8")) as {
  generatedAt: string;
  sourceHash: string;
  totals: unknown;
  items: EvidenceItem[];
};

const indicatorNameBySlug = new Map<string, string>();
for (const ind of INDICATORS) indicatorNameBySlug.set(ind.slug, ind.name);

const rows = raw.items.map((e) => ({
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

const out = {
  generatedAt: raw.generatedAt,
  sourceHash: raw.sourceHash,
  totals: raw.totals,
  facets: {
    regions: Array.from(new Set(rows.map((r) => r.country.region))).filter(Boolean).sort(),
    countries: Array.from(
      new Map(rows.map((r) => [r.country.iso3, { iso3: r.country.iso3, name: r.country.name }])).values()
    ).sort((a, b) => a.name.localeCompare(b.name)),
  },
  rows,
};

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out) + "\n");
console.log(
  `wrote ${path.relative(ROOT, OUT)} (${rows.length} rows, ${out.facets.countries.length} countries, ${out.facets.regions.length} regions, ${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`
);
