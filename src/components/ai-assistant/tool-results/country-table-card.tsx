"use client";

import { useState } from "react";
import Link from "next/link";
import { InsightCard } from "../viz/insight-card";
import { AiDataTable } from "../viz/data-table";
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

type CountryRow = {
  iso3: string;
  name: string;
  region?: string;
  incomeGroup?: string;
  girai?: number | null;
  rankGlobal?: number | null;
};

export function CountryTableCard({
  data,
  sources,
}: {
  data: { countries?: CountryRow[]; count?: number; totalMatched?: number };
  sources: GiraiSource[];
}) {
  const countries = data.countries ?? [];
  const [view, setView] = useState<ChartView>("bar");

  const chartData: ChartDatum[] = countries
    .filter((c) => c.girai != null)
    .map((c) => ({
      label: c.name,
      value: c.girai!,
      href: `/countries/${c.iso3}`,
    }));

  if (countries.length === 0) return null;

  const available: ChartView[] =
    chartData.length >= 3 ? ["bar", "line", "pie"] : ["bar", "line"];

  return (
    <InsightCard
      title="Country results"
      subtitle={
        data.totalMatched !== undefined
          ? `${data.count ?? countries.length} of ${data.totalMatched} countries matched`
          : `${countries.length} countries`
      }
      badge="Dataset"
      footer={<SourcesFooter sources={sources} />}
    >
      {chartData.length > 1 && (
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
          {view === "line" && <AiLineChart data={chartData} />}
          {view === "pie" && <AiPieChart data={chartData} />}
        </ChartPanel>
      )}

      <div className={chartData.length > 1 ? "mt-4" : undefined}>
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
              key: "region",
              header: "Region",
              render: (c) => (
                <span className="text-muted-foreground">{c.region ?? "—"}</span>
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
          ]}
        />
      </div>
    </InsightCard>
  );
}
