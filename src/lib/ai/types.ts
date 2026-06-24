export type GiraiSourceKind =
  | "country"
  | "indicator"
  | "evidence"
  | "region"
  | "report"
  | "dimension";

export type GiraiSource = {
  label: string;
  href: string;
  kind: GiraiSourceKind;
};

export type GiraiVisualization =
  | "table"
  | "bar_chart"
  | "comparison"
  | "analysis";

export type GiraiToolResult<T> = {
  data: T;
  sources: GiraiSource[];
  visualization?: GiraiVisualization;
};
