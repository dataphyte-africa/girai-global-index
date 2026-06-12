import type { DimensionSlug, PillarSlug } from "@/data/2026/taxonomy";
import {
  DIMENSION_FILTER_OPTIONS,
  PILLAR_FILTER_OPTIONS,
} from "@/lib/performance-score";

export interface GroupedMultiSelectOption {
  value: string;
  label: string;
}

export interface GroupedMultiSelectGroup {
  heading: string;
  options: GroupedMultiSelectOption[];
}

export const DIMENSION_VALUE_PREFIX = "dimension:";
export const PILLAR_VALUE_PREFIX = "pillar:";

export function dimensionFilterValue(slug: DimensionSlug): string {
  return `${DIMENSION_VALUE_PREFIX}${slug}`;
}

export function pillarFilterValue(slug: PillarSlug): string {
  return `${PILLAR_VALUE_PREFIX}${slug}`;
}

export function buildScoreFilterGroups(opts?: {
  showDimensions?: boolean;
  showPillars?: boolean;
}): GroupedMultiSelectGroup[] {
  const showDimensions = opts?.showDimensions ?? true;
  const showPillars = opts?.showPillars ?? true;
  const groups: GroupedMultiSelectGroup[] = [];

  if (showDimensions) {
    groups.push({
      heading: "Dimensions",
      options: DIMENSION_FILTER_OPTIONS.map((d) => ({
        value: dimensionFilterValue(d.slug as DimensionSlug),
        label: d.name,
      })),
    });
  }

  if (showPillars) {
    groups.push({
      heading: "Pillars",
      options: PILLAR_FILTER_OPTIONS.map((p) => ({
        value: pillarFilterValue(p.slug as PillarSlug),
        label: p.name,
      })),
    });
  }

  return groups;
}

export function scoreFilterSelectedValues(
  dimensions: string[],
  pillars: string[]
): string[] {
  return [
    ...dimensions.map((slug) => dimensionFilterValue(slug as DimensionSlug)),
    ...pillars.map((slug) => pillarFilterValue(slug as PillarSlug)),
  ];
}

export function parseScoreFilterValues(values: string[]): {
  dimensions: DimensionSlug[];
  pillars: PillarSlug[];
} {
  const dimensions: DimensionSlug[] = [];
  const pillars: PillarSlug[] = [];

  for (const value of values) {
    if (value.startsWith(DIMENSION_VALUE_PREFIX)) {
      dimensions.push(
        value.slice(DIMENSION_VALUE_PREFIX.length) as DimensionSlug
      );
    } else if (value.startsWith(PILLAR_VALUE_PREFIX)) {
      pillars.push(value.slice(PILLAR_VALUE_PREFIX.length) as PillarSlug);
    }
  }

  return { dimensions, pillars };
}
