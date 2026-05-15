/**
 * Build-time narrative fallbacks for country-story surfaces.
 *
 * These templates are intentionally generic. They run as the fallback
 * tier described in ADR 0004 ("CMS-first, AI fallback") — once Sanity
 * narratives ship, the country-story components should prefer those
 * over the strings produced here. The slug-keyed shape (dimension /
 * pillar) tracks the canonical 2026 taxonomy in `src/data/2026/taxonomy.ts`.
 */

import type { DimensionSlug, PillarSlug } from "@/data/2026/taxonomy";
import { getDimension, getPillar } from "@/data/2026/taxonomy";

// ---------------------------------------------------------------------------
// Score tiers

export type ScoreTier = "leader" | "advanced" | "developing" | "emerging" | "nascent";

export interface NarrativeResult {
  tier: ScoreTier;
  label: string;
  narrative: string;
  color: string;
}

export function getScoreTier(score: number): ScoreTier {
  if (score >= 80) return "leader";
  if (score >= 60) return "advanced";
  if (score >= 40) return "developing";
  if (score >= 20) return "emerging";
  return "nascent";
}

export const tierColors: Record<ScoreTier, string> = {
  leader: "#10b981", // emerald-500
  advanced: "#3b82f6", // blue-500
  developing: "#f59e0b", // amber-500
  emerging: "#f97316", // orange-500
  nascent: "#ef4444", // red-500
};

export const tierLabels: Record<ScoreTier, string> = {
  leader: "Global Leader",
  advanced: "Advanced",
  developing: "Developing",
  emerging: "Emerging",
  nascent: "Nascent",
};

// ---------------------------------------------------------------------------
// Index-level narrative (overall GIRAI score)

const indexNarratives: Record<ScoreTier, (country: string) => string> = {
  leader: (country) =>
    `${country} stands among the global leaders in responsible AI governance, demonstrating exceptional commitment across the dimensions tracked by GIRAI. Robust government frameworks, proactive public-sector practice, and active civil-society engagement together set a benchmark for AI governance.`,
  advanced: (country) =>
    `${country} demonstrates advanced responsible-AI capabilities, with established frameworks and visible progress across multiple dimensions of the GIRAI Index. Strong foundations are in place, with clear opportunities to deepen specific areas.`,
  developing: (country) =>
    `${country} is making meaningful progress in establishing responsible-AI frameworks and building institutional capacity. Foundational elements are in place; continued investment in implementation and stakeholder engagement should accelerate maturity.`,
  emerging: (country) =>
    `${country} is in the early stages of developing responsible-AI governance, with initial steps that recognise the importance of formal frameworks and provide a foundation for future development.`,
  nascent: (country) =>
    `${country} has substantial opportunity to develop responsible-AI capabilities. Current indicators show limited formal governance structures, presenting a chance to learn from global best practice and leapfrog in approach.`,
};

export function getIndexNarrative(country: string, score: number): NarrativeResult {
  const tier = getScoreTier(score);
  return {
    tier,
    label: tierLabels[tier],
    narrative: indexNarratives[tier](country),
    color: tierColors[tier],
  };
}

// ---------------------------------------------------------------------------
// Per-tier templated prose for dimensions and pillars

const dimensionTierTemplates: Record<ScoreTier, (country: string, name: string, score: number) => string> = {
  leader: (country, name, score) =>
    `With a score of ${score.toFixed(1)}, ${country} leads on ${name}. The country has codified strong protections, instituted clear accountability, and translated principles into observable practice.`,
  advanced: (country, name, score) =>
    `${country} scores ${score.toFixed(1)} on ${name}, reflecting well-developed frameworks and demonstrable progress. Implementation is consistent across most relevant indicators, with room to deepen weaker sub-areas.`,
  developing: (country, name, score) =>
    `Scoring ${score.toFixed(1)} on ${name}, ${country} is building structured governance and visible practice. Continued investment in coverage and consistency should sharpen the dimension's outcomes.`,
  emerging: (country, name, score) =>
    `${country}'s ${score.toFixed(1)} on ${name} indicates early-stage development. Initial commitments exist, but operationalisation and breadth of indicators are still limited.`,
  nascent: (country, name, score) =>
    `A score of ${score.toFixed(1)} on ${name} highlights significant opportunity. Establishing baseline frameworks, clear accountability, and observable evidence are immediate priorities for ${country}.`,
};

