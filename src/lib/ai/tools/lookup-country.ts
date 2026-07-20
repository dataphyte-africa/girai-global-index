import { tool } from "ai";
import { z } from "zod";
import { getIndicatorLeaderboard } from "@/lib/girai/data";
import { countrySource, indicatorSource, mergeSources } from "../sources";
import type { GiraiToolResult } from "../types";
import {
  bottomDimensions,
  resolveCountry,
  resolveIndicator,
  topDimensions,
} from "../utils";

export const lookupCountryTool = tool({
  description:
    "Look up a country by ISO3 code or name. Returns GIRAI score, ranks, dimension/pillar scores, URAI info, and evidence counts. " +
    "Pass `indicators` to also get the country's score and global rank on specific indicators.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("ISO3 code (e.g. NGA) or country name (e.g. Nigeria)"),
    indicators: z
      .array(z.string())
      .optional()
      .describe(
        "Indicator slugs or names — returns this country's score and global rank on each"
      ),
  }),
  execute: async ({ query, indicators }): Promise<GiraiToolResult<unknown>> => {
    const country = resolveCountry(query);
    if (!country) {
      return {
        data: { found: false, query },
        sources: [],
        visualization: "analysis",
      };
    }

    // Per-indicator detail on request. Rank comes from the indicator
    // leaderboard, which orders every scored country.
    const requested = (indicators ?? []).filter((s) => s.trim().length > 0);
    const indicatorDetails = requested.map((q) => {
      const ind = resolveIndicator(q);
      if (!ind) return { query: q, found: false as const };
      const board = getIndicatorLeaderboard(ind.slug);
      const pos = board.findIndex((e) => e.country.iso3 === country.iso3);
      return {
        query: q,
        found: true as const,
        slug: ind.slug,
        name: ind.name,
        score: country.indicatorScores[ind.slug] ?? null,
        rankGlobal: pos === -1 ? null : pos + 1,
        rankedCountryCount: board.length,
      };
    });

    return {
      data: {
        found: true,
        iso3: country.iso3,
        name: country.name,
        region: country.region,
        subregion: country.subregion,
        incomeGroup: country.incomeGroup,
        developing: country.developing,
        gdpPerCapitaPpp: country.gdpPerCapitaPpp,
        girai: country.girai,
        giraiRaw: country.giraiRaw,
        uraiPenalty: country.uraiPenalty,
        uraiCount: country.uraiCount,
        rankGlobal: country.rankGlobal,
        rankRegional: country.rankRegional,
        rankIncomeGroup: country.rankIncomeGroup,
        frameworkScore: country.frameworkScore,
        implementationScore: country.implementationScore,
        dimensionScores: country.dimensionScores,
        pillarScores: country.pillarScores,
        // 15-cell dimension × pillar breakdown, e.g. CSO Engagement within
        // Trust and Safety.
        dimPillarMatrix: country.dimPillarMatrix,
        strongestDimensions: topDimensions(country),
        weakestDimensions: bottomDimensions(country),
        evidenceCounts: country.evidenceCounts,
        ...(indicatorDetails.length > 0 ? { indicatorDetails } : {}),
      },
      sources: mergeSources(
        [countrySource(country.iso3, country.name)],
        indicatorDetails
          .filter((d) => d.found)
          .map((d) => indicatorSource(d.slug, d.name))
      ),
      visualization: "analysis",
    };
  },
});
