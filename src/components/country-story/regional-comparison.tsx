"use client";

import React from "react";
import { motion } from "motion/react";
import { dimensionColors, getRegionalComparisonNarrative } from "@/lib/narratives";
import { DIMENSIONS } from "@/data/2026/taxonomy";
import { iso3ToIso2 } from "@/data/countries";
import type { CountryRanking } from "@/lib/girai";

interface RegionalComparisonProps {
  country: CountryRanking;
  regionalCountries: CountryRanking[];
}

// Each dimension is scored 0–100 → max stack width is 5 × 100 = 500.
const MAX_TOTAL_SCORE = DIMENSIONS.length * 100;

export function RegionalComparison({ country, regionalCountries }: RegionalComparisonProps) {
  const sortedCountries = [...regionalCountries].sort(
    (a, b) => (b.girai ?? 0) - (a.girai ?? 0)
  );

  const regionalRank =
    sortedCountries.findIndex((c) => c.iso3 === country.iso3) + 1;
  const totalInRegion = sortedCountries.length;

  const comparisonNarrative = getRegionalComparisonNarrative(
    country.name,
    country.region,
    regionalRank,
    totalInRegion
  );

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground mb-4">
            Regional Comparison
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            See how {country.name} compares to other countries in {country.region}{" "}
            across the five GIRAI dimensions.
          </p>
          <p className="text-foreground/80 max-w-3xl mx-auto">
            {comparisonNarrative}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {DIMENSIONS.map((d) => (
            <div key={d.slug} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: dimensionColors[d.slug] }}
              />
              <span className="text-xs text-muted-foreground">{d.name}</span>
            </div>
          ))}
        </motion.div>

        <div className="max-w-4xl mx-auto space-y-3">
          {sortedCountries.map((c, index) => {
            const isCurrentCountry = c.iso3 === country.iso3;
            const iso2 = iso3ToIso2[c.iso3] ?? c.iso3.slice(0, 2).toLowerCase();
            const flagUrl = `https://flagcdn.com/w40/${iso2}.png`;
            const girai = c.girai ?? 0;

            return (
              <motion.div
                key={c.iso3}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className={`relative rounded-lg p-3 transition-all ${
                  isCurrentCountry
                    ? "bg-primary/10 border-2 border-primary shadow-md"
                    : "bg-card border border-border hover:border-primary/30"
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 text-sm font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <img
                    src={flagUrl}
                    alt=""
                    className="w-6 h-4 rounded-sm object-cover shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <span
                    className={`flex-1 text-sm font-medium truncate ${
                      isCurrentCountry ? "text-primary font-medium" : "text-foreground"
                    }`}
                  >
                    {c.name}
                    {isCurrentCountry && (
                      <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </span>
                  <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                    {girai.toFixed(1)}
                  </span>
                </div>

                <div className="h-6 bg-muted rounded-full overflow-hidden flex">
                  {DIMENSIONS.map((d, i) => {
                    const score = c.dimensionScores[d.slug] ?? 0;
                    const widthPercent = (score / MAX_TOTAL_SCORE) * 100;
                    return (
                      <motion.div
                        key={d.slug}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${widthPercent}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.05 + i * 0.1,
                          ease: "easeOut",
                        }}
                        className="h-full relative group"
                        style={{ backgroundColor: dimensionColors[d.slug] }}
                      >
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {d.name}: {score.toFixed(1)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            Showing {totalInRegion} countries in {country.region} sorted by GIRAI Index Score
          </p>
        </motion.div>
      </div>
    </section>
  );
}
