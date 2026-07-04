/**
 * Types for the enriched "Top 10 Takeaway" accordion content.
 *
 * Each takeaway carries an expanded Key Evidence narrative, an optional
 * Bright Spot country callout, and one or more visuals (charts/tables)
 * rebuilt natively from the 2026 GIRAI Flagship Report (Part 3).
 *
 * All chart values are hardcoded from the report (the site's generated
 * JSON lacks several report-specific metrics: implementation-evidence
 * counts, binding/non-binding splits, 2024-vs-2026 deltas, gov-led
 * initiative counts, URAI map points, CSO-activity %).
 */

/** A single indicator row in the framework-vs-implementation ratio chart (T1). */
export type RatioDatum = {
  label: string;
  framework: number;
  implementation: number;
  ratio: number; // percent
};

/** A region bar with a dashed regional-average reference (T3a, T5, T8, T9a). */
export type RegionDatum = {
  region: string;
  value: number; // percent
  regionalAvg: number; // dashed reference line
  /** Deviation in percentage points, as printed in the report (may differ from value-avg by rounding). */
  deviationPp: number;
  n?: number;
};

/** One category (cluster) in a grouped bar chart. */
export type GroupedCategory = {
  category: string;
  bars: { seriesKey: string; value: number }[];
  /** e.g. "+34%" growth annotation drawn above the cluster. */
  delta?: string;
  /** Per-cluster dashed reference lines (T7c). */
  refLines?: { value: number; colorKey: ChartColorKey }[];
};

export type RankDatum = { label: string; value: number };

export type ColumnItem = { label: string; value: number };
export type ColumnGroup = { title: string; items: ColumnItem[] };

export type HeatColumn = { key: string; label: string; avg?: number; n?: number };
export type HeatRow = { label: string; group?: string; cells: (number | null)[] };

export type MapPoint = { name: string; lon: number; lat: number; cases: number };

/**
 * A static chart image exported from the 2026 GIRAI Flagship Report. When
 * attached to a visual it is rendered INSTEAD of the native chart (see
 * `VisualBase.image`); the underlying chart definition is preserved so it can
 * be corrected and re-enabled later simply by removing the `image` field.
 */
export type VisualImage = {
  /** Public path, e.g. "/takeaways/charts/finding-2.jpg". */
  src: string;
  alt: string;
  width: number;
  height: number;
};

/** Fields available on every visual, regardless of `kind`. */
type VisualBase = {
  /** Render this report image instead of the native chart (reversible). */
  image?: VisualImage;
  /** Keep the visual in source but do not render it. */
  hidden?: boolean;
};

/** Named colors resolved in chart-kit so the data module stays declarative. */
export type ChartColorKey =
  | "above" // above average — green
  | "below" // below average — amber
  | "neutral"
  | "series2024"
  | "series2026"
  | "frameworks"
  | "initiatives"
  | "primary"
  | "highlightTop"
  | "highlightBottom"
  | "highlight";

export type TakeawayVisual = (
  | {
      /** Standalone report image with no native chart backing it. */
      kind: "image";
      title: string;
      caption?: string;
      image: VisualImage;
    }
  | {
      kind: "ratioBar";
      title: string;
      caption?: string;
      average: number;
      data: RatioDatum[];
    }
  | {
      kind: "regionalBar";
      title: string;
      caption?: string;
      /** Show a second diverging "deviation from regional avg" panel (T9a). */
      showDeviation?: boolean;
      /** Decimal places for the value labels (default 0). */
      valueDigits?: number;
      data: RegionDatum[];
    }
  | {
      kind: "groupedBar";
      title: string;
      caption?: string;
      /** Axis unit label, e.g. "%" or "countries". */
      unit?: "%" | "count";
      max?: number;
      /** Reference line drawn across the full width (T2 "max (14)", T6 avg lines). */
      globalRefLines?: { label: string; value: number; colorKey: ChartColorKey }[];
      series: { key: string; label: string; colorKey: ChartColorKey }[];
      categories: GroupedCategory[];
    }
  | {
      kind: "indicatorRankBar";
      title: string;
      caption?: string;
      data: RankDatum[];
      highlightTop?: string;
      highlightBottom?: string;
      /** Arbitrary rows to highlight (T7b Environmental Impact). */
      highlight?: string[];
      /** Decimal places for the value labels (default 0). */
      valueDigits?: number;
    }
  | {
      kind: "comparisonColumns";
      title: string;
      caption?: string;
      left: ColumnGroup;
      right: ColumnGroup;
      highlightLabel?: string;
    }
  | {
      kind: "heatmap";
      title: string;
      caption?: string;
      mode: "numeric" | "dots";
      columns: HeatColumn[];
      rows: HeatRow[];
    }
  | {
      kind: "table";
      title: string;
      caption?: string;
      columns: string[];
      rows: string[][];
      emphasizeLastRow?: boolean;
    }
  | {
      kind: "bubbleMap";
      title: string;
      caption?: string;
      points: MapPoint[];
    }
) &
  VisualBase;

export type BrightSpot = { country: string; body: string };

export type Takeaway = {
  /** Full finding headline (accordion trigger). */
  title: string;
  /** Condensed Executive-Summary one-liner shown at the top of the panel. */
  summary: string;
  /** Expanded Key Evidence bullets from Part 3. */
  narrative: string[];
  brightSpot?: BrightSpot;
  visuals: TakeawayVisual[];
};
