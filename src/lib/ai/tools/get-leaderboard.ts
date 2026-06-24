import { tool } from "ai";
import { z } from "zod";
import {
  getDimensionLeaderboard,
  getIndicatorLeaderboard,
  getPillarLeaderboard,
  getTopAndBottomCountries,
} from "@/lib/girai/data";
import {
  countrySource,
  dimensionSource,
  indicatorSource,
  mergeSources,
} from "../sources";
import type { GiraiToolResult } from "../types";
import { resolveDimension, resolveIndicator, resolvePillar } from "../utils";

export const getLeaderboardTool = tool({
  description:
    "Get top or bottom countries ranked by GIRAI score, a dimension, pillar, or indicator.",
  inputSchema: z.object({
    metric: z
      .enum(["girai", "dimension", "pillar", "indicator"])
      .default("girai"),
    metricSlug: z
      .string()
      .optional()
      .describe("Required for dimension, pillar, or indicator metrics"),
    limit: z.number().min(1).max(50).default(10),
    order: z.enum(["top", "bottom"]).default("top"),
  }),
  execute: async (input): Promise<GiraiToolResult<unknown>> => {
    let entries: Array<{ iso3: string; name: string; score: number; rank: number }> =
      [];
    const sources = [];

    if (input.metric === "girai") {
      const { topCountries, bottomCountries } = getTopAndBottomCountries(
        input.limit
      );
      const list = input.order === "top" ? topCountries : bottomCountries;
      entries = list.map((c, i) => ({
        iso3: c.iso3,
        name: c.name,
        score: c.girai ?? 0,
        rank: input.order === "top" ? i + 1 : i + 1,
      }));
    } else if (input.metric === "dimension" && input.metricSlug) {
      const dim = resolveDimension(input.metricSlug);
      if (!dim) {
        return { data: { error: "Unknown dimension" }, sources: [] };
      }
      sources.push(dimensionSource(dim.slug, dim.name));
      const board = getDimensionLeaderboard(dim.slug);
      const slice =
        input.order === "top"
          ? board.slice(0, input.limit)
          : [...board].reverse().slice(0, input.limit);
      entries = slice.map((e, i) => ({
        iso3: e.country.iso3,
        name: e.country.name,
        score: e.score,
        rank: i + 1,
      }));
    } else if (input.metric === "pillar" && input.metricSlug) {
      const pillar = resolvePillar(input.metricSlug);
      if (!pillar) {
        return { data: { error: "Unknown pillar" }, sources: [] };
      }
      const board = getPillarLeaderboard(pillar.slug);
      const slice =
        input.order === "top"
          ? board.slice(0, input.limit)
          : [...board].reverse().slice(0, input.limit);
      entries = slice.map((e, i) => ({
        iso3: e.country.iso3,
        name: e.country.name,
        score: e.score,
        rank: i + 1,
      }));
    } else if (input.metric === "indicator" && input.metricSlug) {
      const ind = resolveIndicator(input.metricSlug);
      if (!ind) {
        return { data: { error: "Unknown indicator" }, sources: [] };
      }
      sources.push(indicatorSource(ind.slug, ind.name));
      const board = getIndicatorLeaderboard(ind.slug);
      const slice =
        input.order === "top"
          ? board.slice(0, input.limit)
          : [...board].reverse().slice(0, input.limit);
      entries = slice.map((e, i) => ({
        iso3: e.country.iso3,
        name: e.country.name,
        score: e.score,
        rank: i + 1,
      }));
    }

    return {
      data: {
        metric: input.metric,
        metricSlug: input.metricSlug,
        order: input.order,
        entries,
      },
      sources: mergeSources(
        sources,
        entries.map((e) => countrySource(e.iso3, e.name))
      ),
      visualization: "bar_chart",
    };
  },
});
