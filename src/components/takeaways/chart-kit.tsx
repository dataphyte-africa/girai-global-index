"use client";

import { useEffect, useRef, useState } from "react";
import type { ChartColorKey } from "./types";

/**
 * Shared chart palette. Fixed mid-tone colors that read well in both light
 * and dark themes (the report itself uses fixed colors). Semantics are kept
 * consistent across the takeaway charts: above average = green, below = amber.
 */
export const CHART_COLOR: Record<ChartColorKey, string> = {
  above: "#3f9d74", // green — above average / positive
  below: "#d9743f", // amber — below average
  neutral: "#94a3b8",
  series2024: "#aecbeb", // light blue — prior edition
  series2026: "#2f5c9e", // dark blue — current edition
  frameworks: "#3f3f46", // dark slate — frameworks adopted
  initiatives: "#3f9d74", // green — government-led initiatives
  primary: "#6366f1", // indigo — primary series
  highlightTop: "#4f46e5", // indigo — best performer
  highlightBottom: "#c2410c", // burnt orange — worst performer
  highlight: "#d9743f", // amber — generic highlight
};

export function chartColor(key: ChartColorKey): string {
  return CHART_COLOR[key];
}

/** Diverging color for a percentage-point deviation: amber(+) → grey(0) → blue(−). */
export function deviationColor(pp: number): string {
  if (pp >= 5) return "#d9743f";
  if (pp >= 1) return "#edb48f";
  if (pp <= -5) return "#5b8fd6";
  if (pp <= -1) return "#a9c2e6";
  return "#d4d8df";
}

/** Observe a container's width for responsive SVG charts. */
export function useContainerWidth(min = 280, fallback = 480) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(fallback);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const w = entry?.contentRect.width ?? fallback;
      setWidth(Math.max(min, w));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [min, fallback]);

  return { ref, width };
}

export function pct(value: number, digits = 0): string {
  return `${value.toFixed(digits)}%`;
}

export function signedPp(value: number): string {
  const rounded = Math.round(value * 10) / 10;
  return `${rounded > 0 ? "+" : ""}${rounded}pp`;
}

/** Shared chart heading + caption frame. */
export function ChartFrame({
  title,
  caption,
  children,
}: {
  title?: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="my-5 rounded-xl border border-border/60 bg-background/40 p-4">
      {title ? (
        <figcaption className="mb-3 text-xs font-semibold uppercase tracking-wide text-foreground/80">
          {title}
        </figcaption>
      ) : null}
      {children}
      {caption ? (
        <p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">
          {caption}
        </p>
      ) : null}
    </figure>
  );
}

/** A small legend row used by several charts. */
export function Legend({
  items,
}: {
  items: { color: string; label: string; dashed?: boolean }[];
}) {
  return (
    <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
      {items.map((it) => (
        <span key={it.label} className="inline-flex items-center gap-1.5">
          {it.dashed ? (
            <span
              className="inline-block h-0 w-4 border-t-2 border-dashed"
              style={{ borderColor: it.color }}
            />
          ) : (
            <span
              className="inline-block h-2.5 w-2.5 rounded-sm"
              style={{ backgroundColor: it.color }}
            />
          )}
          {it.label}
        </span>
      ))}
    </div>
  );
}
