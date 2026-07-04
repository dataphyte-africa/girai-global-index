/**
 * Builds `country-edition-evidence-status.json` from `editions_comparison.xlsx`.
 * Called at the end of `pnpm build:data`.
 *
 * Source of truth: the official `DB_for_web` sheet, which provides side-by-side
 * 2024-vs-2026 framework / government-initiative / CSO status for the 14
 * indicators shared across both editions, for the 130 countries present in the
 * 2024 edition.
 *
 * Countries absent from that sheet (i.e. not assessed in 2024, e.g. NOR/ISR)
 * still render the section with a 2026-only column, reconstructed from the
 * 2026 workbook data passed in by `build-data`.
 */

import fs from "node:fs";
import path from "node:path";
import * as XLSX from "xlsx";
import {
  normalize2026FrameworkStatus,
  normalize2026YesNo,
  type EditionDisplayStatus,
  type EditionPathwayId,
  type FrameworkDisplayStatus,
  type YesNoDisplayStatus,
  EDITION_PATHWAYS,
} from "../src/lib/girai/edition-status.js";

const ROOT = path.resolve(__dirname, "..");
const EDITIONS_FILE = path.join(ROOT, "src/data/2026/editions_comparison.xlsx");
const EDITIONS_SHEET = "DB_for_web";
const OUT_GENERATED = path.join(ROOT, "src/data/2026/generated");

/**
 * The 14 indicators shared across editions, in dimension order. Keyed by the
 * exact `indicator` value used in `editions_comparison.xlsx`, mapped to the
 * 2026 taxonomy slug and canonical name used across the site.
 */
const EDITION_INDICATORS: Array<{ fileName: string; slug: string; name: string }> = [
  // Inclusion and Diversity
  { fileName: "Gender Equality", slug: "gender-equality", name: "Gender Equality" },
  { fileName: "Children's Rights", slug: "childrens-rights", name: "Children's Rights" },
  {
    fileName: "Cultural and Linguistic Diversity",
    slug: "cultural-linguistic-diversity",
    name: "Cultural and Linguistic Diversity",
  },
  // Ethics and Sustainability
  {
    fileName: "Fairness and Non-discrimination",
    slug: "fairness-non-discrimination",
    name: "Fairness and Non-discrimination",
  },
  {
    fileName: "Transparency and Explainability",
    slug: "transparency-explainability",
    name: "Transparency and Explainability",
  },
  {
    fileName: "Human Oversight and Determination",
    slug: "human-oversight-determination",
    name: "Human Oversight and Determination",
  },
  // Labour and Skills
  { fileName: "Labour Protections", slug: "labour-protections", name: "Labour Protections" },
  {
    fileName: "Reskilling and upskilling initiatives",
    slug: "reskilling-upskilling-initiatives",
    name: "Reskilling/Upskilling Initiatives",
  },
  // Trust and Safety
  { fileName: "Safety and Security", slug: "safety-security", name: "Safety and Security" },
  {
    fileName: "Access to Redress and Remedy",
    slug: "access-redress-remedy",
    name: "Access to Redress and Remedy",
  },
  { fileName: "Impact Assessments", slug: "impact-assessments", name: "Impact Assessments" },
  // AI Use in Public Service Delivery
  {
    fileName: "Public Sector Skills Development",
    slug: "public-sector-skills-development",
    name: "Public Sector Skills Development",
  },
  { fileName: "Public Procurement", slug: "public-procurement", name: "Public Procurement" },
  // Government mechanisms for CSO inclusion
  {
    fileName: "Government Mechanisms for CSO Inclusion in AI Policy and Governance",
    slug: "government-mechanisms-cso-inclusion",
    name: "Government Mechanisms for CSO Inclusion in AI Policy and Governance",
  },
];

const SLUG_BY_FILE_NAME = new Map(EDITION_INDICATORS.map((i) => [i.fileName, i.slug]));
const EDITION_SLUGS = EDITION_INDICATORS.map((i) => i.slug);

type PathwayStatuses = Record<EditionPathwayId, Record<string, EditionDisplayStatus | null>>;

type CountryEditionEntry = {
  has2024Coverage: boolean;
  "2024": PathwayStatuses;
  "2026": PathwayStatuses;
};

function emptyPathwayStatuses(): PathwayStatuses {
  const row: Record<string, EditionDisplayStatus | null> = {};
  for (const slug of EDITION_SLUGS) row[slug] = null;
  return {
    frameworks: { ...row },
    initiatives: { ...row },
    cso: { ...row },
  };
}

/** Normalizes the file's framework vocabulary to the display vocabulary. */
function normFrameworkStatus(value: unknown): FrameworkDisplayStatus {
  const s = String(value ?? "").trim();
  if (s === "Binding") return "Binding Framework";
  if (s === "Non-Binding") return "Non-Binding Framework";
  if (s === "Draft") return "Draft";
  return "No Framework"; // "No framework" and any unexpected value
}

