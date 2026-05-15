/**
 * Data-access module for the 2026 GIRAI dataset.
 *
 * Imports the build-time JSON artifacts and exposes typed accessors used
 * by server components. Keep this module thin — it should never compute
 * anything heavy on every call. All ranks, averages and aggregates are
 * pre-computed by `scripts/build-data.ts` and live inside the JSON.
 *
 * Per ADR 0001, the JSON is committed to the repo; importing it directly
 * gives static-analysis friendly behaviour and zero runtime cost.
 */

import rankingsData from "@/data/2026/generated/rankings.json";
import taxonomyData from "@/data/2026/generated/taxonomy.json";
import countriesData from "@/data/2026/generated/countries.json";
import evidenceData from "@/data/2026/generated/evidence.json";
import { DIMENSIONS, PILLARS, INDICATORS } from "@/data/2026/taxonomy";
import type {
  CountryRanking,
  RankingsArtifact,
  TaxonomyArtifact,
  CountriesArtifact,
  EvidenceArtifact,
  EvidenceItem,
  EvidenceKind,
  DimensionSlug,
  PillarSlug,
  ScoreAggregates,
  IndicatorDef,
} from "./types";

// The JSON files are typed as `unknown`-ish by TypeScript; cast once at
// the boundary. This is the only place we narrow.
const rankings = rankingsData as unknown as RankingsArtifact;
const taxonomy = taxonomyData as unknown as TaxonomyArtifact;
const countries = countriesData as unknown as CountriesArtifact;
const evidence = evidenceData as unknown as EvidenceArtifact;

/** All countries with full scores, ordered as they appear in the dataset. */
export function getAllCountries(): CountryRanking[] {
  return rankings.countries;
}

/** Look up a country by ISO3, returning `undefined` if missing. */
export function getCountryByIso3(iso3: string): CountryRanking | undefined {
  return rankings.countries.find((c) => c.iso3 === iso3);
}

/** Distinct GIRAI regions present in the dataset, sorted alphabetically. */
export function getRegions(): string[] {
  const set = new Set<string>();
  for (const c of rankings.countries) if (c.region) set.add(c.region);
  return Array.from(set).sort();
}

/** Distinct WB income groups present in the dataset, sorted alphabetically. */
export function getIncomeGroups(): string[] {
  const set = new Set<string>();
  for (const c of rankings.countries) if (c.incomeGroup) set.add(c.incomeGroup);
  return Array.from(set).sort();
}

/**
 * Top and bottom N countries by GIRAI score. Mirrors the legacy
 * `getTopAndBottomCountries` API surface. Bottom is reversed so worst
 * appears first in the rendered list.
 */
export function getTopAndBottomCountries(count = 10): {
  topCountries: CountryRanking[];
  bottomCountries: CountryRanking[];
} {
  const sorted = [...rankings.countries]
    .filter((c) => c.girai !== null)
    .sort((a, b) => (b.girai ?? 0) - (a.girai ?? 0));
  return {
    topCountries: sorted.slice(0, count),
    bottomCountries: sorted.slice(-count).reverse(),
  };
}

/** Aggregated averages for the entire dataset. */
export function getGlobalAverages(): ScoreAggregates {
  return rankings.aggregates.global;
}

/** Aggregated averages keyed by region. */
export function getRegionAverages(): Record<string, ScoreAggregates> {
  return rankings.aggregates.byRegion;
}

/** Aggregated averages keyed by WB income group. */
export function getIncomeGroupAverages(): Record<string, ScoreAggregates> {
  return rankings.aggregates.byIncomeGroup;
}

/**
 * Per-region summary used by the regional comparison surface. Includes the
 * number of countries in each region, the average GIRAI score, and the
 * region's global rank by that average.
 */
export interface RegionSummary {
  region: string;
  averageGirai: number;
  countryCount: number;
  globalRank: number;
  dimensions: ScoreAggregates["dimensions"];
  pillars: ScoreAggregates["pillars"];
}

