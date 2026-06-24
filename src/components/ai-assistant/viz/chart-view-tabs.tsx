"use client";

import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export type ChartView = "bar" | "line" | "pie";

const LABELS: Record<ChartView, string> = {
  bar: "Bars",
  line: "Trend",
  pie: "Share",
};

export function ChartViewTabs({
  value,
  onChange,
  available = ["bar", "line", "pie"],
  className,
}: {
  value: ChartView;
  onChange: (view: ChartView) => void;
  available?: ChartView[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "inline-flex rounded-full border border-border/80 bg-muted/40 p-0.5",
        className
      )}
      role="tablist"
      aria-label="Chart type"
    >
      {available.map((view) => (
        <button
          key={view}
          type="button"
          role="tab"
          aria-selected={value === view}
          onClick={() => onChange(view)}
          className={cn(
            "rounded-full px-3 py-1 font-medium text-[11px] transition-all",
            value === view
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {LABELS[view]}
        </button>
      ))}
    </div>
  );
}

export function ChartPanel({
  children,
  tabs,
}: {
  children: ReactNode;
  tabs?: ReactNode;
}) {
  return (
    <div className="space-y-3">
      {tabs && <div className="flex justify-end">{tabs}</div>}
      {children}
    </div>
  );
}
