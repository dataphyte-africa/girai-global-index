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
import pillarHighlightsData from "@/data/2026/generated/country-pillar-highlights.json";
import editionEvidenceStatusData from "@/data/2026/generated/country-edition-evidence-status.json";
import { DIMENSIONS, PILLARS, INDICATORS } from "@/data/2026/taxonomy";
import type {
  DimensionScores,
  PillarScores,
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
  CountryPillarHighlightsArtifact,
  CountryPillarHighlightsEntry,
  CountryEditionEvidenceStatusArtifact,
  CountryEditionEvidenceStatusEntry,
  EditionPathwayId,
} from "./types";

// The JSON files are typed as `unknown`-ish by TypeScript; cast once at
// the boundary. This is the only place we narrow.
const rankings = rankingsData as unknown as RankingsArtifact;
const taxonomy = taxonomyData as unknown as TaxonomyArtifact;
const countries = countriesData as unknown as CountriesArtifact;
const evidence = evidenceData as unknown as EvidenceArtifact;
const pillarHighlights =
  pillarHighlightsData as unknown as CountryPillarHighlightsArtifact;
const editionEvidenceStatus =
  editionEvidenceStatusData as unknown as CountryEditionEvidenceStatusArtifact;

/** All countries with full scores, ordered as they appear in the dataset. */
export function getAllCountries(): CountryRanking[] {
  return rankings.countries;
}

/** Look up a country by ISO3, returning `undefined` if missing. */
export function getCountryByIso3(iso3: string): CountryRanking | undefined {
  return rankings.countries.find((c) => c.iso3 === iso3);
}

