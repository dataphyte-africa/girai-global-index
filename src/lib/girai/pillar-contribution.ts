import { PILLARS, type PillarSlug } from "@/data/2026/taxonomy";
import type { PillarScores } from "./types";

/** Score-mix share: each pillar's contribution to the pillar score total (sums to 100). */
export function computePillarContributionMix(
  pillarScores: PillarScores
): Record<PillarSlug, number | null> {
  const sum = PILLARS.reduce((acc, p) => acc + (pillarScores[p.slug] ?? 0), 0);
  if (sum <= 0) {
    return Object.fromEntries(PILLARS.map((p) => [p.slug, null])) as Record<
      PillarSlug,
      number | null
    >;
  }
  return Object.fromEntries(
    PILLARS.map((p) => {
      const score = pillarScores[p.slug];
      return [p.slug, score !== null ? (score / sum) * 100 : null];
    })
  ) as Record<PillarSlug, number | null>;
}

function median(sorted: number[]): number | null {
  if (sorted.length === 0) return null;
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid]!;
  return (sorted[mid - 1]! + sorted[mid]!) / 2;
}

/** Global median pillar score per slug (for Strengths vs Focus area labels). */
export function computePillarMedians(
  countries: { pillarScores: PillarScores }[]
): Record<PillarSlug, number | null> {
  return Object.fromEntries(
    PILLARS.map((p) => {
      const scores = countries
        .map((c) => c.pillarScores[p.slug])
        .filter((s): s is number => s !== null && Number.isFinite(s))
        .sort((a, b) => a - b);
      return [p.slug, median(scores)];
    })
  ) as Record<PillarSlug, number | null>;
}
