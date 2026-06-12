/**
 * Derived statistics for the dimension detail pages.
 *
 * Everything here is computed at build/render time from the committed
 * `rankings.json` + `evidence.json` artifacts (135 countries, ~3k evidence
 * items) — cheap and pure, so we don't memoize. Kept separate from
 * `data.ts` so the thin accessor layer stays free of page-specific shaping.
 */

import {
  getAllCountries,
  getDimensionLeaderboard,
  getIndicatorLeaderboard,
  getEvidenceByDimension,
  getGlobalAverages,
  getRegionAverages,
  getRegions,
  getIndicatorsByDimension,
} from "./data";
import type { DimensionSlug, PillarSlug } from "./types";
import { PILLARS } from "@/data/2026/taxonomy";

// ---------------------------------------------------------------------------
// Score summary (drives the stat bar under the map)

export interface DimensionScoreStats {
  globalAverage: number | null;
  highest: { score: number; iso3: string; name: string } | null;
  lowest: { score: number; iso3: string; name: string } | null;
  countriesScored: number;
  /** Number of scored countries at or above the global average. */
  aboveAverage: number;
}

export function getDimensionScoreStats(slug: DimensionSlug): DimensionScoreStats {
  const leaderboard = getDimensionLeaderboard(slug);
  const globalAverage = getGlobalAverages().dimensions[slug];

  if (leaderboard.length === 0) {
    return {
      globalAverage,
      highest: null,
      lowest: null,
      countriesScored: 0,
      aboveAverage: 0,
    };
  }

  const top = leaderboard[0];
  const bottom = leaderboard[leaderboard.length - 1];
  const avg = globalAverage ?? 0;

  return {
    globalAverage,
    highest: { score: top.score, iso3: top.country.iso3, name: top.country.name },
    lowest: { score: bottom.score, iso3: bottom.country.iso3, name: bottom.country.name },
    countriesScored: leaderboard.length,
    aboveAverage: leaderboard.filter((e) => e.score >= avg).length,
  };
}

export interface IndicatorRegionalScore {
  region: string;
  score: number | null;
}

/** Per-region average scores for a single indicator, sorted highest first. */
export function getIndicatorRegionalAverages(slug: string): IndicatorRegionalScore[] {
  const regions = getRegions();
  const regionAverages = getRegionAverages();

  return regions
    .map((region) => ({
      region,
      score: regionAverages[region]?.indicators[slug] ?? null,
    }))
    .sort((a, b) => (b.score ?? -1) - (a.score ?? -1));
}

export function getIndicatorScoreStats(slug: string): DimensionScoreStats {
  const leaderboard = getIndicatorLeaderboard(slug);
  const globalAverage = getGlobalAverages().indicators[slug] ?? null;

  if (leaderboard.length === 0) {
    return {
      globalAverage,
      highest: null,
      lowest: null,
      countriesScored: 0,
      aboveAverage: 0,
    };
  }

  const top = leaderboard[0];
  const bottom = leaderboard[leaderboard.length - 1];
  const avg = globalAverage ?? 0;

  return {
    globalAverage,
    highest: { score: top.score, iso3: top.country.iso3, name: top.country.name },
    lowest: { score: bottom.score, iso3: bottom.country.iso3, name: bottom.country.name },
    countriesScored: leaderboard.length,
    aboveAverage: leaderboard.filter((e) => e.score >= avg).length,
  };
}

// ---------------------------------------------------------------------------
// Evidence-derived aggregate statistics (the 4 headline numbers)

export interface DimensionAggregateStats {
  /** Documented AI-policy frameworks attributed to this dimension. */
  frameworks: number;
  /** Documented government implementation activities (initiatives). */
  initiatives: number;
  /** Civil-society / non-governmental initiatives. */
  csoInitiatives: number;
  /** Distinct countries that have a dedicated implementing/oversight body. */
  countriesWithOversight: number;
}

function isAffirmative(value: string | null | undefined): boolean {
  if (!value) return false;
  const v = value.toLowerCase();
  return v === "yes" || v === "partially" || v === "true";
}

