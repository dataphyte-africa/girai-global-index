"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import Link from "next/link";
import { chartColor, formatScore, truncateLabel, type ChartDatum } from "./chart-theme";
import { cn } from "@/lib/utils";

export function AiBarChart({
  data,
  className,
  horizontal = true,
  showValues = true,
}: {
  data: ChartDatum[];
  className?: string;
  horizontal?: boolean;
  showValues?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [width, setWidth] = useState(360);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setWidth(Math.max(280, entry?.contentRect.width ?? 360));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current || data.length === 0) return;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    if (horizontal) {
      const barHeight = 32;
      const margin = { left: 108, right: 52, top: 4, bottom: 4 };
      const height = data.length * barHeight + margin.top + margin.bottom;
      const innerW = width - margin.left - margin.right;

      svg.attr("width", width).attr("height", height);

      const maxVal = d3.max(data, (d) => d.value) ?? 100;
      const x = d3.scaleLinear().domain([0, maxVal * 1.08]).range([0, innerW]);

      const g = svg
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

      data.forEach((d, i) => {
        const y = i * barHeight;
        const barW = x(d.value);

        g.append("text")
          .attr("x", -10)
          .attr("y", y + barHeight / 2)
          .attr("dy", "0.35em")
          .attr("text-anchor", "end")
          .attr("fill", "currentColor")
          .attr("class", "text-[11px] font-medium")
          .text(truncateLabel(d.label, 13));

        g.append("rect")
          .attr("x", 0)
          .attr("y", y + 6)
          .attr("width", 0)
          .attr("height", barHeight - 12)
          .attr("rx", 6)
          .attr("fill", chartColor(i))
          .attr("opacity", 0.88)
          .transition()
          .duration(600)
          .delay(i * 60)
          .attr("width", barW);

        if (showValues) {
          g.append("text")
            .attr("x", barW + 8)
            .attr("y", y + barHeight / 2)
            .attr("dy", "0.35em")
            .attr("fill", "currentColor")
            .attr("opacity", 0.55)
            .attr("class", "text-[10px] tabular-nums")
            .text(formatScore(d.value));
        }
      });
    }
  }, [data, width, horizontal, showValues]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <svg ref={svgRef} className="w-full text-foreground" />
      {data.some((d) => d.href) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {data
            .filter((d) => d.href)
            .slice(0, 8)
            .map((d) => (
              <Link
                key={d.label}
                href={d.href!}
                className="rounded-full border border-border/80 bg-muted/30 px-2.5 py-0.5 text-[11px] text-primary transition-colors hover:bg-primary/10"
              >
                {truncateLabel(d.label, 18)}
              </Link>
            ))}
        </div>
      )}
    </div>
  );
}
