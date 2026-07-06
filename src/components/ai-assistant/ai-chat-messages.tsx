"use client";

import type { ReactNode } from "react";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Sources,
  SourcesContent,
  SourcesTrigger,
} from "@/components/ai-elements/sources";
import type { GiraiAgentUIMessage } from "@/lib/ai/agent";
import type { ChatStatus } from "ai";
import Link from "next/link";
import { ComparisonCard } from "./tool-results/comparison-card";
import { CountryTableCard } from "./tool-results/country-table-card";
import { EditionComparisonCard } from "./tool-results/edition-comparison-card";
import { EvidenceListCard } from "./tool-results/evidence-list-card";
import { RegionSummaryCard } from "./tool-results/region-summary-card";
import { LeaderboardChartCard } from "./tool-results/leaderboard-chart-card";
import { extractSourcesFromOutput } from "./tool-results/sources-footer";
import { AiLoadingState } from "./ai-loading-state";

function renderToolOutput(
  toolName: string,
  output: unknown
): ReactNode {
  const sources = extractSourcesFromOutput(output);
  const payload =
    output && typeof output === "object" && "data" in output
      ? (output as { data: unknown }).data
      : output;

  switch (toolName) {
    case "search_countries":
      return (
        <CountryTableCard
          data={payload as Parameters<typeof CountryTableCard>[0]["data"]}
          sources={sources}
        />
      );
    case "get_leaderboard":
      return (
        <LeaderboardChartCard
          data={payload as Parameters<typeof LeaderboardChartCard>[0]["data"]}
          sources={sources}
        />
      );
    case "compare_countries":
      return (
        <ComparisonCard
          data={payload as Parameters<typeof ComparisonCard>[0]["data"]}
          sources={sources}
        />
      );
    case "search_evidence":
      return (
        <EvidenceListCard
          data={payload as Parameters<typeof EvidenceListCard>[0]["data"]}
          sources={sources}
        />
      );
    case "get_edition_comparison":
      return (
        <EditionComparisonCard
          data={payload as Parameters<typeof EditionComparisonCard>[0]["data"]}
          sources={sources}
        />
      );
    case "get_region_summary":
      return (
        <RegionSummaryCard
          data={payload as Parameters<typeof RegionSummaryCard>[0]["data"]}
          sources={sources}
        />
      );
    default:
      return null;
  }
}

function MessageParts({
  message,
  isLastMessage,
  status,
}: {
  message: GiraiAgentUIMessage;
  isLastMessage: boolean;
  status: ChatStatus;
}) {
  const isStreaming = status === "streaming" || status === "submitted";
  const reasoningParts = message.parts.filter((p) => p.type === "reasoning");
  const reasoningText = reasoningParts
    .map((p) => (p.type === "reasoning" ? p.text : ""))
    .join("\n\n");
  const hasReasoning = reasoningParts.length > 0;
  const lastPart = message.parts.at(-1);
  const isReasoningStreaming =
    isLastMessage && isStreaming && lastPart?.type === "reasoning";

  const sourceUrlParts = message.parts.filter((p) => p.type === "source-url");

  return (
    <>
      {message.role === "assistant" && sourceUrlParts.length > 0 && (
        <Sources>
          <SourcesTrigger count={sourceUrlParts.length} />
          <SourcesContent>
            {sourceUrlParts.map((part, i) =>
              part.type === "source-url" ? (
                <Link
                  key={`${message.id}-src-${i}`}
                  className="flex items-center gap-2 font-medium hover:underline"
                  href={part.url}
                >
                  {part.title ?? part.url}
                </Link>
              ) : null
            )}
          </SourcesContent>
        </Sources>
      )}

      {hasReasoning && (
        <Reasoning className="w-full" isStreaming={isReasoningStreaming}>
          <ReasoningTrigger />
          <ReasoningContent>{reasoningText}</ReasoningContent>
        </Reasoning>
      )}

      {message.parts.map((part, i) => {
        if (part.type === "text") {
          return (
            <MessageResponse key={`${message.id}-text-${i}`}>
              {part.text}
            </MessageResponse>
          );
        }

        if (part.type.startsWith("tool-")) {
          const toolName = part.type.replace(/^tool-/, "");
          const toolPart = part as {
            type: string;
            state: string;
            input?: unknown;
            output?: unknown;
            errorText?: string;
          };

          const customCard =
            toolPart.state === "output-available"
              ? renderToolOutput(toolName, toolPart.output)
              : null;

          if (customCard) {
            return <div key={`${message.id}-tool-${i}`}>{customCard}</div>;
          }

          // Tools without a dedicated result card (e.g. file_search,
          // lookup_country, lookup_indicator) are not surfaced in the UI —
          // the assistant folds their results into its text response. We
          // deliberately avoid rendering raw JSON tool output here.
          return null;
        }

        return null;
      })}

      {isLastMessage && isStreaming && message.role === "assistant" && (
        <AiLoadingState />
      )}
    </>
  );
}

export function AiChatMessages({
  messages,
  status,
}: {
  messages: GiraiAgentUIMessage[];
  status: ChatStatus;
}) {
  return (
    <>
      {messages.map((message, index) => (
        <Message from={message.role} key={message.id}>
          <MessageContent>
            <MessageParts
              message={message}
              isLastMessage={index === messages.length - 1}
              status={status}
            />
          </MessageContent>
        </Message>
      ))}
    </>
  );
}
