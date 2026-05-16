"use client";

import React from "react";
import { motion, useInView } from "motion/react";
import { Sparkles } from "lucide-react";

export function WhatMotivatedUsSection() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-br from-background via-violet-50/40 to-background dark:from-background dark:via-violet-950/20 dark:to-background"
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-stretch gap-10 md:gap-12 lg:grid-cols-2">
          {/* Left: Copy */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col justify-center gap-6"
          >
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Why GIRAI?
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              <span className="text-foreground">What </span>
              <span className="text-primary">Motivated</span>
              <span className="text-foreground"> Us to do This?</span>
            </h2>

            <p className="max-w-md text-sm md:text-base leading-relaxed text-muted-foreground">
              Why we built this index, what it measures, and how it helps
              governments, researchers, and civil society turn responsible AI
              principles into actionable insight.
            </p>
          </motion.div>

          {/* Right: Solid violet block with decorative shapes */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="relative flex min-h-[280px] items-center justify-center overflow-hidden rounded-md bg-primary p-10 shadow-2xl shadow-primary/30 md:min-h-[320px] md:p-14"
          >
            {/* Decorative blob shapes */}
            <svg
              aria-hidden
              className="pointer-events-none absolute -right-6 -top-6 h-48 w-48 opacity-25 md:h-60 md:w-60"
              viewBox="0 0 200 200"
              fill="none"
            >
              <path
                d="M40 90 Q40 40 90 40 L160 40 Q170 40 170 50 L170 110 Q170 160 120 160 L60 160 Q40 160 40 140 Z"
                fill="white"
              />
            </svg>
            <svg
              aria-hidden
              className="pointer-events-none absolute -bottom-10 -left-6 h-44 w-44 opacity-20 md:h-56 md:w-56"
              viewBox="0 0 200 200"
              fill="none"
            >
              <path
                d="M30 60 Q30 30 60 30 L130 30 Q160 30 160 60 L160 130 Q160 160 130 160 L60 160 Q30 160 30 130 Z"
                fill="white"
              />
            </svg>

            <h3 className="relative z-10 text-center text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white">
              What Is Global Index
            </h3>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
