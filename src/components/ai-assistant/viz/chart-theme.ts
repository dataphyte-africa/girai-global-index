/** GIRAI chart palette — reads site CSS variables where possible. */
export const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--primary)",
  "var(--hero-accent)",
];

export function chartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length]!;
}

export type ChartDatum = {
  label: string;
  value: number;
  href?: string;
  meta?: string;
};

export type LineSeries = {
  id: string;
  label: string;
  color?: string;
  points: ChartDatum[];
};

export function formatScore(value: number): string {
  return value.toFixed(1);
}

export function truncateLabel(label: string, max = 14): string {
  return label.length > max ? `${label.slice(0, max - 1)}…` : label;
}
