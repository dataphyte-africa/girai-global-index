"use client";

import { useCallback, useMemo, useState } from "react";
import { LayoutGrid, Map as MapIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChoroplethMapClient } from "@/components/choropleth-map-client";
import { RankingDataTable } from "@/components/ranking-data-table";
import {
  PerformanceFilterBar,
  applyPerformanceFilter,
  getPerformanceFilterOptions,
  EMPTY_PERFORMANCE_FILTER,
  type PerformanceFilterState,
} from "@/components/geo-filter-bar";
import {
  buildScoreRankMap,
  resolvePerformanceScore,
} from "@/lib/performance-score";
import type { CountryRanking, DimensionScoreStats } from "@/lib/girai";
import type { DimensionSlug } from "@/data/2026/taxonomy";

export interface DimensionCountriesMapProps {
  rankingData: CountryRanking[];
  dimensionSlug: DimensionSlug;
  dimensionName: string;
  scoreStats: DimensionScoreStats;
}

export function DimensionCountriesMap({
  rankingData,
  dimensionSlug,
  dimensionName,
  scoreStats,
}: DimensionCountriesMapProps) {
  // The map keeps its own filter, independent of the table's built-in filters.
  const [mapFilter, setMapFilter] = useState<PerformanceFilterState>(
    EMPTY_PERFORMANCE_FILTER
  );
  const options = useMemo(
    () => getPerformanceFilterOptions(rankingData),
    [rankingData]
  );
  const mapData = useMemo(
    () => applyPerformanceFilter(rankingData, mapFilter),
    [rankingData, mapFilter]
  );

  const getScore = useCallback(
    (c: CountryRanking) =>
      resolvePerformanceScore(
        c,
        { dimensions: [], pillars: mapFilter.pillars },
        { lockedDimensionSlug: dimensionSlug }
      ),
    [mapFilter.pillars, dimensionSlug]
  );

  const rankMap = useMemo(
    () => buildScoreRankMap(mapData, getScore),
    [mapData, getScore]
  );

  const getRank = useCallback(
    (c: CountryRanking) =>
      mapFilter.pillars.length > 0
        ? rankMap.get(c.iso3) ?? null
        : c.dimensionRanksGlobal[dimensionSlug] ?? null,
    [mapFilter.pillars.length, rankMap, dimensionSlug]
  );

  const statItems = [
    {
      label: "Global average score",
      value:
        scoreStats.globalAverage !== null
          ? scoreStats.globalAverage.toFixed(1)
          : "—",
      sub: "Mean across all scored countries",
    },
    {
      label: "Highest score",
      value: scoreStats.highest ? scoreStats.highest.score.toFixed(1) : "—",
      sub: scoreStats.highest ? scoreStats.highest.name : "—",
    },
    {
      label: "Lowest score",
      value: scoreStats.lowest ? scoreStats.lowest.score.toFixed(1) : "—",
      sub: scoreStats.lowest ? scoreStats.lowest.name : "—",
    },
    {
      label: "Countries above average",
      value: String(scoreStats.aboveAverage),
      sub: `of ${scoreStats.countriesScored} scored`,
    },
  ];

  return (
    <section className="w-full bg-muted/30 px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <Tabs defaultValue="map" className="w-full">
          <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <h2 className="text-3xl md:text-4xl lg:text-5xl max-w-2xl font-medium leading-tight">
              <span className="text-foreground">How </span>
              <span className="text-primary">Countries Perform</span>
              <span className="text-foreground"> on {dimensionName}</span>
            </h2>

            <TabsList className="h-10 self-start rounded-full border border-border bg-background p-1 shadow-sm md:self-end">
              <TabsTrigger
                value="map"
                className="gap-1.5 rounded-full px-4 text-sm data-[state=active]:bg-muted data-[state=active]:shadow-none"
              >
                <MapIcon className="size-4" />
                Map
              </TabsTrigger>
              <TabsTrigger
                value="list"
                className="gap-1.5 rounded-full px-4 text-sm data-[state=active]:bg-muted data-[state=active]:shadow-none"
              >
                <LayoutGrid className="size-4" />
                List
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="map" className="mt-0">
            <div className="mb-4">
              <PerformanceFilterBar
                options={options}
                value={mapFilter}
                onChange={setMapFilter}
                matchCount={mapData.length}
                totalCount={rankingData.length}
                lockedDimensionSlug={dimensionSlug}
                showDimensions={false}
              />
            </div>
            <ChoroplethMapClient
              rankingData={mapData}
              getScore={getScore}
              getRank={getRank}
            />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <RankingDataTable data={rankingData} dimensionSlug={dimensionSlug} />
          </TabsContent>
        </Tabs>

        {/* Stat bar */}
        <div className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border md:grid-cols-4">
          {statItems.map((stat) => (
            <div key={stat.label} className="bg-card p-5">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                {stat.label}
              </p>
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-foreground md:text-3xl">
                {stat.value}
              </p>
              <p className="mt-0.5 truncate text-xs text-muted-foreground">
                {stat.sub}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
