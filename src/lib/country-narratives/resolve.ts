import generatedData from "@/data/2026/generated/country-narratives.generated.json";
import rankingsData from "@/data/2026/generated/rankings.json";
import evidenceData from "@/data/2026/generated/evidence.json";
import pillarHighlightsData from "@/data/2026/generated/country-pillar-highlights.json";
import type { DimensionSlug, PillarSlug } from "@/data/2026/taxonomy";
import type {
  CountryPillarHighlightsArtifact,
  EvidenceArtifact,
  RankingsArtifact,
} from "@/lib/girai/types";
import { buildAllCountryFactBundles } from "./facts";
import {
  buildDeterministicCountryNarratives,
  deterministicDimensionNarrative,
  deterministicHeroNarrative,
  deterministicPillarNarrative,
} from "./deterministic";
import type { CountryNarratives, CountryNarrativesArtifact, NarrativeScope } from "./types";

const generated = generatedData as unknown as CountryNarrativesArtifact;
const rankings = rankingsData as unknown as RankingsArtifact;
const evidence = evidenceData as unknown as EvidenceArtifact;
const pillarHighlights =
  pillarHighlightsData as unknown as CountryPillarHighlightsArtifact;

let factBundlesCache: ReturnType<typeof buildAllCountryFactBundles> | null = null;

function getFactBundles() {
  if (!factBundlesCache) {
    factBundlesCache = buildAllCountryFactBundles({
      countries: rankings.countries,
      evidenceItems: evidence.items,
      pillarHighlights: pillarHighlights.countries,
    });
  }
  return factBundlesCache;
}

function getGeneratedCountry(iso3: string) {
  return generated.countries[iso3.toUpperCase()];
}

export function getCountryHeroNarrative(iso3: string): string {
  const code = iso3.toUpperCase();
  const fromArtifact = getGeneratedCountry(code)?.hero;
  if (fromArtifact) return fromArtifact;

  const bundle = getFactBundles()[code];
  if (bundle) return deterministicHeroNarrative(bundle.hero);

  const country = rankings.countries.find((c) => c.iso3 === code);
  return country
    ? `${country.name} does not yet have narrative copy for this edition.`
    : "";
}

export function getCountryDimensionNarrative(
  iso3: string,
  slug: DimensionSlug
): string {
  const code = iso3.toUpperCase();
  const fromArtifact = getGeneratedCountry(code)?.dimensions[slug];
  if (fromArtifact) return fromArtifact;

  const bundle = getFactBundles()[code];
  if (bundle) {
    return deterministicDimensionNarrative(
      bundle.countryName,
      bundle.dimensions[slug]
    );
  }

  const country = rankings.countries.find((c) => c.iso3 === code);
  if (!country) return "";
  const score = country.dimensionScores[slug];
  if (score === null) {
    return `${country.name} does not yet have a published score for this dimension.`;
  }
  return "";
}

export function getCountryPillarNarrative(
  iso3: string,
  slug: PillarSlug
): string {
  const code = iso3.toUpperCase();
  const fromArtifact = getGeneratedCountry(code)?.pillars[slug];
  if (fromArtifact) return fromArtifact;

  const bundle = getFactBundles()[code];
  if (bundle) return deterministicPillarNarrative(bundle.pillars[slug]);
  return "";
}

/** Unified accessor (ADR 0004). Sanity overrides can slot in ahead of `generated`. */
export function getCountryNarrative(
  scope: NarrativeScope,
  iso3: string,
  slug?: DimensionSlug | PillarSlug
): string {
  switch (scope) {
    case "hero":
      return getCountryHeroNarrative(iso3);
    case "dimension":
      return getCountryDimensionNarrative(iso3, slug as DimensionSlug);
    case "pillar":
      return getCountryPillarNarrative(iso3, slug as PillarSlug);
    default:
      return "";
  }
}

export function getNarrativesArtifactMeta(): Pick<
  CountryNarrativesArtifact,
  "generatedAt" | "sourceHash" | "source" | "model" | "schemaVersion"
> {
  return {
    schemaVersion: generated.schemaVersion,
    generatedAt: generated.generatedAt,
    sourceHash: generated.sourceHash,
    source: generated.source,
    model: generated.model,
  };
}

/** @internal Exposed for build script parity tests. */
export function resolveDeterministicForCountry(iso3: string): CountryNarratives | null {
  const bundle = getFactBundles()[iso3.toUpperCase()];
  if (!bundle) return null;
  return buildDeterministicCountryNarratives(bundle);
}
