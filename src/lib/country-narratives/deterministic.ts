import { DIMENSIONS, PILLARS } from "@/data/2026/taxonomy";
import type { DimensionSlug, PillarSlug } from "@/data/2026/taxonomy";
import { getOrdinalSuffix } from "@/lib/narratives/ordinal";
import { evidenceIncludingClause, formatEvidenceReference } from "./evidence-titles";
import type { CountryFactBundle, CountryNarratives, DimensionFacts, HeroFacts, PillarFacts } from "./types";

function fmt1(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "—";
  return n.toFixed(1);
}

function fmtSigned(n: number | null | undefined): string {
  if (n === null || n === undefined || !Number.isFinite(n)) return "";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}`;
}

function rankPhrase(rank: number | null, total?: number): string {
  if (rank === null) return "unranked";
  return total ? `${getOrdinalSuffix(rank)} of ${total}` : getOrdinalSuffix(rank);
}

function uraiClause(hero: HeroFacts): string {
  if (!hero.uraiCount || hero.uraiCount <= 0) return "";
  const penalty =
    hero.uraiPenalty !== null &&
    hero.giraiRaw !== null &&
    hero.girai !== null &&
    hero.uraiPenalty < 1;
  const base = penalty
    ? ` Published score ${fmt1(hero.girai)} reflects a URAI adjustment from ${fmt1(hero.giraiRaw)} (${hero.uraiCount} government-misuse evidence ${hero.uraiCount === 1 ? "item" : "items"} on file).`
    : ` ${hero.uraiCount} government-misuse evidence ${hero.uraiCount === 1 ? "item is" : "items are"} on file.`;
  const ref = formatEvidenceReference(
    hero.uraiEvidenceTitles,
    "documented misuse cases"
  );
  if (ref && hero.uraiEvidenceTitles.length === 1 && ref.startsWith('"')) {
    return `${base.slice(0, -1)} — including ${ref}.`;
  }
  return base;
}

export function deterministicHeroNarrative(hero: HeroFacts): string {
  if (hero.girai === null) {
    return `${hero.countryName} does not yet have a published GIRAI score.`;
  }

  const rankParts = [
    hero.rankGlobal !== null
      ? `${rankPhrase(hero.rankGlobal, hero.totalCountriesScored)} globally`
      : null,
    hero.rankRegional !== null
      ? `${rankPhrase(hero.rankRegional, hero.regionalPeerCount)} in ${hero.region}`
      : null,
    hero.rankIncomeGroup !== null
      ? `${rankPhrase(hero.rankIncomeGroup, hero.incomeGroupPeerCount)} among ${hero.incomeGroup} peers`
      : null,
  ].filter(Boolean);

  const rankLine =
    rankParts.length > 0
      ? `${hero.countryName} ranks ${rankParts.join(", ")} with a GIRAI score of ${fmt1(hero.girai)}.`
      : `${hero.countryName} has a GIRAI score of ${fmt1(hero.girai)}.`;

  const regionalLine =
    hero.deltaVsRegionalGirai !== null
      ? ` That is ${fmtSigned(hero.deltaVsRegionalGirai)} vs the ${hero.region} average (${fmt1(hero.regionalAvgGirai)}).`
      : "";

  const dimLine =
    hero.strongestDimension && hero.weakestDimension
      ? ` Strongest dimension: ${hero.strongestDimension.name} (${fmt1(hero.strongestDimension.score)}, ${rankPhrase(hero.strongestDimension.rankGlobal)} globally). Weakest: ${hero.weakestDimension.name} (${fmt1(hero.weakestDimension.score)}, ${rankPhrase(hero.weakestDimension.rankGlobal)} globally).`
      : "";

  const execLine =
    hero.frameworkScore !== null &&
    hero.implementationScore !== null &&
    hero.frameworkRankGlobal !== null &&
    hero.implementationRankGlobal !== null
      ? ` Framework substance (${fmt1(hero.frameworkScore)}, ${rankPhrase(hero.frameworkRankGlobal)} globally) and implementation depth (${fmt1(hero.implementationScore)}, ${rankPhrase(hero.implementationRankGlobal)} globally) shape the policy profile.`
      : "";

  const pillarLine = hero.dominantPillar?.pct
    ? ` ${hero.dominantPillar.name} contributes ${Math.round(hero.dominantPillar.pct)}% of weighted pillar mix.`
    : "";

  const evidenceLine =
    hero.evidenceTotals.allItems > 0
      ? ` ${hero.evidenceTotals.allItems} evidence items documented (${hero.evidenceTotals.frameworks} frameworks, ${hero.evidenceTotals.governmentInitiatives} government initiatives, ${hero.evidenceTotals.csoInitiatives} civil society initiatives).`
      : "";

  return `${rankLine}${uraiClause(hero)}${regionalLine}${dimLine}${execLine}${pillarLine}${evidenceLine}`.trim();
}

export function deterministicDimensionNarrative(
  countryName: string,
  facts: DimensionFacts
): string {
  if (facts.score === null) {
    return `${countryName} does not yet have a published score for ${facts.dimensionName}.`;
  }

  const rankPart = [
    facts.rankGlobal !== null ? `${rankPhrase(facts.rankGlobal)} globally` : null,
    facts.rankRegional !== null ? `${rankPhrase(facts.rankRegional)} regionally` : null,
  ]
    .filter(Boolean)
    .join(", ");

  const deltaPart =
    facts.deltaVsRegional !== null
      ? ` (${fmtSigned(facts.deltaVsRegional)} vs regional average)`
      : "";

  const lead = `${facts.dimensionName} scores ${fmt1(facts.score)}${rankPart ? `, ranking ${rankPart}` : ""}${deltaPart}.`;

  const topPart =
    facts.topIndicators.length > 0
      ? ` Strongest indicators: ${facts.topIndicators.map((i) => `${i.name} (${fmt1(i.score)})`).join(", ")}.`
      : "";

  const bottomPart =
    facts.bottomIndicators.length > 0
      ? ` Weakest: ${facts.bottomIndicators.map((i) => `${i.name} (${fmt1(i.score)})`).join(", ")}.`
      : "";

  const relativePart =
    facts.relativeToCountryRank &&
    facts.relativeToCountryRank.isRelativeStrength
      ? ` This dimension ranks ahead of the country's overall global position (${rankPhrase(facts.relativeToCountryRank.countryRankGlobal)}).`
      : facts.relativeToCountryRank &&
          !facts.relativeToCountryRank.isRelativeStrength &&
          facts.relativeToCountryRank.dimensionRankGlobal >
            facts.relativeToCountryRank.countryRankGlobal
        ? ` This dimension trails the country's overall global rank (${rankPhrase(facts.relativeToCountryRank.countryRankGlobal)}).`
        : "";

  const evClause = evidenceIncludingClause(
    facts.evidence.sampleTitles,
    "documented frameworks and initiatives"
  );

  const evPart =
    facts.evidence.totalItems > 0
      ? ` ${facts.evidence.totalItems} evidence items on file${evClause}.`
      : " No dimension-specific evidence items are on file.";

  return `${lead}${topPart}${bottomPart}${relativePart}${evPart}`.trim();
}

