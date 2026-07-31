import { tool } from "ai";
import { z } from "zod";
import {
  getAllCountries,
  getCountrySubregion,
  getGlobalAverages,
  getIncomeGroupAverages,
  getRegionAverages,
} from "@/lib/girai/data";
import type { ScoreAggregates } from "@/lib/girai/types";
import { resolveStatScope } from "@/lib/girai/statistics";
import { DIMENSIONS, PILLARS } from "@/data/2026/taxonomy";
import { regionSource } from "../sources";
import type { GiraiToolResult } from "../types";
import { resolveRegion, resolveSubregion } from "../utils";

import type { CountryRanking } from "@/lib/girai/types";

/**
 * The site's fixed 20-point score bands (see TIER_LEGEND in
 * choropleth-map.tsx). Min-inclusive: a 60 is "Advanced".
 */
const TIERS = [
  { label: "Leading", min: 80, max: 100 },
  { label: "Advanced", min: 60, max: 80 },
  { label: "Developing", min: 40, max: 60 },
  { label: "Emerging", min: 20, max: 40 },
  { label: "Nascent", min: 0, max: 20 },
] as const;

const tierCounts = (list: CountryRanking[]) =>
  TIERS.map((t) => ({
    ...t,
    count: list.filter(
      (c) =>
        c.girai !== null &&
        c.girai >= t.min &&
        (t.max === 100 ? c.girai <= 100 : c.girai < t.max)
    ).length,
  }));

const mean = (values: (number | null)[]): number | null => {
  const scored = values.filter((v): v is number => v !== null);
  return scored.length ? scored.reduce((s, v) => s + v, 0) / scored.length : null;
};

/**
 * Averages for an arbitrary country list. Regions and income groups are
 * pre-aggregated at build time, but the briefs' groupings (LATAM spans two
 * regions; their "Asia" excludes Oceania and adds the Middle East) are not,
 * so those have to be computed here. Verified to reproduce the pre-computed
 * regional aggregates exactly when handed a single region's countries.
 */
function computeAggregates(list: CountryRanking[]): ScoreAggregates {
  return {
    girai: mean(list.map((c) => c.girai)),
    dimensions: Object.fromEntries(
      DIMENSIONS.map((d) => [d.slug, mean(list.map((c) => c.dimensionScores[d.slug]))])
    ) as ScoreAggregates["dimensions"],
    pillars: Object.fromEntries(
      PILLARS.map((p) => [p.slug, mean(list.map((c) => c.pillarScores[p.slug]))])
    ) as ScoreAggregates["pillars"],
    indicators: {} as ScoreAggregates["indicators"],
    frameworkScore: mean(list.map((c) => c.frameworkScore)),
    implementationScore: mean(list.map((c) => c.implementationScore)),
  };
}

/**
 * Every dimension and pillar measured against the global average.
 *
 * "Which dimension is strongest relative to the global benchmark?" is not the
 * same question as "which dimension scores highest" — a region's top-scoring
 * dimension is usually still below the global mean, because the global mean is
 * higher there too. Answering it by eye off two separate tool calls produced
 * the wrong dimension every time, so the comparison is computed here and the
 * winner named outright.
 */
function compareToGlobal(agg: ScoreAggregates) {
  const globals = getGlobalAverages();
  const row = (
    slug: string,
    name: string,
    value: number | null,
    globalValue: number | null
  ) => ({
    slug,
    name,
    value,
    global: globalValue,
    // Positive means the slice outperforms the world on this measure.
    diff: value !== null && globalValue !== null ? value - globalValue : null,
    aboveGlobal: value !== null && globalValue !== null ? value > globalValue : null,
  });

  const dimensions = DIMENSIONS.map((d) =>
    row(d.slug, d.name, agg.dimensions[d.slug], globals.dimensions[d.slug])
  );
  const pillars = PILLARS.map((p) =>
    row(p.slug, p.name, agg.pillars[p.slug], globals.pillars[p.slug])
  );
  const ranked = dimensions
    .filter((d) => d.diff !== null)
    .sort((a, b) => (b.diff ?? 0) - (a.diff ?? 0));

  return {
    dimensions,
    pillars,
    dimensionsAboveGlobal: dimensions.filter((d) => d.aboveGlobal).map((d) => d.name),
    dimensionsAboveGlobalCount: dimensions.filter((d) => d.aboveGlobal).length,
    strongestVsGlobal: ranked[0] ?? null,
    weakestVsGlobal: ranked[ranked.length - 1] ?? null,
  };
}

/**
 * Precomputed score averages — the assistant is forbidden from averaging
 * country scores manually, so without this tool "what's the global average?"
 * and "how do low-income countries perform on average?" were unanswerable.
 */
