import { tool } from "ai";
import { z } from "zod";
import {
  getCountriesBySubregion,
  getGlobalAverages,
  getSubregionSummaries,
} from "@/lib/girai/data";
import type { SubregionSummary } from "@/lib/girai/data";
import { unknownRegion, unknownSubregion } from "../geo-errors";
import { countrySource, mergeSources, regionSource } from "../sources";
import type { GiraiToolResult } from "../types";
import { resolveRegion, resolveSubregion } from "../utils";

/** Members are listed in full — the largest subregion holds 13 countries. */
const MEMBER_LIMIT = 15;

/**
 * Subregional averages. The dataset carries `subregion` on every country but
 * the build step only pre-aggregates by region and income group, so without
 * this tool questions like "which Asian subregion performs best" or "does
 * Central America beat the global average" had no answer path at all.
 */
export const getSubregionSummaryTool = tool({
  description:
    "Get subregional performance: average GIRAI score, country count, rank among subregions, " +
    "dimension/pillar averages, and the ranked member countries — for one subregion, for every " +
    "subregion of a region, or for all subregions at once. " +
    "Subregions include East Asia, South East Asia, South West Asia (South Asia), NorthWest Asia " +
    "(Central Asia and the Caucasus), Oceania (Pacific), West/East/North/Central Africa, " +
    "South Africa (Southern Africa), North/West/Central/Eastern Europe, Balkans, " +
    "South America and Central America. " +
    "Use this — never get_averages or manual arithmetic — for any question about a geography " +
    "smaller than a GIRAI region.",
  inputSchema: z.object({
    subregion: z
      .string()
      .optional()
      .describe("Subregion name or common alias, e.g. 'East Asia', 'South Asia', 'Southern Africa'"),
    region: z
      .string()
      .optional()
      .describe("Return every subregion of this GIRAI region, ranked by average score"),
    includeAllSubregions: z
      .boolean()
      .default(false)
      .describe("Return every subregion in the index, ranked by average score"),
  }),
  execute: async (input): Promise<GiraiToolResult<unknown>> => {
    const globalAverage = getGlobalAverages().girai;

    // Every row carries the global-average comparison so the model never has
    // to remember the threshold or do the subtraction itself.
    const row = (r: SubregionSummary) => ({
      subregion: r.subregion,
      region: r.region,
      isWholeRegion: r.isWholeRegion,
      averageGirai: r.averageGirai,
      countryCount: r.countryCount,
      rankAmongSubregions: r.globalRank,
      rankWithinRegion: r.rankWithinRegion,
      aboveGlobalAverage: globalAverage !== null && r.averageGirai > globalAverage,
    });

    const detail = (r: SubregionSummary) => {
      const members = getCountriesBySubregion(r.subregion);
      return {
        ...row(r),
        dimensions: r.dimensions,
        pillars: r.pillars,
        frameworkScore: r.frameworkScore,
        implementationScore: r.implementationScore,
        countries: members.slice(0, MEMBER_LIMIT).map((c, i) => ({
          iso3: c.iso3,
          name: c.name,
          girai: c.girai,
          rankGlobal: c.rankGlobal,
          rankInSubregion: i + 1,
        })),
      };
    };

    if (input.subregion) {
      const found = resolveSubregion(input.subregion);
      if (!found) {
        return {
          data: {
            ...unknownSubregion(input.subregion),
            availableSubregions: getSubregionSummaries().map((r) => r.subregion),
          },
          sources: [],
        };
      }
      const data = detail(found);
      return {
        data: { found: true, globalAverage, ...data },
        sources: mergeSources(
          [regionSource(found.region)],
          data.countries.map((c) => countrySource(c.iso3, c.name))
        ),
        visualization: "analysis",
      };
    }

    let rows = getSubregionSummaries();
    let scope: string | undefined;
    if (input.region) {
      const region = resolveRegion(input.region);
      if (!region) {
        return { data: unknownRegion(input.region), sources: [] };
      }
      rows = rows.filter((r) => r.region === region);
      scope = region;
    }

    return {
      data: {
        found: true,
        ...(scope ? { region: scope } : {}),
        globalAverage,
        subregionCount: rows.length,
        subregions: rows.map(row),
      },
      sources: mergeSources(
        Array.from(new Set(rows.map((r) => r.region))).map((r) => regionSource(r))
      ),
      visualization: "table",
    };
  },
});
