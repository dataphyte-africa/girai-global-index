/**
 * Builds `country-edition-evidence-status.json` from 2024 and 2026 workbooks.
 * Called at the end of `pnpm build:data`.
 */

import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";
import { INDICATORS } from "../src/data/2026/taxonomy.js";
import {
  THEMATIC_AREA_TO_2026_SLUG,
  UNMAPPED_2024_THEMATIC_AREAS,
  UNMAPPED_2026_AI_POLICY_INDICATORS,
} from "../src/data/edition-indicator-mapping.js";
import {
  normalize2024FrameworkStatus,
  normalize2024YesNo,
  normalize2026FrameworkStatus,
  normalize2026YesNo,
  type EditionDisplayStatus,
  type EditionPathwayId,
  EDITION_PATHWAYS,
} from "../src/lib/girai/edition-status.js";

const ROOT = path.resolve(__dirname, "..");
const DATA_2024 = path.join(ROOT, "src/data/2024/GIRAI_2024_dataset.xlsx");
const OUT_GENERATED = path.join(ROOT, "src/data/2026/generated");

const AI_POLICY_INDICATORS = INDICATORS.filter((i) => i.family === "ai-policy");
const AI_POLICY_SLUGS = AI_POLICY_INDICATORS.map((i) => i.slug);

type PathwayStatuses = Record<EditionPathwayId, Record<string, EditionDisplayStatus | null>>;

type CountryEditionEntry = {
  has2024Coverage: boolean;
  "2024": PathwayStatuses;
  "2026": PathwayStatuses;
};

function emptyPathwayStatuses(): PathwayStatuses {
  const row: Record<string, EditionDisplayStatus | null> = {};
  for (const slug of AI_POLICY_SLUGS) row[slug] = null;
  return {
    frameworks: { ...row },
    initiatives: { ...row },
    cso: { ...row },
  };
}

function str(v: unknown): string | null {
  if (v === null || v === undefined) return null;
  const s = String(v).trim();
  return s === "" || s === "n/a" || s === "N/A" ? null : s;
}

function readSheet(file: string, sheetName: string): Record<string, unknown>[] {
  const wb = XLSX.readFile(file, { cellDates: false });
  const sheet = wb.Sheets[sheetName];
  if (!sheet) throw new Error(`Sheet "${sheetName}" not found in ${path.basename(file)}`);
  return XLSX.utils.sheet_to_json(sheet, { defval: "", raw: true });
}

function writeJson(file: string, data: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + "\n");
}

interface FrameworkRow {
  iso3: string;
  indicatorSlug: string;
  frStatus: string;
  enforceability: string;
}

interface EvidenceCsoRow {
  iso3: string;
  contributesTo: string[];
}

interface InitCountRow {
  iso3: string;
  indicatorSlug: string;
  initCount: number;
}

