import { tool } from "ai";
import { z } from "zod";
import { PILLARS } from "@/data/2026/taxonomy";
import {
  countrySource,
  dimensionSource,
  indicatorSource,
  mergeSources,
} from "../sources";
import type { GiraiToolResult } from "../types";
import {
  resolveCountry,
  resolveDimension,
  resolveIndicator,
  resolvePillar,
} from "../utils";

export const compareCountriesTool = tool({
  description:
    "Compare 2–4 countries side by side on GIRAI scores and optional dimension, pillar, or indicator focus.",
  inputSchema: z.object({
    iso3s: z
      .array(z.string())
      .min(2)
      .max(4)
      .describe("ISO3 codes or country names (2–4 countries)"),
    focusDimension: z
      .string()
      .optional()
      .describe("Dimension slug or name to highlight"),
    focusPillar: z.string().optional().describe("Pillar slug or name to highlight"),
    focusIndicator: z
      .string()
      .optional()
      .describe("Indicator slug or name to highlight"),
  }),
  execute: async (input): Promise<GiraiToolResult<unknown>> => {
    const countries = input.iso3s
      .map((q) => resolveCountry(q))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    if (countries.length < 2) {
      return {
        data: { error: "Could not resolve at least 2 countries", query: input.iso3s },
        sources: [],
      };
    }

    const dim = input.focusDimension
      ? resolveDimension(input.focusDimension)
      : undefined;
    const pillar = input.focusPillar
      ? resolvePillar(input.focusPillar)
      : undefined;
    const indicator = input.focusIndicator
      ? resolveIndicator(input.focusIndicator)
      : undefined;

    const comparison = countries.map((c) => {
      const row: Record<string, unknown> = {
        iso3: c.iso3,
        name: c.name,
        region: c.region,
        girai: c.girai,
        rankGlobal: c.rankGlobal,
        dimensionScores: c.dimensionScores,
        pillarScores: c.pillarScores,
      };
      if (dim) row.focusDimensionScore = c.dimensionScores[dim.slug];
      if (pillar) row.focusPillarScore = c.pillarScores[pillar.slug];
      if (indicator) row.focusIndicatorScore = c.indicatorScores[indicator.slug];
      return row;
    });

    const sources = mergeSources(
      countries.map((c) => countrySource(c.iso3, c.name))
    );
    if (dim) sources.push(dimensionSource(dim.slug, dim.name));
    if (indicator) sources.push(indicatorSource(indicator.slug, indicator.name));

    return {
      data: {
        focus: {
          dimension: dim,
          pillar: pillar
            ? { slug: pillar.slug, name: PILLARS.find((p) => p.slug === pillar.slug)?.name }
            : undefined,
          indicator: indicator
            ? { slug: indicator.slug, name: indicator.name }
            : undefined,
        },
        countries: comparison,
      },
      sources,
      visualization: "comparison",
    };
  },
});
