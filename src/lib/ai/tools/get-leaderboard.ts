import { tool } from "ai";
import { z } from "zod";
import {
  getAllCountries,
  getDimensionLeaderboard,
  getIndicatorLeaderboard,
  getPillarLeaderboard,
  type ScoreLeaderboardEntry,
} from "@/lib/girai/data";
import {
  countrySource,
  dimensionSource,
  indicatorSource,
  mergeSources,
} from "../sources";
import type { GiraiToolResult } from "../types";
import {
  resolveDimension,
  resolveIndicator,
  resolvePillar,
  resolveRegion,
} from "../utils";

export const getLeaderboardTool = tool({
  description:
    "Get top or bottom countries ranked by GIRAI score, a dimension, pillar, or indicator — " +
    "optionally scoped to a region or income group (e.g. top African countries on Trust and Safety). " +
    "`entries` is a slice capped at `limit`; `totalRanked` is how many countries the scoped ranking holds.",
  inputSchema: z.object({
    metric: z
      .enum(["girai", "dimension", "pillar", "indicator"])
      .default("girai"),
    metricSlug: z
      .string()
      .optional()
      .describe("Required for dimension, pillar, or indicator metrics"),
    region: z
      .string()
      .optional()
      .describe("Rank only countries in this GIRAI region"),
    incomeGroup: z
      .string()
      .optional()
      .describe("Rank only countries in this World Bank income group"),
    limit: z.number().min(1).max(50).default(10),
    order: z.enum(["top", "bottom"]).default("top"),
  }),
  execute: async (input): Promise<GiraiToolResult<unknown>> => {
    const sources = [];

    // Full sorted board for the metric; scope filters are applied after so
    // ranks are positions within the scoped list.
    let board: ScoreLeaderboardEntry[];
    if (input.metric === "girai") {
      board = getAllCountries()
        .filter((c) => c.girai !== null)
        .map((country) => ({ country, score: country.girai as number }))
        .sort((a, b) => b.score - a.score);
    } else if (input.metric === "dimension" && input.metricSlug) {
      const dim = resolveDimension(input.metricSlug);
      if (!dim) {
        return { data: { error: "Unknown dimension" }, sources: [] };
      }
      sources.push(dimensionSource(dim.slug, dim.name));
      board = getDimensionLeaderboard(dim.slug);
    } else if (input.metric === "pillar" && input.metricSlug) {
      const pillar = resolvePillar(input.metricSlug);
      if (!pillar) {
        return { data: { error: "Unknown pillar" }, sources: [] };
      }
      board = getPillarLeaderboard(pillar.slug);
    } else if (input.metric === "indicator" && input.metricSlug) {
      const ind = resolveIndicator(input.metricSlug);
      if (!ind) {
        return { data: { error: "Unknown indicator" }, sources: [] };
      }
      sources.push(indicatorSource(ind.slug, ind.name));
      board = getIndicatorLeaderboard(ind.slug);
    } else {
      return {
        data: { error: "metricSlug is required for this metric" },
        sources: [],
      };
    }

    let scope: string | undefined;
    if (input.region) {
      const region = resolveRegion(input.region);
      if (!region) {
        return { data: { error: "Unknown region" }, sources: [] };
      }
      board = board.filter((e) => e.country.region === region);
      scope = region;
    }
    if (input.incomeGroup) {
      const ig = input.incomeGroup.toLowerCase();
      board = board.filter((e) =>
        e.country.incomeGroup.toLowerCase().includes(ig)
      );
      scope = scope ? `${scope} · ${input.incomeGroup}` : input.incomeGroup;
    }

    // Size of the full scoped ranking behind `entries`. Without it a caller
    // can't tell a top-50 slice from the complete list.
    const totalRanked = board.length;
    const slice =
      input.order === "top"
        ? board.slice(0, input.limit)
        : [...board].reverse().slice(0, input.limit);
    const entries = slice.map((e, i) => ({
      iso3: e.country.iso3,
      name: e.country.name,
      score: e.score,
      rank: i + 1,
    }));

    return {
      data: {
        metric: input.metric,
        metricSlug: input.metricSlug,
        ...(scope ? { scope } : {}),
        order: input.order,
        totalRanked,
        truncated: totalRanked > entries.length,
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
