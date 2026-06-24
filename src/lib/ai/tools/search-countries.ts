import { tool } from "ai";
import { z } from "zod";
import { getAllCountries } from "@/lib/girai/data";
import { countrySource, mergeSources } from "../sources";
import type { GiraiToolResult } from "../types";
import { resolveDimension, resolveRegion } from "../utils";

export const searchCountriesTool = tool({
  description:
    "Search and filter countries by region, income group, GIRAI score range, or developing status.",
  inputSchema: z.object({
    region: z.string().optional().describe("GIRAI region name or slug"),
    incomeGroup: z.string().optional().describe("World Bank income group"),
    minGirai: z.number().optional().describe("Minimum GIRAI score (0–100)"),
    maxGirai: z.number().optional().describe("Maximum GIRAI score (0–100)"),
    developing: z
      .enum(["Yes", "No"])
      .optional()
      .describe("Developing economy filter"),
    minDimensionScore: z.number().optional(),
    dimension: z
      .string()
      .optional()
      .describe("Dimension slug or name for minDimensionScore filter"),
    limit: z.number().min(1).max(50).default(25),
    sortBy: z.enum(["girai", "name", "rank"]).default("girai"),
    order: z.enum(["desc", "asc"]).default("desc"),
  }),
  execute: async (input): Promise<GiraiToolResult<unknown>> => {
    let results = getAllCountries().filter((c) => c.girai !== null);

    if (input.region) {
      const region = resolveRegion(input.region);
      if (region) results = results.filter((c) => c.region === region);
    }
    if (input.incomeGroup) {
      const ig = input.incomeGroup.toLowerCase();
      results = results.filter((c) =>
        c.incomeGroup.toLowerCase().includes(ig)
      );
    }
    if (input.developing) {
      results = results.filter((c) => c.developing === input.developing);
    }
    if (input.minGirai !== undefined) {
      results = results.filter((c) => (c.girai ?? 0) >= input.minGirai!);
    }
    if (input.maxGirai !== undefined) {
      results = results.filter((c) => (c.girai ?? 100) <= input.maxGirai!);
    }
    if (input.minDimensionScore !== undefined && input.dimension) {
      const dim = resolveDimension(input.dimension);
      if (dim) {
        results = results.filter(
          (c) => (c.dimensionScores[dim.slug] ?? 0) >= input.minDimensionScore!
        );
      }
    }

    const sortKey = input.sortBy;
    results.sort((a, b) => {
      if (sortKey === "name") {
        return input.order === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      if (sortKey === "rank") {
        return input.order === "asc"
          ? (a.rankGlobal ?? 999) - (b.rankGlobal ?? 999)
          : (b.rankGlobal ?? 0) - (a.rankGlobal ?? 0);
      }
      return input.order === "asc"
        ? (a.girai ?? 0) - (b.girai ?? 0)
        : (b.girai ?? 0) - (a.girai ?? 0);
    });

    const limited = results.slice(0, input.limit).map((c) => ({
      iso3: c.iso3,
      name: c.name,
      region: c.region,
      incomeGroup: c.incomeGroup,
      girai: c.girai,
      rankGlobal: c.rankGlobal,
    }));

    return {
      data: {
        count: limited.length,
        totalMatched: results.length,
        countries: limited,
        filters: input,
      },
      sources: mergeSources(limited.map((c) => countrySource(c.iso3, c.name))),
      visualization: "table",
    };
  },
});