export function getDimensionAggregateStats(
  slug: DimensionSlug
): DimensionAggregateStats {
  const items = getEvidenceByDimension(slug);

  let frameworks = 0;
  let initiatives = 0;
  let csoInitiatives = 0;
  const oversightCountries = new Set<string>();

  for (const it of items) {
    switch (it.kind) {
      case "framework":
        frameworks += 1;
        break;
      case "initiative":
        initiatives += 1;
        if (it.body && isAffirmative(it.body.exists)) {
          oversightCountries.add(it.country.iso3);
        }
        break;
      case "cso-initiative":
        csoInitiatives += 1;
        break;
      default:
        break;
    }
  }

  return {
    frameworks,
    initiatives,
    csoInitiatives,
    countriesWithOversight: oversightCountries.size,
  };
}

// ---------------------------------------------------------------------------
// Regional performance (grouped bar chart)

export interface RegionalIndicatorRow {
  slug: string;
  name: string;
  pillar: PillarSlug;
  /** region name → average score (0–100) or null. */
  byRegion: Record<string, number | null>;
}

/** Per-indicator regional averages for every indicator in the dimension. */
export function getDimensionRegionalIndicatorAverages(
  slug: DimensionSlug
): RegionalIndicatorRow[] {
  const regions = getRegions();
  const regionAverages = getRegionAverages();
  const indicators = getIndicatorsByDimension(slug);

  return indicators.map((ind) => {
    const byRegion: Record<string, number | null> = {};
    for (const region of regions) {
      byRegion[region] = regionAverages[region]?.indicators[ind.slug] ?? null;
    }
    return { slug: ind.slug, name: ind.name, pillar: ind.pillar, byRegion };
  });
}

export interface RegionalPillarRow {
  slug: PillarSlug;
  name: string;
  /** region name → average score (0–100) or null. */
  byRegion: Record<string, number | null>;
}

/**
 * Per-pillar regional averages *within this dimension*, computed from each
 * country's dimension × pillar matrix (the region aggregates only carry
 * global pillar scores, so we average the matrix cells ourselves).
 */
export function getDimensionRegionalPillarAverages(
  slug: DimensionSlug
): RegionalPillarRow[] {
  const regions = getRegions();
  const countries = getAllCountries();

  // pillar → region → { sum, count }
  const acc = new Map<PillarSlug, Map<string, { sum: number; count: number }>>();
  for (const pillar of PILLARS) {
    acc.set(pillar.slug, new Map(regions.map((r) => [r, { sum: 0, count: 0 }])));
  }

  for (const country of countries) {
    const cell = country.dimPillarMatrix?.[slug];
    if (!cell || !country.region) continue;
    for (const pillar of PILLARS) {
      const score = cell[pillar.slug];
      if (score === null || score === undefined) continue;
      const bucket = acc.get(pillar.slug)?.get(country.region);
      if (bucket) {
        bucket.sum += score;
        bucket.count += 1;
      }
    }
  }

  return PILLARS.map((pillar) => {
    const byRegion: Record<string, number | null> = {};
    const regionMap = acc.get(pillar.slug)!;
    for (const region of regions) {
      const bucket = regionMap.get(region)!;
      byRegion[region] = bucket.count > 0 ? bucket.sum / bucket.count : null;
    }
    return { slug: pillar.slug, name: pillar.name, byRegion };
  });
}

/** Stable colour ramp for the GIRAI regions (brand-aligned). */
export const REGION_COLORS: Record<string, string> = {
  Europe: "#6c5cff",
  "Northern America": "#3b82f6",
  "Asia and Oceania": "#f59e0b",
  "Middle East": "#c4b5fd",
  Africa: "#f472b6",
  "South and Central America": "#10b981",
  Caribbean: "#14b8a6",
};

/** Colour for a region, with a deterministic fallback. */
export function regionColor(region: string): string {
  return REGION_COLORS[region] ?? "#94a3b8";
}
