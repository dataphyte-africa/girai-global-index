import { tool } from "ai";
import { z } from "zod";
import { getIndicatorLeaderboard } from "@/lib/girai/data";
import { DIMENSIONS, PILLARS } from "@/data/2026/taxonomy";
import { indicatorSource } from "../sources";
import type { GiraiToolResult } from "../types";
import { resolveIndicator } from "../utils";

export const lookupIndicatorTool = tool({
  description:
    "Look up an indicator by slug or name. Returns definition, dimension, pillar, and optional top/bottom countries.",
  inputSchema: z.object({
    query: z.string().describe("Indicator slug or name"),
    includeLeaderboard: z.boolean().default(true),
    leaderboardLimit: z.number().min(1).max(10).default(5),
  }),
  execute: async (input): Promise<GiraiToolResult<unknown>> => {
    const ind = resolveIndicator(input.query);
    if (!ind) {
      return {
        data: { found: false, query: input.query },
        sources: [],
      };
    }

    const dimension = DIMENSIONS.find((d) => d.slug === ind.dimension);
    const pillar = PILLARS.find((p) => p.slug === ind.pillar);

    let topCountries: Array<{ iso3: string; name: string; score: number }> = [];
    let bottomCountries: Array<{ iso3: string; name: string; score: number }> =
      [];

    if (input.includeLeaderboard) {
      const board = getIndicatorLeaderboard(ind.slug);
      topCountries = board.slice(0, input.leaderboardLimit).map((e) => ({
        iso3: e.country.iso3,
        name: e.country.name,
        score: e.score,
      }));
      bottomCountries = [...board]
        .reverse()
        .slice(0, input.leaderboardLimit)
        .map((e) => ({
          iso3: e.country.iso3,
          name: e.country.name,
          score: e.score,
        }));
    }

    return {
      data: {
        found: true,
        slug: ind.slug,
        name: ind.name,
        dimension: dimension?.name,
        dimensionSlug: ind.dimension,
        pillar: pillar?.name,
        pillarSlug: ind.pillar,
        family: ind.family,
        hasEvidence: ind.hasEvidence,
        topCountries,
        bottomCountries,
      },
      sources: [indicatorSource(ind.slug, ind.name)],
      visualization: "analysis",
    };
  },
});
