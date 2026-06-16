"use client";

import * as React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  CountryEditionEvidenceStatusEntry,
  EditionDisplayStatus,
  EditionPathwayId,
} from "@/lib/girai";
import {
  EDITION_PATHWAYS,
} from "@/lib/girai/edition-status";
import { UNMAPPED_2026_AI_POLICY_INDICATORS } from "@/data/edition-indicator-mapping";

const PATHWAY_TABS: EditionPathwayId[] = ["frameworks", "initiatives", "cso"];

const UNMAPPED_2026_SLUGS = new Set(
  UNMAPPED_2026_AI_POLICY_INDICATORS.map((i) => i.slug)
);

type EmptyReason = "unmapped-indicator" | "no-country-coverage" | null;

interface Props {
  countryName: string;
  editionStatus: CountryEditionEvidenceStatusEntry;
  indicatorCount: number;
  indicators: Array<{ slug: string; name: string }>;
}

function formatStatus(value: EditionDisplayStatus | null): string {
  if (value === null) return "—";
  return value;
}

function emptyReasonLabel(reason: EmptyReason): string | undefined {
  if (reason === "unmapped-indicator") {
    return "This indicator was not assessed in the 2024 edition";
  }
  if (reason === "no-country-coverage") {
    return "This country was not included in the 2024 GIRAI edition";
  }
  return undefined;
}

function StatusCell({
  value,
  emptyReason,
}: {
  value: EditionDisplayStatus | null;
  emptyReason?: EmptyReason;
}) {
  const display = formatStatus(value);
  return (
    <span
      className={cn(
        "text-sm md:text-[0.9375rem]",
        display === "—" ? "text-muted-foreground/50" : "text-foreground"
      )}
      title={display === "—" ? emptyReasonLabel(emptyReason ?? null) : undefined}
    >
      {display}
    </span>
  );
}

export function CountryEditionComparisonSection({
  countryName,
  editionStatus,
  indicatorCount,
  indicators,
}: Props) {
  const [pathway, setPathway] = React.useState<EditionPathwayId>("frameworks");
  const has2024Coverage = editionStatus.has2024Coverage;

  const rows = indicators.map((indicator) => {
    const status2024 = editionStatus["2024"][pathway][indicator.slug] ?? null;
    const status2026 = editionStatus["2026"][pathway][indicator.slug] ?? null;
    const unmapped2024 = UNMAPPED_2026_SLUGS.has(indicator.slug);

    const resolved2024 = !has2024Coverage || unmapped2024 ? null : status2024;
    const emptyReason: EmptyReason = !has2024Coverage
      ? "no-country-coverage"
      : unmapped2024
        ? "unmapped-indicator"
        : null;

    return {
      ...indicator,
      status2024: resolved2024,
      status2026,
      emptyReason,
    };
  });

  return (
    <section className="w-full bg-background px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            Comparing Results{" "}
            <span className="text-primary">Across Editions</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base md:leading-[1.65]">
            Explore how country performance, scores, and governance indicators
            have changed between GIRAI editions.
          </p>
        </header>

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border px-5 py-4 md:flex-row md:items-center md:justify-between md:px-6 md:py-5">
            <p className="text-sm font-medium text-muted-foreground">
              {indicatorCount} indicators
            </p>

            <div
              className="inline-flex self-start rounded-full bg-muted p-1 md:self-auto"
              role="tablist"
              aria-label="Evidence pathway"
            >
              {PATHWAY_TABS.map((id) => {
                const active = pathway === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setPathway(id)}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-xs font-medium transition-colors md:px-4 md:text-sm",
                      active
                        ? "border border-border bg-background text-foreground shadow-sm"
                        : "border border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {EDITION_PATHWAYS[id].label}
                  </button>
                );
              })}
            </div>
          </div>

          {!has2024Coverage ? (
            <div className="flex items-start gap-3 border-b border-border bg-muted/40 px-5 py-4 md:px-6">
              <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
              <p className="text-sm leading-relaxed text-muted-foreground">
                <span className="font-medium text-foreground">{countryName}</span>{" "}
                was not included in the 2024 GIRAI edition. The 2024 column is
                unavailable for this country; only 2026 evidence is shown below.
              </p>
            </div>
          ) : null}

          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-left">
              <thead>
                <tr className="bg-muted/60">
                  <th className="px-5 py-3.5 text-sm font-medium text-foreground md:px-6 md:py-4 md:text-[0.9375rem]">
                    Indicator
                  </th>
                  <th className="px-4 py-3.5 text-right text-sm font-medium text-foreground md:px-6 md:py-4 md:text-[0.9375rem]">
                    2024 Edition
                  </th>
                  <th className="px-5 py-3.5 text-right text-sm font-medium text-foreground md:px-6 md:py-4 md:text-[0.9375rem]">
                    2026 Edition
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-card">
                {rows.map((row) => (
                  <tr
                    key={row.slug}
                    className="group cursor-default border-t border-border bg-white dark:bg-card"
                  >
                    <td
                      className="bg-white px-5 py-4 transition-colors group-hover:border-y group-hover:border-l group-hover:border-dashed group-hover:border-primary/60 group-hover:bg-primary/5 md:px-6 md:py-4.5 dark:bg-card dark:group-hover:bg-primary/10"
                    >
                      <span className="text-sm font-normal text-foreground md:text-[0.9375rem]">
                        {row.name}
                      </span>
                    </td>
                    <td
                      className="bg-white px-4 py-4 text-right transition-colors group-hover:border-y group-hover:border-dashed group-hover:border-primary/60 group-hover:bg-primary/5 md:px-6 md:py-4.5 dark:bg-card dark:group-hover:bg-primary/10"
                    >
                      <StatusCell
                        value={row.status2024}
                        emptyReason={row.emptyReason}
                      />
                    </td>
                    <td
                      className="bg-white px-5 py-4 text-right transition-colors group-hover:border-y group-hover:border-r group-hover:border-dashed group-hover:border-primary/60 group-hover:bg-primary/5 md:px-6 md:py-4.5 dark:bg-card dark:group-hover:bg-primary/10"
                    >
                      <StatusCell value={row.status2026} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-3xl text-center text-xs leading-relaxed text-muted-foreground md:text-[0.8125rem] md:leading-[1.6]">
          Indicator definitions changed between editions; this table compares
          evidence presence and status, not directly comparable scores.
          {has2024Coverage ? (
            <>
              {" "}
              Five 2026 indicators have no 2024 equivalent and show{" "}
              <span className="text-muted-foreground/50">—</span> in the 2024
              column.
            </>
          ) : null}
        </p>
      </div>
    </section>
  );
}
