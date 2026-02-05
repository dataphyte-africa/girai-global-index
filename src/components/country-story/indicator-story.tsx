"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "motion/react";
import { IndicatorIllustration } from "./indicator-illustrations";
import {
  getIndicatorNarrative,
  indicatorLabels,
  indicatorColors,
  type IndicatorType,
} from "@/lib/narratives";
import type { FullRankingData } from "@/data/countries";

interface IndicatorStoryProps {
  country: FullRankingData;
}

interface IndicatorData {
  id: IndicatorType;
  label: string;
  score: number;
  color: string;
  secondaryColor: string;
  category: "pillar" | "dimension";
}

// Define indicator colors (primary and secondary for gradients)
const indicatorColorPairs: Record<IndicatorType, { primary: string; secondary: string }> = {
  governmentFrameworks: { primary: "#6366f1", secondary: "#4f46e5" },
  governmentActions: { primary: "#8b5cf6", secondary: "#7c3aed" },
  nonStateActors: { primary: "#a855f7", secondary: "#9333ea" },
  humanRightsAI: { primary: "#ec4899", secondary: "#db2777" },
  responsibleAIGovernance: { primary: "#f97316", secondary: "#ea580c" },
  responsibleAICapacities: { primary: "#10b981", secondary: "#059669" },
};

