"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { countryFlags } from "@/data/countries";
import type { CountryRanking } from "@/lib/girai";

interface GlobalPerformanceSectionProps {
  topCountries: CountryRanking[];
  bottomCountries: CountryRanking[];
}

// Trophy/medal icons for top 3
const rankIcons: Record<number, string> = {
  1: "🥇",
  2: "🥈",
  3: "🥉",
};

function CountryRow({
  country,
  index,
  isTop,
  maxScore,
}: {
  country: CountryRanking;
  index: number;
  isTop: boolean;
  maxScore: number;
}) {
  const flag = countryFlags[country.iso3] || "🏳️";
  const score = country.girai ?? 0;
  const rank = country.rankGlobal ?? 0;
  const scorePercent = (score / maxScore) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, x: isTop ? -20 : 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      viewport={{ once: false }}
      className="flex items-center gap-3 p-2.5 group bg-card rounded-lg shadow-sm"
    >
      <div className="flex text-center gap-1.5 w-[50px] h-[50px] bg-muted rounded-lg justify-center items-center p-3">
        {rankIcons[rank] ? (
          <span className="text-lg">{rankIcons[rank]}</span>
        ) : (
          <span className="text-sm font-semibold text-muted-foreground w-6">
            {rank}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2 w-full ">
        <div className="flex items-center">
          <div className="flex items-center gap-2 min-w-[130px]">
            <span className="text-xl">{flag}</span>
            <span className="text-sm font-medium truncate ">
              {country.name}
            </span>
          </div>
        </div>

        <div className="flex h-2 bg-muted rounded-full overflow-hidden">
          <motion.div
            className={`h-full rounded-full ${
              isTop
                ? "bg-linear-to-r from-indigo-400 to-indigo-500"
                : "bg-linear-to-r from-slate-300 to-slate-400"
            }`}
            initial={{ width: 0 }}
            whileInView={{ width: `${scorePercent}%` }}
            transition={{
              duration: 0.8,
              delay: index * 0.05 + 0.2,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
          />
        </div>
      </div>

      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: index * 0.05 + 0.6 }}
        viewport={{ once: true }}
        className="text-sm font-semibold text-foreground min-w-[40px] text-right"
      >
        {score.toFixed(0)}
      </motion.span>
    </motion.div>
  );
}

export function GlobalPerformanceSection({
  topCountries,
  bottomCountries,
}: GlobalPerformanceSectionProps) {
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: false, amount: 0.5 });

  const maxScore = Math.max(
    ...topCountries.map((c) => c.girai ?? 0),
    100
  );

  return (
    <section
      id="top-takeaways"
      className="w-full px-4 py-16 md:py-24 bg-muted/30"
    >
      <div className="mx-auto max-w-6xl">
        <div ref={headingRef} className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight md:text-4xl"
          >
            Global Performance{" "}
            <span className="text-primary">Overview</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-3 text-muted-foreground max-w-xl mx-auto"
          >
            Examining leaders and lagging positions in responsible AI governance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className=" "
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold">Top 10 Countries</h3>
            </div>

            <div className="space-y-3">
              {topCountries.slice(0, 10).map((country, index) => (
                <CountryRow
                  key={country.iso3}
                  country={country}
                  index={index}
                  isTop={true}
                  maxScore={maxScore}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className=""
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-semibold">Bottom 10 Countries</h3>
            </div>

            <div className="space-y-3">
              {bottomCountries.slice(0, 10).map((country, index) => (
                <CountryRow
                  key={country.iso3}
                  country={country}
                  index={index}
                  isTop={false}
                  maxScore={maxScore}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
