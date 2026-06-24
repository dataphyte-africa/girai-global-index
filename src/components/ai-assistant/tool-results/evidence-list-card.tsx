"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { InsightCard } from "../viz/insight-card";
import { SourcesFooter } from "./sources-footer";
import type { GiraiSource } from "@/lib/ai/types";

type EvidenceRow = {
  id: string;
  kind: string;
  title: string;
  country: string;
  countryIso3: string;
  indicatorSlug: string;
};

const KIND_COLORS: Record<string, string> = {
  framework: "bg-violet-500/15 text-violet-700 dark:text-violet-300",
  initiative: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  "cso-initiative": "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  "government-misuse": "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

export function EvidenceListCard({
  data,
  sources,
}: {
  data: {
    items?: EvidenceRow[];
    count?: number;
    totalMatched?: number;
  };
  sources: GiraiSource[];
}) {
  const items = data.items ?? [];
  if (items.length === 0) return null;

  return (
    <InsightCard
      title="Evidence items"
      subtitle={
        data.totalMatched !== undefined
          ? `${data.count ?? items.length} of ${data.totalMatched} matches`
          : `${items.length} items`
      }
      badge="Evidence"
      footer={<SourcesFooter sources={sources} />}
    >
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="group flex gap-3 rounded-xl border border-border/60 bg-background/50 p-3 transition-colors hover:border-primary/20 hover:bg-primary/3"
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted/50">
              <FileText className="size-3.5 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/evidence/${encodeURIComponent(item.id)}`}
                className="font-medium text-sm leading-snug hover:text-primary hover:underline"
              >
                {item.title}
              </Link>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <Link
                  href={`/countries/${item.countryIso3}`}
                  className="text-muted-foreground text-xs hover:underline"
                >
                  {item.country}
                </Link>
                <span
                  className={`rounded-md px-1.5 py-0.5 font-medium text-[10px] capitalize ${KIND_COLORS[item.kind] ?? "bg-muted text-muted-foreground"}`}
                >
                  {item.kind.replace(/-/g, " ")}
                </span>
                <Link
                  href={`/indicators/${item.indicatorSlug}`}
                  className="text-primary/80 text-xs hover:underline"
                >
                  {item.indicatorSlug}
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </InsightCard>
  );
}
