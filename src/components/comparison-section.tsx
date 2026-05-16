"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Check, ChevronDown, Plus, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type {
  CountryRanking,
  PillarSlug,
  ScoreAggregates,
} from "@/lib/girai";
import { countryFlags } from "@/data/countries";
import { DIMENSIONS, INDICATORS, PILLARS } from "@/data/2026/taxonomy";

// ---------------------------------------------------------------------------
// Types

type EntityRef =
  | { kind: "country"; iso3: string }
  | { kind: "region"; name: string }
  | null;

interface ResolvedEntity {
  id: string;
  kind: "country" | "region";
  label: string;
  sub?: string;
  flag?: string;
  girai: number | null;
  dimensions: Record<string, number | null>;
  indicators: Record<string, number | null>;
}

// Palette per slot index — must stay stable as slots are added/removed.
const SLOT_PALETTE = [
  {
    dot: "bg-primary",
    bar: "from-primary to-primary/70",
    text: "text-primary",
    soft: "bg-primary/10",
    ring: "ring-primary/40",
  },
  {
    dot: "bg-sky-500",
    bar: "from-sky-500 to-sky-400",
    text: "text-sky-600 dark:text-sky-400",
    soft: "bg-sky-500/10",
    ring: "ring-sky-500/40",
  },
  {
    dot: "bg-amber-500",
    bar: "from-amber-500 to-amber-400",
    text: "text-amber-600 dark:text-amber-400",
    soft: "bg-amber-500/10",
    ring: "ring-amber-500/40",
  },
  {
    dot: "bg-emerald-500",
    bar: "from-emerald-500 to-emerald-400",
    text: "text-emerald-600 dark:text-emerald-400",
    soft: "bg-emerald-500/10",
    ring: "ring-emerald-500/40",
  },
  {
    dot: "bg-rose-500",
    bar: "from-rose-500 to-rose-400",
    text: "text-rose-600 dark:text-rose-400",
    soft: "bg-rose-500/10",
    ring: "ring-rose-500/40",
  },
] as const;

const PILLAR_BADGES: Record<
  PillarSlug,
  { abbr: string; className: string }
