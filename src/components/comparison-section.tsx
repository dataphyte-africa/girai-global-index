"use client";

import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  Check,
  ChevronDown,
  Filter,
  Info,
  Plus,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  CountryRanking,
  PillarSlug,
  ScoreAggregates,
} from "@/lib/girai";
import { countryFlags } from "@/data/countries";
import {
  DIMENSIONS,
  INDICATORS,
  PILLARS,
  URAI_INDICATOR_SLUG,
} from "@/data/2026/taxonomy";
import { getOrdinalSuffix } from "@/lib/narratives";

// ---------------------------------------------------------------------------
// Types

export type ComparisonEntityRef =
  | { kind: "country"; iso3: string }
  | { kind: "region"; name: string }
  | null;

type EntityRef = ComparisonEntityRef;

type BreakdownMode = "dimensions" | "pillars";

/** Indicators scored on the 0–100 framework matrix (excludes URAI penalty). */
const REGULAR_INDICATORS = INDICATORS.filter(
  (ind) => ind.slug !== URAI_INDICATOR_SLUG
);

interface ResolvedEntity {
  id: string;
  kind: "country" | "region";
  label: string;
  sub?: string;
  flag?: string;
  girai: number | null;
  rankGlobal?: number | null;
  rankRegional?: number | null;
  dimensions: Record<string, number | null>;
  pillars: Record<string, number | null>;
  indicators: Record<string, number | null>;
  /** Country-only: URAI penalty multiplier (1.0 = none). */
  uraiPenalty?: number | null;
  /** Country-only: government-misuse evidence count. */
  uraiCount?: number;
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

function ComparisonHelpTip({ content }: { content: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          className="inline-flex shrink-0 rounded-full p-0.5 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="More information"
        >
          <Info className="h-3.5 w-3.5" />
        </button>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-xs text-left">
        {content}
      </TooltipContent>
    </Tooltip>
  );
}

function formatUraiPenalty(entity: ResolvedEntity): {
  label: string;
  detail?: string;
} {
  if (entity.kind === "country") {
    const penalty = entity.uraiPenalty;
    if (penalty !== null && penalty !== undefined && penalty < 1) {
      const count = entity.uraiCount ?? 0;
      return {
        label: `×${penalty.toFixed(2)}`,
        detail:
          count > 0
            ? `${count} government-misuse ${count === 1 ? "item" : "items"}`
            : undefined,
      };
    }
    return { label: "No penalty" };
  }
  const avg = entity.indicators[URAI_INDICATOR_SLUG] ?? null;
  if (avg === null) return { label: "—" };
  if (avg >= 0.999) return { label: "No penalty" };
  return { label: `×${avg.toFixed(2)}`, detail: "Regional average" };
}

function refKey(ref: EntityRef): string {
  if (!ref) return "none";
  return `${ref.kind}:${ref.kind === "country" ? ref.iso3 : ref.name}`;
}

/** Fisher–Yates sample of up to `n` distinct items. */
function sampleN<T>(items: T[], n: number): T[] {
  const pool = [...items];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, n);
}

