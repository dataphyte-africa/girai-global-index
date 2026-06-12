"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import { MultiSelectFilter } from "@/components/ui/multi-select-filter";
import { GroupedMultiSelectFilter } from "@/components/ui/grouped-multi-select-filter";
import type { CountryRanking } from "@/lib/girai";
import type { DimensionSlug } from "@/data/2026/taxonomy";
import {
  DIMENSION_FILTER_OPTIONS,
  PILLAR_FILTER_OPTIONS,
} from "@/lib/performance-score";
import {
  buildScoreFilterGroups,
  parseScoreFilterValues,
  scoreFilterSelectedValues,
} from "@/lib/score-filter-options";

export interface PerformanceFilterState {
  regions: string[];
  incomeGroups: string[];
  dimensions: string[];
  pillars: string[];
}

/** @deprecated Use PerformanceFilterState */
export type GeoFilterState = PerformanceFilterState;

export const EMPTY_PERFORMANCE_FILTER: PerformanceFilterState = {
  regions: [],
  incomeGroups: [],
  dimensions: [],
  pillars: [],
};

/** @deprecated Use EMPTY_PERFORMANCE_FILTER */
export const EMPTY_GEO_FILTER = EMPTY_PERFORMANCE_FILTER;

export interface PerformanceFilterOptions {
  regions: string[];
  incomeGroups: string[];
  dimensions: { slug: string; name: string }[];
  pillars: { slug: string; name: string }[];
}

/** Distinct region + income-group values present in the dataset. */
export function getPerformanceFilterOptions(
  data: CountryRanking[]
): PerformanceFilterOptions {
  const regions = new Set<string>();
  const incomeGroups = new Set<string>();
  for (const c of data) {
    if (c.region) regions.add(c.region);
    if (c.incomeGroup) incomeGroups.add(c.incomeGroup);
  }
  return {
    regions: Array.from(regions).sort(),
    incomeGroups: Array.from(incomeGroups).sort(),
    dimensions: DIMENSION_FILTER_OPTIONS,
    pillars: PILLAR_FILTER_OPTIONS,
  };
}

/** @deprecated Use getPerformanceFilterOptions */
export const getGeoFilterOptions = getPerformanceFilterOptions;

/** Apply region + income-group filters (which countries appear). */
export function applyPerformanceFilter(
  data: CountryRanking[],
  filter: PerformanceFilterState
): CountryRanking[] {
  const { regions, incomeGroups } = filter;
  if (regions.length === 0 && incomeGroups.length === 0) return data;
  return data.filter(
    (c) =>
      (regions.length === 0 || regions.includes(c.region)) &&
      (incomeGroups.length === 0 || incomeGroups.includes(c.incomeGroup))
  );
}

/** @deprecated Use applyPerformanceFilter */
export const applyGeoFilter = applyPerformanceFilter;

export interface PerformanceFilterBarProps {
  options: PerformanceFilterOptions;
  value: PerformanceFilterState;
  onChange: (next: PerformanceFilterState) => void;
  matchCount?: number;
  totalCount?: number;
  /** On a dimension detail page — hide dimension filter; pillars slice the matrix. */
  lockedDimensionSlug?: DimensionSlug;
  showDimensions?: boolean;
  showPillars?: boolean;
}

export function PerformanceFilterBar({
  options,
  value,
  onChange,
  matchCount,
  totalCount,
  lockedDimensionSlug,
  showDimensions = true,
  showPillars = true,
}: PerformanceFilterBarProps) {
  const showScoreFilter =
    (showDimensions && !lockedDimensionSlug) || showPillars;
  const scoreGroups = buildScoreFilterGroups({
    showDimensions: showDimensions && !lockedDimensionSlug,
    showPillars,
  });

  const hasFilters =
    value.regions.length > 0 ||
    value.incomeGroups.length > 0 ||
    value.dimensions.length > 0 ||
    value.pillars.length > 0;

  const hint = useMemo(() => {
    if (matchCount === undefined || totalCount === undefined) return null;
    if (!hasFilters) return null;
    return `${matchCount} of ${totalCount} countries`;
  }, [matchCount, totalCount, hasFilters]);

  const scoreSelected = scoreFilterSelectedValues(
    value.dimensions,
    value.pillars
  );

  return (
    <div className="relative z-10 flex flex-wrap items-end gap-3">
      <MultiSelectFilter
        fieldLabel="Region"
        placeholder="All regions"
        options={options.regions}
        selected={value.regions}
        onChange={(regions) => onChange({ ...value, regions })}
        className="w-[200px]"
      />
      <MultiSelectFilter
        fieldLabel="Income group"
        placeholder="All income groups"
        options={options.incomeGroups}
        selected={value.incomeGroups}
        onChange={(incomeGroups) => onChange({ ...value, incomeGroups })}
        className="w-[220px]"
      />
      {showScoreFilter ? (
        <GroupedMultiSelectFilter
          fieldLabel="Index"
          placeholder="Overall GIRAI"
          groups={scoreGroups}
          selected={scoreSelected}
          onChange={(values) => {
            const { dimensions, pillars } = parseScoreFilterValues(values);
            onChange({ ...value, dimensions, pillars });
          }}
          className="w-[240px]"
        />
      ) : null}
      {hasFilters ? (
        <button
          type="button"
          onClick={() => onChange(EMPTY_PERFORMANCE_FILTER)}
          className="mb-0.5 inline-flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-3.5" />
          Reset
        </button>
      ) : null}
      {hint ? (
        <span className="mb-2.5 text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </div>
  );
}

/** @deprecated Use PerformanceFilterBar */
export const GeoFilterBar = PerformanceFilterBar;
