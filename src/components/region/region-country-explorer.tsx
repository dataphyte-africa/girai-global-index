"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { CountryHeatmapTable } from "@/components/country-heatmap-table";
import type { CountryRanking } from "@/lib/girai";

interface RegionCountryExplorerProps {
  regionName: string;
  /** Countries already filtered to this region by the page. */
  countries: CountryRanking[];
}

export function RegionCountryExplorer({
  regionName,
  countries,
}: RegionCountryExplorerProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: false, amount: 0.4 });

  return (
    <section
      id="results"
      className="w-full scroll-mt-24 bg-[#f8f9ff] px-4 py-14 dark:bg-muted/20 md:px-8 md:py-20"
    >
      <div className="mx-auto max-w-6xl">
        <div ref={headingRef} className="mb-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-medium tracking-tight md:text-4xl"
          >
            <span className="text-primary">Explore</span> a Country&apos;s
            Performance
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base"
          >
            Search and compare every country in {regionName} across all five
            dimensions and three pillars, colour-coded by score.
          </motion.p>
        </div>

        <CountryHeatmapTable data={countries} />
      </div>
    </section>
  );
}
