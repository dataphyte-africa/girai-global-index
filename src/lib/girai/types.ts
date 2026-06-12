/**
 * Public TypeScript shapes for the 2026 GIRAI dataset.
 *
 * These types describe the JSON artifacts emitted by `pnpm build:data`
 * (see ADR 0001 / 0002). Consumed by `src/lib/girai/data.ts` and any
 * component that reads ranking/score/aggregate data directly.
 *
 * Slugs (`DimensionSlug`, `PillarSlug`, indicator slugs) are part of the
 * public URL contract (ADR 0007). Do not rename.
 */

import type {
  DimensionSlug,
  PillarSlug,
  IndicatorFamily,
  DimensionDef,
  PillarDef,
  IndicatorDef,
} from "@/data/2026/taxonomy";

export type { DimensionSlug, PillarSlug, IndicatorFamily, DimensionDef, PillarDef, IndicatorDef };

/** Per-country evidence counts for a single indicator. */
export interface EvidenceCounts {
  fr: number;
  init: number;
  cse: number;
}

/** Score map from pillar slug → 0–100 score (or null if unscored). */
export type PillarScores = Record<PillarSlug, number | null>;

/** Score map from dimension slug → 0–100 score (or null if unscored). */
export type DimensionScores = Record<DimensionSlug, number | null>;

/** 15-cell matrix: dimension × pillar. */
export type DimPillarMatrix = Record<DimensionSlug, PillarScores>;

/** Score map from indicator slug → 0–100 score (or null if unscored). */
export type IndicatorScores = Record<string, number | null>;

/** A country and every score / rank / count attached to it. */
export interface CountryRanking {
  iso3: string;
  name: string;
  region: string;
  subregion: string;
  developing: string;
  wbRegion: string;
  incomeGroup: string;
  gdpPerCapitaPpp: number | null;

  /** Final GIRAI score, after URAI penalty. */
  girai: number | null;
  /** GIRAI score before URAI penalty. */
  giraiRaw: number | null;
  /** URAI penalty multiplier (1.0 = no penalty). */
  uraiPenalty: number | null;
  /** Number of URAI ("government misuse") evidence items recorded. */
  uraiCount: number;

  /**
   * Derived sub-score (0–100) of the AI Policy pillar. Computed as the mean
   * of the country's framework thematic-element ratings (Yes=100, Partially=50,
   * No=0) across every framework slot it has on AI Policy indicators.
   * Captures *policy substance coverage*.
   */
  frameworkScore: number | null;
  /**
   * Derived sub-score (0–100) of the AI Policy pillar. 50% mean of the
   * `plan`/`budget`/`monitoring` flags on the country's frameworks (Yes/
   * Partially/No → 100/50/0), 50% initiative coverage rate (share of AI
   * Policy indicators with at least one initiative on file). Captures
   * *execution depth*.
   */
  implementationScore: number | null;

  /** Global rank by GIRAI score (1 = best). */
  rankGlobal: number | null;
  /** Rank within the country's region. */
  rankRegional: number | null;
  /** Rank within the country's WB income group. */
  rankIncomeGroup: number | null;

  dimensionScores: DimensionScores;
  pillarScores: PillarScores;
  dimPillarMatrix: DimPillarMatrix;
  indicatorScores: IndicatorScores;

  dimensionRanksGlobal: Record<DimensionSlug, number | null>;
  dimensionRanksRegional: Record<DimensionSlug, number | null>;
  pillarRanksGlobal: Record<PillarSlug, number | null>;
  pillarRanksRegional: Record<PillarSlug, number | null>;

  frameworkRankGlobal: number | null;
  frameworkRankRegional: number | null;
  implementationRankGlobal: number | null;
  implementationRankRegional: number | null;

  /** Per-indicator evidence counts (only populated for indicators with evidence). */
  evidenceCounts: Record<string, EvidenceCounts>;
}

/** Aggregated averages for a slice of countries (global, region, income). */
export interface ScoreAggregates {
  girai: number | null;
  dimensions: DimensionScores;
  pillars: PillarScores;
  indicators: IndicatorScores;
  /** Mean of the derived `frameworkScore` across the slice. */
  frameworkScore: number | null;
  /** Mean of the derived `implementationScore` across the slice. */
  implementationScore: number | null;
}

/** Top-level shape of `rankings.json`. */
export interface RankingsArtifact {
  generatedAt: string;
  sourceHash: string;
  countries: CountryRanking[];
  aggregates: {
    global: ScoreAggregates;
    byRegion: Record<string, ScoreAggregates>;
    byIncomeGroup: Record<string, ScoreAggregates>;
  };
}

/** Top-level shape of `taxonomy.json`. */
export interface TaxonomyArtifact {
  generatedAt: string;
  sourceHash: string;
  dimensions: DimensionDef[];
  pillars: PillarDef[];
  indicators: IndicatorDef[];
}

// ---------------------------------------------------------------------------
// Evidence
//
// `evidence.json` lives under `public/` and contains a discriminated-union
// of every framework / initiative / CSO initiative / GMC item / URAI case
// produced by the 2026 GIRAI dataset. The schema mirrors what the build
// script emits (see scripts/build-data.ts, ADR 0005).

export type EvidenceKind =
  | "framework"
  | "initiative"
  | "cso-initiative"
  | "gmc-consultation"
  | "gmc-provision"
  | "gmc-mechanism"
  | "government-misuse";

export interface EvidenceCountryRef {
  iso3: string;
  name: string;
  region: string;
  subregion: string;
  developing: string;
  incomeGroup: string;
}

export interface EvidenceThematicElement {
  text: string;
  value: string;
  justification: string;
}