export const getAveragesTool = tool({
  description:
    "Get precomputed average scores (GIRAI, dimensions, pillars, framework/implementation) " +
    "and the GIRAI score-tier distribution (Leading/Advanced/Developing/Emerging/Nascent) " +
    "for the whole index, one region, one subregion, one World Bank income group, or a report " +
    "grouping such as LATAM or the Asia brief's 38-country grouping (scope 'group'). " +
    "Every non-global result carries vsGlobal: each dimension and pillar against the global average, " +
    "with strongestVsGlobal / weakestVsGlobal / dimensionsAboveGlobal already worked out — " +
    "use those for 'strongest relative to the global benchmark', never compare two calls by eye. " +
    "Use for any 'average', 'how many countries score X', or group-comparison question instead of computing manually.",
  inputSchema: z.object({
    scope: z
      .enum(["global", "region", "subregion", "income-group", "group"])
      .describe(
        "Which slice to average over. Use 'group' for LATAM / Latin America (South and Central America plus the Caribbean, 22 countries) or the Asia brief's grouping (Asia and Oceania minus Oceania plus the Middle East, 38 countries) — neither is a GIRAI region."
      ),
    name: z
      .string()
      .optional()
      .describe(
        "Region name (scope=region), subregion name (scope=subregion), income group such as 'Low income' (scope=income-group), or 'LATAM' / 'Asia' (scope=group)"
      ),
    includeIndicators: z
      .boolean()
      .default(false)
      .describe("Also return the 38 per-indicator averages"),
  }),
  execute: async (input): Promise<GiraiToolResult<unknown>> => {
    const shape = (label: string, agg: ScoreAggregates, scoped: CountryRanking[]) => ({
      found: true,
      scope: input.scope,
      label,
      countryCount: scoped.length,
      girai: agg.girai,
      dimensions: agg.dimensions,
      pillars: agg.pillars,
      frameworkScore: agg.frameworkScore,
      implementationScore: agg.implementationScore,
      // How many of the scoped countries fall in each GIRAI score band.
      tiers: tierCounts(scoped),
      globalGirai: getGlobalAverages().girai,
      vsGlobal: compareToGlobal(agg),
      ...(input.includeIndicators ? { indicators: agg.indicators } : {}),
    });
    const countries = getAllCountries().filter((c) => c.girai !== null);

    if (input.scope === "global") {
      return {
        data: shape("Global", getGlobalAverages(), countries),
        sources: [],
        visualization: "analysis",
      };
    }

    if (input.scope === "group") {
      // Report groupings cut across GIRAI regions, so nothing is pre-aggregated
      // and the scope resolver (shared with the evidence-statistics tool) has to
      // rebuild the country list. Its `note` states which grouping was applied.
      const scope = input.name ? resolveStatScope(input.name) : undefined;
      if (!scope) {
        return {
          data: { found: false, scope: input.scope, query: input.name },
          sources: [],
        };
      }
      const members = scope.countries.filter((c) => c.girai !== null);
      return {
        data: {
          ...shape(scope.label, computeAggregates(members), members),
          ...(scope.note ? { grouping: scope.note } : {}),
        },
        sources: [],
        visualization: "analysis",
      };
    }

    if (input.scope === "subregion") {
      // Subregional averages are derived, not baked into rankings.json, so the
      // per-indicator breakdown the other scopes carry is unavailable here.
      const found = input.name ? resolveSubregion(input.name) : undefined;
      if (!found) {
        return {
          data: { found: false, scope: input.scope, query: input.name },
          sources: [],
        };
      }
      const members = countries.filter(
        (c) => getCountrySubregion(c) === found.subregion
      );
      return {
        data: {
          found: true,
          scope: input.scope,
          label: found.subregion,
          region: found.region,
          countryCount: members.length,
          girai: found.averageGirai,
          dimensions: found.dimensions,
          pillars: found.pillars,
          frameworkScore: found.frameworkScore,
          implementationScore: found.implementationScore,
          rankAmongSubregions: found.globalRank,
          tiers: tierCounts(members),
          globalGirai: getGlobalAverages().girai,
          vsGlobal: compareToGlobal(computeAggregates(members)),
        },
        sources: [regionSource(found.region)],
        visualization: "analysis",
      };
    }

    if (input.scope === "region") {
      const region = input.name ? resolveRegion(input.name) : undefined;
      const agg = region ? getRegionAverages()[region] : undefined;
      if (!region || !agg) {
        return {
          data: { found: false, scope: input.scope, query: input.name },
          sources: [],
        };
      }
      return {
        data: shape(
          region,
          agg,
          countries.filter((c) => c.region === region)
        ),
        sources: [regionSource(region)],
        visualization: "analysis",
      };
    }

    // Income group: match the World Bank label loosely. Exact match wins; among
    // partial matches take the shortest so "low" resolves to "Low income", not
    // "Lower middle income".
    const byIncome = getIncomeGroupAverages();
    const query = (input.name ?? "").toLowerCase().trim();
    const group =
      Object.keys(byIncome).find((g) => g.toLowerCase() === query) ??
      (query
        ? Object.keys(byIncome)
            .filter((g) => g.toLowerCase().includes(query))
            .sort((a, b) => a.length - b.length)[0]
        : undefined);
    if (!group) {
      return {
        data: {
          found: false,
          scope: input.scope,
          query: input.name,
          availableGroups: Object.keys(byIncome),
        },
        sources: [],
      };
    }
    return {
      data: shape(
        group,
        byIncome[group],
        countries.filter((c) => c.incomeGroup === group)
      ),
      sources: [],
      visualization: "analysis",
    };
  },
});
