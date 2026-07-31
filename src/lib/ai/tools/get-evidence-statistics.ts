import { tool } from "ai";
import { z } from "zod";
import {
  bindingByCountry,
  bindingBySubregion,
  bindingShare,
  coverageByIndicator,
  csoActivity,
  governmentMisuse,
  indicatorCoverage,
  overallCoverage,
  resolveStatScope,
} from "@/lib/girai/statistics";
import { findIndicator } from "@/data/2026/taxonomy";
import type { GiraiToolResult } from "../types";
import { resolveIndicator } from "../utils";

/**
 * Statistics computed over the evidence corpus rather than the score tables.
 *
 * These are the numbers the published regional briefs report — binding rates,
 * framework coverage, implementation follow-through, CSO activity, documented
 * misuse. They live nowhere in rankings.json, so before this tool existed the
 * assistant met them by improvising a plausible figure from score data.
 * Figures are recomputed live, so they track the current evidence corpus and
 * may exceed a brief published against an earlier snapshot.
 */
export const getEvidenceStatisticsTool = tool({
  description:
    "Compute evidence-based statistics that are NOT in the score tables: " +
    "the share of frameworks that are legally binding, framework coverage rates, " +
    "implementation follow-through (of countries with a framework, how many act on it), " +
    "civil-society activity counts, and documented government misuse of AI. " +
    "Use for any question about binding vs non-binding laws, policy coverage or " +
    "implementation gaps, CSO/civil-society activity, or unacceptable-risk AI cases — " +
    "these cannot be answered from GIRAI scores. " +
    "Scope accepts 'global', a report grouping ('Asia', 'LATAM'), a GIRAI region, a subregion, or a country. " +
    "groupBy ranks the result to answer 'which indicator/country/subregion leads on this'.",
  inputSchema: z.object({
    metric: z
      .enum([
        "binding-share",
        "framework-coverage",
        "implementation",
        "cso-activity",
        "government-misuse",
      ])
      .describe(
        "binding-share: legally binding vs non-binding frameworks. " +
          "framework-coverage: share of countries (or country-indicator pairs) with an active framework. " +
          "implementation: of countries with a framework, how many also show delivery evidence. " +
          "cso-activity: civil-society initiative counts. " +
          "government-misuse: documented unacceptable-risk AI cases."
      ),
    scope: z
      .string()
      .optional()
      .describe(
        "'global' (default), a report grouping ('Asia' = 38 countries, 'LATAM' = 22), " +
          "a GIRAI region ('Africa'), a subregion ('East Asia'), or a country"
      ),
    indicatorSlug: z
      .string()
      .optional()
      .describe(
        "Indicator name or slug, for per-indicator coverage/implementation (e.g. 'labour-protections')"
      ),
    groupBy: z
      .enum(["none", "indicator", "country", "subregion"])
      .default("none")
      .describe(
        "Rank the metric across indicators, countries, or subregions instead of returning one figure"
      ),
    limit: z.number().min(1).max(25).default(10),
  }),
  execute: async (input): Promise<GiraiToolResult<unknown>> => {
    const scope = resolveStatScope(input.scope);
    if (!scope) {
      return {
        data: {
          error: "Unknown scope",
          query: input.scope,
          hint: "Use 'global', a report grouping ('Asia', 'LATAM'), a GIRAI region, a subregion, or a country name.",
        },
        sources: [],
      };
    }

    // Every payload carries the scope's country count and, when the grouping
    // is not a GIRAI region, a note saying so — the same statistic means
    // different things over 30 countries and over 38.
    const base = {
      scope: scope.label,
      countryCount: scope.countries.length,
      ...(scope.note ? { groupingNote: scope.note } : {}),
    };

    if (input.metric === "government-misuse") {
      return {
        data: { ...base, ...governmentMisuse(scope) },
        sources: [],
        visualization: "analysis",
      };
    }

    if (input.metric === "cso-activity") {
      return {
        data: { ...base, ...csoActivity(scope) },
        sources: [],
        visualization: "analysis",
      };
    }

    if (input.metric === "binding-share") {
      if (input.groupBy === "country") {
        const r = bindingByCountry(scope);
        return {
          data: {
            ...base,
            ...bindingShare(scope),
            totalBindingCases: r.totalBindingCases,
            countries: r.countries.slice(0, input.limit),
            countriesTruncated: r.countries.length > input.limit,
          },
          sources: [],
          visualization: "table",
        };
      }
      if (input.groupBy === "subregion") {
        const rows = bindingBySubregion(scope);
        return {
          data: { ...base, subregions: rows.slice(0, input.limit) },
          sources: [],
          visualization: "table",
        };
      }
      return {
        data: { ...base, ...bindingShare(scope) },
        sources: [],
        visualization: "analysis",
      };
    }

    // framework-coverage and implementation share a shape: both are about the
    // framework → delivery pipeline, so each result reports both figures and
    // the caller reads the one it asked for.
    if (input.groupBy === "indicator") {
      const rows = coverageByIndicator(scope);
      const ranked =
        input.metric === "implementation"
          ? [...rows].sort(
              (a, b) => (b.implementationPct ?? -1) - (a.implementationPct ?? -1)
            )
          : rows;
      return {
        data: {
          ...base,
          rankedBy: input.metric,
          indicators: ranked.slice(0, input.limit),
          indicatorsTruncated: ranked.length > input.limit,
        },
        sources: [],
        visualization: "table",
      };
    }

    if (input.indicatorSlug) {
      const ind = resolveIndicator(input.indicatorSlug);
      if (!ind) {
        return {
          data: { error: "Unknown indicator", query: input.indicatorSlug },
          sources: [],
        };
      }
      return {
        data: {
          ...base,
          indicatorSlug: ind.slug,
          indicatorName: findIndicator(ind.slug)?.name ?? ind.name,
          ...indicatorCoverage(scope, ind.slug),
        },
        sources: [],
        visualization: "analysis",
      };
    }

    return {
      data: { ...base, ...overallCoverage(scope) },
      sources: [],
      visualization: "analysis",
    };
  },
});