/**
 * Catch-all evidence shape. Most fields are optional because the kinds
 * have different field surfaces; consumers should branch on `kind`.
 */
export interface EvidenceItem {
  id: string;
  kind: EvidenceKind;
  country: EvidenceCountryRef;
  dimensionSlug: DimensionSlug;
  pillarSlug: PillarSlug;
  indicatorSlug: string;
  /** cso-initiative only — slugs of indicators this initiative also speaks to. */
  contributesTo?: string[];
  title: string;
  link?: string | null;
  /** Mirrored copy on the GIRAI Drive (used for cross-verification). */
  drive?: string | null;
  type?: string | null;
  justification: string;

  // framework-specific
  enforceability?: string | null;
  reach?: string | null;
  scope?: string | null;
  approval?: string | null;
  defenceAndSecurity?: { value: string; justification: string } | null;

  // initiative-specific
  consultation?: string | null;
  body?: { exists: string; name: string | null } | null;
  plan?: string | null;
  budget?: string | null;
  monitoring?: string | null;
  thematicElements?: EvidenceThematicElement[] | null;
}

/** Pathway ids used by the Evidence Hub picker (maps to kind groups in URL). */
export type EvidencePathwayId = "frameworks" | "initiatives" | "nonGov" | "misuse";

export interface EvidenceArtifact {
  generatedAt: string;
  sourceHash: string;
  totals: {
    /** Raw row count: one row can represent one indicator covered by a framework. */
    items: number;
    /** Display count of unique evidence identities, summed per kind. Frameworks are title-deduped. */
    uniqueItems: number;
    byKind: Record<EvidenceKind, number>;
    /** Display counts by kind. Non-framework kinds use URL when present, otherwise title. */
    uniqueItemsByKind: Record<EvidenceKind, number>;
    /** Display counts by kind, deduped by title only. Used for framework documents. */
    uniqueTitlesByKind: Record<EvidenceKind, number>;
    /** Countries in the indexed GIRAI country universe, including countries with zero evidence rows. */
    countriesIndexed: number;
    countriesWithItems: number;
    /** Distinct countries with at least one evidence item per pathway group. */
    countriesByPathway: Record<EvidencePathwayId, number>;
  };
  items: EvidenceItem[];
}

export interface IndicatorAdoptionEntry {
  adopted: number;
  draft: number;
  notAdopted: number;
  total: number;
}

export interface IndicatorAdoptionArtifact {
  generatedAt: string;
  sourceHash: string;
  totalCountries: number;
  frameworks: Record<string, IndicatorAdoptionEntry>;
}

/** Three factual checklist lines for one pillar on the country drivers section. */
export interface CountryPillarHighlight {
  bullets: [string, string, string];
}

/** Per-country pillar highlights for "What Drives This Performance?" */
export interface CountryPillarHighlightsEntry {
  iso3: string;
  pillars: Record<PillarSlug, CountryPillarHighlight>;
}

/** Top-level shape of `country-pillar-highlights.json`. */
export interface CountryPillarHighlightsArtifact {
  generatedAt: string;
  sourceHash: string;
  countries: CountryPillarHighlightsEntry[];
}

// ---------------------------------------------------------------------------
// Evidence Explorer slim index
//
// `evidence-index.json` lives under `public/` and is a denormalised, slim
// view of the evidence corpus optimised for client-side faceted search.
// Holds only the fields needed to render an evidence row and drive the
// filter/search UI in `<EvidenceExplorer />`. The full per-item record
// stays in `evidence.json` / accessible at `/evidence/[itemId]`.
//
// Why slim:
//   • Full evidence.json is ~7.3 MB (justifications, thematic elements,
//     etc.). Shipping that to the browser for an in-page filter is wasteful.
//   • The explorer never needs `justification` or thematic ratings until
//     a row is expanded; even then it can lazy-fetch from the full
//     artifact or rely on the detail page.

export interface EvidenceIndexRow {
  id: string;
  kind: EvidenceKind;
  title: string;
  link: string | null;
  type: string | null;
  enforceability: string | null;
  /** ISO 8601 date (yyyy-mm-dd) — frameworks only. */
  approval: string | null;
  country: {
    iso3: string;
    name: string;
    region: string;
    incomeGroup: string;
  };
  dimensionSlug: DimensionSlug;
  pillarSlug: PillarSlug;
  indicatorSlug: string;
  /** Human-readable indicator name (cached so the client doesn't need the taxonomy). */
  indicatorName: string;
}

export interface EvidenceIndexArtifact {
  generatedAt: string;
  sourceHash: string;
  totals: {
    items: number;
    uniqueItems?: number;
    byKind: Record<EvidenceKind, number>;
    uniqueItemsByKind?: Record<EvidenceKind, number>;
    uniqueTitlesByKind?: Record<EvidenceKind, number>;
    countriesIndexed?: number;
    countriesWithItems: number;
    countriesByPathway?: Record<EvidencePathwayId, number>;
  };
  /** Pre-computed facet option lists (sorted, distinct). */
  facets: {
    regions: string[];
    countries: Array<{ iso3: string; name: string }>;
  };
  rows: EvidenceIndexRow[];
}

/** Top-level shape of `countries.json` (basic country metadata, no scores). */
export interface CountriesArtifact {
  generatedAt: string;
  sourceHash: string;
  countries: Array<
    Pick<
      CountryRanking,
      | "iso3"
      | "name"
      | "region"
      | "subregion"
      | "developing"
      | "wbRegion"
      | "incomeGroup"
      | "gdpPerCapitaPpp"
    >
  >;
}
