"use client";

/**
 * Country page section: "How {country} performs across the five dimensions".
 *
 * Layout (desktop):
 *   ┌─────────────────────┬─────────────────────┐
 *   │  4 sticky summary   │  5 dimension cards   │
 *   │  cards (Framework,  │  scrolling past the  │
 *   │  Implementation,    │  sticky column.      │
 *   │  CSO, Income Group) │                      │
 *   └─────────────────────┴─────────────────────┘
 *
 * Mobile collapses to a single column (left cards first, then dimensions).
 *
 * All data points come from `CountryRanking` + `ScoreAggregates` (the
 * regional aggregate for "Avrg. Dimension score", and the income-group
 * aggregate for the Income Group card's peer-average reference).
 *
 * Narrative copy is sourced via `@/lib/country-narratives` (fact bundles →
 * generated/deterministic fallback per ADR 0004).
 */

import { motion } from "motion/react";
import type { CountryRanking, ScoreAggregates } from "@/lib/girai";
import { DIMENSIONS } from "@/data/2026/taxonomy";
import { getCountryDimensionNarrative } from "@/lib/country-narratives";
import { getOrdinalSuffix } from "@/lib/narratives/ordinal";

interface Props {
  country: CountryRanking;
  regionAggregates: ScoreAggregates | null;
  incomeGroupAggregates: ScoreAggregates | null;
}

export function CountryPerformanceOverview({
  country,
  regionAggregates,
  incomeGroupAggregates,
}: Props) {
  const summaryCards: SummaryCard[] = [
    {
      label: "Framework",
      score: country.frameworkScore,
      avgScore: regionAggregates?.frameworkScore ?? null,
      avgLabel: "Avrg. Score",
      rankGlobal: country.frameworkRankGlobal,
      rankRegional: country.frameworkRankRegional,
    },
    {
      label: "Implementation",
      score: country.implementationScore,
      avgScore: regionAggregates?.implementationScore ?? null,
      avgLabel: "Avrg. Score",
      rankGlobal: country.implementationRankGlobal,
      rankRegional: country.implementationRankRegional,
    },
    {
      label: "Civil society engagement",
      score: country.pillarScores["cso-engagement"],
      avgScore: regionAggregates?.pillars["cso-engagement"] ?? null,
      avgLabel: "Avrg. Score",
      rankGlobal: country.pillarRanksGlobal["cso-engagement"],
      rankRegional: country.pillarRanksRegional["cso-engagement"],
    },
    {
      label: "Income Group",
      sublabel: country.incomeGroup || undefined,
      score: country.girai,
      avgScore: incomeGroupAggregates?.girai ?? null,
      avgLabel: "Avrg. Score",
      rankGlobal: country.rankGlobal,
      rankRegional: country.rankRegional,
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 md:mb-16 max-w-3xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-foreground tracking-tight">
            How <span className="text-[#6c5cff]">{country.name}</span> Performs
            Across the Five Dimensions
          </h2>
          <p className="text-muted-foreground mt-4 text-sm md:text-base">
            GIRAI evaluates countries across five core dimensions that capture
            the social, ethical, and institutional impacts of artificial
            intelligence.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Sticky summary column */}
          <div className="lg:sticky lg:top-24 self-start">
            <div className="flex flex-col gap-4">
              {summaryCards.map((card) => (
                <SummaryCardView key={card.label} card={card} />
              ))}
            </div>
          </div>

          {/* Scrolling dimension column */}
          <div className="flex flex-col gap-16 lg:gap-24">
            {DIMENSIONS.map((dim, i) => {
              const score = country.dimensionScores[dim.slug];
              const avg = regionAggregates?.dimensions[dim.slug] ?? null;
              const rankG = country.dimensionRanksGlobal[dim.slug];
              const rankR = country.dimensionRanksRegional[dim.slug];
              const blurb = getCountryDimensionNarrative(country.iso3, dim.slug);
              return (
                <DimensionCardView
                  key={dim.slug}
                  index={i + 1}
                  title={dim.name}
                  score={score}
                  avgScore={avg}
                  rankGlobal={rankG}
                  rankRegional={rankR}
                  blurb={blurb}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Summary card (left column)

interface SummaryCard {
  label: string;
  sublabel?: string;
  score: number | null;
  avgScore: number | null;
  avgLabel: string;
  rankGlobal: number | null;
  rankRegional: number | null;
}

function SummaryCardView({ card }: { card: SummaryCard }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4 }}
      className="rounded-2xl border border-border bg-card px-5 py-4 md:px-6 md:py-5 shadow-sm"
    >
      <div className="flex items-baseline justify-between gap-6">
        <div className="min-w-0">
          <p className="text-sm font-medium text-foreground truncate">
            {card.label}
          </p>
          {card.sublabel && (
            <p className="text-xs text-muted-foreground mt-0.5 truncate">
              {card.sublabel}
            </p>
          )}
          <p className="mt-2 text-3xl md:text-[2rem] font-bold tabular-nums text-foreground leading-none">
            {formatScore(card.score)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xs text-muted-foreground">{card.avgLabel}</p>
          <p className="mt-2 text-3xl md:text-[2rem] font-bold tabular-nums text-[#3bb6e5] leading-none">
            {formatScore(card.avgScore)}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <RankPill label="Global" rank={card.rankGlobal} tone="violet" />
        <RankPill label="Regional" rank={card.rankRegional} tone="blue" />
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Dimension card (right column)

interface DimensionCardProps {
  index: number;
  title: string;
  score: number | null;
  avgScore: number | null;
  rankGlobal: number | null;
  rankRegional: number | null;
  blurb: string;
}

function DimensionCardView({
  index,
  title,
  score,
  avgScore,
  rankGlobal,
  rankRegional,
  blurb,
}: DimensionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className="max-w-xl"
    >
      <div className="flex items-center gap-4 mb-5">
        <span className="flex items-center justify-center size-8 rounded-full bg-[#6c5cff] text-white text-sm font-semibold tabular-nums shadow-sm">
          {index}
        </span>
        <h3 className="text-2xl md:text-3xl font-medium text-foreground tracking-tight">
          {title}
        </h3>
      </div>
      <div className="flex items-baseline gap-8 mb-4">
        <div>
          <p className="text-4xl md:text-[2.75rem] font-bold tabular-nums text-[#6c5cff] leading-none">
            {formatScore(score)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">Index Score</p>
        </div>
        <div>
          <p className="text-4xl md:text-[2.75rem] font-bold tabular-nums text-[#3bb6e5] leading-none">
            {formatScore(avgScore)}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            Avrg. Dimension score
          </p>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <RankPill label="Global" rank={rankGlobal} tone="violet" />
        <RankPill label="Regional" rank={rankRegional} tone="blue" />
      </div>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
        {blurb}
      </p>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Shared primitives

function RankPill({
  label,
  rank,
  tone,
}: {
  label: string;
  rank: number | null;
  tone: "violet" | "blue";
}) {
  const palette =
    tone === "violet"
      ? "bg-[#ece9ff] text-[#6c5cff] dark:bg-[#6c5cff]/15 dark:text-[#b6acff]"
      : "bg-[#e3f4fb] text-[#3bb6e5] dark:bg-[#3bb6e5]/15 dark:text-[#7fd2ee]";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${palette}`}
    >
      {label}: {rank !== null ? getOrdinalSuffix(rank) : "—"}
    </span>
  );
}

function formatScore(v: number | null | undefined): string {
  if (v === null || v === undefined || !Number.isFinite(v)) return "—";
  return v.toFixed(2);
}
