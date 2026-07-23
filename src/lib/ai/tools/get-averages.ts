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

/**
 * Precomputed score averages — the assistant is forbidden from averaging
 * country scores manually, so without this tool "what's the global average?"
 * and "how do low-income countries perform on average?" were unanswerable.
 */
export const getAveragesTool = tool({
  description:
    "Get precomputed average scores (GIRAI, dimensions, pillars, framework/implementation) " +
    "and the GIRAI score-tier distribution (Leading/Advanced/Developing/Emerging/Nascent) " +
    "for the whole index, one region, one subregion, or one World Bank income group. " +
    "Use for any 'average', 'how many countries score X', or group-comparison question instead of computing manually.",
  inputSchema: z.object({
    scope: z
      .enum(["global", "region", "subregion", "income-group"])
      .describe("Which slice to average over"),
    name: z
      .string()
      .optional()
      .describe(
        "Region name (scope=region), subregion name (scope=subregion), or income group such as 'Low income' (scope=income-group)"
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
