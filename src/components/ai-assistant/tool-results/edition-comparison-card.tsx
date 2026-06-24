"use client";

import Link from "next/link";
import { InsightCard } from "../viz/insight-card";
import { AiDataTable } from "../viz/data-table";
import { SourcesFooter } from "./sources-footer";
import type { GiraiSource } from "@/lib/ai/types";

type ChangeRow = {
  pathway: string;
  indicatorSlug: string;
  indicatorName: string;
  status2024: string;
  status2026: string;
};

export function EditionComparisonCard({
  data,
  sources,
}: {
  data: {
    name?: string;
    iso3?: string;
    changedIndicatorCount?: number;
    changes?: ChangeRow[];
    note?: string;
  };
  sources: GiraiSource[];
}) {
  const changes = data.changes ?? [];
  if (!data.name) return null;

  return (
    <InsightCard
      title={`Edition changes — ${data.name}`}
      subtitle={data.note}
      badge="2024 → 2026"
      footer={<SourcesFooter sources={sources} />}
    >
      {data.iso3 && (
        <Link
          href={`/countries/${data.iso3}`}
          className="mb-4 inline-flex items-center gap-1 text-primary text-xs hover:underline"
        >
          View full country profile →
        </Link>
      )}

      {changes.length > 0 ? (
        <AiDataTable
          rows={changes}
          getRowKey={(r) => `${r.pathway}-${r.indicatorSlug}`}
          columns={[
            {
              key: "indicator",
              header: "Indicator",
              render: (r) => (
                <Link
                  href={`/indicators/${r.indicatorSlug}`}
                  className="font-medium hover:underline"
                >
                  {r.indicatorName}
                </Link>
              ),
            },
            {
              key: "pathway",
              header: "Pathway",
              render: (r) => (
                <span className="text-muted-foreground capitalize text-xs">
                  {r.pathway}
                </span>
              ),
            },
            {
              key: "2024",
              header: "2024",
              render: (r) => r.status2024,
            },
            {
              key: "2026",
              header: "2026",
              render: (r) => (
                <span className="font-medium">{r.status2026}</span>
              ),
            },
          ]}
        />
      ) : (
        <p className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-6 text-center text-muted-foreground text-sm">
          No evidence-status changes detected (
          {data.changedIndicatorCount ?? 0} changes).
        </p>
      )}
    </InsightCard>
  );
}
