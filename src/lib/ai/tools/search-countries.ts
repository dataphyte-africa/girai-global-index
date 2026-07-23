import { tool } from "ai";
import { z } from "zod";
import {
  getAllCountries,
  getCountrySubregion,
  getGlobalAverages,
} from "@/lib/girai/data";
import { unknownRegion, unknownSubregion } from "../geo-errors";
import { countrySource, mergeSources } from "../sources";
import type { GiraiToolResult } from "../types";
import { resolveDimension, resolveRegion, resolveSubregion } from "../utils";

export const searchCountriesTool = tool({
  description:
    "Search and filter countries by region, subregion, income group, GIRAI score range, " +
    "developing status, or position relative to the global average. " +
    "`countries` is capped at `limit` — check `totalMatched` and `truncated` before presenting it as a complete list.",
  inputSchema: z.object({
    region: z.string().optional().describe("GIRAI region name or slug"),
    subregion: z
      .string()
      .optional()
      .describe(
        "Subregion name or alias, e.g. 'West Africa', 'East Asia', 'South Asia', 'Central America'"
      ),
    compareToGlobalAverage: z
      .enum(["above", "below"])
      .optional()
      .describe(
        "Keep only countries scoring above (or below) the precomputed global average. " +
          "Use this for 'which countries score above the global average' instead of passing a remembered number to minGirai."
      ),
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
    sortBy: z.enum(["girai", "name", "rank", "gdp"]).default("girai"),
    order: z.enum(["desc", "asc"]).default("desc"),
  }),
  execute: async (input): Promise<GiraiToolResult<unknown>> => {
    const globalAverage = getGlobalAverages().girai;
    let results = getAllCountries().filter((c) => c.girai !== null);

    if (input.region) {
      const region = resolveRegion(input.region);
      if (!region) {
        return { data: unknownRegion(input.region), sources: [] };
      }
      results = results.filter((c) => c.region === region);
    }
    if (input.subregion) {
      const sub = resolveSubregion(input.subregion);
      if (!sub) {
        return { data: unknownSubregion(input.subregion), sources: [] };
      }
      results = results.filter((c) => getCountrySubregion(c) === sub.subregion);
    }
    if (input.compareToGlobalAverage && globalAverage !== null) {
      results = results.filter((c) =>
        input.compareToGlobalAverage === "above"
          ? (c.girai ?? 0) > globalAverage
          : (c.girai ?? 0) < globalAverage
      );
    }
    if (input.incomeGroup) {
      const ig = input.incomeGroup.toLowerCase();
      results = results.filter((c) =>
        c.incomeGroup.toLowerCase().includes(ig)
      );
    }
    if (input.developing) {
      // The dataset stores "Developing"/"Developed", not the Yes/No the model
      // sends — comparing raw input matched nothing, ever.
      const want = input.developing === "Yes" ? "Developing" : "Developed";
      results = results.filter((c) => c.developing === want);
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
      if (sortKey === "gdp") {
        return input.order === "asc"
          ? (a.gdpPerCapitaPpp ?? Infinity) - (b.gdpPerCapitaPpp ?? Infinity)
          : (b.gdpPerCapitaPpp ?? -Infinity) - (a.gdpPerCapitaPpp ?? -Infinity);
      }
      return input.order === "asc"
        ? (a.girai ?? 0) - (b.girai ?? 0)
        : (b.girai ?? 0) - (a.girai ?? 0);
    });

    const limited = results.slice(0, input.limit).map((c) => ({
      iso3: c.iso3,
      name: c.name,
      region: c.region,
      subregion: getCountrySubregion(c),
      incomeGroup: c.incomeGroup,
      girai: c.girai,
      rankGlobal: c.rankGlobal,
      gdpPerCapitaPpp: c.gdpPerCapitaPpp,
    }));

    return {
      data: {
        count: limited.length,
        totalMatched: results.length,
        globalAverage,
        truncated: results.length > limited.length,
        countries: limited,
        filters: input,
      },
      sources: mergeSources(limited.map((c) => countrySource(c.iso3, c.name))),
      visualization: "table",
    };
  },
});
