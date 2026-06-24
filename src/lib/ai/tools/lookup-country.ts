import { tool } from "ai";
import { z } from "zod";
import { countrySource } from "../sources";
import type { GiraiToolResult } from "../types";
import {
  bottomDimensions,
  resolveCountry,
  topDimensions,
} from "../utils";

export const lookupCountryTool = tool({
  description:
    "Look up a country by ISO3 code or name. Returns GIRAI score, ranks, dimension/pillar scores, URAI info, and evidence counts.",
  inputSchema: z.object({
    query: z
      .string()
      .describe("ISO3 code (e.g. NGA) or country name (e.g. Nigeria)"),
  }),
  execute: async ({ query }): Promise<GiraiToolResult<unknown>> => {
    const country = resolveCountry(query);
    if (!country) {
      return {
        data: { found: false, query },
        sources: [],
        visualization: "analysis",
      };
    }

    return {
      data: {
        found: true,
        iso3: country.iso3,
        name: country.name,
        region: country.region,
        incomeGroup: country.incomeGroup,
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
        strongestDimensions: topDimensions(country),
        weakestDimensions: bottomDimensions(country),
        evidenceCounts: country.evidenceCounts,
      },
      sources: [countrySource(country.iso3, country.name)],
      visualization: "analysis",
    };
  },
});
