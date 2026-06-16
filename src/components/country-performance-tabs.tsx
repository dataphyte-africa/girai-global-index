"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
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
import type { CountryRanking } from "@/lib/girai";

export function CountryPerformanceTabs({
  rankingData,
}: {
  rankingData: CountryRanking[];
}) {
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: false, amount: 0.4 });
  const [tab, setTab] = useState<"map" | "list">("list");
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
      resolvePerformanceScore(c, {
        dimensions: mapFilter.dimensions,
        pillars: mapFilter.pillars,
      }),
    [mapFilter.dimensions, mapFilter.pillars]
  );

  const rankMap = useMemo(
    () => buildScoreRankMap(mapData, getScore),
    [mapData, getScore]
  );

  const getRank = useCallback(
    (c: CountryRanking) => rankMap.get(c.iso3) ?? c.rankGlobal ?? null,
    [rankMap]
  );

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as "map" | "list")} className="w-full">
      <div
        ref={headingRef}
        className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
      >
        <div className="flex flex-col gap-2">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-medium leading-tight md:text-4xl"
          >
            Responsible <span className="text-primary">AI Performance</span>
            <br className="hidden sm:block" /> Across Countries
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="max-w-xl text-muted-foreground"
          >
            Switch between an interactive map and a full list to explore
            dimension and pillar scores for every country in the 2026 GIRAI
            edition.
          </motion.p>
        </div>

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
          />
        </div>
        <ChoroplethMapClient
          rankingData={mapData}
          getScore={getScore}
          getRank={getRank}
        />
      </TabsContent>

      <TabsContent value="list" className="mt-0">
        <RankingDataTable data={rankingData} />
      </TabsContent>
    </Tabs>
  );
}
