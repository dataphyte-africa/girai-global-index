"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { chartColor, formatScore, truncateLabel, type ChartDatum } from "./chart-theme";
import { cn } from "@/lib/utils";

export function AiLineChart({
  data,
  className,
  yDomain,
}: {
  data: ChartDatum[];
  className?: string;
  yDomain?: [number, number];
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

    const height = 200;
    const margin = { top: 16, right: 16, bottom: 36, left: 40 };
    const innerW = width - margin.left - margin.right;
    const innerH = height - margin.top - margin.bottom;

    svg.attr("width", width).attr("height", height);

    const yMin = yDomain?.[0] ?? 0;
    const yMax =
      yDomain?.[1] ?? (d3.max(data, (d) => d.value) ?? 100) * 1.05;

    const x = d3
      .scalePoint<string>()
      .domain(data.map((d) => d.label))
      .range([0, innerW])
      .padding(0.5);

    const y = d3.scaleLinear().domain([yMin, yMax]).range([innerH, 0]);

    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Grid
    g.selectAll(".grid-y")
      .data(y.ticks(5))
      .join("line")
      .attr("x1", 0)
      .attr("x2", innerW)
      .attr("y1", (t) => y(t))
      .attr("y2", (t) => y(t))
      .attr("stroke", "currentColor")
      .attr("opacity", 0.08);

    const line = d3
      .line<ChartDatum>()
      .x((d) => x(d.label)!)
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    const path = g
      .append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", chartColor(0))
      .attr("stroke-width", 2.5)
      .attr("d", line);

    const totalLength = path.node()?.getTotalLength() ?? 0;
    path
      .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(800)
      .attr("stroke-dashoffset", 0);

    g.selectAll(".dot")
      .data(data)
      .join("circle")
      .attr("cx", (d) => x(d.label)!)
      .attr("cy", (d) => y(d.value))
      .attr("r", 0)
      .attr("fill", chartColor(0))
      .attr("stroke", "var(--card)")
      .attr("stroke-width", 2)
      .transition()
      .delay(400)
      .duration(400)
      .attr("r", 5);

    g.selectAll(".x-label")
      .data(data)
      .join("text")
      .attr("x", (d) => x(d.label)!)
      .attr("y", innerH + 20)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .attr("opacity", 0.6)
      .attr("class", "text-[9px]")
      .text((d) => truncateLabel(d.label, 10));

    g.append("g")
      .call(
        d3
          .axisLeft(y)
          .ticks(4)
          .tickSize(0)
          .tickFormat((v) => formatScore(Number(v)))
      )
      .call((sel) => sel.select(".domain").remove())
      .call((sel) =>
        sel
          .selectAll(".tick text")
          .attr("fill", "currentColor")
          .attr("opacity", 0.45)
          .attr("class", "text-[9px] tabular-nums")
      );
  }, [data, width, yDomain]);

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      <svg ref={svgRef} className="w-full text-foreground" />
    </div>
  );
}
