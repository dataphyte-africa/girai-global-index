import { tool } from "ai";
import { z } from "zod";
import {
  getCountryEditionEvidenceStatus,
  getEditionEvidenceStatusArtifact,
} from "@/lib/girai/data";
import type { EditionPathwayId } from "@/lib/girai/types";
import { countrySource } from "../sources";
import type { GiraiToolResult } from "../types";
import { resolveCountry } from "../utils";

const PATHWAYS: EditionPathwayId[] = ["frameworks", "initiatives", "cso"];

export const getEditionComparisonTool = tool({
  description:
    "Get 2024 vs 2026 evidence-status comparison for a country. Shows which indicators gained or lost evidence coverage — not score changes.",
  inputSchema: z.object({
    query: z.string().describe("ISO3 code or country name"),
  }),
  execute: async ({ query }): Promise<GiraiToolResult<unknown>> => {
    const country = resolveCountry(query);
    if (!country) {
      return { data: { found: false, query }, sources: [] };
    }

    const status = getCountryEditionEvidenceStatus(country.iso3);
    const editionArtifact = getEditionEvidenceStatusArtifact();

    if (!status) {
      return {
        data: {
          found: true,
          iso3: country.iso3,
          name: country.name,
          hasStatus: false,
          message: "No edition comparison data available for this country.",
        },
        sources: [countrySource(country.iso3, country.name)],
        visualization: "analysis",
      };
    }

    const changes: Array<{
      pathway: EditionPathwayId;
      indicatorSlug: string;
      indicatorName: string;
      status2024: string;
      status2026: string;
    }> = [];

    for (const pathway of PATHWAYS) {
      for (const ind of editionArtifact.indicators) {
        const s2024 = status["2024"][pathway][ind.slug] ?? null;
        const s2026 = status["2026"][pathway][ind.slug] ?? null;
        if (s2024 !== s2026) {
          changes.push({
            pathway,
            indicatorSlug: ind.slug,
            indicatorName: ind.name,
            status2024: String(s2024 ?? "—"),
            status2026: String(s2026 ?? "—"),
          });
        }
      }
    }

    return {
      data: {
        found: true,
        iso3: country.iso3,
        name: country.name,
        has2024Coverage: status.has2024Coverage,
        changedIndicatorCount: changes.length,
        changes: changes.slice(0, 40),
        note: "This compares evidence coverage between editions, not GIRAI scores. Methodology changed between 2024 and 2026.",
      },
      sources: [countrySource(country.iso3, country.name)],
      visualization: "comparison",
    };
  },
});
