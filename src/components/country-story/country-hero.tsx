"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CountryMapWithGradient } from "./country-map-svg";
import { Button } from "@/components/ui/button";
import { iso3ToIso2 } from "@/data/countries";
import { PILLARS } from "@/data/2026/taxonomy";
import { getIndexNarrative, getOrdinalSuffix, pillarColors } from "@/lib/narratives";
import type { CountryRanking } from "@/lib/girai";

interface CountryHeroProps {
  country: CountryRanking;
}

export function CountryHero({ country }: CountryHeroProps) {
  const iso2 = iso3ToIso2[country.iso3] ?? country.iso3.slice(0, 2).toLowerCase();
  const flagUrl = `https://flagcdn.com/w160/${iso2}.png`;

  const indexScore = country.girai ?? 0;
  const indexNarrative = getIndexNarrative(country.name, indexScore);

  return (
    <section className="relative min-h-[80vh] overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-primary/10 dark:from-primary/10 dark:via-background dark:to-primary/20" />

      <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
        <div className="absolute inset-0 bg-linear-to-l from-primary to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Index
            </Button>
          </Link>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[60vh]">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex items-center gap-4"
            >
              <img
                src={flagUrl}
                alt={`${country.name} flag`}
                className="h-16 w-auto rounded-md shadow-lg object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div>
                <h1 className="text-3xl md:text-4xl font-medium text-foreground">
                  {country.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                  {country.region}
                  {country.subregion ? ` • ${country.subregion}` : ""}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-baseline gap-4">
                <span className="text-7xl md:text-8xl font-bold text-primary tabular-nums">
                  {indexScore.toFixed(1)}
                </span>
                <div className="space-y-1">
                  <span
                    className="inline-block px-3 py-1 rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: indexNarrative.color }}
                  >
                    {indexNarrative.label}
                  </span>
                  <p className="text-sm text-muted-foreground">GIRAI Index Score</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                {country.rankGlobal !== null && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                    <span className="text-2xl font-medium text-primary">
                      {getOrdinalSuffix(country.rankGlobal)}
                    </span>
                    <span className="text-sm text-muted-foreground">Global Rank</span>
                  </div>
                )}
                {country.rankRegional !== null && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border">
                    <span className="text-2xl font-medium text-foreground">
                      {getOrdinalSuffix(country.rankRegional)}
                    </span>
                    <span className="text-sm text-muted-foreground">in {country.region}</span>
                  </div>
                )}
                {country.rankIncomeGroup !== null && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border">
                    <span className="text-2xl font-medium text-foreground">
                      {getOrdinalSuffix(country.rankIncomeGroup)}
                    </span>
                    <span className="text-sm text-muted-foreground">{country.incomeGroup}</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-xl"
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                {indexNarrative.narrative}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="grid grid-cols-3 gap-4"
            >
              {PILLARS.map((p) => (
                <QuickStat
                  key={p.slug}
                  label={p.name}
                  value={country.pillarScores[p.slug] ?? 0}
                  color={pillarColors[p.slug]}
                />
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 blur-3xl opacity-30 animate-pulse">
                <CountryMapWithGradient
                  iso3={country.iso3}
                  gradientColors={["#6D6BFF", "#A4F9E9"]}
                  width={500}
                  height={400}
                  className="w-full h-auto"
                  strokeWidth={0}
                />
              </div>
              <CountryMapWithGradient
                iso3={country.iso3}
                gradientColors={["#6D6BFF", "#A4FCE9"]}
                gradientId="heroMapGradient"
                width={500}
                height={400}
                className="w-full h-auto relative z-10 drop-shadow-2xl"
                strokeWidth={0}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2"
        >
          <div className="w-1 h-2 rounded-full bg-muted-foreground/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}

function QuickStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div className="p-3 rounded-lg bg-card border border-border">
      <div className="text-2xl font-bold tabular-nums" style={{ color }}>
        {value.toFixed(1)}
      </div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </div>
  );
}
