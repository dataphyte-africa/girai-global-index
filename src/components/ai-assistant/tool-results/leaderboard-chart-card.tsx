"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { InsightCard } from "../viz/insight-card";
import { AiBarChart } from "../viz/bar-chart";
import { AiLineChart } from "../viz/line-chart";
import { AiPieChart } from "../viz/pie-chart";
import {
  ChartPanel,
  ChartViewTabs,
  type ChartView,
} from "../viz/chart-view-tabs";
import type { ChartDatum } from "../viz/chart-theme";
import { SourcesFooter } from "./sources-footer";
import type { GiraiSource } from "@/lib/ai/types";

type Entry = {
  iso3: string;
  name: string;
  score: number;
  rank: number;
};

export function LeaderboardChartCard({
  data,
  sources,
}: {
  data: {
    metric?: string;
    metricSlug?: string;
    order?: string;
    entries?: Entry[];
  };
  sources: GiraiSource[];
}) {
  const entries = useMemo(() => data.entries ?? [], [data.entries]);
  const [view, setView] = useState<ChartView>("bar");

  const chartData: ChartDatum[] = useMemo(
    () =>
      entries.map((e) => ({
        label: e.name,
        value: e.score,
        href: `/countries/${e.iso3}`,
        meta: `#${e.rank}`,
      })),
    [entries]
  );

  if (entries.length === 0) return null;

  const title =
    data.metric === "girai"
      ? `${data.order === "bottom" ? "Lowest" : "Top"} GIRAI performers`
      : `${data.order === "bottom" ? "Lowest" : "Top"} — ${data.metricSlug ?? data.metric}`;

  const available: ChartView[] =
    entries.length <= 8 ? ["bar", "line", "pie"] : ["bar", "line"];

  return (
    <InsightCard
      title={title}
      subtitle={`${entries.length} countries ranked by score`}
      badge="Leaderboard"
      footer={<SourcesFooter sources={sources} />}
    >
      <ChartPanel
        tabs={
          <ChartViewTabs
            available={available}
            value={view}
            onChange={setView}
          />
        }
      >
        {view === "bar" && <AiBarChart data={chartData} />}
        {view === "line" && (
          <AiLineChart data={chartData} yDomain={[0, 100]} />
        )}
        {view === "pie" && <AiPieChart data={chartData} />}
      </ChartPanel>

      <ol className="mt-4 grid gap-1.5 sm:grid-cols-2">
        {entries.slice(0, 6).map((e, i) => (
          <li
            key={e.iso3}
            className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/20 px-2.5 py-1.5 text-xs"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-primary/10 font-semibold text-[10px] text-primary tabular-nums">
              {i + 1}
            </span>
            <Link
              href={`/countries/${e.iso3}`}
              className="min-w-0 flex-1 truncate font-medium hover:underline"
            >
              {e.name}
            </Link>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              {e.score.toFixed(1)}
            </span>
          </li>
        ))}
      </ol>
    </InsightCard>
  );
}