export function IndicatorStorySection({ country }: IndicatorStoryProps) {
  const [activeCard, setActiveCard] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start start", "end end"],
  });

  // Build indicator data array
  const indicators: IndicatorData[] = [
    {
      id: "governmentFrameworks",
      label: indicatorLabels.governmentFrameworks,
      score: country.pillarScores.governmentFrameworks,
      color: indicatorColors.governmentFrameworks,
      secondaryColor: indicatorColorPairs.governmentFrameworks.secondary,
      category: "pillar",
    },
    {
      id: "governmentActions",
      label: indicatorLabels.governmentActions,
      score: country.pillarScores.governmentActions,
      color: indicatorColors.governmentActions,
      secondaryColor: indicatorColorPairs.governmentActions.secondary,
      category: "pillar",
    },
    {
      id: "nonStateActors",
      label: indicatorLabels.nonStateActors,
      score: country.pillarScores.nonStateActors,
      color: indicatorColors.nonStateActors,
      secondaryColor: indicatorColorPairs.nonStateActors.secondary,
      category: "pillar",
    },
    {
      id: "humanRightsAI",
      label: indicatorLabels.humanRightsAI,
      score: country.dimensionScores.humanRightsAI,
      color: indicatorColors.humanRightsAI,
      secondaryColor: indicatorColorPairs.humanRightsAI.secondary,
      category: "dimension",
    },
    {
      id: "responsibleAIGovernance",
      label: indicatorLabels.responsibleAIGovernance,
      score: country.dimensionScores.responsibleAIGovernance,
      color: indicatorColors.responsibleAIGovernance,
      secondaryColor: indicatorColorPairs.responsibleAIGovernance.secondary,
      category: "dimension",
    },
    {
      id: "responsibleAICapacities",
      label: indicatorLabels.responsibleAICapacities,
      score: country.dimensionScores.responsibleAICapacities,
      color: indicatorColors.responsibleAICapacities,
      secondaryColor: indicatorColorPairs.responsibleAICapacities.secondary,
      category: "dimension",
    },
  ];

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    // Fixed breakpoint calculation to ensure last card becomes active
    // Divide the scroll into equal segments for each card
    const cardCount = indicators.length;
    const segmentSize = 1 / cardCount;
    
    // Find which segment we're in
    let newActiveCard = Math.floor(latest / segmentSize);
    
    // Clamp to valid range (0 to cardCount - 1)
    newActiveCard = Math.max(0, Math.min(cardCount - 1, newActiveCard));
    
    setActiveCard(newActiveCard);
  });

  const activeIndicator = indicators[activeCard];

  return (
    <section className="py-16 bg-background">
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
            Indicator Performance
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Explore how {country.country} performs across the six key indicators
            that make up the GIRAI Index, spanning government frameworks,
            actions, and multi-stakeholder engagement.
          </p>
        </motion.div>

        {/* Two-column scroll section */}
        <div
          ref={containerRef}
          className="relative h-200 overflow-y-auto rounded-xl border bg-card"
        >
          <div className="flex">
            {/* Left column - Sticky illustration */}
            <div className="w-1/2 hidden lg:block">
              <div className="sticky top-0 h-screen flex items-center justify-center p-8">
                <motion.div
                  key={activeCard}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  className="relative w-full h-full flex flex-col items-center justify-center"
                >
                  {/* Background glow */}
                  <div
                    className="absolute inset-0 blur-3xl opacity-30 transition-all duration-700 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${activeIndicator.color}50 0%, transparent 60%)`,
                    }}
                  />
                  
                  {/* Illustration */}
                  <div className="relative z-10 w-80 h-80">
                    <IndicatorIllustration
                      indicator={activeIndicator.id}
                      color={activeIndicator.color}
                      secondaryColor={activeIndicator.secondaryColor}
                    />
                  </div>
                  
                  {/* Active indicator label */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                    className="mt-6 px-5 py-2.5 rounded-full text-white text-sm font-medium shadow-lg z-20"
                    style={{ backgroundColor: activeIndicator.color }}
                  >
                    {activeIndicator.label}
                  </motion.div>
                  
                  {/* Score badge */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                    className="mt-3 text-4xl font-bold tabular-nums"
                    style={{ color: activeIndicator.color }}
                  >
                    {activeIndicator.score.toFixed(1)}
                    <span className="text-lg text-muted-foreground font-normal ml-1">/ 100</span>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Right column - Scrollable content */}
            <div className="w-full lg:w-1/2 p-8">
              {indicators.map((indicator, index) => {
                const narrative = getIndicatorNarrative(
                  indicator.id,
                  country.country,
                  indicator.score
                );

                return (
                  <IndicatorCard
                    key={indicator.id}
                    indicator={indicator}
                    narrative={narrative}
                    isActive={activeCard === index}
                    isLast={index === indicators.length - 1}
                  />
                );
              })}
              {/* Extra space at bottom for scroll to reach last item - smaller on mobile */}
              <div className="h-40 lg:h-96" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

interface IndicatorCardProps {
  indicator: IndicatorData;
  narrative: {
    tier: string;
    label: string;
    narrative: string;
    color: string;
  };
  isActive: boolean;
  isLast: boolean;
}

function IndicatorCard({ indicator, narrative, isActive, isLast }: IndicatorCardProps) {
  return (
    <motion.div
      animate={{
        opacity: isActive ? 1 : 0.3,
        scale: isActive ? 1 : 0.98,
      }}
      transition={{ duration: 0.3 }}
      className={`my-16 first:mt-8 ${isLast ? "mb-8" : ""}`}
    >
      {/* Category badge */}
      <span className="inline-block px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider mb-3 bg-muted text-muted-foreground">
        {indicator.category === "pillar" ? "Pillar Score" : "Dimension Score"}
      </span>

      {/* Title with score */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <h3 className="text-2xl font-bold text-foreground">{indicator.label}</h3>
        <div
          className="flex items-center gap-2 px-3 py-1 rounded-full text-white font-semibold"
          style={{ backgroundColor: indicator.color }}
        >
          <span className="text-lg">{indicator.score.toFixed(1)}</span>
          <span className="text-xs opacity-80">/ 100</span>
        </div>
      </div>

      {/* Tier badge */}
      <div className="mb-4">
        <span
          className="inline-block px-3 py-1 rounded-full text-sm font-medium text-white"
          style={{ backgroundColor: narrative.color }}
        >
          {narrative.label}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-3 bg-muted rounded-full overflow-hidden mb-6">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${indicator.score}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ backgroundColor: indicator.color }}
        />
      </div>

      {/* Narrative */}
      <p className="text-muted-foreground leading-relaxed">{narrative.narrative}</p>

      {/* Mobile illustration (shown only on small screens) - key forces re-render when active */}
      <div className="lg:hidden mt-6 flex justify-center">
        <motion.div 
          key={isActive ? `${indicator.id}-active` : `${indicator.id}-inactive`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: isActive ? 0.9 : 0.4, scale: isActive ? 1 : 0.95 }}
          transition={{ duration: 0.4 }}
          className="w-48 h-48"
        >
          {isActive && (
            <IndicatorIllustration
              indicator={indicator.id}
              color={indicator.color}
              secondaryColor={indicator.secondaryColor}
            />
          )}
          {!isActive && (
            <div 
              className="w-full h-full rounded-xl opacity-30"
              style={{ 
                background: `linear-gradient(135deg, ${indicator.color}20 0%, ${indicator.secondaryColor}20 100%)` 
              }}
            />
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