export function getRegionSummaries(): RegionSummary[] {
  const counts = new Map<string, number>();
  for (const c of rankings.countries) {
    counts.set(c.region, (counts.get(c.region) ?? 0) + 1);
  }
  const rows: RegionSummary[] = [];
  for (const [region, agg] of Object.entries(rankings.aggregates.byRegion)) {
    if (agg.girai === null) continue;
    rows.push({
      region,
      averageGirai: agg.girai,
      countryCount: counts.get(region) ?? 0,
      globalRank: 0,
      dimensions: agg.dimensions,
      pillars: agg.pillars,
    });
  }
  rows.sort((a, b) => b.averageGirai - a.averageGirai);
  rows.forEach((r, i) => (r.globalRank = i + 1));
  return rows;
}

// ---------------------------------------------------------------------------
// Taxonomy

export function getTaxonomy(): TaxonomyArtifact {
  return taxonomy;
}

export function getDimensionDefs() {
  return DIMENSIONS;
}

export function getPillarDefs() {
  return PILLARS;
}

export function getIndicatorDefs(): IndicatorDef[] {
  return INDICATORS;
}

export function getIndicatorsByDimension(slug: DimensionSlug): IndicatorDef[] {
  return INDICATORS.filter((i) => i.dimension === slug);
}

export function getIndicatorsByPillar(slug: PillarSlug): IndicatorDef[] {
  return INDICATORS.filter((i) => i.pillar === slug);
}

// ---------------------------------------------------------------------------
// Provenance

export function getDatasetProvenance() {
  return {
    generatedAt: rankings.generatedAt,
    sourceHash: rankings.sourceHash,
    countryCount: rankings.countries.length,
    indicatorCount: INDICATORS.length,
  };
}

// Re-export simple country metadata if a caller doesn't want full scores.
export function getBasicCountries() {
  return countries.countries;
}

// ---------------------------------------------------------------------------
// Score-leaderboard helpers
//
// These pre-sort countries for the various per-dimension and per-indicator
// surfaces. They're cheap (135 rows) and pure, so we don't memoize.

export interface ScoreLeaderboardEntry {
  country: CountryRanking;
  score: number;
}

function buildLeaderboard(
  resolve: (c: CountryRanking) => number | null
): ScoreLeaderboardEntry[] {
  return rankings.countries
    .map((country) => ({ country, score: resolve(country) }))
    .filter((row): row is ScoreLeaderboardEntry => row.score !== null)
    .sort((a, b) => b.score - a.score);
}

export function getDimensionLeaderboard(slug: DimensionSlug): ScoreLeaderboardEntry[] {
  return buildLeaderboard((c) => c.dimensionScores[slug] ?? null);
}

export function getPillarLeaderboard(slug: PillarSlug): ScoreLeaderboardEntry[] {
  return buildLeaderboard((c) => c.pillarScores[slug] ?? null);
}

export function getIndicatorLeaderboard(slug: string): ScoreLeaderboardEntry[] {
  return buildLeaderboard((c) => c.indicatorScores[slug] ?? null);
}

// ---------------------------------------------------------------------------
// Evidence access

export function getEvidenceArtifact(): EvidenceArtifact {
  return evidence;
}

export function getAllEvidenceItems(): EvidenceItem[] {
  return evidence.items;
}

/** Look up a single evidence item by its public ID (per ADR 0007). */
export function getEvidenceById(id: string): EvidenceItem | undefined {
  return evidence.items.find((it) => it.id === id);
}

export function getEvidenceByIndicator(slug: string): EvidenceItem[] {
  return evidence.items.filter(
    (it) => it.indicatorSlug === slug || it.contributesTo?.includes(slug)
  );
}

export function getEvidenceByDimension(slug: DimensionSlug): EvidenceItem[] {
  return evidence.items.filter((it) => it.dimensionSlug === slug);
}

export function getEvidenceByCountry(iso3: string): EvidenceItem[] {
  return evidence.items.filter((it) => it.country.iso3 === iso3);
}

export function countEvidenceByIndicator(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const it of evidence.items) {
    counts[it.indicatorSlug] = (counts[it.indicatorSlug] ?? 0) + 1;
  }
  return counts;
}

/** Total evidence items keyed by kind (mirror of `evidence.totals.byKind`). */
export function getEvidenceTotals(): Record<EvidenceKind, number> {
  return evidence.totals.byKind;
}
