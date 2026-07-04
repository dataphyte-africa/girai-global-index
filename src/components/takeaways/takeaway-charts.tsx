"use client";

import { scaleLinear } from "d3";
import {
  ChartFrame,
  Legend,
  chartColor,
  deviationColor,
  pct,
  signedPp,
  useContainerWidth,
} from "./chart-kit";
import type {
  ColumnGroup,
  HeatColumn,
  HeatRow,
  MapPoint,
  RankDatum,
  RatioDatum,
  RegionDatum,
  TakeawayVisual,
} from "./types";

const RATIO_ABOVE = "#3f9d74"; // green
const RATIO_BELOW = "#5b8fd6"; // blue

/* ------------------------------------------------------------------ */
/* T1 — Framework-vs-Implementation ratio (diverging horizontal bars)  */
/* ------------------------------------------------------------------ */

export function RatioBarChart({
  data,
  average,
  title,
  caption,
}: {
  data: RatioDatum[];
  average: number;
  title: string;
  caption?: string;
}) {
  const { ref, width } = useContainerWidth();
  const labelW = width < 420 ? 116 : 150;
  const valueW = 84;
  const barArea = Math.max(60, width - labelW - valueW);
  const maxFramework = Math.max(...data.map((d) => d.framework));
  const x = scaleLinear().domain([0, maxFramework]).range([0, barArea]);
  const rowH = 30;

  // index of first below-average row, to place the divider.
  const firstBelow = data.findIndex((d) => d.ratio < average);

  return (
    <ChartFrame title={title} caption={caption}>
      <Legend
        items={[
          { color: RATIO_ABOVE, label: "Above average" },
          { color: RATIO_BELOW, label: "Below average" },
        ]}
      />
      <div ref={ref} className="w-full overflow-hidden">
        {data.map((d, i) => {
          const above = d.ratio >= average;
          const color = above ? RATIO_ABOVE : RATIO_BELOW;
          return (
            <div key={d.label}>
              {i === firstBelow ? (
                <div className="my-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="h-px flex-1 border-t border-dashed border-border" />
                  average: {pct(average)}
                  <span className="h-px flex-1 border-t border-dashed border-border" />
                </div>
              ) : null}
              <div
                className="flex items-center gap-2"
                style={{ height: rowH }}
              >
                <span
                  className="shrink-0 truncate text-right text-[11px] text-foreground/80"
                  style={{ width: labelW }}
                  title={d.label}
                >
                  {d.label}
                </span>
                <span className="relative" style={{ width: barArea, height: 16 }}>
                  <span
                    className="absolute inset-y-0 left-0 rounded-sm"
                    style={{
                      width: x(d.framework),
                      backgroundColor: color,
                      opacity: 0.28,
                    }}
                  />
                  <span
                    className="absolute inset-y-0 left-0 rounded-sm"
                    style={{ width: x(d.implementation), backgroundColor: color }}
                  />
                </span>
                <span
                  className="shrink-0 text-right text-[11px] tabular-nums text-muted-foreground"
                  style={{ width: valueW }}
                >
                  <span className="font-semibold text-foreground">{pct(d.ratio)}</span>{" "}
                  <span className="text-[10px]">
                    {d.framework}/{d.implementation}
                  </span>
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </ChartFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Regional bar with dashed regional-average reference (+ optional       */
/* deviation panel). T3a, T5, T8, T9a.                                   */
/* ------------------------------------------------------------------ */

function regionBarColor(pp: number): string {
  if (pp >= 1) return chartColor("above");
  if (pp <= -1) return chartColor("below");
  return chartColor("neutral");
}

export function RegionalBarChart({
  data,
  title,
  caption,
  showDeviation = false,
  valueDigits = 0,
}: {
  data: RegionDatum[];
  title: string;
  caption?: string;
  showDeviation?: boolean;
  valueDigits?: number;
}) {
  const { ref, width } = useContainerWidth();
  const h = 230;
  const m = { top: 26, right: 8, bottom: 42, left: 34 };
  const innerW = Math.max(120, width - m.left - m.right);
  const innerH = h - m.top - m.bottom;
  const n = data.length;
  const slot = innerW / n;
  const barW = Math.min(46, slot * 0.5);
  const y = scaleLinear().domain([0, 100]).range([innerH, 0]);

  return (
    <ChartFrame title={title} caption={caption}>
      <Legend
        items={[
          { color: chartColor("above"), label: "Above regional average" },
          { color: chartColor("below"), label: "Below regional average" },
          { color: chartColor("neutral"), label: "Regional avg (dashed)", dashed: true },
        ]}
      />
      <div ref={ref} className="w-full">
        <svg width={width} height={h} className="text-muted-foreground">
          {/* y gridlines */}
          {[0, 25, 50, 75, 100].map((t) => (
            <g key={t}>
              <line
                x1={m.left}
                x2={m.left + innerW}
                y1={m.top + y(t)}
                y2={m.top + y(t)}
                stroke="currentColor"
                strokeOpacity={0.12}
              />
              <text
                x={m.left - 6}
                y={m.top + y(t)}
                dy="0.32em"
                textAnchor="end"
                className="fill-current text-[9px]"
                opacity={0.6}
              >
                {t}
              </text>
            </g>
          ))}
          {data.map((d, i) => {
            const cx = m.left + slot * i + slot / 2;
            const barX = cx - barW / 2;
            const color = regionBarColor(d.deviationPp);
            const avgY = m.top + y(d.regionalAvg);
            return (
              <g key={d.region}>
                <rect
                  x={barX}
                  y={m.top + y(d.value)}
                  width={barW}
                  height={innerH - y(d.value)}
                  rx={3}
                  fill={color}
                />
                {/* value + deviation label */}
                <text
                  x={cx}
                  y={m.top + y(d.value) - 5}
                  textAnchor="middle"
                  className="fill-current text-[10px] font-semibold"
                  fill={color}
                >
                  {pct(d.value, valueDigits)} ({signedPp(d.deviationPp)})
                </text>
                {/* regional avg dashed segment */}
                <line
                  x1={cx - slot * 0.4}
                  x2={cx + slot * 0.4}
                  y1={avgY}
                  y2={avgY}
                  stroke="currentColor"
                  strokeWidth={1.5}
                  strokeDasharray="4 3"
                  opacity={0.55}
                />
                {/* region label */}
                <text
                  x={cx}
                  y={h - m.bottom + 14}
                  textAnchor="middle"
                  className="fill-current text-[9px]"
                  opacity={0.75}
                >
                  {d.region}
                </text>
                {d.n != null ? (
                  <text
                    x={cx}
                    y={h - m.bottom + 25}
                    textAnchor="middle"
                    className="fill-current text-[8px]"
                    opacity={0.5}
                  >
                    n={d.n}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>

        {showDeviation ? <DeviationStrip data={data} /> : null}
      </div>
    </ChartFrame>
  );
}

function DeviationStrip({ data }: { data: RegionDatum[] }) {
  const { ref, width } = useContainerWidth();
  const h = 130;
  const m = { top: 18, right: 8, bottom: 30, left: 34 };
  const innerW = Math.max(120, width - m.left - m.right);
  const innerH = h - m.top - m.bottom;
  const maxAbs = Math.max(20, ...data.map((d) => Math.abs(d.deviationPp)));
  const y = scaleLinear().domain([-maxAbs, maxAbs]).range([innerH, 0]);
  const zeroY = m.top + y(0);
  const slot = innerW / data.length;
  const barW = Math.min(46, slot * 0.5);

  return (
    <div ref={ref} className="mt-1 w-full">
      <p className="mb-1 text-[10px] font-medium text-muted-foreground">
        Deviation from regional average (percentage points)
      </p>
      <svg width={width} height={h} className="text-muted-foreground">
        <line
          x1={m.left}
          x2={m.left + innerW}
          y1={zeroY}
          y2={zeroY}
          stroke="currentColor"
          strokeOpacity={0.35}
        />
        {data.map((d, i) => {
          const cx = m.left + slot * i + slot / 2;
          const up = d.deviationPp >= 0;
          const color = up ? chartColor("above") : chartColor("below");
          const yTop = up ? m.top + y(d.deviationPp) : zeroY;
          const barH = Math.abs(zeroY - (m.top + y(d.deviationPp)));
          return (
            <g key={d.region}>
              <rect x={cx - barW / 2} y={yTop} width={barW} height={barH} rx={2} fill={color} />
              <text
                x={cx}
                y={up ? yTop - 4 : yTop + barH + 11}
                textAnchor="middle"
                className="fill-current text-[9px] font-medium"
                fill={color}
              >
                {signedPp(d.deviationPp)}
              </text>
              <text
                x={cx}
                y={h - m.bottom + 16}
                textAnchor="middle"
                className="fill-current text-[9px]"
                opacity={0.7}
              >
                {d.region}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Grouped bar (clusters of series). T2, T6, T7c, T9b.                  */
/* ------------------------------------------------------------------ */

export function GroupedBarChart({
  visual,
}: {
  visual: Extract<TakeawayVisual, { kind: "groupedBar" }>;
}) {
  const { ref, width } = useContainerWidth();
  const { categories, series, unit = "%", max, globalRefLines, title, caption } = visual;
  const h = 270;
  const m = { top: 28, right: 40, bottom: 46, left: 38 };
  const innerW = Math.max(140, width - m.left - m.right);
  const innerH = h - m.top - m.bottom;

  const dataMax =
    max ??
    Math.max(
      ...categories.flatMap((c) => c.bars.map((b) => b.value)),
      ...(globalRefLines?.map((r) => r.value) ?? [0]),
    ) * 1.15;
  const y = scaleLinear().domain([0, dataMax]).range([innerH, 0]);

  const groupSlot = innerW / categories.length;
  const groupPad = groupSlot * 0.22;
  const barsW = groupSlot - groupPad;
  const barW = Math.min(54, barsW / series.length - 6);

  const fmt = (v: number) => (unit === "%" ? pct(v) : `${v}`);

  return (
    <ChartFrame title={title} caption={caption}>
      <Legend items={series.map((s) => ({ color: chartColor(s.colorKey), label: s.label }))} />
      <div ref={ref} className="w-full">
        <svg width={width} height={h} className="text-muted-foreground">
          {globalRefLines?.map((r) => (
            <g key={r.label}>
              <line
                x1={m.left}
                x2={m.left + innerW}
                y1={m.top + y(r.value)}
                y2={m.top + y(r.value)}
                stroke={chartColor(r.colorKey)}
                strokeWidth={1.5}
                strokeDasharray="5 4"
                opacity={0.7}
              />
              <text
                x={m.left + innerW + 3}
                y={m.top + y(r.value)}
                dy="0.32em"
                className="fill-current text-[9px]"
                opacity={0.7}
              >
                {r.label}
              </text>
            </g>
          ))}
          {categories.map((cat, ci) => {
            const gx = m.left + groupSlot * ci + groupPad / 2;
            return (
              <g key={cat.category}>
                {cat.refLines?.map((r, ri) => (
                  <line
                    key={ri}
                    x1={gx}
                    x2={gx + barsW}
                    y1={m.top + y(r.value)}
                    y2={m.top + y(r.value)}
                    stroke={chartColor(r.colorKey)}
                    strokeWidth={1.5}
                    strokeDasharray="5 4"
                    opacity={0.75}
                  />
                ))}
                {series.map((s, si) => {
                  const bar = cat.bars.find((b) => b.seriesKey === s.key);
                  if (!bar) return null;
                  const bx = gx + (barsW / series.length) * si + (barsW / series.length - barW) / 2;
                  return (
                    <g key={s.key}>
                      <rect
                        x={bx}
                        y={m.top + y(bar.value)}
                        width={barW}
                        height={innerH - y(bar.value)}
                        rx={3}
                        fill={chartColor(s.colorKey)}
                      />
                      <text
                        x={bx + barW / 2}
                        y={m.top + y(bar.value) - 4}
                        textAnchor="middle"
                        className="fill-current text-[9px] font-medium"
                        opacity={0.85}
                      >
                        {fmt(bar.value)}
                      </text>
                    </g>
                  );
                })}
                {cat.delta ? (
                  <text
                    x={gx + barsW / 2}
                    y={m.top - 12}
                    textAnchor="middle"
                    className="fill-current text-[10px] font-bold"
                    fill={chartColor("above")}
                  >
                    ▲ {cat.delta}
                  </text>
                ) : null}
                <text
                  x={gx + barsW / 2}
                  y={h - m.bottom + 16}
                  textAnchor="middle"
                  className="fill-current text-[9px]"
                  opacity={0.75}
                >
                  {cat.category}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </ChartFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Indicator rank — horizontal % bars with highlights. T4, T7b.         */
/* ------------------------------------------------------------------ */

export function IndicatorRankBar({
  data,
  title,
  caption,
  highlightTop,
  highlightBottom,
  highlight = [],
  valueDigits = 0,
}: {
  data: RankDatum[];
  title: string;
  caption?: string;
  highlightTop?: string;
  highlightBottom?: string;
  highlight?: string[];
  valueDigits?: number;
}) {
  const { ref, width } = useContainerWidth();
  const labelW = width < 420 ? 130 : 184;
  const valueW = 40;
  const barArea = Math.max(60, width - labelW - valueW);
  const maxVal = Math.max(...data.map((d) => d.value));
  const x = scaleLinear().domain([0, maxVal]).range([0, barArea]);

  const colorFor = (label: string) => {
    if (label === highlightTop) return chartColor("highlightTop");
    if (label === highlightBottom) return chartColor("highlightBottom");
    if (highlight.includes(label)) return chartColor("highlight");
    return chartColor("neutral");
  };
  const emphasized = (label: string) =>
    label === highlightTop || label === highlightBottom || highlight.includes(label);

  return (
    <ChartFrame title={title} caption={caption}>
      <div ref={ref} className="w-full">
        {data.map((d) => {
          const color = colorFor(d.label);
          const strong = emphasized(d.label);
          return (
            <div key={d.label} className="flex items-center gap-2" style={{ height: 24 }}>
              <span
                className={`shrink-0 truncate text-right text-[11px] ${
                  strong ? "font-semibold text-foreground" : "text-foreground/75"
                }`}
                style={{ width: labelW }}
                title={d.label}
              >
                {d.label}
              </span>
              <span style={{ width: barArea }}>
                <span
                  className="block h-3 rounded-sm"
                  style={{ width: Math.max(2, x(d.value)), backgroundColor: color }}
                />
              </span>
              <span
                className="shrink-0 text-right text-[11px] tabular-nums text-muted-foreground"
                style={{ width: valueW }}
              >
                {pct(d.value, valueDigits)}
              </span>
            </div>
          );
        })}
      </div>
    </ChartFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Comparison columns (two ranked lists). T7a.                          */
/* ------------------------------------------------------------------ */

export function ComparisonColumns({
  left,
  right,
  title,
  caption,
  highlightLabel,
}: {
  left: ColumnGroup;
  right: ColumnGroup;
  title: string;
  caption?: string;
  highlightLabel?: string;
}) {
  const renderCol = (col: ColumnGroup) => (
    <div className="flex-1">
      <p className="mb-2 text-center text-[11px] font-semibold text-foreground/80">{col.title}</p>
      <ul className="space-y-1">
        {col.items.map((it) => {
          const hot = it.label === highlightLabel;
          return (
            <li
              key={it.label}
              className={`flex items-center justify-between gap-2 rounded px-1.5 py-0.5 text-[11px] ${
                hot ? "font-semibold text-foreground" : "text-foreground/70"
              }`}
              style={hot ? { backgroundColor: "rgba(217,116,63,0.12)" } : undefined}
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: hot ? chartColor("highlight") : "#5b8fd6" }}
                />
                <span className="truncate" title={it.label}>
                  {it.label}
                </span>
              </span>
              <span className="shrink-0 tabular-nums">{pct(it.value)}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );

  return (
    <ChartFrame title={title} caption={caption}>
      <div className="flex gap-4">
        {renderCol(left)}
        <div className="w-px shrink-0 bg-border/60" />
        {renderCol(right)}
      </div>
    </ChartFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Deviation heatmap (numeric or dots). T10a, T10b.                     */
/* ------------------------------------------------------------------ */

export function DeviationHeatmap({
  columns,
  rows,
  mode,
  title,
  caption,
}: {
  columns: HeatColumn[];
  rows: HeatRow[];
  mode: "numeric" | "dots";
  title: string;
  caption?: string;
}) {
  // group rows by dimension for grouped row headers
  return (
    <ChartFrame title={title} caption={caption}>
      {mode === "dots" ? (
        <Legend
          items={[
            { color: "#d9743f", label: "Prioritised (>+5pp)" },
            { color: "#5b8fd6", label: "Deprioritised (<−5pp)" },
            { color: "#d4d8df", label: "Neutral (±5pp)" },
          ]}
        />
      ) : null}
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-[10px]">
          <thead>
            <tr>
              <th className="sticky left-0 bg-background/40 px-1 py-1 text-left font-medium text-muted-foreground" />
              {columns.map((c) => (
                <th key={c.key} className="px-1 py-1 text-center font-semibold text-foreground/80">
                  <div>{c.label}</div>
                  {c.avg != null ? (
                    <div className="font-normal text-muted-foreground">
                      avg {c.avg}%{c.n != null ? ` · n=${c.n}` : ""}
                    </div>
                  ) : null}
                </th>
              ))}
              {mode === "dots" ? (
                <th className="px-1 py-1 text-center font-semibold text-foreground/80">#</th>
              ) : null}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => {
              const showGroup = r.group && (ri === 0 || rows[ri - 1].group !== r.group);
              const prioritisedCount = r.cells.filter((c) => c != null && c >= 5).length;
              return (
                <tr key={r.label} className="border-t border-border/40">
                  <th className="sticky left-0 bg-background/40 px-1 py-1 text-left font-normal">
                    {showGroup ? (
                      <span className="block text-[8px] uppercase tracking-wide text-muted-foreground/70">
                        {r.group}
                      </span>
                    ) : null}
                    <span className="text-foreground/80">{r.label}</span>
                  </th>
                  {r.cells.map((cell, ci) => (
                    <td key={ci} className="px-1 py-1 text-center">
                      {cell == null ? (
                        <span className="text-muted-foreground/40">–</span>
                      ) : mode === "numeric" ? (
                        <span
                          className="inline-block w-full rounded px-1 py-0.5 tabular-nums text-foreground"
                          style={{ backgroundColor: deviationColor(cell) }}
                        >
                          {cell > 0 ? `+${cell}` : cell}
                        </span>
                      ) : (
                        <span
                          className="inline-block h-2.5 w-2.5 rounded-full"
                          style={{
                            backgroundColor:
                              cell >= 5 ? "#d9743f" : cell <= -5 ? "#5b8fd6" : "#d4d8df",
                          }}
                        />
                      )}
                    </td>
                  ))}
                  {mode === "dots" ? (
                    <td className="px-1 py-1 text-center font-semibold tabular-nums text-[#d9743f]">
                      {prioritisedCount}
                    </td>
                  ) : null}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ChartFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Styled data table. T1a, T3c.                                         */
/* ------------------------------------------------------------------ */

export function DataTableViz({
  columns,
  rows,
  title,
  caption,
  emphasizeLastRow,
}: {
  columns: string[];
  rows: string[][];
  title: string;
  caption?: string;
  emphasizeLastRow?: boolean;
}) {
  return (
    <ChartFrame title={title} caption={caption}>
      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-[11px]">
          <thead>
            <tr className="border-b border-border">
              {columns.map((c, i) => (
                <th
                  key={c}
                  className={`px-2 py-1.5 font-semibold text-foreground/80 ${
                    i === 0 ? "text-left" : "text-right"
                  }`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => {
              const last = emphasizeLastRow && ri === rows.length - 1;
              return (
                <tr
                  key={ri}
                  className={`border-b border-border/40 ${last ? "font-semibold text-foreground" : ""}`}
                >
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className={`px-2 py-1.5 tabular-nums ${
                        ci === 0 ? "text-left text-foreground/80" : "text-right text-muted-foreground"
                      } ${last ? "text-foreground" : ""}`}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </ChartFrame>
  );
}

/* ------------------------------------------------------------------ */
/* Bubble map over the equirectangular world watermark. T3b.            */
/* ------------------------------------------------------------------ */

export function BubbleMap({
  points,
  title,
  caption,
}: {
  points: MapPoint[];
  title: string;
  caption?: string;
}) {
  // viewBox matches /countries/world-map-watermark.svg (1200 x 600, equirectangular)
  const W = 1200;
  const H = 600;
  const projX = (lon: number) => ((lon + 180) / 360) * W;
  const projY = (lat: number) => ((90 - lat) / 180) * H;
  const r = (cases: number) => (cases >= 4 ? 13 : cases >= 2 ? 9 : 5.5);

  return (
    <ChartFrame title={title} caption={caption}>
      <div className="relative w-full overflow-hidden rounded-lg bg-muted/20">
        {/* basemap */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/countries/world-map-watermark.svg"
          alt=""
          aria-hidden
          className="block w-full opacity-40 dark:opacity-25 dark:invert"
        />
        {/* bubbles overlay */}
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="absolute inset-0 h-full w-full"
          preserveAspectRatio="xMidYMid meet"
        >
          {points.map((p) => (
            <circle
              key={p.name}
              cx={projX(p.lon)}
              cy={projY(p.lat)}
              r={r(p.cases)}
              fill="#d9743f"
              fillOpacity={0.65}
              stroke="#b85a2b"
              strokeWidth={1}
            >
              <title>
                {p.name}: {p.cases >= 4 ? "4+" : p.cases >= 2 ? "2–3" : "1"} case
                {p.cases > 1 ? "s" : ""}
              </title>
            </circle>
          ))}
        </svg>
      </div>
      <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block rounded-full bg-[#d9743f]" style={{ width: 7, height: 7 }} />
          1 case
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block rounded-full bg-[#d9743f]" style={{ width: 12, height: 12 }} />
          2–3 cases
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block rounded-full bg-[#d9743f]" style={{ width: 18, height: 18 }} />
          4+ cases
        </span>
      </div>
    </ChartFrame>
  );
}
