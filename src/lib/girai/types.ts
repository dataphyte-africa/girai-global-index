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

  /** Per-indicator evidence counts (only populated for indicators with evidence). */
  evidenceCounts: Record<string, EvidenceCounts>;
}

/** Aggregated averages for a slice of countries (global, region, income). */
export interface ScoreAggregates {
  girai: number | null;
  dimensions: DimensionScores;
  pillars: PillarScores;
  indicators: IndicatorScores;
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

export interface EvidenceArtifact {
  generatedAt: string;
  sourceHash: string;
  totals: {
    items: number;
    byKind: Record<EvidenceKind, number>;
    countriesWithItems: number;
  };
  items: EvidenceItem[];
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
