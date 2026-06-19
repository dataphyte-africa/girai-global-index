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

  // Rank badges and the score are already shown in the hero UI, so the copy
  // focuses on comparative context and analysis rather than restating them.
  const comparisons = [
    hero.deltaVsRegionalGirai !== null
      ? `${fmtSigned(hero.deltaVsRegionalGirai)} against the ${hero.region} average (${fmt1(hero.regionalAvgGirai)})`
      : null,
    hero.deltaVsIncomeGroupGirai !== null
      ? `${fmtSigned(hero.deltaVsIncomeGroupGirai)} against ${hero.incomeGroup} peers (${fmt1(hero.incomeGroupAvgGirai)})`
      : null,
  ].filter(Boolean);

  const leadLine =
    comparisons.length > 0
      ? `${hero.countryName}'s index score lands ${comparisons.join(" and ")}.`
      : `${hero.countryName} carries a GIRAI score of ${fmt1(hero.girai)}.`;

  const percentileLine = (() => {
    if (hero.rankGlobal === null || hero.totalCountriesScored <= 1) return "";
    if (hero.rankGlobal === 1) {
      return ` It leads all ${hero.totalCountriesScored} economies assessed this edition.`;
    }
    const pct = Math.round(
      ((hero.totalCountriesScored - hero.rankGlobal) /
        (hero.totalCountriesScored - 1)) *
        100
    );
    return ` It scores ahead of ${pct}% of the ${hero.totalCountriesScored} economies assessed this edition.`;
  })();

  const execLine = (() => {
    if (hero.frameworkScore === null || hero.implementationScore === null) {
      return "";
    }
    const gap = hero.frameworkScore - hero.implementationScore;
    if (gap >= 3) {
      return ` Framework substance (${fmt1(hero.frameworkScore)}) runs ${fmt1(gap)} points ahead of implementation depth (${fmt1(hero.implementationScore)}) — policy is further developed on paper than in delivery.`;
    }
    if (gap <= -3) {
      return ` Implementation depth (${fmt1(hero.implementationScore)}) outpaces framework substance (${fmt1(hero.frameworkScore)}) by ${fmt1(Math.abs(gap))} points — delivery is running ahead of formal policy design.`;
    }
    return ` Framework substance (${fmt1(hero.frameworkScore)}) and implementation depth (${fmt1(hero.implementationScore)}) move broadly in step.`;
  })();

  const evidenceLine =
    hero.evidenceTotals.allItems > 0
      ? ` The profile rests on ${hero.evidenceTotals.allItems} documented evidence items spanning policy frameworks, government initiatives and civil society activity.`
      : "";

  return `${leadLine}${percentileLine}${uraiClause(hero)}${execLine}${evidenceLine}`.trim();
}

export function deterministicDimensionNarrative(
  countryName: string,
  facts: DimensionFacts
): string {
  if (facts.score === null) {
    return `${countryName} does not yet have a published score for ${facts.dimensionName}.`;
  }

  // The card already surfaces the score and both rank pills, so the copy leads
  // with the comparative gap and what it signals rather than restating numbers.
  const lead =
    facts.deltaVsRegional !== null
      ? `${countryName} runs ${fmtSigned(facts.deltaVsRegional)} against the regional average (${fmt1(facts.regionalAverage)}) on ${facts.dimensionName}.`
      : facts.rankGlobal !== null
        ? `${countryName} ranks ${rankPhrase(facts.rankGlobal)} globally on ${facts.dimensionName}.`
        : `${facts.dimensionName} is a measured dimension for ${countryName}.`;

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

  // The card already lists the contribution %, evidence-count bullets and a
  // strength/focus label, so the copy adds analysis: competitive standing and
  // how this pillar pulls against the country's overall position.
  const standingLine =
    facts.rankGlobal !== null
      ? `A score of ${fmt1(facts.score)} ranks ${rankPhrase(facts.rankGlobal)} globally${
          facts.aboveMedian === true
            ? ", above the global median"
            : facts.aboveMedian === false
              ? ", below the global median"
              : ""
        }.`
      : `This pillar scores ${fmt1(facts.score)}.`;

  const rel = facts.relativeToCountryRank;
  const relativeLine = rel
    ? rel.isRelativeStrength
      ? ` That outpaces the country's overall standing (${rankPhrase(rel.countryRankGlobal)} globally), so it lifts the headline score.`
      : rel.pillarRankGlobal > rel.countryRankGlobal
        ? ` That trails the country's overall standing (${rankPhrase(rel.countryRankGlobal)} globally), making it the clearest drag on the headline score.`
        : ` It tracks closely with the country's overall standing (${rankPhrase(rel.countryRankGlobal)} globally).`
    : "";

  const evRef = formatEvidenceReference(
    facts.sampleEvidenceTitles,
    "documented policy items"
  );
  const evPart = evRef ? ` Anchoring items include ${evRef}.` : "";

  return `${standingLine}${relativeLine}${evPart}`.trim();
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
