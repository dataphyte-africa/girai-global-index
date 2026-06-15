import { PILLARS, type PillarSlug } from "@/data/2026/taxonomy";
import type { PillarScores } from "./types";

/** Official GIRAI pillar weights used in the composite score. */
export const PILLAR_WEIGHTS: Record<PillarSlug, number> = {
  "ai-policy": 0.6,
  "cso-engagement": 0.1,
  "enabling-conditions": 0.3,
};

/** Weighted share: each pillar's contribution to the weighted pillar total (sums to 100). */
export function computePillarContributionMix(
  pillarScores: PillarScores
): Record<PillarSlug, number | null> {
  const weightedSum = PILLARS.reduce((acc, p) => {
    const score = pillarScores[p.slug];
    if (score === null) return acc;
    return acc + score * PILLAR_WEIGHTS[p.slug];
  }, 0);

  if (weightedSum <= 0) {
    return Object.fromEntries(PILLARS.map((p) => [p.slug, null])) as Record<
      PillarSlug,
      number | null
    >;
  }

  return Object.fromEntries(
    PILLARS.map((p) => {
      const score = pillarScores[p.slug];
      if (score === null) return [p.slug, null];
      const weighted = score * PILLAR_WEIGHTS[p.slug];
      return [p.slug, (weighted / weightedSum) * 100];
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