const pillarTierTemplates: Record<ScoreTier, (country: string, name: string, score: number) => string> = {
  leader: (country, name, score) =>
    `${country} achieves ${score.toFixed(1)} on the ${name} pillar — sustained, well-resourced activity across the indicators that define this pillar.`,
  advanced: (country, name, score) =>
    `${country}'s ${score.toFixed(1)} on the ${name} pillar reflects strong, broad-based coverage of the underlying indicators.`,
  developing: (country, name, score) =>
    `Scoring ${score.toFixed(1)} on the ${name} pillar, ${country} is steadily building out the indicators that define this pillar.`,
  emerging: (country, name, score) =>
    `${country}'s ${score.toFixed(1)} on the ${name} pillar suggests early activity, with several indicator areas still un-evidenced.`,
  nascent: (country, name, score) =>
    `A pillar score of ${score.toFixed(1)} on ${name} indicates limited visible activity. Targeted investment in this pillar's indicators would lift the country's overall position quickly.`,
};

export function getDimensionNarrative(
  slug: DimensionSlug,
  country: string,
  score: number
): NarrativeResult {
  const tier = getScoreTier(score);
  const dim = getDimension(slug);
  return {
    tier,
    label: tierLabels[tier],
    narrative: dimensionTierTemplates[tier](country, dim.name, score),
    color: dimensionColors[slug],
  };
}

export function getPillarNarrative(
  slug: PillarSlug,
  country: string,
  score: number
): NarrativeResult {
  const tier = getScoreTier(score);
  const pillar = getPillar(slug);
  return {
    tier,
    label: tierLabels[tier],
    narrative: pillarTierTemplates[tier](country, pillar.name, score),
    color: pillarColors[slug],
  };
}

// ---------------------------------------------------------------------------
// Visual identity for dimensions and pillars
//
// These are the tones used by the country-story surfaces (badges, bars,
// illustrations). Stable per slug so a chart on one page colour-matches
// a chart on another.

export const dimensionColors: Record<DimensionSlug, string> = {
  "inclusion-diversity": "#ec4899", // pink
  "ethics-sustainability": "#f97316", // orange
  "labour-skills": "#10b981", // emerald
  "trust-safety": "#a855f7", // purple
  "ai-use-public-service": "#6366f1", // indigo
};

export const dimensionGradients: Record<DimensionSlug, string> = {
  "inclusion-diversity": "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
  "ethics-sustainability": "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
  "labour-skills": "linear-gradient(135deg, #10b981 0%, #059669 100%)",
  "trust-safety": "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
  "ai-use-public-service": "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
};

export const pillarColors: Record<PillarSlug, string> = {
  "ai-policy": "#6366f1", // indigo
  "cso-engagement": "#a855f7", // purple
  "enabling-conditions": "#10b981", // emerald
};

// ---------------------------------------------------------------------------
// Misc helpers

export function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export function getRegionalComparisonNarrative(
  country: string,
  region: string,
  regionalRank: number,
  totalInRegion: number
): string {
  const position = regionalRank / Math.max(1, totalInRegion);
  if (position <= 0.25) {
    return `${country} ranks ${getOrdinalSuffix(regionalRank)} out of ${totalInRegion} countries in ${region}, placing it among the top performers in the region.`;
  } else if (position <= 0.5) {
    return `${country} ranks ${getOrdinalSuffix(regionalRank)} out of ${totalInRegion} countries in ${region}, performing above the regional median.`;
  } else if (position <= 0.75) {
    return `${country} ranks ${getOrdinalSuffix(regionalRank)} out of ${totalInRegion} countries in ${region}, with opportunities to learn from regional leaders.`;
  } else {
    return `${country} ranks ${getOrdinalSuffix(regionalRank)} out of ${totalInRegion} countries in ${region}, representing significant potential for improvement through regional collaboration.`;
  }
}