/** Yes / No / (n·a → null, rendered as "—"). */
function normYesNo(value: unknown): YesNoDisplayStatus | null {
  const s = String(value ?? "").trim().toLowerCase();
  if (s === "yes") return "Yes";
  if (s === "no") return "No";
  return null;
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
  if (!fs.existsSync(EDITIONS_FILE)) {
    throw new Error(`Editions comparison workbook not found at ${EDITIONS_FILE}`);
  }

  const countries: Record<string, CountryEditionEntry> = {};

  // --- Primary source: editions_comparison.xlsx (130 countries in both editions) ---
  const rows = readSheet(EDITIONS_FILE, EDITIONS_SHEET);
  const countriesInFile = new Set<string>();

  for (const raw of rows) {
    const iso3 = String(raw["ISO3"] ?? "").trim();
    const indicatorName = String(raw["indicator"] ?? "").trim();
    const slug = SLUG_BY_FILE_NAME.get(indicatorName);
    if (!iso3 || !slug) continue;

    countriesInFile.add(iso3);

    if (!countries[iso3]) {
      countries[iso3] = {
        has2024Coverage: true,
        "2024": emptyPathwayStatuses(),
        "2026": emptyPathwayStatuses(),
      };
    }
    const country = countries[iso3];

    country["2024"].frameworks[slug] = normFrameworkStatus(raw["fr_status_2024"]);
    country["2024"].initiatives[slug] = normYesNo(raw["init_existence_2024"]);
    country["2024"].cso[slug] = normYesNo(raw["cso_existence_2024"]);

    country["2026"].frameworks[slug] = normFrameworkStatus(raw["fr_status_2026"]);
    country["2026"].initiatives[slug] = normYesNo(raw["init_existence_2026"]);
    country["2026"].cso[slug] = normYesNo(raw["cso_existence_2026"]);
  }

  // --- Fallback: countries absent from the 2024 edition (2026-only column) ---
  const countriesWithout2024Coverage = opts.iso3List.filter(
    (iso3) => !countriesInFile.has(iso3)
  );
  const fallbackSet = new Set(countriesWithout2024Coverage);
  const editionSlugSet = new Set(EDITION_SLUGS);

  for (const iso3 of countriesWithout2024Coverage) {
    countries[iso3] = {
      has2024Coverage: false,
      "2024": emptyPathwayStatuses(),
      "2026": emptyPathwayStatuses(),
    };
  }

  for (const row of opts.frameworkRows2026) {
    if (!fallbackSet.has(row.iso3) || !editionSlugSet.has(row.indicatorSlug)) continue;
    countries[row.iso3]["2026"].frameworks[row.indicatorSlug] =
      normalize2026FrameworkStatus(row.frStatus, row.enforceability);
  }
  for (const row of opts.initCounts2026) {
    if (!fallbackSet.has(row.iso3) || !editionSlugSet.has(row.indicatorSlug)) continue;
    countries[row.iso3]["2026"].initiatives[row.indicatorSlug] = normalize2026YesNo(
      row.initCount
    );
  }
  for (const row of opts.csoContributions2026) {
    if (!fallbackSet.has(row.iso3)) continue;
    for (const slug of row.contributesTo) {
      if (!editionSlugSet.has(slug)) continue;
      countries[row.iso3]["2026"].cso[slug] = "Yes";
    }
  }
  // Default remaining 2026 cells for fallback countries to explicit "No".
  for (const iso3 of countriesWithout2024Coverage) {
    const country = countries[iso3];
    for (const slug of EDITION_SLUGS) {
      if (country["2026"].cso[slug] === null) country["2026"].cso[slug] = "No";
      if (country["2026"].initiatives[slug] === null) country["2026"].initiatives[slug] = "No";
      if (country["2026"].frameworks[slug] === null)
        country["2026"].frameworks[slug] = "No Framework";
    }
  }

  if (countriesWithout2024Coverage.length > 0) {
    console.log(
      `[build-data] edition comparison: ${countriesWithout2024Coverage.length} countries without 2024 coverage (${countriesWithout2024Coverage.join(", ")})`
    );
  }

  const artifact = {
    generatedAt: opts.generatedAt,
    sourceHash: opts.sourceHash,
    editions: ["2024", "2026"] as const,
    indicatorCount: EDITION_INDICATORS.length,
    pathways: EDITION_PATHWAYS,
    mapping: {
      crosswalk: Object.fromEntries(EDITION_INDICATORS.map((i) => [i.fileName, i.slug])),
      unmapped2026Indicators: [] as Array<{ slug: string; name: string; reason: string }>,
      unmapped2024ThematicAreas: [] as Array<{ thematicArea: string; note: string }>,
    },
    countriesWithout2024Coverage,
    indicators: EDITION_INDICATORS.map((i) => ({ slug: i.slug, name: i.name })),
    countries,
  };

  writeJson(
    path.join(OUT_GENERATED, "country-edition-evidence-status.json"),
    artifact
  );
  console.log(
    `[build-data] wrote country-edition-evidence-status.json (${Object.keys(countries).length} countries, ${EDITION_INDICATORS.length} indicators, source: editions_comparison.xlsx)`
  );
}
