"use client";

import React from "react";
import { motion, useInView } from "motion/react";
import { Button } from "@/components/ui/button";

export function WhyGIRAIMattersIntroSection() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-[#1a0f4d] text-white dark:bg-[#0f0830]"
    >
      {/* Decorative subtle line/curve background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 10%, rgba(255,255,255,0.35) 0%, transparent 55%), radial-gradient(ellipse at 90% 90%, rgba(168,85,247,0.45) 0%, transparent 60%)",
        }}
      />
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.07]"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M -100 600 Q 400 300 900 500 T 1600 200"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M -100 750 Q 500 500 1000 650 T 1600 400"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />
        <path
          d="M -100 850 Q 600 650 1100 800 T 1600 600"
          stroke="white"
          strokeWidth="1"
          fill="none"
        />
      </svg>

      <div className="relative mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          {/* Sticky left column */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={
                isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }
              }
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-white">
                Why GIRAI Matters
              </h2>
              <p className="max-w-md text-base md:text-lg leading-relaxed text-white/70">
                Turning AI ethics into measurable action for governments,
                society, and public trust.
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="rounded-full bg-white px-6 text-[#1a0f4d] hover:bg-white/90"
                >
                  <a href="#learn-more">Learn more</a>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Scrollable right column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col gap-6 text-sm md:text-base leading-relaxed text-white/85"
          >
            <p>
              Without measurement, the promise of responsible AI remains
              abstract. GIRAI exists to close the gap between principles and
              practice — tracking what countries are actually doing to govern
              AI responsibly.
            </p>
            <p>
              Today, there is a scarcity of globally representative data on
              what steps countries are taking to prepare for the challenges and
              possibilities presented by AI — particularly with regard to the
              enjoyment and realization of human rights. Commitments are made,
              frameworks are drafted, but without consistent, comparable
              evidence, there is no way to know whether progress is real or
              rhetorical. The Global Index on Responsible AI is the first tool
              of its kind — a comprehensive, human rights–based measurement
              initiative designed for policymakers, researchers, and
              journalists. With a comparative set of benchmarks, it measures
              government commitments and country capacities through a social,
              technical, and political lens.
            </p>
            <p>
              What sets GIRAI apart is how the evidence is gathered. Rather
              than relying solely on publicly available datasets, the Index
              generates primary, locally sourced data — representing the
              breadth and depth of experiences across different regions and
              filling critical gaps that global datasets typically miss.
            </p>
            <p>
              This approach is built on four commitments: it is collaborative
              — bringing together diverse voices and perspectives from every
              region. It is rigorous — drawing on firsthand, in-country
              evidence from people who know the local landscape. It is
              independent — led by independent organisations worldwide. And it
              is actionable — designed not just to describe the state of AI
              governance, but to drive local and global action on responsible
              AI.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
