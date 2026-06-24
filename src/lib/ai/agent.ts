import { createOpenAI } from "@ai-sdk/openai";
import { InferAgentUIMessage, stepCountIs, ToolLoopAgent } from "ai";
import { buildGiraiInstructions } from "./instructions";
import { compareCountriesTool } from "./tools/compare-countries";
import { getEditionComparisonTool } from "./tools/get-edition-comparison";
import { getLeaderboardTool } from "./tools/get-leaderboard";
import { getRegionSummaryTool } from "./tools/get-region-summary";
import { lookupCountryTool } from "./tools/lookup-country";
import { lookupIndicatorTool } from "./tools/lookup-indicator";
import { searchCountriesTool } from "./tools/search-countries";
import { searchEvidenceTool } from "./tools/search-evidence";

const DEFAULT_MODEL = "gpt-4.1";
const DEFAULT_VECTOR_STORE_ID = "vs_6a3a6e41c3548191b72539d24aa60b0b";

function createGiraiAgent() {
  const openai = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const vectorStoreId =
    process.env.OPENAI_VECTOR_STORE_ID ?? DEFAULT_VECTOR_STORE_ID;
  const modelId = process.env.GIRAI_ASSISTANT_MODEL ?? DEFAULT_MODEL;

  return new ToolLoopAgent({
    model: openai.responses(modelId),
    instructions: buildGiraiInstructions(),
    tools: {
      file_search: openai.tools.fileSearch({
        vectorStoreIds: [vectorStoreId],
      }),
      lookup_country: lookupCountryTool,
      search_countries: searchCountriesTool,
      get_leaderboard: getLeaderboardTool,
      lookup_indicator: lookupIndicatorTool,
      search_evidence: searchEvidenceTool,
      compare_countries: compareCountriesTool,
      get_edition_comparison: getEditionComparisonTool,
      get_region_summary: getRegionSummaryTool,
    },
    stopWhen: stepCountIs(12),
  });
}

export const giraiAgent = createGiraiAgent();
export type GiraiAgentUIMessage = InferAgentUIMessage<typeof giraiAgent>;
