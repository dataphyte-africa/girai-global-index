import { DIMENSIONS, INDICATORS, PILLARS } from "@/data/2026/taxonomy";
import type { DimensionSlug, PillarSlug } from "@/data/2026/taxonomy";
import { computePillarContributionMix, computePillarMedians } from "@/lib/girai/pillar-contribution";
import type {
  CountryPillarHighlightsEntry,
  CountryRanking,
  EvidenceItem,
} from "@/lib/girai/types";
import { dedupeTitles } from "./evidence-titles";
import type {
  CountryFactBundle,
  DimensionExtreme,
  DimensionFacts,
  HeroFacts,
  IndicatorFact,
  PillarFacts,
} from "./types";

export interface BuildFactBundlesInput {
  countries: CountryRanking[];
  evidenceItems: EvidenceItem[];
  pillarHighlights: CountryPillarHighlightsEntry[];
}

function average(values: (number | null | undefined)[]): number | null {
  const nums = values.filter((v): v is number => v !== null && v !== undefined && Number.isFinite(v));
  if (nums.length === 0) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function regionAverages(countries: CountryRanking[], region: string) {
  const peers = countries.filter((c) => c.region === region);
  const dimAvgs = Object.fromEntries(
    DIMENSIONS.map((d) => [
      d.slug,
      average(peers.map((c) => c.dimensionScores[d.slug])),
    ])
  ) as Record<DimensionSlug, number | null>;
  return {
    girai: average(peers.map((c) => c.girai)),
    dimensions: dimAvgs,
    framework: average(peers.map((c) => c.frameworkScore)),
    implementation: average(peers.map((c) => c.implementationScore)),
  };
}

function incomeGroupAverages(countries: CountryRanking[], incomeGroup: string) {
  const peers = countries.filter((c) => c.incomeGroup === incomeGroup);
  return {
    girai: average(peers.map((c) => c.girai)),
    peerCount: peers.filter((c) => c.girai !== null).length,
  };
}

function evidenceForCountry(items: EvidenceItem[], iso3: string): EvidenceItem[] {
  const code = iso3.toUpperCase();
  return items.filter((it) => it.country.iso3 === code);
}

function indicatorsForDimension(dim: DimensionSlug) {
  return INDICATORS.filter((i) => i.dimension === dim);
}

function topBottomIndicators(
  country: CountryRanking,
  dim: DimensionSlug,
  n = 2
): { top: IndicatorFact[]; bottom: IndicatorFact[] } {
  const inds = indicatorsForDimension(dim)
    .map((i) => ({
      slug: i.slug,
      name: i.name,
      score: country.indicatorScores[i.slug] ?? null,
    }))
    .filter((x) => x.score !== null && Number.isFinite(x.score))
    .sort((a, b) => b.score! - a.score!);

  return {
    top: inds.slice(0, n).map((x) => ({ slug: x.slug, name: x.name, score: x.score! })),
    bottom: inds
      .slice(-n)
      .reverse()
      .map((x) => ({ slug: x.slug, name: x.name, score: x.score! })),
  };
}

function dimensionEvidenceSummary(items: EvidenceItem[], dim: DimensionSlug) {
  const dimItems = items.filter((e) => {
    if (e.dimensionSlug === dim) return true;
    const ind = INDICATORS.find((i) => i.slug === e.indicatorSlug);
    return ind?.dimension === dim;
  });
  const frameworks = dimItems.filter((e) => e.kind === "framework");
  const initiatives = dimItems.filter(
    (e) => e.kind === "initiative" || e.kind === "cso-initiative"
  );
  const titles = dedupeTitles(
    [...frameworks, ...initiatives].map((e) => e.title).filter(Boolean)
  );
  return {
    totalItems: dimItems.length,
    frameworkCount: frameworks.length,
    initiativeCount: initiatives.length,
    sampleTitles: titles.slice(0, 5),
    allowedTitles: titles,
  };
}

function pillarEvidenceTitles(items: EvidenceItem[], pillar: PillarSlug, limit = 5): string[] {
  return dedupeTitles(
    items
      .filter(
        (e) =>
          e.pillarSlug === pillar &&
          (e.kind === "framework" ||
            e.kind === "initiative" ||
            e.kind === "cso-initiative")
      )
      .map((e) => e.title)
      .filter(Boolean)
  ).slice(0, limit);
}

function dimensionExtremes(
  country: CountryRanking,
  regDimAvgs: Record<DimensionSlug, number | null>
): { strongest: DimensionExtreme | null; weakest: DimensionExtreme | null } {
  const scored = DIMENSIONS.map((d) => ({
    slug: d.slug,
    name: d.name,
    score: country.dimensionScores[d.slug],
  })).filter((x) => x.score !== null && Number.isFinite(x.score)) as Array<{
    slug: DimensionSlug;
    name: string;
    score: number;
  }>;

  if (scored.length === 0) return { strongest: null, weakest: null };

  scored.sort((a, b) => b.score - a.score);
  const strongest = scored[0]!;
  const weakest = scored[scored.length - 1]!;

  const toExtreme = (row: (typeof scored)[0]): DimensionExtreme => ({
    slug: row.slug,
    name: row.name,
    score: row.score,
    rankGlobal: country.dimensionRanksGlobal[row.slug],
    deltaVsRegional: row.score - (regDimAvgs[row.slug] ?? 0),
  });

  return { strongest: toExtreme(strongest), weakest: toExtreme(weakest) };
}

function buildHeroFacts(
  country: CountryRanking,
  countries: CountryRanking[],
  evidenceItems: EvidenceItem[]
): HeroFacts {
  const regAvg = regionAverages(countries, country.region);
  const incomeAvg = incomeGroupAverages(countries, country.incomeGroup);
  const extremes = dimensionExtremes(country, regAvg.dimensions);
  const contribution = computePillarContributionMix(country.pillarScores);
  const allEvidence = evidenceForCountry(evidenceItems, country.iso3);
  const uraiItems = allEvidence.filter((e) => e.kind === "government-misuse");

  const dominant = [...PILLARS]
    .map((p) => ({ slug: p.slug, name: p.name, pct: contribution[p.slug] }))
    .sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0))[0];

  const scored = countries.filter((c) => c.girai !== null);

  return {
    iso3: country.iso3,
    countryName: country.name,
    region: country.region,
    incomeGroup: country.incomeGroup,
    girai: country.girai,
    giraiRaw: country.giraiRaw,
    uraiPenalty: country.uraiPenalty,
    uraiCount: country.uraiCount,
    uraiEvidenceTitles: dedupeTitles(uraiItems.map((e) => e.title)),
    rankGlobal: country.rankGlobal,
    rankRegional: country.rankRegional,
    rankIncomeGroup: country.rankIncomeGroup,
    totalCountriesScored: scored.length,
    regionalPeerCount: countries.filter(
      (c) => c.region === country.region && c.girai !== null
    ).length,
    incomeGroupPeerCount: incomeAvg.peerCount,
    regionalAvgGirai: regAvg.girai,
    incomeGroupAvgGirai: incomeAvg.girai,
    deltaVsRegionalGirai:
      country.girai !== null && regAvg.girai !== null
        ? country.girai - regAvg.girai
        : null,
    deltaVsIncomeGroupGirai:
      country.girai !== null && incomeAvg.girai !== null
        ? country.girai - incomeAvg.girai
        : null,
    frameworkScore: country.frameworkScore,
    frameworkRankGlobal: country.frameworkRankGlobal,
    implementationScore: country.implementationScore,
    implementationRankGlobal: country.implementationRankGlobal,
    strongestDimension: extremes.strongest,
    weakestDimension: extremes.weakest,
    pillarScores: country.pillarScores,
    pillarContributionPct: contribution,
    dominantPillar: dominant
      ? { slug: dominant.slug, name: dominant.name, pct: dominant.pct }
      : null,
    evidenceTotals: {
      allItems: allEvidence.length,
      frameworks: allEvidence.filter((e) => e.kind === "framework").length,
      governmentInitiatives: allEvidence.filter((e) => e.kind === "initiative").length,
      csoInitiatives: allEvidence.filter((e) => e.kind === "cso-initiative").length,
    },
  };
}

