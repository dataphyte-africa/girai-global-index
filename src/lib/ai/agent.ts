import { createOpenAI } from "@ai-sdk/openai";
import { InferAgentUIMessage, stepCountIs, ToolLoopAgent } from "ai";
import { buildGiraiInstructions } from "./instructions";
import { compareCountriesTool } from "./tools/compare-countries";
import { getAveragesTool } from "./tools/get-averages";
import { getEditionComparisonTool } from "./tools/get-edition-comparison";
import { getEvidenceStatisticsTool } from "./tools/get-evidence-statistics";
import { getLeaderboardTool } from "./tools/get-leaderboard";
import { getRegionSummaryTool } from "./tools/get-region-summary";
import { getSubregionSummaryTool } from "./tools/get-subregion-summary";
import { lookupCountryTool } from "./tools/lookup-country";
import { lookupIndicatorTool } from "./tools/lookup-indicator";
import { searchCountriesTool } from "./tools/search-countries";
import { searchEvidenceTool } from "./tools/search-evidence";

const DEFAULT_MODEL = "gpt-5.1";
// Hard per-step output ceiling, as defense in depth behind the prompt's
// bounded-output rule. Legitimate answers are short prose plus sources (well
// under 2k tokens even with reasoning included), so 8k never truncates real
// use — but it caps what any one "keep going" turn can burn if the model is
// talked past the prompt rule. Reasoning tokens count toward this limit on
// the responses API, so do not lower it aggressively.
const MAX_OUTPUT_TOKENS = 8192;
// The vector store holding the published 2026 report and methodology.
// Override per-environment with OPENAI_VECTOR_STORE_ID. Keep this in sync with
// the live store: a stale id makes file_search fail silently, which reads as
// "the reports say nothing" rather than as a configuration error.
const DEFAULT_VECTOR_STORE_ID = "vs_6a4901cf126c81919229546dcb2d9b69";

/**
 * Builds the agent. The model is a parameter so the eval harness can benchmark
 * the same tools and instructions across models without touching the runtime
 * default, which stays driven by env.
 */
export function createGiraiAgent(options: { model?: string } = {}) {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStoreId =
    process.env.OPENAI_VECTOR_STORE_ID ?? DEFAULT_VECTOR_STORE_ID;
  const modelId =
    options.model ?? process.env.GIRAI_ASSISTANT_MODEL ?? DEFAULT_MODEL;

  return new ToolLoopAgent({
    model: openai.responses(modelId),
    instructions: buildGiraiInstructions(),
    tools: {
      file_search: openai.tools.fileSearch({
        vectorStoreIds: [vectorStoreId],
      }),
      // Post-publication context only (recent AI-governance developments).
      // The instructions bound it to 2 calls per turn and forbid using web
      // results for scores/ranks — the dataset tools stay authoritative.
      web_search: openai.tools.webSearch({
        searchContextSize: "medium",
      }),
      lookup_country: lookupCountryTool,
      search_countries: searchCountriesTool,
      get_leaderboard: getLeaderboardTool,
      lookup_indicator: lookupIndicatorTool,
      search_evidence: searchEvidenceTool,
      compare_countries: compareCountriesTool,
      get_averages: getAveragesTool,
      get_edition_comparison: getEditionComparisonTool,
      get_region_summary: getRegionSummaryTool,
      get_subregion_summary: getSubregionSummaryTool,
      get_evidence_statistics: getEvidenceStatisticsTool,
    },
    maxOutputTokens: MAX_OUTPUT_TOKENS,
    stopWhen: stepCountIs(12),
  });
}

export const giraiAgent = createGiraiAgent();
export type GiraiAgentUIMessage = InferAgentUIMessage<typeof giraiAgent>;
