"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { MoveDownRight, MoveUpRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { flagUrlForIso3 } from "@/lib/geo-iso";
import { DIMENSIONS } from "@/data/2026/taxonomy";
import { getOrdinalSuffix } from "@/lib/narratives";
import type { CountryRanking } from "@/lib/girai";

interface RegionCountryExplorerProps {
  regionName: string;
  countries: CountryRanking[];
}

const ACCENT = "#6c5cff";

const BAR_TRACK_STYLE: React.CSSProperties = {
  backgroundColor: "#eef0f6",
};

export function RegionCountryExplorer({
  regionName,
  countries,
}: RegionCountryExplorerProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: false, amount: 0.4 });

  const ordered = useMemo(
    () =>
      [...countries].sort((a, b) => {
        const ra = a.rankRegional ?? Number.POSITIVE_INFINITY;
        const rb = b.rankRegional ?? Number.POSITIVE_INFINITY;
        if (ra !== rb) return ra - rb;
        return (b.girai ?? 0) - (a.girai ?? 0);
      }),
    [countries]
  );

  const regionalAvg = useMemo(() => {
    const scores = ordered
      .map((c) => c.girai)
      .filter((s): s is number => s !== null);
    if (scores.length === 0) return 0;
    return scores.reduce((sum, s) => sum + s, 0) / scores.length;
  }, [ordered]);

  const [activeIso3, setActiveIso3] = useState(() => ordered[0]?.iso3 ?? "");
  const [query, setQuery] = useState("");

  const active = useMemo(
    () => ordered.find((c) => c.iso3 === activeIso3) ?? ordered[0],
    [ordered, activeIso3]
  );

  const q = query.trim().toLowerCase();
  const filtered = q
    ? ordered.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.iso3.toLowerCase().includes(q) ||
          c.subregion.toLowerCase().includes(q)
      )
    : ordered;

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
            className="text-3xl font-bold tracking-tight md:text-4xl"
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
            Select or search for a country to view its Global Index score,
            regional standing, and performance across all five dimensions.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,360px)_1fr]">
          {/* Country list */}
          <div className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-sm">
            <div className="p-4 pb-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search countries"
                  className="h-12 rounded-2xl border-transparent bg-muted/50 pl-10 text-sm shadow-none focus-visible:border-border"
                />
              </div>
            </div>
            <ul className="max-h-[520px] overflow-y-auto px-1 pb-2">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No countries match &ldquo;{query}&rdquo;.
                </li>
              ) : (
                filtered.map((c) => {
                  const selected = c.iso3 === active?.iso3;
                  const flagUrl = flagUrlForIso3(c.iso3);
                  const score = c.girai;
                  const aboveAvg =
                    score !== null ? score >= regionalAvg : false;
                  return (
                    <li key={c.iso3}>
                      <button
                        type="button"
                        onClick={() => setActiveIso3(c.iso3)}
                        className={cn(
                          "flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left transition-colors",
                          selected
                            ? "border-l-[var(--accent-color)] bg-[color-mix(in_srgb,var(--accent-color)_8%,transparent)]"
                            : "border-transparent hover:bg-muted/50"
                        )}
                        style={
                          { "--accent-color": ACCENT } as React.CSSProperties
                        }
                      >
                        <span className="relative h-8 w-10 shrink-0 overflow-hidden rounded-md border border-border/80 bg-muted">
                          {flagUrl ? (
                            <Image
                              src={flagUrl}
                              alt=""
                              fill
                              sizes="40px"
                              className="object-cover"
                              unoptimized
                            />
                          ) : null}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-semibold text-foreground">
                            {c.name}
                          </span>
                          <span className="block truncate text-xs text-muted-foreground">
                            {c.rankRegional !== null
                              ? `#${c.rankRegional} · ${regionName}`
                              : regionName}
                          </span>
                        </span>
                        {score !== null && (
                          <span
                            className={cn(
                              "flex shrink-0 items-center gap-1 text-sm font-bold tabular-nums",
                              aboveAvg ? "text-emerald-600" : "text-rose-500"
                            )}
                          >
                            {/* {aboveAvg ? (
                              <MoveUpRight className="size-3.5" />
                            ) : (
                              <MoveDownRight className="size-3.5" />
                            )} */}
                            <span style={{ color: ACCENT }}>
                              {score.toFixed(0)}
                            </span>
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </div>

          {/* Detail card */}
          {active ? <CountryDetail country={active} /> : null}
        </div>
      </div>
    </section>
  );
}

function CountryDetail({ country }: { country: CountryRanking }) {
  const score = country.girai;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={country.iso3}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="overflow-hidden rounded-3xl border border-border/70 bg-card shadow-md"
      >
        <div className="p-6 md:p-7">
          {/* Global Index header */}
          <div className="rounded-2xl bg-[#ede9fe]/70 px-6 py-5 dark:bg-violet-950/30 flex flex-col items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground">
              {country.name} Global Index
            </p>
            <p className="mt-1 text-5xl font-bold tabular-nums tracking-tight text-foreground">
              {score === null ? "—" : score.toFixed(2)}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {country.rankGlobal !== null && (
                <RankChip
                  label="Global"
                  rank={country.rankGlobal}
                  variant="global"
                />
              )}
              {country.rankRegional !== null && (
                <RankChip
                  label="Regional"
                  rank={country.rankRegional}
                  variant="regional"
                />
              )}
            </div>
          </div>

          {/* Dimension bars */}
          <div className="mt-8">
            <h4 className="mb-5 text-base font-bold text-foreground">
              Dimension-Level Performance
            </h4>
            <div className="flex flex-col gap-5">
              {DIMENSIONS.map((d, idx) => {
                const value = country.dimensionScores[d.slug] ?? null;
                const pct = value === null ? 0 : Math.min(value, 100);
                const labelFitsInside = pct >= 18;
                return (
                  <div key={d.slug}>
                    <p className="mb-1 text-sm font-medium text-foreground/90">
                      {d.name}
                    </p>
                    <div
                      className="relative h-[26px] w-full overflow-hidden rounded-full"
                      style={BAR_TRACK_STYLE}
                    >
                      <motion.div
                        className="absolute inset-y-0 left-0 flex items-center justify-end rounded-full pr-2.5"
                        style={{ backgroundColor: ACCENT }}
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{
                          duration: 0.7,
                          delay: idx * 0.06,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      >
                        {labelFitsInside && value !== null && (
                          <span className="text-xs font-semibold tabular-nums text-white">
                            {value.toFixed(1)}
                          </span>
                        )}
                      </motion.div>
                      {!labelFitsInside && value !== null && (
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-semibold tabular-nums text-foreground">
                          {value.toFixed(1)}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <Link
            href={`/countries/${country.iso3}`}
            className="mt-8 flex w-full items-center justify-center rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Read story
          </Link>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const CHIP_STYLES = {
  global: "bg-[#7C3AED]/12 text-[#7C3AED] dark:text-violet-300",
  regional: "bg-[#3B82F6]/12 text-[#3B82F6] dark:text-sky-300",
} as const;

function RankChip({
  label,
  rank,
  variant,
}: {
  label: string;
  rank: number;
  variant: keyof typeof CHIP_STYLES;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        CHIP_STYLES[variant]
      )}
    >
      {label}: {getOrdinalSuffix(rank)}
    </span>
  );
}
