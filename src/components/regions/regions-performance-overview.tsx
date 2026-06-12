"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { DIMENSIONS, PILLARS } from "@/data/2026/taxonomy";
import type { DimensionSlug, PillarSlug } from "@/data/2026/taxonomy";
import type { RegionSummary } from "@/lib/girai";
import { getRegionDisplayName, regionToSlug } from "@/lib/regions";
import { cn } from "@/lib/utils";

const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";
const LINK_COLOR = "#6366F1";
const RANK_BADGE_BG = "#EDE9FE";
const RANK_BADGE_TEXT = "#7C3AED";

/** Bar colours left-to-right, matching the Figma comp. */
const DIMENSION_BAR_COLORS: Record<DimensionSlug, string> = {
  "inclusion-diversity": "#8B5CF6",
  "ethics-sustainability": "#93C5FD",
  "labour-skills": "#FDBA74",
  "trust-safety": "#C4B5FD",
  "ai-use-public-service": "#FDA4AF",
};

const PILLAR_BAR_COLORS: Record<PillarSlug, string> = {
  "ai-policy": "#8B5CF6",
  "cso-engagement": "#93C5FD",
  "enabling-conditions": "#FDBA74",
};

const REGION_ORDER = [
  "Europe",
  "Northern America",
  "Asia and Oceania",
  "Middle East",
  "South and Central America",
  "Africa",
  "Caribbean",
];

type ChartMode = "dimensions" | "pillars";

const SORTED_DIMENSIONS = [...DIMENSIONS].sort((a, b) => a.order - b.order);

function orderRegions(summaries: RegionSummary[]): RegionSummary[] {
  const byRegion = new Map(summaries.map((row) => [row.region, row]));
  const ordered: RegionSummary[] = [];

  for (const region of REGION_ORDER) {
    const row = byRegion.get(region);
    if (row) ordered.push(row);
  }

  for (const row of summaries) {
    if (!REGION_ORDER.includes(row.region)) ordered.push(row);
  }

  return ordered;
}

export interface RegionsPerformanceOverviewProps {
  summaries: RegionSummary[];
}

export function RegionsPerformanceOverview({
  summaries,
}: RegionsPerformanceOverviewProps) {
  const [mode, setMode] = useState<ChartMode>("dimensions");
  const rows = useMemo(() => orderRegions(summaries), [summaries]);

  return (
    <section className="w-full bg-[#f8f9ff] px-4 py-16 dark:bg-muted/20 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2
            className="text-3xl font-bold tracking-tight md:text-4xl"
            style={{ color: HEADING_DARK }}
          >
            Regional Performance Overview
          </h2>
          <p
            className="mt-4 text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            Scores reflect aggregated performance across all GIRAI dimensions
            for each assessed region.
          </p>

          <div className="mt-8 inline-flex rounded-full border border-border/60 bg-[#ECEEF2] p-1 text-sm shadow-sm">
            <button
              type="button"
              onClick={() => setMode("dimensions")}
              className={cn(
                "rounded-full px-5 py-2 font-medium transition-all",
                mode === "dimensions"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Dimensions
            </button>
            <button
              type="button"
              onClick={() => setMode("pillars")}
              className={cn(
                "rounded-full px-5 py-2 font-medium transition-all",
                mode === "pillars"
                  ? "bg-white text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Pillars
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {rows.map((summary, cardIndex) => (
            <RegionOverviewCard
              key={summary.region}
              summary={summary}
              mode={mode}
              cardIndex={cardIndex}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function RegionOverviewCard({
  summary,
  mode,
  cardIndex,
}: {
  summary: RegionSummary;
  mode: ChartMode;
  cardIndex: number;
}) {
  const displayName = getRegionDisplayName(summary.region);
  const href = `/regions/${regionToSlug(summary.region)}`;

  const bars = useMemo(() => {
    if (mode === "pillars") {
      return PILLARS.map((pillar) => ({
        key: pillar.slug,
        value: summary.pillars[pillar.slug] ?? null,
        color: PILLAR_BAR_COLORS[pillar.slug],
      }));
    }
    return SORTED_DIMENSIONS.map((dimension) => ({
      key: dimension.slug,
      value: summary.dimensions[dimension.slug] ?? null,
      color: DIMENSION_BAR_COLORS[dimension.slug],
    }));
  }, [mode, summary]);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.4, delay: cardIndex * 0.04, ease: "easeOut" }}
      className="flex flex-col rounded-xl border border-border/40 bg-white p-5 shadow-[0_2px_12px_rgba(15,23,42,0.06)] dark:bg-card md:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <h3
          className="text-base font-bold leading-snug md:text-[1.05rem]"
          style={{ color: HEADING_DARK }}
        >
          {displayName}
        </h3>
        <span
          className="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
          style={{ backgroundColor: RANK_BADGE_BG, color: RANK_BADGE_TEXT }}
        >
          Rank #{summary.globalRank}
        </span>
      </div>

      <p className="mt-4 flex items-baseline gap-1">
        <span
          className="text-4xl font-bold tabular-nums tracking-tight"
          style={{ color: HEADING_DARK }}
        >
          {summary.averageGirai.toFixed(1)}
        </span>
        <span className="text-sm font-medium" style={{ color: SUBTITLE_COLOR }}>
          / 100 overall
        </span>
      </p>

      <div className="mt-5">
        <VerticalBarChart bars={bars} cardIndex={cardIndex} />
      </div>

      <Link
        href={href}
        className="mt-5 inline-flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-80"
        style={{ color: LINK_COLOR }}
      >
        View Region
        <ArrowRight className="size-4" strokeWidth={2.25} />
      </Link>
    </motion.article>
  );
}

function VerticalBarChart({
  bars,
  cardIndex,
}: {
  bars: Array<{ key: string; value: number | null; color: string }>;
  cardIndex: number;
}) {
  return (
    <div className="flex h-[72px] items-end gap-2 md:gap-2.5">
      {bars.map((bar, idx) => {
        const pct =
          bar.value === null ? 0 : Math.max(4, Math.min(100, bar.value));

        return (
          <div
            key={bar.key}
            className="relative flex h-full flex-1 flex-col justify-end"
          >
            <motion.div
              className="w-full rounded-t-[5px]"
              style={{ backgroundColor: bar.color }}
              initial={{ height: 0 }}
              whileInView={{ height: `${pct}%` }}
              viewport={{ once: true }}
              transition={{
                duration: 0.55,
                delay: cardIndex * 0.04 + idx * 0.05,
                ease: [0.25, 0.1, 0.25, 1],
              }}
            />
          </div>
        );
      })}
    </div>
  );
}