export function buildEditionComparisonArtifact(opts: {
  generatedAt: string;
  sourceHash: string;
  iso3List: string[];
  frameworkRows2026: FrameworkRow[];
  initCounts2026: InitCountRow[];
  csoContributions2026: EvidenceCsoRow[];
}): void {
  if (!fs.existsSync(DATA_2024)) {
    throw new Error(`2024 dataset not found at ${DATA_2024}`);
  }

  const countries: Record<string, CountryEditionEntry> = {};

  for (const iso3 of opts.iso3List) {
    countries[iso3] = {
      has2024Coverage: false,
      "2024": emptyPathwayStatuses(),
      "2026": emptyPathwayStatuses(),
    };
  }

  // --- 2026 ---
  for (const row of opts.frameworkRows2026) {
    const country = countries[row.iso3];
    if (!country || !AI_POLICY_SLUGS.includes(row.indicatorSlug)) continue;
    country["2026"].frameworks[row.indicatorSlug] = normalize2026FrameworkStatus(
      row.frStatus,
      row.enforceability
    );
  }

  for (const row of opts.initCounts2026) {
    const country = countries[row.iso3];
    if (!country || !AI_POLICY_SLUGS.includes(row.indicatorSlug)) continue;
    country["2026"].initiatives[row.indicatorSlug] = normalize2026YesNo(row.initCount);
  }

  const csoByIsoSlug = new Map<string, boolean>();
  for (const row of opts.csoContributions2026) {
    for (const slug of row.contributesTo) {
      if (!AI_POLICY_SLUGS.includes(slug)) continue;
      csoByIsoSlug.set(`${row.iso3}::${slug}`, true);
    }
  }
  for (const [key] of csoByIsoSlug) {
    const [iso3, slug] = key.split("::");
    const country = countries[iso3];
    if (country) country["2026"].cso[slug] = "Yes";
  }
  for (const iso3 of opts.iso3List) {
    const country = countries[iso3];
    if (!country) continue;
    for (const slug of AI_POLICY_SLUGS) {
      if (country["2026"].cso[slug] === null) {
        country["2026"].cso[slug] = "No";
      }
      if (country["2026"].initiatives[slug] === null) {
        country["2026"].initiatives[slug] = "No";
      }
      if (country["2026"].frameworks[slug] === null) {
        country["2026"].frameworks[slug] = "No Framework";
      }
    }
  }

  // --- 2024 ---
  const rows2024 = readSheet(DATA_2024, "Data");
  const countriesWith2024Data = new Set<string>();

  for (const raw of rows2024) {
    const iso3 = str(raw["ISO3"]);
    const thematicArea = str(raw["thematic_area"]);
    if (!iso3 || !thematicArea) continue;

    countriesWith2024Data.add(iso3);

    const slug = THEMATIC_AREA_TO_2026_SLUG[thematicArea];
    if (!slug) continue;

    if (!countries[iso3]) {
      countries[iso3] = {
        has2024Coverage: true,
        "2024": emptyPathwayStatuses(),
        "2026": emptyPathwayStatuses(),
      };
    }

    const country = countries[iso3];
    country.has2024Coverage = true;
    country["2024"].frameworks[slug] = normalize2024FrameworkStatus({
      fr_doc1_existence_text: str(raw["fr_doc1_existence_text"]) ?? undefined,
      fr_doc1_type_text: str(raw["fr_doc1_type_text"]) ?? undefined,
      ga_type_text: str(raw["ga_type_text"]) ?? undefined,
    });
    country["2024"].initiatives[slug] = normalize2024YesNo(
      str(raw["ga_existence_text"]) ?? undefined
    );
    country["2024"].cso[slug] = normalize2024YesNo(
      str(raw["nsa_cs_existence_text"]) ?? undefined
    );
  }

  const countriesWithout2024Coverage = opts.iso3List.filter(
    (iso3) => !countriesWith2024Data.has(iso3)
  );

  if (countriesWithout2024Coverage.length > 0) {
    console.log(
      `[build-data] edition comparison: ${countriesWithout2024Coverage.length} countries without 2024 coverage (${countriesWithout2024Coverage.join(", ")})`
    );
  }

  const artifact = {
    generatedAt: opts.generatedAt,
    sourceHash: opts.sourceHash,
    editions: ["2024", "2026"] as const,
    indicatorCount: AI_POLICY_SLUGS.length,
    pathways: EDITION_PATHWAYS,
    mapping: {
      crosswalk: THEMATIC_AREA_TO_2026_SLUG,
      unmapped2026Indicators: UNMAPPED_2026_AI_POLICY_INDICATORS,
      unmapped2024ThematicAreas: UNMAPPED_2024_THEMATIC_AREAS,
    },
    countriesWithout2024Coverage,
    indicators: AI_POLICY_INDICATORS.map((i) => ({ slug: i.slug, name: i.name })),
    countries,
  };

  writeJson(
    path.join(OUT_GENERATED, "country-edition-evidence-status.json"),
    artifact
  );
  console.log(
    `[build-data] wrote country-edition-evidence-status.json (${Object.keys(countries).length} countries, ${AI_POLICY_SLUGS.length} indicators)`
  );
}