function buildDimensionFacts(
  country: CountryRanking,
  dim: DimensionSlug,
  regDimAvgs: Record<DimensionSlug, number | null>,
  evidenceItems: EvidenceItem[]
): DimensionFacts {
  const dimDef = DIMENSIONS.find((d) => d.slug === dim)!;
  const score = country.dimensionScores[dim];
  const regAvg = regDimAvgs[dim];
  const { top, bottom } = topBottomIndicators(country, dim);
  const ev = dimensionEvidenceSummary(evidenceForCountry(evidenceItems, country.iso3), dim);

  return {
    dimensionName: dimDef.name,
    score,
    rankGlobal: country.dimensionRanksGlobal[dim],
    rankRegional: country.dimensionRanksRegional[dim],
    regionalAverage: regAvg,
    deltaVsRegional:
      score !== null && regAvg !== null ? score - regAvg : null,
    topIndicators: top,
    bottomIndicators: bottom,
    evidence: ev,
    relativeToCountryRank:
      country.rankGlobal !== null && country.dimensionRanksGlobal[dim] !== null
        ? {
            countryRankGlobal: country.rankGlobal,
            dimensionRankGlobal: country.dimensionRanksGlobal[dim]!,
            isRelativeStrength:
              country.dimensionRanksGlobal[dim]! < country.rankGlobal,
          }
        : null,
  };
}

