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

  const averageScore = scoreStats.globalAverage;
  const averagePct =
    averageScore !== null ? Math.max(0, Math.min(100, averageScore)) : 0;

  return (
    <section className="w-full bg-white dark:bg-muted/20 px-4 py-16 md:px-8 md:py-24">
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

        {/* Stat cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="flex flex-col rounded-2xl border border-border bg-[linear-gradient(to_right,#EEF2FF,#FAF5FF)] p-6 dark:bg-none dark:bg-muted/40">
            <p className="text-sm text-muted-foreground">Global Average Score</p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-primary md:text-5xl">
              {averageScore !== null ? Math.round(averageScore) : "—"}
            </p>
            <div className="mt-auto pt-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary"
                  style={{ width: `${averagePct}%` }}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col rounded-2xl border border-border bg-[linear-gradient(to_right,#EEF2FF,#FAF5FF)] p-6 dark:bg-none dark:bg-muted/40">
            <p className="text-sm text-muted-foreground">Highest Score</p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-primary md:text-5xl">
              {scoreStats.highest ? Math.round(scoreStats.highest.score) : "—"}
            </p>
            <p className="mt-auto pt-6 text-sm text-muted-foreground">
              {scoreStats.highest ? (
                <>
                  <span className="font-semibold text-foreground">
                    {scoreStats.highest.name}
                  </span>{" "}
                  leads globally
                </>
              ) : (
                "No scored countries"
              )}
            </p>
          </div>

          <div className="flex flex-col rounded-2xl border border-border bg-[linear-gradient(to_right,#EEF2FF,#FAF5FF)] p-6 dark:bg-none dark:bg-muted/40">
            <p className="text-sm text-muted-foreground">Countries Assessed</p>
            <p className="mt-2 text-4xl font-bold tabular-nums text-primary md:text-5xl">
              {scoreStats.countriesScored}
            </p>
            <p className="mt-auto pt-6 text-sm text-muted-foreground">
              Comprehensive global coverage
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
