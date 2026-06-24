import { tool } from "ai";
import { z } from "zod";
import { getRegionSummaries } from "@/lib/girai/data";
import { regionSource } from "../sources";
import type { GiraiToolResult } from "../types";
import { resolveRegionSummary } from "../utils";

export const getRegionSummaryTool = tool({
  description:
    "Get regional performance summary: average GIRAI score, country count, global rank among regions, and dimension/pillar averages.",
  inputSchema: z.object({
    region: z.string().describe("GIRAI region name or URL slug"),
    includeAllRegions: z
      .boolean()
      .default(false)
      .describe("If true, return summaries for all regions ranked"),
  }),
  execute: async (input): Promise<GiraiToolResult<unknown>> => {
    if (input.includeAllRegions) {
      const all = getRegionSummaries();
      return {
        data: {
          regions: all.map((r) => ({
            region: r.region,
            averageGirai: r.averageGirai,
            countryCount: r.countryCount,
            globalRank: r.globalRank,
            dimensions: r.dimensions,
            pillars: r.pillars,
          })),
        },
        sources: all.map((r) => regionSource(r.region)),
        visualization: "table",
      };
    }

    const summary = resolveRegionSummary(input.region);
    if (!summary) {
      return {
        data: { found: false, query: input.region },
        sources: [],
      };
    }

    return {
      data: {
        found: true,
        region: summary.region,
        averageGirai: summary.averageGirai,
        countryCount: summary.countryCount,
        globalRank: summary.globalRank,
        dimensions: summary.dimensions,
        pillars: summary.pillars,
      },
      sources: [regionSource(summary.region)],
      visualization: "analysis",
    };
  },
});
