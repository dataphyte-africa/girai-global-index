"use client";

import { useMemo, useState } from "react";
import { regionColor } from "@/lib/girai";
import type { RegionalIndicatorRow, RegionalPillarRow } from "@/lib/girai";
import { cn } from "@/lib/utils";

export interface DimensionRegionalPerformanceProps {
  regions: string[];
  indicatorRows: RegionalIndicatorRow[];
  pillarRows: RegionalPillarRow[];
}

const REGION_ORDER = [
  "Europe",
  "Northern America",
  "Asia and Oceania",
  "Middle East",
  "Africa",
  "South and Central America",
  "Caribbean",
];

type Mode = "indicator" | "pillar";

interface Row {
  key: string;
  label: string;
  byRegion: Record<string, number | null>;
}

export function DimensionRegionalPerformance({
  regions,
  indicatorRows,
  pillarRows,
}: DimensionRegionalPerformanceProps) {
  const [mode, setMode] = useState<Mode>("indicator");

  const orderedRegions = useMemo(() => {
    const known = REGION_ORDER.filter((r) => regions.includes(r));
    const rest = regions.filter((r) => !REGION_ORDER.includes(r)).sort();
    return [...known, ...rest];
  }, [regions]);

  const rows: Row[] = useMemo(() => {
    if (mode === "pillar") {
      return pillarRows.map((p) => ({
        key: p.slug,
        label: p.name,
        byRegion: p.byRegion,
      }));
    }
    return indicatorRows.map((i) => ({
      key: i.slug,
      label: i.name,
      byRegion: i.byRegion,
    }));
  }, [mode, indicatorRows, pillarRows]);

  return (
    <section className="w-full px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
            <span className="text-primary">Regional Performance</span>{" "}
            <span className="text-foreground">by {mode === "pillar" ? "Pillar" : "Indicator"}</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            How different regions approach this dimension of responsible AI,
            revealing both progress and persistent challenges.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex rounded-full border border-border bg-background p-1 text-sm shadow-sm">
            <button
              type="button"
              onClick={() => setMode("indicator")}
              className={cn(
                "rounded-full px-4 py-1.5 font-medium transition-colors",
                mode === "indicator"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              By indicator
            </button>
            <button
              type="button"
              onClick={() => setMode("pillar")}
              className={cn(
                "rounded-full px-4 py-1.5 font-medium transition-colors",
                mode === "pillar"
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              By pillar
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {orderedRegions.map((region) => (
              <div key={region} className="flex items-center gap-1.5">
                <span
                  className="size-3 rounded-full"
                  style={{ backgroundColor: regionColor(region) }}
                />
                <span className="text-xs text-muted-foreground">{region}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {rows.map((row) => (
            <div key={row.key}>
              <p className="mb-2.5 text-sm font-semibold text-foreground">
                {row.label}
              </p>
              <div className="flex flex-col gap-1.5">
                {orderedRegions.map((region) => {
                  const value = row.byRegion[region];
                  const pct = value === null ? 0 : Math.max(0, Math.min(100, value));
                  return (
                    <div key={region} className="flex items-center gap-3">
                      <div className="relative h-5 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: regionColor(region),
                          }}
                        />
                      </div>
                      <span className="w-10 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground">
                        {value === null ? "—" : value.toFixed(1)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
