"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { LayoutGrid, Map as MapIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChoroplethMapClient } from "@/components/choropleth-map-client";
import { RankingDataTable } from "@/components/ranking-data-table";
import type { CountryRanking } from "@/lib/girai";

export function CountryPerformanceTabs({
  rankingData,
}: {
  rankingData: CountryRanking[];
}) {
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: false, amount: 0.4 });
  const [tab, setTab] = useState<"map" | "list">("map");

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
            className="text-3xl font-bold leading-tight md:text-4xl"
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
            Switch between an interactive map and a full ranking to explore
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
        <ChoroplethMapClient rankingData={rankingData} />
      </TabsContent>

      <TabsContent value="list" className="mt-0">
        <RankingDataTable data={rankingData} />
      </TabsContent>
    </Tabs>
  );
}
