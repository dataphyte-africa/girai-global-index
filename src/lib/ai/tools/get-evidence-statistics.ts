import { tool } from "ai";
import { z } from "zod";
import {
  bindingByCountry,
  bindingByGroup,
  bindingBySubregion,
  bindingShare,
  coverageByIndicator,
  csoActivity,
  editionChange,
  editionChangeByCountry,
  editionChangeByGroup,
  editionChangeByIndicator,
  editionChangeForIndicator,
  governmentMisuse,
  getNationalAiPolicy,
  indicatorCoverage,
  nationalAiPolicyByGroup,
  nationalAiPolicyList,
  nationalAiPolicyStats,
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
    "civil-society activity counts, documented government misuse of AI, and " +
    "national AI policy adoption (how many countries have adopted / drafted / lack a " +
    "National AI Policy or equivalent, and what those policies contain), and " +
    "edition change since 2024 for any group of countries (framework coverage growth, " +
    "binding upgrades, new initiatives). " +
    "Use for any question about national AI policies or strategies, binding vs non-binding laws, policy coverage or " +
    "implementation gaps, CSO/civil-society activity, or unacceptable-risk AI cases — " +
    "these cannot be answered from GIRAI scores. " +
    "Scope accepts 'global', a report grouping ('Asia', 'LATAM', 'Global North', 'Global South'), " +
    "a GIRAI region, a subregion, a World Bank income group ('Low income'), or a country. " +
    "groupBy ranks the result to answer 'which indicator/country/subregion leads on this'; " +
    "groupBy 'development' splits it into Global North vs Global South in one call.",
  inputSchema: z.object({
    metric: z
      .enum([
        "binding-share",
        "framework-coverage",
        "implementation",
        "cso-activity",
        "government-misuse",
        "national-ai-policy",
        "edition-change",
      ])
      .describe(
        "binding-share: legally binding vs non-binding frameworks. " +
          "framework-coverage: share of countries (or country-indicator pairs) with an active framework. " +
          "implementation: of countries with a framework, how many also show delivery evidence. " +
          "cso-activity: civil-society initiative counts. " +
          "government-misuse: documented unacceptable-risk AI cases. " +
          "national-ai-policy: countries with an adopted, draft, or no National AI Policy (one per country) — " +
          "the ONLY correct source for 'how many national AI policies/strategies are adopted'. " +
          "With a country scope it returns that country's policy record. " +
          "edition-change: 2024 → 2026 evidence change over the 14 indicators both editions share — " +
          "average indicators with an adopted framework per country, new and lost frameworks, " +
          "non-binding → binding upgrades, initiative and CSO activity. Pass indicatorSlug for one " +
          "indicator's country counts (had in 2024 / new by 2026 / still none). For ONE country's " +
          "indicator-by-indicator changes use get_edition_comparison instead."
      ),
    scope: z
      .string()
      .optional()
      .describe(
        "'global' (default), a report grouping ('Asia' = 38 countries, 'LATAM' = 22, " +
          "'Global North' = 37 developed, 'Global South' = 98 developing), a GIRAI region ('Africa'), " +
          "a subregion ('East Asia'), an income group ('High income'), or a country"
      ),
    indicatorSlug: z
      .string()
      .optional()
      .describe(
        "Indicator name or slug, for per-indicator coverage/implementation/edition-change (e.g. 'labour-protections')"
      ),
    groupBy: z
      .enum([
        "none",
        "indicator",
        "country",
        "subregion",
        "region",
        "development",
      ])
      .default("none")
      .describe(
        "Rank the metric across indicators, countries, subregions, or regions instead of returning one figure. " +
          "For national-ai-policy, 'country' lists each policy (title, type, date, binding) and " +
          "'region'/'subregion' rank adoption rates. " +
          "'development' returns Global North and Global South side by side " +
          "(national-ai-policy, binding-share, edition-change)."
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
          hint: "Use 'global', a report grouping ('Asia', 'LATAM', 'Global North', 'Global South'), a GIRAI region, a subregion, an income group, or a country name.",
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

    if (input.metric === "national-ai-policy") {
      // A single country gets its own record — title, date, binding status
      // and what the document provides for — rather than a 1-of-1 rate.
      if (scope.countries.length === 1) {
        const policy = getNationalAiPolicy(scope.countries[0].iso3);
        return {
          data: {
            ...base,
            nationalAiPolicy: policy
              ? {
                  ...policy,
                  // Element-level justifications are long; keep text + value.
                  thematicElements:
                    policy.thematicElements?.map(({ text, value }) => ({
                      text,
                      value,
                    })) ?? null,
                }
              : null,
          },
          sources: [],
          visualization: "analysis",
        };
      }
      if (
        input.groupBy === "region" ||
        input.groupBy === "subregion" ||
        input.groupBy === "development"
      ) {
        const rows = nationalAiPolicyByGroup(scope, input.groupBy);
        return {
          data: {
            ...base,
            ...pickNapTotals(nationalAiPolicyStats(scope)),
            groupedBy: input.groupBy,
            groups: rows.slice(0, input.limit),
            groupsTruncated: rows.length > input.limit,
          },
          sources: [],
          visualization: "table",
        };
      }
      if (input.groupBy === "country") {
        const rows = nationalAiPolicyList(scope);
        return {
          data: {
            ...base,
            ...pickNapTotals(nationalAiPolicyStats(scope)),
            policies: rows.slice(0, input.limit),
            policiesTruncated: rows.length > input.limit,
          },
          sources: [],
          visualization: "table",
        };
      }
      return {
        data: { ...base, ...nationalAiPolicyStats(scope) },
        sources: [],
        visualization: "analysis",
      };
    }

    if (input.metric === "edition-change") {
      // Only 14 indicators exist in both editions; anything else has no 2024
      // baseline, so say so rather than return a misleading zero.
      const comparable = editionChangeByIndicator(scope);
      let indicatorSlug: string | undefined;
      if (input.indicatorSlug) {
        const ind = resolveIndicator(input.indicatorSlug);
        if (!ind || !comparable.some((r) => r.indicatorSlug === ind.slug)) {
          return {
            data: {
              error: ind
                ? "Indicator not comparable across editions"
                : "Unknown indicator",
              query: input.indicatorSlug,
              comparableIndicators: comparable.map((r) => r.indicatorName),
            },
            sources: [],
          };
        }
        indicatorSlug = ind.slug;
      }
      const editionBase = {
        ...base,
        note:
          "Compares evidence status, not scores — scores are not comparable across editions. " +
          "Countries without 2024 coverage are excluded (see excludedNo2024Coverage).",
      };

      if (input.groupBy === "indicator") {
        return {
          data: { ...editionBase, ...editionChange(scope), indicators: comparable },
          sources: [],
          visualization: "table",
        };
      }
      if (input.groupBy === "country") {
        const rows = editionChangeByCountry(scope);
        return {
          data: {
            ...editionBase,
            ...editionChange(scope),
            rankedBy: "gain in indicators with an adopted framework",
            countries: rows.slice(0, input.limit),
            countriesTruncated: rows.length > input.limit,
          },
          sources: [],
          visualization: "table",
        };
      }
      if (
        input.groupBy === "region" ||
        input.groupBy === "subregion" ||
        input.groupBy === "development"
      ) {
        return {
          data: {
            ...editionBase,
            groupedBy: input.groupBy,
            groups: editionChangeByGroup(scope, input.groupBy, indicatorSlug),
          },
          sources: [],
          visualization: "table",
        };
      }
      return {
        data: {
          ...editionBase,
          ...(indicatorSlug
            ? editionChangeForIndicator(scope, indicatorSlug)
            : editionChange(scope)),
        },
        sources: [],
        visualization: "analysis",
      };
    }

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
      if (input.groupBy === "region" || input.groupBy === "development") {
        return {
          data: {
            ...base,
            ...bindingShare(scope),
            groupedBy: input.groupBy,
            groups: bindingByGroup(scope, input.groupBy),
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

/**
 * The complete aggregates, carried alongside a grouped or listed result. The
 * policy list is capped, so a count question answered from it is wrong —
 * every NAP response therefore holds the true totals whatever groupBy was
 * chosen. Only the long name lists are dropped.
 */
function pickNapTotals(s: ReturnType<typeof nationalAiPolicyStats>) {
  return {
    adopted: s.adopted,
    adoptedPct: s.adoptedPct,
    draft: s.draft,
    draftPct: s.draftPct,
    noPolicy: s.noPolicy,
    noPolicyPct: s.noPolicyPct,
    adoptedByType: s.adoptedByType,
    adoptedBinding: s.adoptedBinding,
    adoptedNonBinding: s.adoptedNonBinding,
    adoptedBindingByType: s.adoptedBindingByType,
    adoptedByYear: s.adoptedByYear,
    adoptedContents: s.adoptedContents,
  };
}
