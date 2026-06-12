import type { CountryRanking } from "@/lib/girai";
import type { DimensionSlug, PillarSlug } from "@/data/2026/taxonomy";
import { DIMENSIONS, PILLARS } from "@/data/2026/taxonomy";

export interface ScoreFilterSelection {
  dimensions: string[];
  pillars: string[];
}

export const EMPTY_SCORE_FILTER: ScoreFilterSelection = {
  dimensions: [],
  pillars: [],
};

/**
 * Resolve the score used for map colouring, table columns, and sorting.
 *
 * Homepage: averages all selected dimension + pillar scores; falls back to
 * overall GIRAI when none are selected.
 *
 * Dimension page (lockedDimensionSlug): defaults to that dimension's score;
 * when pillars are selected, averages those pillars within the dimension
 * matrix instead.
 */
export function resolvePerformanceScore(
  country: CountryRanking,
  scoreFilter: ScoreFilterSelection,
  opts?: { lockedDimensionSlug?: DimensionSlug }
): number | null {
  const locked = opts?.lockedDimensionSlug;

  if (locked) {
    if (scoreFilter.pillars.length > 0) {
      const matrix = country.dimPillarMatrix[locked];
      const values = scoreFilter.pillars
        .map((slug) => matrix[slug as PillarSlug])
        .filter((v): v is number => v != null);
      if (values.length > 0) {
        return values.reduce((sum, v) => sum + v, 0) / values.length;
      }
    }
    return country.dimensionScores[locked] ?? null;
  }

  const values: number[] = [];
  for (const slug of scoreFilter.dimensions) {
    const v = country.dimensionScores[slug as DimensionSlug];
    if (v != null) values.push(v);
  }
  for (const slug of scoreFilter.pillars) {
    const v = country.pillarScores[slug as PillarSlug];
    if (v != null) values.push(v);
  }

  if (values.length === 0) return country.girai;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/** Regional rank (1 = highest within region) for a custom score function. */
export function buildRegionalScoreRankMap(
  countries: CountryRanking[],
  getScore: (c: CountryRanking) => number | null
): Map<string, number> {
  const byRegion = new Map<string, { iso3: string; score: number }[]>();
  for (const c of countries) {
    const score = getScore(c);
    if (score == null || !c.region) continue;
    const list = byRegion.get(c.region) ?? [];
    list.push({ iso3: c.iso3, score });
    byRegion.set(c.region, list);
  }

  const map = new Map<string, number>();
  for (const list of byRegion.values()) {
    list.sort((a, b) => b.score - a.score);
    list.forEach((row, index) => map.set(row.iso3, index + 1));
  }
  return map;
}

/** Global rank (1 = highest) for a custom score function over the dataset. */
export function buildScoreRankMap(
  countries: CountryRanking[],
  getScore: (c: CountryRanking) => number | null
): Map<string, number> {
  const ranked = countries
    .map((c) => ({ iso3: c.iso3, score: getScore(c) }))
    .filter((row): row is { iso3: string; score: number } => row.score != null)
    .sort((a, b) => b.score - a.score);

  const map = new Map<string, number>();
  ranked.forEach((row, index) => map.set(row.iso3, index + 1));
  return map;
}

export function usesCustomScoreFilter(
  scoreFilter: ScoreFilterSelection,
  lockedDimensionSlug?: DimensionSlug
): boolean {
  if (lockedDimensionSlug) return scoreFilter.pillars.length > 0;
  return scoreFilter.dimensions.length > 0 || scoreFilter.pillars.length > 0;
}

export function scoreColumnLabel(
  scoreFilter: ScoreFilterSelection,
  opts?: { lockedDimensionSlug?: DimensionSlug }
): string {
  const locked = opts?.lockedDimensionSlug;
  const dimNames = scoreFilter.dimensions
    .map((slug) => DIMENSIONS.find((d) => d.slug === slug)?.name)
    .filter(Boolean) as string[];
  const pillarNames = scoreFilter.pillars
    .map((slug) => PILLARS.find((p) => p.slug === slug)?.name)
    .filter(Boolean) as string[];

  if (locked) {
    if (pillarNames.length === 1) return pillarNames[0];
    if (pillarNames.length > 1) return "Avg. pillar score";
    return DIMENSIONS.find((d) => d.slug === locked)?.name ?? "Score";
  }

  if (dimNames.length === 0 && pillarNames.length === 0) return "Index";
  if (dimNames.length === 1 && pillarNames.length === 0) return dimNames[0];
  if (pillarNames.length === 1 && dimNames.length === 0) return pillarNames[0];
  return "Avg. score";
}

export const DIMENSION_FILTER_OPTIONS = DIMENSIONS.map((d) => ({
  slug: d.slug,
  name: d.name,
}));

export const PILLAR_FILTER_OPTIONS = PILLARS.map((p) => ({
  slug: p.slug,
  name: p.name,
}));