> = {
  "ai-policy": {
    abbr: "AP",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  "cso-engagement": {
    abbr: "CSO",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  "enabling-conditions": {
    abbr: "EC",
    className:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  },
};

// ---------------------------------------------------------------------------
// Helpers

function refKey(ref: EntityRef): string {
  if (!ref) return "none";
  return `${ref.kind}:${ref.kind === "country" ? ref.iso3 : ref.name}`;
}

function resolveRef(
  ref: EntityRef,
  countryMap: Map<string, CountryRanking>,
  regionMap: Map<string, ScoreAggregates>
): ResolvedEntity | null {
  if (!ref) return null;
  if (ref.kind === "country") {
    const c = countryMap.get(ref.iso3);
    if (!c) return null;
    return {
      id: `country:${c.iso3}`,
      kind: "country",
      label: c.name,
      sub: c.region,
      flag: countryFlags[c.iso3] || "🏳️",
      girai: c.girai,
      dimensions: c.dimensionScores,
      indicators: c.indicatorScores,
    };
  }
  const agg = regionMap.get(ref.name);
  if (!agg) return null;
  return {
    id: `region:${ref.name}`,
    kind: "region",
    label: ref.name,
    sub: "Regional average",
    girai: agg.girai,
    dimensions: agg.dimensions,
    indicators: agg.indicators,
  };
}

// ---------------------------------------------------------------------------
// Grouped selector — regions on top, countries searchable below, plus a None
// option to clear the slot without removing it.

interface SelectorProps {
  value: EntityRef;
  onChange: (next: EntityRef) => void;
  countries: CountryRanking[];
  regions: string[];
  /** Refs already chosen in other slots (to disable). */
  disabledKeys: Set<string>;
  paletteIndex: number;
}

function EntitySelector({
  value,
  onChange,
  countries,
  regions,
  disabledKeys,
  paletteIndex,
}: SelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const palette = SLOT_PALETTE[paletteIndex % SLOT_PALETTE.length];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const selectedLabel = (() => {
    if (!value) return null;
    if (value.kind === "country") {
      const c = countries.find((x) => x.iso3 === value.iso3);
      return c ? { label: c.name, flag: countryFlags[c.iso3] || "🏳️" } : null;
    }
    return { label: value.name, flag: undefined };
  })();

  const q = query.trim().toLowerCase();
  const filteredCountries = q
    ? countries.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.iso3.toLowerCase().includes(q) ||
          c.region.toLowerCase().includes(q)
      )
    : countries;
  const filteredRegions = q
    ? regions.filter((r) => r.toLowerCase().includes(q))
    : regions;

  const isDisabled = (ref: EntityRef) => {
    const k = refKey(ref);
    return k !== refKey(value) && disabledKeys.has(k);
  };

  const select = (ref: EntityRef) => {
    onChange(ref);
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-11 w-full items-center justify-between gap-2 rounded-full border bg-background px-4 text-sm transition-all",
          "hover:border-foreground/30",
          open && `ring-2 ring-offset-2 ${palette.ring}`
        )}
      >
        <span className="flex items-center gap-2 truncate">
          <span className={cn("h-2.5 w-2.5 rounded-full shrink-0", palette.dot)} />
          {selectedLabel ? (
            <>
              {selectedLabel.flag && (
                <span className="text-base leading-none">
                  {selectedLabel.flag}
                </span>
              )}
              <span className="truncate font-medium">{selectedLabel.label}</span>
            </>
          ) : (
            <span className="text-muted-foreground">None</span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 opacity-50 transition-transform",
            open && "rotate-180"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 mt-2 w-full min-w-[260px] origin-top rounded-xl border bg-popover text-popover-foreground shadow-xl"
          >
            <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Regions
            </div>
            <div className="px-1 pb-2">
              <button
                type="button"
                onClick={() => select(null)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors hover:bg-accent",
                  value === null && "bg-accent/50"
                )}
              >
                <span className="text-muted-foreground">None</span>
                {value === null && <Check className="h-4 w-4 text-primary" />}
              </button>
              {filteredRegions.map((r) => {
                const ref: EntityRef = { kind: "region", name: r };
                const selected =
                  value?.kind === "region" && value.name === r;
                const disabled = isDisabled(ref);
                return (
                  <button
                    key={r}
                    type="button"
                    disabled={disabled}
                    onClick={() => select(ref)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-2.5 py-2 text-sm transition-colors",
                      "hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
                      selected && "bg-accent/60"
                    )}
                  >
                    <span className="truncate">{r}</span>
                    {selected && <Check className="h-4 w-4 text-primary" />}
                  </button>
                );
              })}
              {filteredRegions.length === 0 && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  No matching regions
                </div>
              )}
            </div>

            <div className="border-t" />

            <div className="px-3 pt-3 pb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Countries
            </div>
            <div className="px-3 pb-2">
              <div className="flex items-center gap-2 rounded-full bg-muted px-3 py-2">
                <Search className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search countries"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="rounded p-0.5 hover:bg-background/60"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                )}
              </div>
            </div>
            <div className="max-h-[220px] overflow-y-auto px-1 pb-2">
              {filteredCountries.length === 0 ? (
                <div className="px-2 py-2 text-xs text-muted-foreground">
                  No matching countries
                </div>
              ) : (
                filteredCountries.map((c) => {
                  const ref: EntityRef = { kind: "country", iso3: c.iso3 };
                  const selected =
                    value?.kind === "country" && value.iso3 === c.iso3;
                  const disabled = isDisabled(ref);
                  return (
                    <button
                      key={c.iso3}
                      type="button"
                      disabled={disabled}
                      onClick={() => select(ref)}
                      className={cn(
                        "flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors",
                        "hover:bg-accent disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent",
                        selected && "bg-accent/60"
                      )}
                    >
                      <span className="text-base leading-none">
                        {countryFlags[c.iso3] || "🏳️"}
                      </span>
                      <span className="flex-1 truncate text-left">
                        {c.name}
                      </span>
                      {c.rankGlobal !== null && (
                        <span className="text-xs text-muted-foreground">
                          #{c.rankGlobal}
                        </span>
                      )}
                      {selected && (
                        <Check className="h-4 w-4 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dimension comparison card (left)

function DimensionCard({
  entities,
}: {
  entities: ResolvedEntity[];
}) {
  return (
    <div className="bg-card border rounded-2xl p-5 md:p-6 shadow-sm">
      <h4 className="text-base font-semibold mb-6">Dimension scores</h4>

      <div className="space-y-7">
        {DIMENSIONS.map((d, idx) => (
          <div key={d.slug}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-sm font-medium text-foreground">
                {d.name}
              </span>
            </div>
            <div className="space-y-1.5">
              {entities.length === 0 && (
                <div className="h-2 rounded-full bg-muted/60" />
              )}
              {entities.map((e, slotIdx) => {
                const palette = SLOT_PALETTE[slotIdx % SLOT_PALETTE.length];
                const value = e.dimensions[d.slug] ?? null;
                const pct = value === null ? 0 : Math.min(value, 100);
                return (
                  <div
                    key={e.id}
                    className="flex items-center gap-3"
                    title={`${e.label}: ${value === null ? "—" : value.toFixed(1)}`}
                  >
                    <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-muted/60">
                      <motion.div
                        className={cn(
                          "absolute inset-y-0 left-0 rounded-full bg-linear-to-r",
                          palette.bar
                        )}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: false, amount: 0.3 }}
                        transition={{
                          duration: 0.7,
                          delay: idx * 0.05 + slotIdx * 0.08,
                          ease: [0.25, 0.1, 0.25, 1],
                        }}
                      />
                    </div>
                    <span
                      className={cn(
                        "min-w-[44px] text-right text-xs font-semibold tabular-nums",
                        palette.text
                      )}
                    >
                      {value === null ? "—" : value.toFixed(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Indicator table (right)

function IndicatorTable({
  entities,
}: {
  entities: ResolvedEntity[];
}) {
  return (
    <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b flex items-center justify-between">
        <h4 className="text-base font-semibold">Indicators</h4>
        <span className="text-xs text-muted-foreground">
          {INDICATORS.length} indicators
        </span>
      </div>
      <div className="max-h-[640px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-card z-10 shadow-[0_1px_0_var(--border)]">
            <TableRow className="hover:bg-transparent">
              <TableHead className="min-w-[200px]">Indicator</TableHead>
              {entities.length === 0 && (
                <TableHead className="text-right text-muted-foreground italic font-normal">
                  Pick something to compare
                </TableHead>
              )}
              {entities.map((e, idx) => {
                const palette = SLOT_PALETTE[idx % SLOT_PALETTE.length];
                return (
                  <TableHead key={e.id} className="text-right">
                    <span className="inline-flex items-center gap-1.5">
                      <span
                        className={cn("h-2 w-2 rounded-full", palette.dot)}
                      />
                      <span className="truncate max-w-[120px]">{e.label}</span>
                    </span>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {INDICATORS.map((ind) => {
              const badge = PILLAR_BADGES[ind.pillar];
              return (
                <TableRow key={ind.slug}>
                  <TableCell className="whitespace-normal">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{ind.name}</span>
                      <span
                        className={cn(
                          "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                          badge.className
                        )}
                      >
                        {badge.abbr}
                      </span>
                    </div>
                  </TableCell>
                  {entities.length === 0 && <TableCell />}
                  {entities.map((e, idx) => {
                    const palette = SLOT_PALETTE[idx % SLOT_PALETTE.length];
                    const value = e.indicators[ind.slug] ?? null;
                    return (
                      <TableCell
                        key={e.id}
                        className={cn(
                          "text-right tabular-nums font-medium",
                          palette.text
                        )}
                      >
                        {value === null ? (
                          <span className="text-muted-foreground/60">—</span>
                        ) : (
                          value.toFixed(1)
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      <div className="px-5 py-3 border-t flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
        {PILLARS.map((p) => {
          const badge = PILLAR_BADGES[p.slug];
          return (
            <span key={p.slug} className="inline-flex items-center gap-1.5">
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                  badge.className
                )}
              >
                {badge.abbr}
              </span>
              <span>{p.name}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section

const MAX_SLOTS = 4;

export interface ComparisonSectionProps {
  countries: CountryRanking[];
  regions: string[];
  regionAverages: Record<string, ScoreAggregates>;
}

export function ComparisonSection({
  countries,
  regions,
  regionAverages,
}: ComparisonSectionProps) {
  const headingRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(headingRef, { once: false, amount: 0.4 });

  const countryMap = useMemo(() => {
    const m = new Map<string, CountryRanking>();
    for (const c of countries) m.set(c.iso3, c);
    return m;
  }, [countries]);
  const regionMap = useMemo(() => {
    const m = new Map<string, ScoreAggregates>();
    for (const [name, agg] of Object.entries(regionAverages)) m.set(name, agg);
    return m;
  }, [regionAverages]);

  // Sensible default: top country, second country, and the region with the
  // highest GIRAI average. Falls back gracefully on small datasets.
  const [slots, setSlots] = useState<EntityRef[]>(() => {
    const sortedCountries = [...countries]
      .filter((c) => c.girai !== null)
      .sort((a, b) => (b.girai ?? 0) - (a.girai ?? 0));
    const topRegion = Object.entries(regionAverages)
      .filter(([, a]) => a.girai !== null)
      .sort((a, b) => (b[1].girai ?? 0) - (a[1].girai ?? 0))[0]?.[0];
    return [
      sortedCountries[0]
        ? { kind: "country", iso3: sortedCountries[0].iso3 }
        : null,
      sortedCountries[1]
        ? { kind: "country", iso3: sortedCountries[1].iso3 }
        : null,
      topRegion ? { kind: "region", name: topRegion } : null,
    ];
  });

  const resolved = useMemo(
    () =>
      slots
        .map((ref) => resolveRef(ref, countryMap, regionMap))
        .filter((e): e is ResolvedEntity => e !== null),
    [slots, countryMap, regionMap]
  );

  const disabledKeys = useMemo(
    () => new Set(slots.map(refKey).filter((k) => k !== "none")),
    [slots]
  );

  const updateSlot = (idx: number, next: EntityRef) =>
    setSlots((prev) => prev.map((r, i) => (i === idx ? next : r)));

  const removeSlot = (idx: number) =>
    setSlots((prev) => prev.filter((_, i) => i !== idx));

  const addSlot = () => {
    if (slots.length >= MAX_SLOTS) return;
    setSlots((prev) => [...prev, null]);
  };

  return (
    <section
      id="compare"
      className="w-full px-4 py-16 md:py-24 bg-muted/30"
    >
      <div className="mx-auto max-w-7xl">
        <div ref={headingRef} className="mb-10 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight md:text-4xl"
          >
            Compare responsible AI{" "}
            <span className="text-primary">performance</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mt-3 text-muted-foreground max-w-2xl mx-auto"
          >
            Explore how countries and regions perform across GIRAI&apos;s
            governance dimensions, scores, and structural indicators.
          </motion.p>
        </div>

        {/* Horizontal selector row */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex flex-wrap items-center gap-3"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {slots.map((ref, idx) => (
              <motion.div
                key={`slot-${idx}`}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-1.5 min-w-[200px] flex-1 sm:flex-initial sm:w-[220px]"
              >
                <EntitySelector
                  value={ref}
                  onChange={(next) => updateSlot(idx, next)}
                  countries={countries}
                  regions={regions}
                  disabledKeys={disabledKeys}
                  paletteIndex={idx}
                />
                {slots.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSlot(idx)}
                    aria-label="Remove comparison slot"
                    className="p-2 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {slots.length < MAX_SLOTS && (
            <motion.button
              layout
              type="button"
              onClick={addSlot}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-11 items-center gap-1.5 rounded-full border-2 border-dashed border-muted-foreground/30 px-4 text-sm font-medium text-muted-foreground hover:border-primary hover:text-primary transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add filter
            </motion.button>
          )}
        </motion.div>

        {/* Left: dimensions card; Right: indicators table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <div className="lg:col-span-5">
            <DimensionCard entities={resolved} />
          </div>
          <div className="lg:col-span-7">
            <IndicatorTable entities={resolved} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
