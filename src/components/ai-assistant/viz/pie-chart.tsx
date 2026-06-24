"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import {
  chartColor,
  formatScore,
  truncateLabel,
  type ChartDatum,
} from "./chart-theme";
import { cn } from "@/lib/utils";

export function AiPieChart({
  data,
  className,
  donut = true,
}: {
  data: ChartDatum[];
  className?: string;
  donut?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(320);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.max(260, entry?.contentRect.width ?? 320));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const size = Math.min(width, 280);
    const radius = size / 2 - 8;
    const innerRadius = donut ? radius * 0.58 : 0;

    svg.attr("width", size).attr("height", size);

    const g = svg
      .append("g")
      .attr("transform", `translate(${size / 2},${size / 2})`);

    const pie = d3
      .pie<ChartDatum>()
      .value((d) => d.value)
      .sort(null)
      .padAngle(0.02);

    const arc = d3
      .arc<d3.PieArcDatum<ChartDatum>>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .cornerRadius(4);

    const arcs = g
      .selectAll(".arc")
      .data(pie(data))
      .join("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("fill", (_, i) => chartColor(i))
      .attr("opacity", 0.9)
      .transition()
      .delay((_, i) => i * 80)
      .duration(500)
      .attrTween("d", function (d) {
        const interpolate = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arc(interpolate(t)) ?? "";
      });

    if (donut) {
      const total = d3.sum(data, (d) => d.value);
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "-0.2em")
        .attr("fill", "currentColor")
        .attr("class", "text-[10px] font-medium uppercase tracking-wider opacity-50")
        .text("Total");
      g.append("text")
        .attr("text-anchor", "middle")
        .attr("dy", "1.1em")
        .attr("fill", "currentColor")
        .attr("class", "text-lg font-semibold tabular-nums")
        .text(formatScore(total));
    }
  }, [data, width, donut]);

  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div ref={containerRef} className={cn("flex flex-col gap-4 sm:flex-row sm:items-center", className)}>
      <svg ref={svgRef} className="mx-auto shrink-0 text-foreground sm:mx-0" />
      <ul className="min-w-0 flex-1 space-y-2">
        {data.map((d, i) => {
          const pct = total > 0 ? ((d.value / total) * 100).toFixed(1) : "0";
          return (
            <li
              key={d.label}
              className="flex items-center gap-2.5 text-xs"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: chartColor(i) }}
              />
              <span className="min-w-0 flex-1 truncate text-foreground/90">
                {truncateLabel(d.label, 22)}
              </span>
              <span className="shrink-0 tabular-nums text-muted-foreground">
                {formatScore(d.value)}{" "}
                <span className="text-[10px]">({pct}%)</span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