/** Two random distinct countries + one random region (entities with a score). */
function buildRandomSlots(
  countries: CountryRanking[],
  regionAverages: Record<string, ScoreAggregates>
): EntityRef[] {
  const eligibleCountries = countries.filter((c) => c.girai !== null);
  const eligibleRegions = Object.entries(regionAverages)
    .filter(([, a]) => a.girai !== null)
    .map(([name]) => name);
  const [c1, c2] = sampleN(eligibleCountries, 2);
  const [region] = sampleN(eligibleRegions, 1);
  return [
    c1 ? { kind: "country", iso3: c1.iso3 } : null,
    c2 ? { kind: "country", iso3: c2.iso3 } : null,
    region ? { kind: "region", name: region } : null,
  ];
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
      rankGlobal: c.rankGlobal,
      rankRegional: c.rankRegional,
      dimensions: c.dimensionScores,
      pillars: c.pillarScores,
      indicators: c.indicatorScores,
      uraiPenalty: c.uraiPenalty,
      uraiCount: c.uraiCount,
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
    pillars: agg.pillars,
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
// Animated score stat cards — one horizontal card per selected entity. The
// row wraps on desktop and scrolls horizontally on small screens, so adding
// more comparators never breaks the layout.

function StatCardStrip({ entities }: { entities: ResolvedEntity[] }) {
  if (entities.length === 0) return null;
  return (
    <div className="mb-6 flex snap-x gap-3 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        {entities.map((e, idx) => {
          const palette = SLOT_PALETTE[idx % SLOT_PALETTE.length];
          return (
            <motion.div
              key={e.id}
              layout
              initial={{ opacity: 0, y: 14, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
              className={cn(
                "relative w-[210px] shrink-0 snap-start overflow-hidden rounded-2xl border bg-card p-4 shadow-sm sm:w-[200px] sm:flex-1 sm:basis-[180px]",
                "before:absolute before:inset-x-0 before:top-0 before:h-1",
                idx % SLOT_PALETTE.length === 0 && "before:bg-primary",
                idx % SLOT_PALETTE.length === 1 && "before:bg-sky-500",
                idx % SLOT_PALETTE.length === 2 && "before:bg-amber-500",
                idx % SLOT_PALETTE.length === 3 && "before:bg-emerald-500",
                idx % SLOT_PALETTE.length === 4 && "before:bg-rose-500"
              )}
            >
              <div className="flex items-center gap-2">
                {e.flag && (
                  <span className="text-lg leading-none">{e.flag}</span>
                )}
                <span
                  className={cn("h-2 w-2 shrink-0 rounded-full", palette.dot)}
                />
                <span className="truncate text-sm font-semibold" title={e.label}>
                  {e.label}
                </span>
              </div>
              <p
                className={cn(
                  "mt-3 text-3xl font-bold tabular-nums",
                  palette.text
                )}
              >
                {e.girai === null ? "—" : e.girai.toFixed(2)}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {e.kind === "region" ? (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    Regional average
                  </span>
                ) : (
                  <>
                    {e.rankGlobal != null && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Global {getOrdinalSuffix(e.rankGlobal)}
                      </span>
                    )}
                    {e.rankRegional != null && (
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                        Regional {getOrdinalSuffix(e.rankRegional)}
                      </span>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Score breakdown card (left) — dimensions or pillars

function ScoreBreakdownCard({
  entities,
}: {
  entities: ResolvedEntity[];
}) {
  const [mode, setMode] = useState<BreakdownMode>("dimensions");

  const categories =
    mode === "dimensions"
      ? DIMENSIONS.map((d) => ({ slug: d.slug, name: d.name }))
      : PILLARS.map((p) => ({ slug: p.slug, name: p.name }));

  const getValue = (entity: ResolvedEntity, slug: string) =>
    mode === "dimensions"
      ? (entity.dimensions[slug] ?? null)
      : (entity.pillars[slug] ?? null);

  return (
    <div className="bg-card border rounded-2xl p-5 md:p-6 shadow-sm">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h4 className="text-base font-medium">
            {mode === "dimensions" ? "Dimension scores" : "Pillar scores"}
          </h4>
          <ComparisonHelpTip content="Switch between dimension-level and pillar-level aggregate scores for the selected countries or regions." />
        </div>
        <div className="inline-flex rounded-full border bg-muted/50 p-1 text-sm">
          <button
            type="button"
            onClick={() => setMode("dimensions")}
            className={cn(
              "rounded-full px-3 py-1 font-medium transition-all",
              mode === "dimensions"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Dimensions
          </button>
          <button
            type="button"
            onClick={() => setMode("pillars")}
            className={cn(
              "rounded-full px-3 py-1 font-medium transition-all",
              mode === "pillars"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Pillars
          </button>
        </div>
      </div>

      <div className="space-y-7">
        {categories.map((cat, idx) => (
          <div key={cat.slug}>
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-sm font-medium text-foreground">
                {cat.name}
              </span>
            </div>
            <div className="space-y-2">
              {entities.length === 0 && (
                <div className="h-7 rounded-full bg-muted/60" />
              )}
              {entities.map((e, slotIdx) => {
                const palette = SLOT_PALETTE[slotIdx % SLOT_PALETTE.length];
                const value = getValue(e, cat.slug);
                const pct = value === null ? 0 : Math.min(value, 100);
                const labelFitsInside = pct >= 22;
                return (
                  <div
                    key={e.id}
                    className="flex items-center gap-3"
                    title={`${e.label}: ${value === null ? "—" : value.toFixed(1)}`}
                  >
                    <div className="relative h-7 flex-1 overflow-hidden rounded-full bg-muted/60">
                      <motion.div
                        className={cn(
                          "absolute inset-y-0 left-0 flex items-center rounded-full bg-linear-to-r px-3",
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
                      >
                        {labelFitsInside && (
                          <span className="truncate text-xs font-semibold text-white [text-shadow:0_1px_2px_rgba(0,0,0,0.25)]">
                            {e.label}
                          </span>
                        )}
                      </motion.div>
                      {!labelFitsInside && (
                        <span className="absolute inset-y-0 left-3 flex items-center text-xs font-medium text-foreground/80">
                          {e.label}
                        </span>
                      )}
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
// Pillar multi-select filter (checkbox dropdown)

function PillarFilter({
  active,
  onChange,
}: {
  active: Set<PillarSlug>;
  onChange: (next: Set<PillarSlug>) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (slug: PillarSlug) => {
    const next = new Set(active);
    // Keep at least one pillar selected.
    if (next.has(slug)) {
      if (next.size > 1) next.delete(slug);
    } else {
      next.add(slug);
    }
    onChange(next);
  };

  const allSelected = active.size === PILLARS.length;
  const selectedPillars = PILLARS.filter((p) => active.has(p.slug));

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex h-9 items-center gap-2 rounded-full border bg-background pl-3 pr-2.5 text-sm transition-all",
          "hover:border-foreground/30",
          open && "ring-2 ring-offset-2 ring-primary/40"
        )}
      >
        <Filter className="h-3.5 w-3.5 text-muted-foreground" />
        {allSelected ? (
          <span className="text-muted-foreground">All pillars</span>
        ) : (
          <span className="flex items-center gap-1">
            {selectedPillars.map((p) => {
              const badge = PILLAR_BADGES[p.slug];
              return (
                <span
                  key={p.slug}
                  className={cn(
                    "rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                    badge.className
                  )}
                >
                  {badge.abbr}
                </span>
              );
            })}
          </span>
        )}
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
            className="absolute right-0 z-50 mt-2 w-[260px] origin-top-right rounded-xl border bg-popover p-1.5 text-popover-foreground shadow-xl"
          >
            <div className="px-2 pt-1.5 pb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Filter by pillar
            </div>
            {PILLARS.map((p) => {
              const badge = PILLAR_BADGES[p.slug];
              const checked = active.has(p.slug);
              return (
                <button
                  key={p.slug}
                  type="button"
                  onClick={() => toggle(p.slug)}
                  className="flex w-full items-center gap-2.5 rounded-md px-2 py-2 text-sm transition-colors hover:bg-accent"
                >
                  <span
                    className={cn(
                      "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
                      checked
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/40"
                    )}
                  >
                    {checked && <Check className="h-3 w-3" />}
                  </span>
                  <span
                    className={cn(
                      "rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                      badge.className
                    )}
                  >
                    {badge.abbr}
                  </span>
                  <span className="flex-1 truncate text-left">{p.name}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
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
  const [activePillars, setActivePillars] = useState<Set<PillarSlug>>(
    () => new Set(PILLARS.map((p) => p.slug))
  );

  const visibleIndicators = useMemo(
    () => REGULAR_INDICATORS.filter((ind) => activePillars.has(ind.pillar)),
    [activePillars]
  );

  // Group the visible indicators under their dimension, preserving the
  // canonical dimension order and dropping dimensions with no rows.
  const groupedByDimension = useMemo(
    () =>
      DIMENSIONS.map((dim) => ({
        dimension: dim,
        indicators: visibleIndicators.filter(
          (ind) => ind.dimension === dim.slug
        ),
      })).filter((g) => g.indicators.length > 0),
    [visibleIndicators]
  );

  // Indicator column + one column per entity (or the empty-state placeholder).
  const columnCount = 1 + (entities.length === 0 ? 1 : entities.length);

  return (
    <div className="bg-card border rounded-2xl shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h4 className="text-base font-medium">Indicators</h4>
          <ComparisonHelpTip content="Scores are 0–100. The star marks the highest score among selected entities when values differ." />
          <span className="text-xs text-muted-foreground">
            {visibleIndicators.length} of {REGULAR_INDICATORS.length}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <ComparisonHelpTip content="Show or hide indicator rows by pillar: AI Policy, CSO Engagement, and Enabling Conditions." />
          <PillarFilter active={activePillars} onChange={setActivePillars} />
        </div>
      </div>
      <Table containerClassName="max-h-[640px] overflow-auto">
        <TableHeader className="sticky top-0 z-10 [&_th]:bg-card [&_th]:shadow-[0_1px_0_var(--border)]">
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
            {groupedByDimension.map(({ dimension, indicators }) => (
              <Fragment key={dimension.slug}>
                <TableRow className="hover:bg-transparent">
                  <TableCell
                    colSpan={columnCount}
                    className="sticky top-10 z-[5] border-y bg-muted/70 py-2 backdrop-blur-sm"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      {dimension.name}
                      <span className="rounded-full bg-background px-1.5 py-0.5 text-[10px] font-medium normal-case tabular-nums text-muted-foreground/80">
                        {indicators.length}
                      </span>
                    </span>
                  </TableCell>
                </TableRow>
                {indicators.map((ind) => {
                  const badge = PILLAR_BADGES[ind.pillar];
                  const rowValues = entities.map(
                    (e) => e.indicators[ind.slug] ?? null
                  );
                  const numeric = rowValues.filter(
                    (v): v is number => v !== null
                  );
                  // Only highlight a leader when at least two entities have
                  // values and there's a real spread (not everyone tied).
                  const maxValue =
                    numeric.length >= 2 ? Math.max(...numeric) : null;
                  const hasLeader =
                    maxValue !== null && numeric.some((v) => v < maxValue);
                  return (
                    <TableRow key={ind.slug}>
                      <TableCell className="whitespace-normal">
                        <div className="flex items-center gap-2 pl-2">
                          <span
                            className={cn(
                              "shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                              badge.className
                            )}
                          >
                            {badge.abbr}
                          </span>
                          <span className="text-sm">{ind.name}</span>
                        </div>
                      </TableCell>
                      {entities.length === 0 && <TableCell />}
                      {entities.map((e, idx) => {
                        const palette = SLOT_PALETTE[idx % SLOT_PALETTE.length];
                        const value = rowValues[idx];
                        const isLeader =
                          hasLeader && value !== null && value === maxValue;
                        return (
                          <TableCell
                            key={e.id}
                            className={cn(
                              "text-right tabular-nums font-medium",
                              palette.text,
                              isLeader && "font-bold"
                            )}
                          >
                            {value === null ? (
                              <span className="text-muted-foreground/60">—</span>
                            ) : isLeader ? (
                              <span
                                className={cn(
                                  "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5",
                                  palette.soft
                                )}
                              >
                                <span
                                  aria-hidden
                                  className="text-[11px] leading-none"
                                >
                                  ⭐
                                </span>
                                {value.toFixed(1)}
                              </span>
                            ) : (
                              value.toFixed(1)
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      {/* {entities.length > 0 && ( 
        <div className="border-t px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <h5 className="text-sm font-medium">URAI score adjustment</h5>
            <ComparisonHelpTip content="URAI is not a dimension or pillar score. It is a multiplier applied to the overall GIRAI score after aggregation when government misuse evidence is on file." />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-muted-foreground">
                  <th className="pb-2 text-left font-medium">Adjustment</th>
                  {entities.map((e, idx) => {
                    const palette = SLOT_PALETTE[idx % SLOT_PALETTE.length];
                    return (
                      <th key={e.id} className="pb-2 text-right font-medium">
                        <span className="inline-flex items-center justify-end gap-1.5">
                          <span
                            className={cn("h-2 w-2 rounded-full", palette.dot)}
                          />
                          <span className="truncate max-w-[120px]">{e.label}</span>
                        </span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1 text-muted-foreground">
                    Unacceptable Risks AI Systems
                  </td>
                  {entities.map((e, idx) => {
                    const palette = SLOT_PALETTE[idx % SLOT_PALETTE.length];
                    const { label, detail } = formatUraiPenalty(e);
                    return (
                      <td
                        key={e.id}
                        className={cn(
                          "py-1 text-right tabular-nums font-medium",
                          palette.text
                        )}
                      >
                        <span>{label}</span>
                        {detail && (
                          <span className="mt-0.5 block text-[11px] font-normal text-muted-foreground">
                            {detail}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )} */}
      <div className="border-t bg-card/95 backdrop-blur-sm px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        {PILLARS.map((p) => {
          const badge = PILLAR_BADGES[p.slug];
          return (
            <div key={p.slug} className="flex items-center gap-1.5">
              <span
                className={cn(
                  "rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                  badge.className
                )}
              >
                {badge.abbr}
              </span>
              <span className="text-xs text-muted-foreground">{p.name}</span>
            </div>
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
  /** When set, replaces the homepage default slot selection. */
  initialSlots?: ComparisonEntityRef[];
  /** Optional heading override (JSX so callers can highlight a word). */
  heading?: React.ReactNode;
  /** Optional subheading copy override. */
  subheading?: React.ReactNode;
}

export function ComparisonSection({
  countries,
  regions,
  regionAverages,
  initialSlots,
  heading,
  subheading,
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

  // Deterministic default for the server render (top two countries + highest
  // scoring region) to avoid a hydration mismatch; the selection is then
  // randomized once on mount below.
  const [slots, setSlots] = useState<EntityRef[]>(() => {
    if (initialSlots?.length) return initialSlots;
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

  // Randomize the pre-selection once after mount (skipped when explicit
  // initial slots are provided). Running client-side keeps SSR output stable.
  useEffect(() => {
    if (initialSlots?.length) return;
    setSlots(buildRandomSlots(countries, regionAverages));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            className="text-3xl font-medium tracking-tight md:text-4xl"
          >
            {heading ?? (
              <>
                Compare responsible AI{" "}
                <span className="text-primary">performance</span>
              </>
            )}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mt-3 text-muted-foreground max-w-2xl mx-auto"
          >
            {subheading ??
              "Explore how countries and regions perform across GIRAI's governance dimensions, scores, and structural indicators."}
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
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <span className="text-sm font-medium text-muted-foreground">
              Compare
            </span>
            <ComparisonHelpTip content="Select up to 4 countries or regional averages to compare side by side." />
          </div>
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
            <motion.div layout className="flex items-center gap-1">
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
              <ComparisonHelpTip content="Add another country or region to the comparison (max 4)." />
            </motion.div>
          )}
        </motion.div>

        {/* Animated per-entity score cards */}
        <StatCardStrip entities={resolved} />

        {/* Left: dimensions card; Right: indicators table */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.15 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <div className="lg:col-span-5">
            <ScoreBreakdownCard entities={resolved} />
          </div>
          <div className="lg:col-span-7">
            <IndicatorTable entities={resolved} />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
