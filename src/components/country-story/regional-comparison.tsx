"use client";

import React from "react";
import { motion } from "motion/react";
import { indicatorColors, indicatorLabels, getRegionalComparisonNarrative } from "@/lib/narratives";
import type { FullRankingData } from "@/data/countries";
import { iso3ToIso2 } from "@/data/countries";

interface RegionalComparisonProps {
  country: FullRankingData;
  regionalCountries: FullRankingData[];
}

// Indicator configuration for the stacked bar
const indicators = [
  { key: "governmentFrameworks" as const, getPillar: true },
  { key: "governmentActions" as const, getPillar: true },
  { key: "nonStateActors" as const, getPillar: true },
  { key: "humanRightsAI" as const, getPillar: false },
  { key: "responsibleAIGovernance" as const, getPillar: false },
  { key: "responsibleAICapacities" as const, getPillar: false },
];

function getIndicatorScore(country: FullRankingData, key: string, isPillar: boolean): number {
  if (isPillar) {
    return country.pillarScores[key as keyof typeof country.pillarScores] || 0;
  }
  return country.dimensionScores[key as keyof typeof country.dimensionScores] || 0;
}

export function RegionalComparison({ country, regionalCountries }: RegionalComparisonProps) {
  // Sort regional countries by index score (descending)
  const sortedCountries = [...regionalCountries].sort((a, b) => b.indexScore - a.indexScore);
  
  // Find current country's regional rank
  const regionalRank = sortedCountries.findIndex((c) => c.iso3 === country.iso3) + 1;
  const totalInRegion = sortedCountries.length;
  
  // Calculate max total score for scaling (sum of all 6 indicators, max 600)
  const maxTotalScore = 600;
  
  // Get narrative
  const comparisonNarrative = getRegionalComparisonNarrative(
    country.country,
    country.giraiRegion,
    regionalRank,
    totalInRegion
  );

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Regional Comparison
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
            See how {country.country} compares to other countries in {country.giraiRegion} across all six GIRAI indicators.
          </p>
          <p className="text-foreground/80 max-w-3xl mx-auto">
            {comparisonNarrative}
          </p>
        </motion.div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-8"
        >
          {indicators.map(({ key }) => (
            <div key={key} className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-sm"
                style={{ backgroundColor: indicatorColors[key] }}
              />
              <span className="text-xs text-muted-foreground">
                {indicatorLabels[key]}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Stacked bar chart */}
        <div className="max-w-4xl mx-auto space-y-3">
          {sortedCountries.map((c, index) => {
            const isCurrentCountry = c.iso3 === country.iso3;
            const iso2 = iso3ToIso2[c.iso3] ?? c.iso3.slice(0, 2).toLowerCase();
            const flagUrl = `https://flagcdn.com/w40/${iso2}.png`;

            // Calculate total of all indicator scores
            const totalScore = indicators.reduce(
              (sum, { key, getPillar }) => sum + getIndicatorScore(c, key, getPillar),
              0
            );

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
                {/* Country info row */}
                <div className="flex items-center gap-3 mb-2">
                  {/* Rank */}
                  <span className="w-8 text-sm font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  
                  {/* Flag */}
                  <img
                    src={flagUrl}
                    alt=""
                    className="w-6 h-4 rounded-sm object-cover shadow-sm"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  
                  {/* Country name */}
                  <span
                    className={`flex-1 text-sm font-medium truncate ${
                      isCurrentCountry ? "text-primary font-semibold" : "text-foreground"
                    }`}
                  >
                    {c.country}
                    {isCurrentCountry && (
                      <span className="ml-2 text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </span>
                  
                  {/* Total score */}
                  <span className="text-sm font-semibold text-muted-foreground tabular-nums">
                    {c.indexScore.toFixed(1)}
                  </span>
                </div>

                {/* Stacked bar */}
                <div className="h-6 bg-muted rounded-full overflow-hidden flex">
                  {indicators.map(({ key, getPillar }, i) => {
                    const score = getIndicatorScore(c, key, getPillar);
                    // Each indicator is max 100, so we scale by maxTotalScore (600)
                    const widthPercent = (score / maxTotalScore) * 100;

                    return (
                      <motion.div
                        key={key}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${widthPercent}%` }}
                        viewport={{ once: true }}
                        transition={{
                          duration: 0.6,
                          delay: index * 0.05 + i * 0.1,
                          ease: "easeOut",
                        }}
                        className="h-full relative group"
                        style={{ backgroundColor: indicatorColors[key] }}
                      >
                        {/* Tooltip on hover */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {indicatorLabels[key]}: {score.toFixed(1)}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Additional context */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-muted-foreground">
            Showing {totalInRegion} countries in {country.giraiRegion} sorted by GIRAI Index Score
          </p>
        </motion.div>
      </div>
    </section>
  );
}
