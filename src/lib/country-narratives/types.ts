import type { DimensionSlug, PillarSlug } from "@/data/2026/taxonomy";

export const NARRATIVE_SCHEMA_VERSION = "1.0" as const;

export type NarrativeScope = "hero" | "dimension" | "pillar";

export interface DimensionExtreme {
  slug: DimensionSlug;
  name: string;
  score: number;
  rankGlobal: number | null;
  deltaVsRegional: number;
}

export interface HeroFacts {
  iso3: string;
  countryName: string;
  region: string;
  incomeGroup: string;
  girai: number | null;
  giraiRaw: number | null;
  uraiPenalty: number | null;
  uraiCount: number;
  uraiEvidenceTitles: string[];
  rankGlobal: number | null;
  rankRegional: number | null;
  rankIncomeGroup: number | null;
  totalCountriesScored: number;
  regionalPeerCount: number;
  incomeGroupPeerCount: number;
  regionalAvgGirai: number | null;
  incomeGroupAvgGirai: number | null;
  deltaVsRegionalGirai: number | null;
  deltaVsIncomeGroupGirai: number | null;
  frameworkScore: number | null;
  frameworkRankGlobal: number | null;
  implementationScore: number | null;
  implementationRankGlobal: number | null;
  strongestDimension: DimensionExtreme | null;
  weakestDimension: DimensionExtreme | null;
  pillarScores: Record<PillarSlug, number | null>;
  pillarContributionPct: Record<PillarSlug, number | null>;
  dominantPillar: { slug: PillarSlug; name: string; pct: number | null } | null;
  evidenceTotals: {
    allItems: number;
    frameworks: number;
    governmentInitiatives: number;
    csoInitiatives: number;
  };
}

export interface IndicatorFact {
  slug: string;
  name: string;
  score: number;
}

export interface DimensionFacts {
  dimensionName: string;
  score: number | null;
  rankGlobal: number | null;
  rankRegional: number | null;
  regionalAverage: number | null;
  deltaVsRegional: number | null;
  topIndicators: IndicatorFact[];
  bottomIndicators: IndicatorFact[];
  evidence: {
    totalItems: number;
    frameworkCount: number;
    initiativeCount: number;
    sampleTitles: string[];
    allowedTitles: string[];
  };
  relativeToCountryRank: {
    countryRankGlobal: number;
    dimensionRankGlobal: number;
    isRelativeStrength: boolean;
  } | null;
}

export interface PillarFacts {
  pillarName: string;
  score: number | null;
  rankGlobal: number | null;
  globalMedian: number | null;
  aboveMedian: boolean | null;
  contributionPct: number | null;
  checklistBullets: [string, string, string] | null;
  sampleEvidenceTitles: string[];
  allowedTitles: string[];
}

export interface CountryFactBundle {
  iso3: string;
  countryName: string;
  hero: HeroFacts;
  dimensions: Record<DimensionSlug, DimensionFacts>;
  pillars: Record<PillarSlug, PillarFacts>;
}

export interface CountryNarratives {
  hero: string;
  dimensions: Record<DimensionSlug, string>;
  pillars: Record<PillarSlug, string>;
}

export type NarrativeSource = "generated" | "deterministic";

export interface CountryNarrativesArtifact {
  schemaVersion: typeof NARRATIVE_SCHEMA_VERSION;
  generatedAt: string;
  sourceHash: string;
  /** `generated` when LLM copy passed validation; otherwise `deterministic`. */
  source: NarrativeSource;
  model: string | null;
  countries: Record<string, CountryNarratives>;
}

export interface CountryNarrativeFactsArtifact {
  schemaVersion: typeof NARRATIVE_SCHEMA_VERSION;
  generatedAt: string;
  sourceHash: string;
  countries: Record<string, CountryFactBundle>;
}