/** Pillar checklist bullets for the country "What Drives This Performance?" section. */
export function getCountryPillarHighlights(
  iso3: string
): CountryPillarHighlightsEntry | undefined {
  const code = iso3.toUpperCase();
  return pillarHighlights.countries.find((c) => c.iso3 === code);
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
// Subregions
//
// `subregion` ships on every country record but the build step only
// pre-aggregates by region and income group, so these averages are derived
// here and memoized. It is a single pass over 135 rows, done once per process.
//
// Three regions — Caribbean, Middle East and Northern America — carry an
// empty `subregion` because the region already *is* the finest geographic
// unit GIRAI publishes for them. Treating them as a subregion named after
// their region keeps the subregion axis total: every country belongs to
// exactly one, so subregion averages roll back up to the global average.

/** The subregion a country belongs to, falling back to its region. */
export function getCountrySubregion(country: CountryRanking): string {
  return country.subregion?.trim() || country.region;
}

export interface SubregionSummary {
  subregion: string;
  /** Parent GIRAI region — subregion names are only unique within one. */
  region: string;
  /** True when the region has no published subregion split and stands in for one. */
  isWholeRegion: boolean;
  averageGirai: number;
  countryCount: number;
  /** Rank of this subregion's average among all subregions, 1 = highest. */
  globalRank: number;
  /** Rank among the subregions of the same parent region, 1 = highest. */
  rankWithinRegion: number;
  dimensions: DimensionScores;
  pillars: PillarScores;
  frameworkScore: number | null;
  implementationScore: number | null;
}

function mean(values: (number | null)[]): number | null {
  const scored = values.filter((v): v is number => v !== null);
  return scored.length
    ? scored.reduce((sum, v) => sum + v, 0) / scored.length
    : null;
}

let subregionSummaryCache: SubregionSummary[] | null = null;

/**
 * Every subregion with its average scores, ranked by average GIRAI score.
 * Memoized — the country list is static for the lifetime of the process.
 */
export function getSubregionSummaries(): SubregionSummary[] {
  if (subregionSummaryCache) return subregionSummaryCache;

  // Keyed on region + subregion because subregion names are only unique
  // within a region; the value carries both so the key is never parsed back.
  const groups = new Map<
    string,
    { region: string; subregion: string; members: CountryRanking[] }
  >();
  for (const c of rankings.countries) {
    const sub = getCountrySubregion(c);
    const key = c.region + "|" + sub;
    const bucket = groups.get(key);
    if (bucket) bucket.members.push(c);
    else groups.set(key, { region: c.region, subregion: sub, members: [c] });
  }

  const rows: SubregionSummary[] = [];
  for (const { region, subregion, members } of groups.values()) {
    const averageGirai = mean(members.map((c) => c.girai));
    if (averageGirai === null) continue;
    rows.push({
      subregion,
      region,
      isWholeRegion: subregion === region,
      averageGirai,
      countryCount: members.length,
      globalRank: 0,
      rankWithinRegion: 0,
      dimensions: Object.fromEntries(
        DIMENSIONS.map((d) => [d.slug, mean(members.map((c) => c.dimensionScores[d.slug]))])
      ) as DimensionScores,
      pillars: Object.fromEntries(
        PILLARS.map((p) => [p.slug, mean(members.map((c) => c.pillarScores[p.slug]))])
      ) as PillarScores,
      frameworkScore: mean(members.map((c) => c.frameworkScore)),
      implementationScore: mean(members.map((c) => c.implementationScore)),
    });
  }

  rows.sort((a, b) => b.averageGirai - a.averageGirai);
  rows.forEach((r, i) => (r.globalRank = i + 1));
  const seenPerRegion = new Map<string, number>();
  for (const r of rows) {
    const next = (seenPerRegion.get(r.region) ?? 0) + 1;
    seenPerRegion.set(r.region, next);
    r.rankWithinRegion = next;
  }

  subregionSummaryCache = rows;
  return rows;
}

/** Distinct subregion names paired with their parent region, best-average first. */
export function getSubregions(): { subregion: string; region: string }[] {
  return getSubregionSummaries().map((r) => ({
    subregion: r.subregion,
    region: r.region,
  }));
}

/** Countries belonging to a subregion, best score first. */
export function getCountriesBySubregion(subregion: string): CountryRanking[] {
  return rankings.countries
    .filter((c) => getCountrySubregion(c) === subregion)
    .sort((a, b) => (b.girai ?? -1) - (a.girai ?? -1));
}

/**
 * A country's rank among the scored countries of its own subregion.
 * Ties share a rank, matching the build step's ranking convention.
 */
export function getSubregionalRank(country: CountryRanking): number | null {
  if (country.girai === null) return null;
  const peers = getCountriesBySubregion(getCountrySubregion(country)).filter(
    (c) => c.girai !== null
  );
  const better = peers.filter((c) => (c.girai ?? 0) > country.girai!).length;
  return better + 1;
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

export function getEvidenceByRegion(region: string): EvidenceItem[] {
  return evidence.items.filter((it) => it.country.region === region);
}

function normalizeEvidenceText(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeEvidenceUrl(value: string | null | undefined): string {
  return normalizeEvidenceText(value)
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/[#?].*$/, "")
    .replace(/\/$/, "");
}

function evidenceIdentity(item: EvidenceItem): string {
  if (item.kind === "framework") return normalizeEvidenceText(item.title) || item.id;
  return normalizeEvidenceUrl(item.link) || normalizeEvidenceText(item.title) || item.id;
}

/**
 * Count distinct evidence items, deduped the same way the Evidence Explorer's
 * stats card does: by normalized URL (or title for frameworks) within each kind.
 * A single piece of evidence is assessed under multiple indicators, so the raw
 * item count (one row per indicator case) is larger than this unique count.
 */
export function countUniqueEvidence(items: EvidenceItem[]): number {
  const byKind = new Map<EvidenceKind, Set<string>>();
  for (const item of items) {
    const set = byKind.get(item.kind) ?? new Set<string>();
    set.add(evidenceIdentity(item));
    byKind.set(item.kind, set);
  }
  return Array.from(byKind.values()).reduce((sum, set) => sum + set.size, 0);
}

/** URAI / government-misuse cases for a country (Unacceptable Risk AI Systems). */
export function getGovernmentMisuseByCountry(iso3: string): EvidenceItem[] {
  const code = iso3.toUpperCase();
  return evidence.items.filter(
    (it) => it.country.iso3 === code && it.kind === "government-misuse"
  );
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

/** Full edition-comparison artifact (2024 vs 2026 evidence status). */
export function getEditionEvidenceStatusArtifact(): CountryEditionEvidenceStatusArtifact {
  return editionEvidenceStatus;
}

/** Per-country 2024/2026 evidence status for the edition-comparison table. */
export function getCountryEditionEvidenceStatus(
  iso3: string
): CountryEditionEvidenceStatusEntry | undefined {
  return editionEvidenceStatus.countries[iso3.toUpperCase()];
}
