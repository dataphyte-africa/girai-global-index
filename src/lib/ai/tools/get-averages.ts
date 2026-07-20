import { tool } from "ai";
import { z } from "zod";
import {
  getAllCountries,
  getGlobalAverages,
  getIncomeGroupAverages,
  getRegionAverages,
} from "@/lib/girai/data";
import type { ScoreAggregates } from "@/lib/girai/types";
import { regionSource } from "../sources";
import type { GiraiToolResult } from "../types";
import { resolveRegion } from "../utils";

/**
 * Precomputed score averages — the assistant is forbidden from averaging
 * country scores manually, so without this tool "what's the global average?"
 * and "how do low-income countries perform on average?" were unanswerable.
 */
export const getAveragesTool = tool({
  description:
    "Get precomputed average scores (GIRAI, dimensions, pillars, framework/implementation) " +
    "for the whole index, one region, or one World Bank income group. " +
    "Use for any 'average' or group-comparison question instead of averaging manually.",
  inputSchema: z.object({
    scope: z
      .enum(["global", "region", "income-group"])
      .describe("Which slice to average over"),
    name: z
      .string()
      .optional()
      .describe(
        "Region name (for scope=region) or income group, e.g. 'Low income' (for scope=income-group)"
      ),
    includeIndicators: z
      .boolean()
      .default(false)
      .describe("Also return the 38 per-indicator averages"),
  }),
  execute: async (input): Promise<GiraiToolResult<unknown>> => {
    const shape = (label: string, agg: ScoreAggregates, countryCount: number) => ({
      found: true,
      scope: input.scope,
      label,
      countryCount,
      girai: agg.girai,
      dimensions: agg.dimensions,
      pillars: agg.pillars,
      frameworkScore: agg.frameworkScore,
      implementationScore: agg.implementationScore,
      ...(input.includeIndicators ? { indicators: agg.indicators } : {}),
    });
    const countries = getAllCountries().filter((c) => c.girai !== null);

    if (input.scope === "global") {
      return {
        data: shape("Global", getGlobalAverages(), countries.length),
        sources: [],
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
          countries.filter((c) => c.region === region).length
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
        countries.filter((c) => c.incomeGroup === group).length
      ),
      sources: [],
      visualization: "analysis",
    };
  },
});
