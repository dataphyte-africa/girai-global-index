"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { InsightCard } from "../viz/insight-card";
import { AiDataTable } from "../viz/data-table";
import { AiBarChart } from "../viz/bar-chart";
import { AiLineChart } from "../viz/line-chart";
import {
  ChartPanel,
  ChartViewTabs,
  type ChartView,
} from "../viz/chart-view-tabs";
import type { ChartDatum } from "../viz/chart-theme";
import { SourcesFooter } from "./sources-footer";
import type { GiraiSource } from "@/lib/ai/types";

type CompareRow = {
  iso3: string;
  name: string;
  region?: string;
  girai?: number | null;
  rankGlobal?: number | null;
  focusDimensionScore?: number | null;
  focusPillarScore?: number | null;
  focusIndicatorScore?: number | null;
};

export function ComparisonCard({
  data,
  sources,
}: {
  data: {
    countries?: CompareRow[];
    focus?: {
      dimension?: { slug: string; name: string };
      pillar?: { slug: string; name?: string };
      indicator?: { slug: string; name: string };
    };
  };
  sources: GiraiSource[];
}) {
  const countries = useMemo(() => data.countries ?? [], [data.countries]);
  const [view, setView] = useState<ChartView>("bar");

  const focusLabel =
    data.focus?.indicator?.name ??
    data.focus?.dimension?.name ??
    data.focus?.pillar?.name;

  const giraiData: ChartDatum[] = useMemo(
    () =>
      countries
        .filter((c) => c.girai != null)
        .map((c) => ({
          label: c.name,
          value: c.girai!,
          href: `/countries/${c.iso3}`,
        })),
    [countries]
  );

  const focusData: ChartDatum[] = useMemo(() => {
    const out: ChartDatum[] = [];
    for (const c of countries) {
      const score =
        c.focusIndicatorScore ??
        c.focusDimensionScore ??
        c.focusPillarScore;
      if (score == null) continue;
      out.push({
        label: c.name,
        value: score,
        href: `/countries/${c.iso3}`,
      });
    }
    return out;
  }, [countries]);

  if (countries.length === 0) return null;

  const chartData = focusData.length > 0 ? focusData : giraiData;
  const chartTitle = focusData.length > 0 ? focusLabel : "GIRAI score";

  return (
    <InsightCard
      title="Country comparison"
      subtitle={focusLabel ? `Focused on ${focusLabel}` : "Overall GIRAI scores"}
      badge="Compare"
      footer={<SourcesFooter sources={sources} />}
    >
      {chartData.length >= 2 && (
        <ChartPanel
          tabs={
            <ChartViewTabs
              available={["bar", "line"]}
              value={view}
              onChange={setView}
            />
          }
        >
          {view === "bar" && <AiBarChart data={chartData} />}
          {view === "line" && (
            <AiLineChart data={chartData} yDomain={[0, 100]} />
          )}
        </ChartPanel>
      )}

      <div className={chartData.length >= 2 ? "mt-4" : undefined}>
        <p className="mb-2 font-medium text-[11px] text-muted-foreground uppercase tracking-wider">
          {chartTitle} breakdown
        </p>
        <AiDataTable
          rows={countries}
          getRowKey={(c) => c.iso3}
          columns={[
            {
              key: "name",
              header: "Country",
              render: (c) => (
                <Link
                  href={`/countries/${c.iso3}`}
                  className="font-medium text-primary hover:underline"
                >
                  {c.name}
                </Link>
              ),
            },
            {
              key: "girai",
              header: "GIRAI",
              align: "right",
              render: (c) => c.girai?.toFixed(1) ?? "—",
            },
            {
              key: "rank",
              header: "Rank",
              align: "right",
              render: (c) => c.rankGlobal ?? "—",
            },
            ...(focusLabel
              ? [
                  {
                    key: "focus",
                    header: focusLabel,
                    align: "right" as const,
                    render: (c: CompareRow) => {
                      const score =
                        c.focusIndicatorScore ??
                        c.focusDimensionScore ??
                        c.focusPillarScore;
                      return score?.toFixed(1) ?? "—";
                    },
                  },
                ]
              : []),
          ]}
        />
      </div>
    </InsightCard>
  );
}