export function deterministicPillarNarrative(facts: PillarFacts): string {
  if (facts.score === null) {
    return `No published score for the ${facts.pillarName} pillar.`;
  }

  const rankPart =
    facts.rankGlobal !== null ? ` (${rankPhrase(facts.rankGlobal)} globally)` : "";
  const medianPart =
    facts.aboveMedian === true
      ? " — above the global median"
      : facts.aboveMedian === false
        ? " — below the global median"
        : "";

  const contrib =
    facts.contributionPct !== null
      ? `, contributing ${Math.round(facts.contributionPct)}% of weighted pillar mix`
      : "";

  const lead = `${facts.pillarName} scores ${fmt1(facts.score)}${rankPart}${medianPart}${contrib}.`;

  const bullets =
    facts.checklistBullets?.filter(Boolean).slice(0, 2).join("; ") ?? "";

  const bulletPart = bullets ? ` Evidence profile: ${bullets}.` : "";

  const evRef = formatEvidenceReference(
    facts.sampleEvidenceTitles,
    "documented policy items"
  );
  const evPart = evRef ? ` Key items include ${evRef}.` : "";

  return `${lead}${bulletPart}${evPart}`.trim();
}

export function buildDeterministicCountryNarratives(
  bundle: CountryFactBundle
): CountryNarratives {
  const dimensions = Object.fromEntries(
    DIMENSIONS.map((d) => [
      d.slug,
      deterministicDimensionNarrative(bundle.countryName, bundle.dimensions[d.slug]),
    ])
  ) as Record<DimensionSlug, string>;

  const pillars = Object.fromEntries(
    PILLARS.map((p) => [
      p.slug,
      deterministicPillarNarrative(bundle.pillars[p.slug]),
    ])
  ) as Record<PillarSlug, string>;

  return {
    hero: deterministicHeroNarrative(bundle.hero),
    dimensions,
    pillars,
  };
}

export function buildAllDeterministicNarratives(
  bundles: Record<string, CountryFactBundle>
): Record<string, CountryNarratives> {
  const out: Record<string, CountryNarratives> = {};
  for (const [iso, bundle] of Object.entries(bundles)) {
    out[iso] = buildDeterministicCountryNarratives(bundle);
  }
  return out;
}
