"use client";

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import type { Dimension } from "@/data/dimensions-data";

const PRIMARY_COLOR = "oklch(56.39% 0.232 285.48)";

// Helper to get CSS variable value
function getCssVar(name: string): string {
  if (typeof document === "undefined") return "";
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

interface RadialDimensionsChartProps {
  dimensions: Dimension[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
}

interface ChartLink {
  dimension: Dimension;
  indicator: string;
  indicatorAngle: number;
  dimensionAngle: number;
}

// Convert radial angle (0 at top, clockwise) to x coordinate
function radialX(angle: number, radius: number): number {
  return Math.sin(angle) * radius;
}

// Convert radial angle (0 at top, clockwise) to y coordinate
function radialY(angle: number, radius: number): number {
  return -Math.cos(angle) * radius;
}

// Get rotation and text-anchor for label based on angle
// Returns { rotation: degrees, anchor: "start" | "end", flipped: boolean }
function getLabelTransform(angle: number): { rotation: number; anchor: "start" | "end" } {
  // Convert radial angle (0 at top) to SVG rotation (0 at right)
  // This makes the text follow the radial direction outward
  const svgDegrees = (angle * 180) / Math.PI - 90;
  // Normalize to 0-360
  const normalized = ((svgDegrees % 360) + 360) % 360;
  
  // If the text would be upside down (pointing into left half of circle),
  // flip it 180° and use "end" anchor so text still extends outward
  if (normalized > 90 && normalized < 270) {
    return {
      rotation: svgDegrees + 180,
      anchor: "end"
    };
  }
  
  return {
    rotation: svgDegrees,
    anchor: "start"
  };
}

function buildChartData(dimensions: Dimension[]) {
  const numDimensions = dimensions.length;
  const angleStep = (2 * Math.PI) / numDimensions;
  const startAngle = 0; // Start from top (0 = 12 o'clock in radial coordinates)

  const links: ChartLink[] = [];
  const indicatorPositions: { dimension: Dimension; indicator: string; angle: number }[] = [];

  dimensions.forEach((dim, i) => {
    const dimAngle = startAngle + i * angleStep;
    const indicators = dim.indicators;
    const numIndicators = indicators.length;
    // Spread indicators in an arc centered on the dimension angle
    const arcSpan = angleStep * 0.7;
    const arcStart = dimAngle - arcSpan / 2;
    const indicatorAngleStep = numIndicators > 1 ? arcSpan / (numIndicators - 1) : 0;

    indicators.forEach((indicator, j) => {
      const indAngle = numIndicators === 1 ? dimAngle : arcStart + j * indicatorAngleStep;
      links.push({ dimension: dim, indicator, indicatorAngle: indAngle, dimensionAngle: dimAngle });
      indicatorPositions.push({ dimension: dim, indicator, angle: indAngle });
    });
  });

  return { links, indicatorPositions, angleStep, startAngle };
}

export function RadialDimensionsChart({
  dimensions,
  selectedId,
  onSelect,
}: RadialDimensionsChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const padding = 50; // Extra space for indicator labels
  const chartSize = 580;
  const size = chartSize + padding * 2;
  const center = size / 2;
  const innerRadius = 75;
  const middleRadius = 140;
  const outerRadius = 230;
  const pentagonRadius = 52;

  useEffect(() => {
    if (!svgRef.current || dimensions.length === 0) return;

    const { links, indicatorPositions, angleStep, startAngle } = buildChartData(dimensions);

    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("viewBox", [0, 0, size, size])
      .attr("width", "100%")
      .style("height", "auto")
      .style("max-width", "100%");

    const g = svg.append("g").attr("transform", `translate(${center},${center})`);

    // D3 linkRadial: angle accessor returns angle (0 at top), radius accessor returns distance
    const linkGenerator = d3.linkRadial<
      d3.DefaultLinkObject,
      [number, number]
    >()
      .angle((d) => d[0])
      .radius((d) => d[1]);

    // Get CSS variable values for dark mode support
    const MUTED_COLOR = getCssVar("--chart-muted") || "oklch(0.85 0.01 260)";
    const MUTED_NODE = getCssVar("--chart-muted-node") || "oklch(0.9 0.01 260)";
    const MUTED_LABEL = getCssVar("--chart-muted-label") || "oklch(0.4 0.02 260)";
    const MUTED_TEXT = getCssVar("--chart-muted-text") || "oklch(0.3 0.02 260)";

    const linkData = links.map((l) => ({
      source: [l.dimensionAngle, innerRadius] as [number, number],
      target: [l.indicatorAngle, outerRadius] as [number, number],
      dimensionId: l.dimension.id,
    }));

    // Draw paths
    const linkGroup = g.append("g").attr("class", "links");

    const paths = linkGroup
      .selectAll("path")
      .data(linkData)
      .join("path")
      .attr("class", "link-path")
      .attr("data-dimension", (d) => d.dimensionId)
      .attr("d", (d) =>
        linkGenerator({
          source: d.source,
          target: d.target,
        } as d3.DefaultLinkObject)
      )
      .attr("fill", "none")
      .attr("stroke", MUTED_COLOR)
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.4);

    // Animate selected paths
    paths.each(function (d) {
      const path = d3.select(this);
      const isSelected = d.dimensionId === selectedId;
      const pathNode = path.node() as SVGPathElement;
      const pathLength = pathNode.getTotalLength();

      if (isSelected) {
        path
          .attr("stroke-dasharray", pathLength)
          .attr("stroke-dashoffset", pathLength)
          .transition()
          .duration(600)
          .ease(d3.easeCubicOut)
          .attr("stroke", PRIMARY_COLOR)
          .attr("stroke-width", 2.5)
          .attr("stroke-opacity", 1)
          .attr("stroke-dashoffset", 0);
      } else {
        path
          .attr("stroke-dasharray", "none")
          .attr("stroke-dashoffset", 0)
          .attr("stroke", MUTED_COLOR)
          .attr("stroke-width", 1.5)
          .attr("stroke-opacity", 0.4);
      }
    });

    // Draw indicator nodes (circles at outer edge)
    const indicatorGroup = g.append("g").attr("class", "indicators");

    indicatorGroup
      .selectAll("circle")
      .data(indicatorPositions)
      .join("circle")
      .attr("class", "indicator-node")
      .attr("data-dimension", (d) => d.dimension.id)
      .attr("cx", (d) => radialX(d.angle, outerRadius))
      .attr("cy", (d) => radialY(d.angle, outerRadius))
      .attr("r", (d) => (d.dimension.id === selectedId ? 0 : 5))
      .attr("fill", (d) => (d.dimension.id === selectedId ? PRIMARY_COLOR : "white"))
      .attr("stroke", (d) => (d.dimension.id === selectedId ? PRIMARY_COLOR : MUTED_COLOR))
      .attr("stroke-width", 2)
      .filter((d) => d.dimension.id === selectedId)
      .transition()
      .delay((_, i) => i * 50)
      .duration(400)
      .ease(d3.easeBackOut)
      .attr("r", 7);

    // Draw indicator labels with rotation and multi-line support
    const labelGroup = g.append("g").attr("class", "indicator-labels");
    const labelOffset = 12;
    
    // Helper to split long labels into multiple lines
    function splitLabel(text: string, maxChars: number = 18): string[] {
      if (text.length <= maxChars) return [text];
      
      const words = text.split(" ");
      const lines: string[] = [];
      let currentLine = "";
      
      for (const word of words) {
        if (currentLine.length + word.length + 1 <= maxChars) {
          currentLine = currentLine ? `${currentLine} ${word}` : word;
        } else {
          if (currentLine) lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      
      return lines;
    }
    
    indicatorPositions.forEach((d) => {
      const x = radialX(d.angle, outerRadius + labelOffset);
      const y = radialY(d.angle, outerRadius + labelOffset);
      const { rotation, anchor } = getLabelTransform(d.angle);
      const lines = splitLabel(d.indicator);
      const isSelected = d.dimension.id === selectedId;
      
      const textEl = labelGroup
        .append("text")
        .attr("class", "indicator-label")
        .attr("data-dimension", d.dimension.id)
        .attr("transform", `translate(${x},${y}) rotate(${rotation})`)
        .attr("text-anchor", anchor)
        .attr("fill", isSelected ? PRIMARY_COLOR : MUTED_LABEL)
        .attr("font-size", 14)
        .attr("font-weight", isSelected ? 600 : 400);
      
      lines.forEach((line, i) => {
        textEl
          .append("tspan")
          .attr("x", 0)
          .attr("dy", i === 0 ? `-${(lines.length - 1) * 0.5}em` : "1.1em")
          .text(line);
      });
    });

    // Draw center pentagon
    const pentagonPoints: [number, number][] = [];
    for (let i = 0; i < 5; i++) {
      const a = startAngle + i * angleStep;
      pentagonPoints.push([radialX(a, pentagonRadius), radialY(a, pentagonRadius)]);
    }
    const pentagonPath = d3.line()(pentagonPoints) + "Z";

    const selectedDimension = selectedId
      ? dimensions.find((d) => d.id === selectedId)
      : null;
    const pentagonImage = selectedDimension?.image;

    // Defs for pentagon clipPath (for image background)
    const defs = svg.append("defs");
    defs
      .append("clipPath")
      .attr("id", "pentagon-clip")
      .append("path")
      .attr("d", pentagonPath);

    const centerGroup = g.append("g").attr("class", "center");

    if (pentagonImage) {
      centerGroup
        .append("image")
        .attr("href", pentagonImage)
        .attr("x", -pentagonRadius)
        .attr("y", -pentagonRadius)
        .attr("width", pentagonRadius * 2)
        .attr("height", pentagonRadius * 2)
        .attr("preserveAspectRatio", "xMidYMid slice")
        .attr("clip-path", "url(#pentagon-clip)")
        .attr("opacity", 1);
    }

    centerGroup
      .append("path")
      .attr("d", pentagonPath)
      .attr("fill", pentagonImage ? "transparent" : MUTED_COLOR)
      .attr("fill-opacity", pentagonImage ? 0 : 0.08)
      .attr("stroke", MUTED_COLOR)
      .attr("stroke-width", 1)
      .transition()
      .duration(400)
      .attr("fill", pentagonImage ? "transparent" : selectedId ? PRIMARY_COLOR : MUTED_COLOR)
      .attr("fill-opacity", pentagonImage ? 0 : selectedId ? 0.2 : 0.08)
      .attr("stroke", selectedId ? PRIMARY_COLOR : MUTED_COLOR);

    // Draw dimension labels (clickable buttons)
    const dimensionLabelsGroup = g.append("g").attr("class", "dimension-labels");

    dimensions.forEach((dim, i) => {
      const a = startAngle + i * angleStep;
      const x = radialX(a, middleRadius);
      const y = radialY(a, middleRadius);
      const isSelected = dim.id === selectedId;

      const labelG = dimensionLabelsGroup
        .append("g")
        .attr("class", "dimension-label-group")
        .attr("data-dimension", dim.id)
        .attr("transform", `translate(${x},${y})`)
        .style("cursor", "pointer")
        .on("click", () => {
          onSelect(dim.id === selectedId ? null : dim.id);
        });

      const rect = labelG
        .append("rect")
        .attr("class", "dimension-rect")
        .attr("x", -70)
        .attr("y", -14)
        .attr("width", 140)
        .attr("height", 28)
        .attr("rx", 14)
        .attr("fill", MUTED_NODE)
        .attr("stroke", MUTED_COLOR)
        .attr("stroke-width", 1);

      const text = labelG
        .append("text")
        .attr("class", "dimension-text")
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .attr("fill", MUTED_TEXT)
        .attr("font-size", 12)
        .attr("font-weight", 500)
        .text(dim.name.length > 20 ? dim.name.slice(0, 18) + "..." : dim.name);

      // Animate if selected
      if (isSelected) {
        rect
          .transition()
          .duration(300)
          .attr("fill", PRIMARY_COLOR)
          .attr("stroke", PRIMARY_COLOR)
          .attr("stroke-width", 2);

        text
          .transition()
          .duration(300)
          .attr("fill", "white")
          .attr("font-weight", 600);
      }
    });

  }, [dimensions, selectedId, onSelect]);

  return (
    <div className="flex justify-center items-center w-full">
      <svg ref={svgRef} className="radial-dimensions-chart overflow-visible" />
    </div>
  );
}
