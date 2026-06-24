import {
  getAllCountries,
  getCountryByIso3,
  getRegions,
  getRegionSummaries,
} from "@/lib/girai/data";
import type { CountryRanking } from "@/lib/girai/types";
import { regionToSlug } from "@/lib/regions";
import {
  DIMENSIONS,
  findDimension,
  findIndicator,
  findPillar,
  INDICATORS,
} from "@/data/2026/taxonomy";
import type { DimensionSlug, PillarSlug } from "@/data/2026/taxonomy";

export function resolveCountry(query: string): CountryRanking | undefined {
  const trimmed = query.trim();
  if (!trimmed) return undefined;

  const byIso = getCountryByIso3(trimmed.toUpperCase());
  if (byIso) return byIso;

  const lower = trimmed.toLowerCase();
  const exact = getAllCountries().find(
    (c) => c.name.toLowerCase() === lower
  );
  if (exact) return exact;

  const partial = getAllCountries().filter((c) =>
    c.name.toLowerCase().includes(lower)
  );
  return partial.length === 1 ? partial[0] : undefined;
}

export function resolveRegion(query: string): string | undefined {
  const trimmed = query.trim();
  if (!trimmed) return undefined;

  const regions = getRegions();
  const lower = trimmed.toLowerCase();
  const slug = regionToSlug(trimmed);

  const exact = regions.find(
    (r) =>
      r.toLowerCase() === lower ||
      regionToSlug(r) === lower ||
      regionToSlug(r) === slug
  );
  if (exact) return exact;

  const partial = regions.filter(
    (r) =>
      r.toLowerCase().includes(lower) || regionToSlug(r).includes(lower)
  );
  return partial.length === 1 ? partial[0] : undefined;
}

export function resolveRegionSummary(query: string) {
  const region = resolveRegion(query);
  if (!region) return undefined;
  return getRegionSummaries().find((r) => r.region === region);
}

export function resolveDimension(
  query: string
): { slug: DimensionSlug; name: string } | undefined {
  const found = findDimension(query);
  if (found) return { slug: found.slug, name: found.name };
  const lower = query.toLowerCase();
  const match = DIMENSIONS.find(
    (d) =>
      d.slug === lower ||
      d.name.toLowerCase().includes(lower) ||
      d.aliases.some((a) => a.toLowerCase().includes(lower))
  );
  return match ? { slug: match.slug, name: match.name } : undefined;
}

export function resolvePillar(
  query: string
): { slug: PillarSlug; name: string } | undefined {
  const found = findPillar(query);
  if (found) return { slug: found.slug, name: found.name };
  return undefined;
}

export function resolveIndicator(query: string) {
  const found = findIndicator(query);
  if (found) return found;
  const lower = query.toLowerCase();
  return INDICATORS.find(
    (i) =>
      i.slug === lower ||
      i.name.toLowerCase().includes(lower) ||
      i.aliases.some((a) => a.toLowerCase().includes(lower))
  );
}

export function topDimensions(country: CountryRanking, n = 2) {
  return DIMENSIONS.map((d) => ({
    slug: d.slug,
    name: d.name,
    score: country.dimensionScores[d.slug],
  }))
    .filter((d) => d.score !== null)
    .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
    .slice(0, n);
}

export function bottomDimensions(country: CountryRanking, n = 2) {
  return DIMENSIONS.map((d) => ({
    slug: d.slug,
    name: d.name,
    score: country.dimensionScores[d.slug],
  }))
    .filter((d) => d.score !== null)
    .sort((a, b) => (a.score ?? 0) - (b.score ?? 0))
    .slice(0, n);
}
