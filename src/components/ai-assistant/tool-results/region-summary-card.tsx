"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { InsightCard } from "../viz/insight-card";
import { AiBarChart } from "../viz/bar-chart";
import { AiLineChart } from "../viz/line-chart";
import { AiPieChart } from "../viz/pie-chart";
import { AiDataTable } from "../viz/data-table";
import {
  ChartPanel,
  ChartViewTabs,
  type ChartView,
} from "../viz/chart-view-tabs";
import type { ChartDatum } from "../viz/chart-theme";
import { regionToSlug } from "@/lib/regions";
import { SourcesFooter } from "./sources-footer";
import type { GiraiSource } from "@/lib/ai/types";

type RegionRow = {
  region: string;
  averageGirai: number;
  countryCount: number;
  globalRank: number;
};

export function RegionSummaryCard({
  data,
  sources,
}: {
  data: {
    found?: boolean;
    region?: string;
    averageGirai?: number;
    countryCount?: number;
    globalRank?: number;
    regions?: RegionRow[];
  };
  sources: GiraiSource[];
}) {
  const [view, setView] = useState<ChartView>("bar");
  const isMulti = Array.isArray(data.regions) && data.regions.length > 0;

  const chartData: ChartDatum[] = useMemo(() => {
    if (isMulti) {
      return (data.regions ?? []).map((r) => ({
        label: r.region,
        value: r.averageGirai,
        href: `/regions/${regionToSlug(r.region)}`,
      }));
    }
    if (data.region && data.averageGirai != null) {
      return [{ label: data.region, value: data.averageGirai }];
    }
    return [];
  }, [data, isMulti]);

  if (!data.found && !isMulti) return null;

  if (!isMulti && data.region) {
    return (
      <InsightCard
        title={data.region}
        subtitle="Regional performance summary"
        badge={`Rank #${data.globalRank ?? "—"}`}
        footer={<SourcesFooter sources={sources} />}
      >
        <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <dt className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Avg GIRAI
            </dt>
            <dd className="mt-1 font-semibold text-2xl tabular-nums">
              {data.averageGirai?.toFixed(1) ?? "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <dt className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Countries
            </dt>
            <dd className="mt-1 font-semibold text-2xl tabular-nums">
              {data.countryCount ?? "—"}
            </dd>
          </div>
          <div className="rounded-xl border border-border/60 bg-muted/20 p-3">
            <dt className="text-[10px] text-muted-foreground uppercase tracking-wider">
              Global rank
            </dt>
            <dd className="mt-1 font-semibold text-2xl tabular-nums">
              {data.globalRank ?? "—"}
            </dd>
          </div>
        </dl>
      </InsightCard>
    );
  }

  const rows = data.regions ?? [];

  return (
    <InsightCard
      title="Regional overview"
      subtitle="Average GIRAI scores across all GIRAI regions"
      badge="Regions"
      footer={<SourcesFooter sources={sources} />}
    >
      <ChartPanel
        tabs={
          <ChartViewTabs
            available={["bar", "line", "pie"]}
            value={view}
            onChange={setView}
          />
        }
      >
        {view === "bar" && <AiBarChart data={chartData} />}
        {view === "line" && <AiLineChart data={chartData} yDomain={[0, 100]} />}
        {view === "pie" && <AiPieChart data={chartData} />}
      </ChartPanel>

      <div className="mt-4">
        <AiDataTable
          rows={rows}
          getRowKey={(r) => r.region}
          columns={[
            {
              key: "region",
              header: "Region",
              render: (r) => (
                <Link
                  href={`/regions/${regionToSlug(r.region)}`}
                  className="font-medium text-primary hover:underline"
                >
                  {r.region}
                </Link>
              ),
            },
            {
              key: "avg",
              header: "Avg GIRAI",
              align: "right",
              render: (r) => r.averageGirai.toFixed(1),
            },
            {
              key: "count",
              header: "Countries",
              align: "right",
              render: (r) => r.countryCount,
            },
            {
              key: "rank",
              header: "Rank",
              align: "right",
              render: (r) => r.globalRank,
            },
          ]}
        />
      </div>
    </InsightCard>
  );
}
