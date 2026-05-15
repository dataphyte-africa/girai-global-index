"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useInView } from "motion/react";
import { DimensionIllustration } from "./indicator-illustrations";
import {
  getDimensionNarrative,
  dimensionColors,
  dimensionGradients,
} from "@/lib/narratives";
import { DIMENSIONS } from "@/data/2026/taxonomy";
import type { DimensionSlug } from "@/data/2026/taxonomy";
import type { CountryRanking } from "@/lib/girai";

interface IndicatorStoryProps {
  country: CountryRanking;
}

interface DimensionCard {
  slug: DimensionSlug;
  label: string;
  score: number;
  color: string;
  secondaryColor: string;
}

// Secondary colours for the gradient illustrations. Pulled from the
// `dimensionGradients` map by parsing the second stop colour.
const dimensionSecondaryColors: Record<DimensionSlug, string> = {
  "inclusion-diversity": "#db2777",
  "ethics-sustainability": "#ea580c",
  "labour-skills": "#059669",
  "trust-safety": "#9333ea",
  "ai-use-public-service": "#4f46e5",
};

export function IndicatorStorySection({ country }: IndicatorStoryProps) {
  const [activeCard, setActiveCard] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const dimensionCards: DimensionCard[] = DIMENSIONS.map((d) => ({
    slug: d.slug,
    label: d.name,
    score: country.dimensionScores[d.slug] ?? 0,
    color: dimensionColors[d.slug],
    secondaryColor: dimensionSecondaryColors[d.slug],
  }));

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardCount = dimensionCards.length;
    const segmentSize = 1 / cardCount;
    let next = Math.floor(latest / segmentSize);
    next = Math.max(0, Math.min(cardCount - 1, next));
    setActiveCard(next);
  });

  const activeCardData = dimensionCards[activeCard];

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Dimension Performance
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore how {country.name} performs across the five GIRAI
            dimensions — from Inclusion &amp; Diversity to AI Use in Public
            Service.
          </p>
        </motion.div>
      </div>

      <div ref={sectionRef} className="relative container mx-auto px-4">
        <div className="flex gap-8">
          <div className="w-1/2 hidden lg:block">
            <div
              className="sticky top-24 flex items-center justify-center p-8"
              style={{ height: "calc(100vh - 8rem)" }}
            >
              <motion.div
                key={activeCard}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="relative w-full h-full flex flex-col items-center justify-center"
              >
                <div
                  className="absolute inset-0 blur-3xl opacity-30 transition-all duration-700 rounded-full"
                  style={{
                    background: `radial-gradient(circle, ${activeCardData.color}50 0%, transparent 60%)`,
                  }}
                />

                <div className="relative z-10 w-80 h-80">
                  <DimensionIllustration
                    dimension={activeCardData.slug}
                    color={activeCardData.color}
                    secondaryColor={activeCardData.secondaryColor}
                  />
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="mt-6 px-5 py-2.5 rounded-full text-white text-sm font-medium shadow-lg z-20"
                  style={{ backgroundColor: activeCardData.color }}
                >
                  {activeCardData.label}
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="mt-3 text-4xl font-bold tabular-nums"
                  style={{ color: activeCardData.color }}
                >
                  {activeCardData.score.toFixed(1)}
                  <span className="text-lg text-muted-foreground font-normal ml-1">
                    / 100
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>

          <div className="w-full lg:w-1/2 py-8">
            {dimensionCards.map((card, index) => {
              const narrative = getDimensionNarrative(card.slug, country.name, card.score);
              return (
                <DimensionCardView
                  key={card.slug}
                  card={card}
                  narrative={narrative}
                  isActive={activeCard === index}
                  isLast={index === dimensionCards.length - 1}
                />
              );
            })}
            <div className="h-[30vh]" />
          </div>
        </div>
      </div>
    </section>
  );
}

interface DimensionCardViewProps {
  card: DimensionCard;
  narrative: {
    tier: string;
    label: string;
    narrative: string;
    color: string;
  };
  isActive: boolean;
  isLast: boolean;
}

function DimensionCardView({ card, narrative, isActive, isLast }: DimensionCardViewProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={
        isInView
          ? { opacity: isActive ? 1 : 0.3, y: 0, scale: isActive ? 1 : 0.98 }
          : { opacity: 0, y: 30 }
      }
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`my-16 first:mt-8 ${isLast ? "mb-8" : ""}`}
    >
      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider mb-3 bg-muted text-muted-foreground">
        Dimension Score
      </span>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h3 className="text-2xl font-bold text-foreground">{card.label}</h3>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full text-white font-semibold"
          style={{ backgroundColor: card.color }}
        >
          <span className="text-lg">{card.score.toFixed(1)}</span>
          <span className="text-xs opacity-80">/ 100</span>
        </div>
      </div>

      <div className="mb-4">
        <span
          className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: narrative.color }}
        >
          {narrative.label}
        </span>
      </div>

      <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${card.score}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: card.color }}
        />
      </div>

      <p className="text-muted-foreground leading-relaxed">{narrative.narrative}</p>

      <div className="lg:hidden mt-6 flex justify-center">
        <motion.div
          key={isActive ? `${card.slug}-active` : `${card.slug}-inactive`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isActive ? 0.9 : 0.4, scale: isActive ? 1 : 0.95 }}
          transition={{ duration: 0.4 }}
          className="w-48 h-48"
        >
          {isActive ? (
            <DimensionIllustration
              dimension={card.slug}
              color={card.color}
              secondaryColor={card.secondaryColor}
            />
          ) : (
            <div
              className="w-full h-full rounded-xl opacity-30"
              style={{
                background: dimensionGradients[card.slug],
              }}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
