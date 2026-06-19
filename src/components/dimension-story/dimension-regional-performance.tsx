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

/**
 * Pick black or white text for a given hex background so the in-bar region
 * label stays readable on every region colour (light lavender/orange as well
 * as the deep Europe purple). Uses WCAG relative luminance.
 */
function readableTextColor(hex: string): string {
  const m = hex.replace("#", "");
  const full =
    m.length === 3
      ? m
          .split("")
          .map((c) => c + c)
          .join("")
      : m;
  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;
  const toLinear = (c: number) =>
    c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  const luminance =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return luminance > 0.5 ? "#0b0b0f" : "#ffffff";
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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">
            <span className="text-primary">Regional Performance</span>{" "}
            <span className="text-foreground">by {mode === "pillar" ? "Pillar" : "Indicator"}</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            How different regions approach this dimension of responsible AI,
            revealing both progress and persistent challenges.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="inline-flex shrink-0 rounded-full bg-muted p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode("indicator")}
              className={cn(
                "rounded-full px-4 py-1.5 font-medium transition-colors",
                mode === "indicator"
                  ? "bg-background text-foreground shadow-sm"
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
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              By pillar
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-full bg-muted/60 px-4 py-2">
            {orderedRegions.map((region) => (
              <div key={region} className="flex items-center gap-1.5">
                <span
                  className="size-3 shrink-0 rounded-[3px]"
                  style={{ backgroundColor: regionColor(region) }}
                />
                <span className="text-xs font-medium text-foreground">
                  {region}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {rows.map((row) => (
            <div key={row.key}>
              <p className="mb-3 text-sm font-medium text-foreground">
                {row.label}
              </p>
              <div className="flex flex-col gap-1.5">
                {orderedRegions.map((region) => {
                  const value = row.byRegion[region];
                  const pct =
                    value === null ? 0 : Math.max(0, Math.min(100, value));
                  const fill = regionColor(region);
                  return (
                    <div
                      key={region}
                      className="relative h-5 w-full overflow-hidden rounded-full bg-muted/50"
                    >
                      <span
                        className="absolute inset-y-0 left-0 rounded-full transition-all"
                        style={{ width: `${pct}%`, backgroundColor: fill }}
                      />
                      <span
                        className="absolute left-3 top-1/2 max-w-[60%] -translate-y-1/2 truncate text-[11px] font-semibold"
                        style={{ color: readableTextColor(fill) }}
                        title={region}
                      >
                        {region}
                      </span>
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold tabular-nums text-foreground">
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
