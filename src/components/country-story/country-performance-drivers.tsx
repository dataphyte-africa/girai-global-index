"use client";

import { Check } from "lucide-react";
import { motion } from "motion/react";
import { PILLARS } from "@/data/2026/taxonomy";
import { PILLAR_COPY } from "@/lib/pillar-copy";
import { getCountryPillarNarrative } from "@/lib/country-narratives";
import { EvidenceLinkedText } from "./evidence-linked-text";
import {
  computePillarContributionMix,
  computePillarMedians,
} from "@/lib/girai/pillar-contribution";
import type {
  CountryPillarHighlightsEntry,
  CountryRanking,
} from "@/lib/girai";

interface CountryPerformanceDriversProps {
  country: CountryRanking;
  highlights: CountryPillarHighlightsEntry;
  allCountries: CountryRanking[];
}

export function CountryPerformanceDrivers({
  country,
  highlights,
  allCountries,
}: CountryPerformanceDriversProps) {
  const contributionMix = computePillarContributionMix(country.pillarScores);
  const pillarMedians = computePillarMedians(allCountries);

  return (
    <section
      aria-labelledby="country-performance-drivers-heading"
      className="border-t border-border/60 bg-gradient-to-b from-[#F8F9FF] to-background py-16 md:py-24 dark:from-[#0c0718] dark:to-background"
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-3xl text-center md:mb-16"
        >
          <h2
            id="country-performance-drivers-heading"
            className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight"
          >
            <span className="text-[#6c5cff]">What Drives</span>{" "}
            <span className="text-foreground">This Performance?</span>
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
            A breakdown of the structural factors shaping this country&apos;s
            score.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-5 lg:gap-6">
          {PILLARS.map((pillar, index) => {
            const copy = PILLAR_COPY[pillar.slug];
            const pillarHighlight = highlights.pillars[pillar.slug];
            const score = country.pillarScores[pillar.slug];
            const contribution = contributionMix[pillar.slug];
            const median = pillarMedians[pillar.slug];
            const isStrength =
              score !== null &&
              median !== null &&
              score >= median;
            const calloutText = getCountryPillarNarrative(
              country.iso3,
              pillar.slug
            );

            return (
              <PillarDriverCard
                key={pillar.slug}
                index={index}
                heading={copy.heading}
                description={copy.driversDescription}
                contributionPct={contribution}
                bullets={pillarHighlight.bullets}
                calloutLabel={isStrength ? "Strengths" : "Focus area"}
                calloutText={calloutText}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PillarDriverCard({
  index,
  heading,
  description,
  contributionPct,
  bullets,
  calloutLabel,
  calloutText,
}: {
  index: number;
  heading: string;
  description: string;
  contributionPct: number | null;
  bullets: [string, string, string];
  calloutLabel: string;
  calloutText: string;
}) {
  const pct =
    contributionPct !== null && Number.isFinite(contributionPct)
      ? Math.round(contributionPct)
      : null;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="flex flex-col rounded-2xl border border-border/80 bg-card p-6 shadow-sm md:p-7"
    >
      <h3 className="text-lg font-medium text-foreground md:text-xl">
        {heading}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>

      <div className="mt-6">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-xs font-medium text-muted-foreground">
            Contribution to overall score
          </p>
          <p className="text-2xl font-bold tabular-nums text-foreground">
            {pct !== null ? `${pct}%` : "—"}
          </p>
        </div>
        <div
          className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
          role="progressbar"
          aria-valuenow={pct ?? undefined}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Contribution to overall score${pct !== null ? `: ${pct}%` : ""}`}
        >
          <div
            className="h-full rounded-full bg-[#6c5cff] transition-[width] duration-500"
            style={{ width: pct !== null ? `${pct}%` : "0%" }}
          />
        </div>
      </div>

      <ul className="mt-6 flex flex-col gap-3">
        {bullets.map((bullet) => (
          <li key={bullet} className="flex gap-2.5 text-sm leading-snug text-foreground">
            <span
              className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-[#6c5cff]/15 text-[#6c5cff]"
              aria-hidden
            >
              <Check className="size-3 stroke-[2.5]" />
            </span>
            <span>
              <EvidenceLinkedText text={bullet} />
            </span>
          </li>
        ))}
      </ul>

      <aside
        className="mt-6 border-l-4 border-[#6c5cff] bg-[#6c5cff]/8 px-4 py-3 dark:bg-[#6c5cff]/12"
        aria-label={calloutLabel}
      >
        <p className="text-sm font-semibold text-[#6c5cff]">{calloutLabel}</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          <EvidenceLinkedText text={calloutText} />
        </p>
      </aside>
    </motion.article>
  );
}
