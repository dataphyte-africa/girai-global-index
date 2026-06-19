"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { CountryRanking, ScoreLeaderboardEntry } from "@/lib/girai";
import { PILLARS, type DimensionSlug, type PillarSlug } from "@/data/2026/taxonomy";
import { PILLAR_BADGES } from "@/lib/pillar-badges";
import { flagUrlForIso3 } from "@/lib/geo-iso";
import { cn } from "@/lib/utils";

const PILLAR_NAMES: Record<PillarSlug, string> = Object.fromEntries(
  PILLARS.map((p) => [p.slug, p.name])
) as Record<PillarSlug, string>;

/** Shared brand purple — kept consistent across every dimension. */
const ACCENT = "#6c5cff";

export interface ExplorerIndicator {
  slug: string;
  name: string;
  pillar: PillarSlug;
}

export interface DimensionCountryExplorerProps {
  dimensionSlug: DimensionSlug;
  dimensionName: string;
  leaderboard: ScoreLeaderboardEntry[];
  indicators: ExplorerIndicator[];
}

export function DimensionCountryExplorer({
  dimensionSlug,
  dimensionName,
  leaderboard,
  indicators,
}: DimensionCountryExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedIso3, setSelectedIso3] = useState(
    leaderboard[0]?.country.iso3 ?? ""
  );

  const rankByIso3 = useMemo(() => {
    const m = new Map<string, number>();
    leaderboard.forEach((e, i) => m.set(e.country.iso3, i + 1));
    return m;
  }, [leaderboard]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return leaderboard;
    return leaderboard.filter(
      (e) =>
        e.country.name.toLowerCase().includes(q) ||
        e.country.region.toLowerCase().includes(q) ||
        e.country.iso3.toLowerCase().includes(q)
    );
  }, [query, leaderboard]);

  const selected = useMemo(
    () => leaderboard.find((e) => e.country.iso3 === selectedIso3) ?? leaderboard[0],
    [leaderboard, selectedIso3]
  );

  return (
    <section className="w-full bg-[#f8f9ff] px-4 py-16 dark:bg-muted/20 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">
            <span className="text-primary">Explore</span>{" "}
            <span className="text-foreground">a Country&apos;s Performance</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            Dive deep into how individual nations perform on{" "}
            {dimensionName.toLowerCase()} in AI governance.
          </p>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
          {/* Search list */}
          <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm">
            <div className="relative mb-2">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search countries"
                className="h-12 rounded-2xl border-transparent bg-muted/50 pl-10 text-sm shadow-none focus-visible:border-border"
              />
            </div>
            <ul className="flex max-h-[520px] flex-col overflow-y-auto">
              {filtered.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted-foreground">
                  No countries found.
                </li>
              ) : null}
              {filtered.map((entry) => {
                const c = entry.country;
                const isActive = c.iso3 === selected?.country.iso3;
                const flagUrl = flagUrlForIso3(c.iso3);
                const rank = rankByIso3.get(c.iso3);
                return (
                  <li key={c.iso3}>
                    <button
                      type="button"
                      onClick={() => setSelectedIso3(c.iso3)}
                      className={cn(
                        "flex w-full items-center gap-3 border-l-2 px-3 py-3 text-left transition-colors",
                        isActive
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
                          #{rank ?? "—"} · {c.region}
                        </span>
                      </span>
                      <span className="text-sm font-bold tabular-nums text-primary">
                        {entry.score.toFixed(0)}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Country card */}
          {selected ? (
            <CountryCard
              country={selected.country}
              score={selected.score}
              dimensionSlug={dimensionSlug}
              indicators={indicators}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function CountryCard({
  country,
  score,
  dimensionSlug,
  indicators,
}: {
  country: CountryRanking;
  score: number;
  dimensionSlug: DimensionSlug;
  indicators: ExplorerIndicator[];
}) {
  const rank = country.dimensionRanksGlobal[dimensionSlug];

  return (
    <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-sm md:p-5">
      {/* Header panel */}
      <div className="rounded-2xl bg-primary/10 px-6 py-6 dark:bg-primary/15">
        <h3 className="text-2xl font-medium text-foreground md:text-3xl">
          {country.name}
        </h3>
        <dl className="mt-5 grid grid-cols-3 gap-4">
          <div>
            <dt className="text-xs text-muted-foreground">Overall Score</dt>
            <dd
              className="mt-1 text-3xl font-bold tabular-nums"
              style={{ color: ACCENT }}
            >
              {score.toFixed(0)}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Global Rank</dt>
            <dd
              className="mt-1 text-3xl font-bold tabular-nums"
              style={{ color: ACCENT }}
            >
              #{rank ?? "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Region</dt>
            <dd
              className="mt-1 truncate text-xl font-medium md:text-2xl"
              style={{ color: ACCENT }}
            >
              {country.region}
            </dd>
          </div>
        </dl>
      </div>

      {/* Indicator breakdown */}
      <div className="px-2 py-6 md:px-3">
        <h4 className="mb-5 text-sm font-medium text-foreground">
          Indicator-by-Indicator Breakdown
        </h4>
        <div className="flex flex-col gap-4">
          {indicators.map((ind) => {
            const value = country.indicatorScores[ind.slug];
            const pct = value == null ? 0 : Math.max(0, Math.min(100, value));
            return (
              <div key={ind.slug}>
                <p className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium text-foreground/80">
                  {ind.name}
                  <span className="inline-flex items-center gap-1.5">
                    <span
                      className={cn(
                        "rounded px-1.5 py-0.5 text-[10px] font-semibold leading-none",
                        PILLAR_BADGES[ind.pillar].className
                      )}
                    >
                      {PILLAR_BADGES[ind.pillar].abbr}
                    </span>
                    <span className="text-muted-foreground">
                      {PILLAR_NAMES[ind.pillar]}
                    </span>
                  </span>
                </p>
                <div className="relative h-5 w-full overflow-hidden rounded-full bg-muted/70">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: ACCENT }}
                  />
                  <span
                    className={cn(
                      "absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold tabular-nums",
                      // When the fill reaches the label, render it white for
                      // contrast against the purple bar; otherwise dark on track.
                      pct > 88 ? "text-white" : "text-foreground"
                    )}
                  >
                    {value == null ? "—" : value.toFixed(1)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <Link
          href={`/countries/${country.iso3}`}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium transition-colors hover:underline"
          style={{ color: ACCENT }}
        >
          View full country profile
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}
