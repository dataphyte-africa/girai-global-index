import { tool } from "ai";
import { z } from "zod";
import { getAllEvidenceItems } from "@/lib/girai/data";
import { unknownRegion, unknownSubregion } from "../geo-errors";
import { evidenceSource, indicatorSource, mergeSources } from "../sources";
import type { GiraiToolResult } from "../types";
import { resolveIndicator, resolveRegion, resolveSubregion } from "../utils";

/**
 * Dropped from a free-text query before matching, since the model tends to
 * phrase `query` as a sentence and every surviving term has to pass the AND
 * below. Function words only — dropping content words ("documented",
 * "evidence") would silently narrow the query to something the user never
 * asked for, which is worse than matching nothing.
 */
const QUERY_STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "which", "have", "has", "had", "are",
  "was", "were", "any", "all", "from", "into", "about", "there", "their",
  "been", "does", "did", "this", "these", "those", "its",
]);

const tokenize = (query: string): string[] => [
  ...new Set(
    query
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((t) => t.length > 2 && !QUERY_STOPWORDS.has(t))
  ),
];

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
    "Search evidence items by text query and optional filters (country, indicator, kind, region, subregion). " +
    "`items` is only a sample, capped at `limit`. To answer 'which countries have …' or " +
    "'which indicator has the most …' use the `countries` / `indicators` roll-ups — " +
    "computed over every match, complete regardless of `limit`.",
  inputSchema: z.object({
    query: z
      .string()
      .optional()
      .describe(
        "Keyword search in title/justification/country — every keyword must match. " +
          "Pass distinctive keywords, not a sentence. Omit it when the kind/country/indicator filters already express the question."
      ),
    countryIso3: z.string().optional().describe("Filter by country ISO3"),
    indicatorSlug: z.string().optional().describe("Filter by indicator slug or name"),
    kind: z.enum(EVIDENCE_KINDS).optional().describe("Evidence kind filter"),
    region: z.string().optional().describe("Filter by GIRAI region"),
    subregion: z
      .string()
      .optional()
      .describe("Filter by subregion, e.g. 'West Africa', 'South East Asia'"),
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
      if (!region) {
        return { data: unknownRegion(input.region), sources: [] };
      }
      items = items.filter((it) => it.country.region === region);
    }
    if (input.subregion) {
      const sub = resolveSubregion(input.subregion);
      if (!sub) {
        return { data: unknownSubregion(input.subregion), sources: [] };
      }
      // Evidence country refs carry the raw subregion, blank for the three
      // regions that publish no split — fall back to the region there too.
      items = items.filter(
        (it) =>
          (it.country.subregion?.trim() || it.country.region) === sub.subregion
      );
    }
    // Match on tokens, not the raw string: substring-matching the whole query
    // meant any multi-word phrase matched nothing at all.
    //
    // If the keywords still match nothing but the structured filters matched
    // something, keep those rather than reporting zero — a prose `query` used to
    // wipe out a valid `kind` search and make the assistant claim no such
    // evidence existed. `queryIgnored` tells the model that happened. Without a
    // structured filter there is nothing to fall back to, so zero stands.
    const hasStructuredFilter = Boolean(
      input.countryIso3 ||
        input.indicatorSlug ||
        input.kind ||
        input.region ||
        input.subregion
    );
    const hasQuery = Boolean(input.query?.trim());
    const tokens = hasQuery ? tokenize(input.query!) : [];
    let queryIgnored = false;

    if (tokens.length > 0) {
      const matched = items.filter((it) => {
        const haystack =
          `${it.title} ${it.justification} ${it.country.name}`.toLowerCase();
        return tokens.every((t) => haystack.includes(t));
      });
      if (matched.length > 0 || !hasStructuredFilter) items = matched;
      else queryIgnored = true;
    } else if (hasQuery) {
      // Nothing searchable survived tokenizing (all stopwords / too short), so
      // no text filter was applied. Flag it rather than passing every item off
      // as a match for the query.
      queryIgnored = true;
    }

    // Rolled up over every match, not just the returned page: "which countries
    // have X evidence" is a common question, and `items` is capped at `limit`
    // while the data is ordered by country — so a truncated page silently cuts
    // the answer off partway through the alphabet. Bounded by the country count.
    const tally = new Map<string, { iso3: string; name: string; count: number }>();
    for (const it of items) {
      const seen = tally.get(it.country.iso3);
      if (seen) seen.count += 1;
      else
        tally.set(it.country.iso3, {
          iso3: it.country.iso3,
          name: it.country.name,
          count: 1,
        });
    }
    const countries = [...tally.values()].sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name)
    );

    // Same idea per indicator, so "which indicator has the most X evidence"
    // is one call instead of 38. Bounded by the indicator count.
    const indicatorTally = new Map<string, { slug: string; name: string; count: number }>();
    for (const it of items) {
      const seen = indicatorTally.get(it.indicatorSlug);
      if (seen) seen.count += 1;
      else
        indicatorTally.set(it.indicatorSlug, {
          slug: it.indicatorSlug,
          name: resolveIndicator(it.indicatorSlug)?.name ?? it.indicatorSlug,
          count: 1,
        });
    }
    const indicators = [...indicatorTally.values()].sort(
      (a, b) => b.count - a.count || a.name.localeCompare(b.name)
    );

    const limited = items.slice(0, input.limit).map((it) => ({
      id: it.id,
      kind: it.kind,
      title: it.title,
      country: it.country.name,
      countryIso3: it.country.iso3,
      indicatorSlug: it.indicatorSlug,
      region: it.country.region,
      type: it.type,
      // Real external source URL (Drive mirror as fallback) — evidence has no
      // dedicated on-site detail page.
      link: it.link ?? it.drive ?? null,
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
        itemsTruncated: items.length > limited.length,
        countryCount: countries.length,
        countries,
        indicators,
        items: limited,
        filters: input,
        ...(tokens.length > 0 ? { queryTokens: tokens } : {}),
        ...(queryIgnored
          ? {
              queryIgnored: true,
              queryIgnoredNote:
                "No evidence text matched the keywords in `query`, so it was dropped and these results reflect the other filters only. Say the text search matched nothing — do NOT claim no such evidence exists.",
            }
          : {}),
      },
      sources: mergeSources(
        limited
          .filter((it): it is typeof it & { link: string } => Boolean(it.link))
          .map((it) => evidenceSource(it.title, it.link)),
        indicatorSources
      ),
      visualization: "table",
    };
  },
});
