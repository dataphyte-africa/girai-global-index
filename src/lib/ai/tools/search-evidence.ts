import { tool } from "ai";
import { z } from "zod";
import { getAllEvidenceItems } from "@/lib/girai/data";
import { evidenceSource, indicatorSource, mergeSources } from "../sources";
import type { GiraiToolResult } from "../types";
import { resolveIndicator, resolveRegion } from "../utils";

const EVIDENCE_KINDS = [
  "framework",
  "initiative",
  "cso-initiative",
  "gmc-consultation",
  "gmc-provision",
  "gmc-mechanism",
  "government-misuse",
] as const;

export const searchEvidenceTool = tool({
  description:
    "Search evidence items by text query and optional filters (country, indicator, kind, region).",
  inputSchema: z.object({
    query: z.string().optional().describe("Free-text search in title/justification"),
    countryIso3: z.string().optional().describe("Filter by country ISO3"),
    indicatorSlug: z.string().optional().describe("Filter by indicator slug or name"),
    kind: z.enum(EVIDENCE_KINDS).optional().describe("Evidence kind filter"),
    region: z.string().optional().describe("Filter by GIRAI region"),
    limit: z.number().min(1).max(30).default(15),
  }),
  execute: async (input): Promise<GiraiToolResult<unknown>> => {
    let items = getAllEvidenceItems();

    if (input.countryIso3) {
      const code = input.countryIso3.toUpperCase();
      items = items.filter((it) => it.country.iso3 === code);
    }
    if (input.indicatorSlug) {
      const ind = resolveIndicator(input.indicatorSlug);
      if (ind) {
        items = items.filter(
          (it) =>
            it.indicatorSlug === ind.slug ||
            it.contributesTo?.includes(ind.slug)
        );
      }
    }
    if (input.kind) {
      items = items.filter((it) => it.kind === input.kind);
    }
    if (input.region) {
      const region = resolveRegion(input.region);
      if (region) {
        items = items.filter((it) => it.country.region === region);
      }
    }
    if (input.query?.trim()) {
      const q = input.query.toLowerCase();
      items = items.filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.justification.toLowerCase().includes(q) ||
          it.country.name.toLowerCase().includes(q)
      );
    }

    const limited = items.slice(0, input.limit).map((it) => ({
      id: it.id,
      kind: it.kind,
      title: it.title,
      country: it.country.name,
      countryIso3: it.country.iso3,
      indicatorSlug: it.indicatorSlug,
      region: it.country.region,
      type: it.type,
    }));

    const indicatorSlugs = [...new Set(limited.map((i) => i.indicatorSlug))];
    const indicatorSources = indicatorSlugs
      .map((slug) => {
        const ind = resolveIndicator(slug);
        return ind ? indicatorSource(ind.slug, ind.name) : null;
      })
      .filter((s): s is NonNullable<typeof s> => s !== null);

    return {
      data: {
        count: limited.length,
        totalMatched: items.length,
        items: limited,
        filters: input,
      },
      sources: mergeSources(
        limited.map((it) => evidenceSource(it.id, it.title)),
        indicatorSources
      ),
      visualization: "table",
    };
  },
});