function buildPillarFacts(
  country: CountryRanking,
  pillar: PillarSlug,
  pillarMedians: Record<PillarSlug, number | null>,
  contribution: Record<PillarSlug, number | null>,
  highlights: CountryPillarHighlightsEntry | undefined,
  evidenceItems: EvidenceItem[]
): PillarFacts {
  const pillarDef = PILLARS.find((p) => p.slug === pillar)!;
  const score = country.pillarScores[pillar];
  const median = pillarMedians[pillar];
  const titles = pillarEvidenceTitles(
    evidenceForCountry(evidenceItems, country.iso3),
    pillar
  );

  return {
    pillarName: pillarDef.name,
    score,
    rankGlobal: country.pillarRanksGlobal[pillar],
    globalMedian: median,
    aboveMedian:
      score !== null && median !== null ? score >= median : null,
    contributionPct: contribution[pillar],
    checklistBullets: highlights?.pillars[pillar]?.bullets ?? null,
    sampleEvidenceTitles: titles,
    allowedTitles: titles,
  };
}

export function buildCountryFactBundle(
  country: CountryRanking,
  input: BuildFactBundlesInput,
  pillarMedians: Record<PillarSlug, number | null>
): CountryFactBundle {
  const regAvg = regionAverages(input.countries, country.region);
  const contribution = computePillarContributionMix(country.pillarScores);
  const highlights = input.pillarHighlights.find((h) => h.iso3 === country.iso3);

  const dimensions = Object.fromEntries(
    DIMENSIONS.map((d) => [
      d.slug,
      buildDimensionFacts(country, d.slug, regAvg.dimensions, input.evidenceItems),
    ])
  ) as Record<DimensionSlug, DimensionFacts>;

  const pillars = Object.fromEntries(
    PILLARS.map((p) => [
      p.slug,
      buildPillarFacts(
        country,
        p.slug,
        pillarMedians,
        contribution,
        highlights,
        input.evidenceItems
      ),
    ])
  ) as Record<PillarSlug, PillarFacts>;

  return {
    iso3: country.iso3,
    countryName: country.name,
    hero: buildHeroFacts(country, input.countries, input.evidenceItems),
    dimensions,
    pillars,
  };
}

export function buildAllCountryFactBundles(
  input: BuildFactBundlesInput
): Record<string, CountryFactBundle> {
  const pillarMedians = computePillarMedians(input.countries);
  const out: Record<string, CountryFactBundle> = {};
  for (const country of input.countries) {
    out[country.iso3] = buildCountryFactBundle(country, input, pillarMedians);
  }
  return out;
}

/** Flat list of proper nouns the LLM is allowed to cite for a country bundle. */
export function allowedProperNouns(bundle: CountryFactBundle): string[] {
  const titles = new Set<string>();
  for (const dim of Object.values(bundle.dimensions)) {
    for (const t of dim.evidence.allowedTitles) titles.add(t);
  }
  for (const pillar of Object.values(bundle.pillars)) {
    for (const t of pillar.allowedTitles) titles.add(t);
  }
  for (const t of bundle.hero.uraiEvidenceTitles) titles.add(t);
  titles.add(bundle.countryName);
  return [...titles];
}
