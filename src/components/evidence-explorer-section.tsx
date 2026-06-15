"use client";

import React from "react";
import { motion, useInView } from "motion/react";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export type EvidenceExplorerStat = {
  value: string;
  label: string;
};

export interface EvidenceExplorerSectionProps {
  stats: EvidenceExplorerStat[];
}

export function EvidenceExplorerSection({
  stats,
}: EvidenceExplorerSectionProps) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-50 dark:opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 40% at 15% 30%, rgba(168,85,247,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 90% 80%, rgba(99,102,241,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-2">
          {/* Left: Copy + CTA */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-start gap-6"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Evidence Explorer
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1] text-foreground">
              Explore the Evidence Behind the Index
            </h2>

            <p className="max-w-md text-sm md:text-base leading-relaxed text-muted-foreground">
              Access the laws, policies, strategies, institutional actions, and
              public documents that inform GIRAI scores across countries and
              regions.
            </p>

            <Button
              asChild
              size="lg"
              className="bg-primary px-6 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
            >
              <a href="/evidence">
                Explore Evidence Explorer
                <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          </motion.div>

          {/* Right: Dark stats card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl bg-[#1a0f4d] p-6 shadow-2xl shadow-primary/20 ring-1 ring-white/10 md:p-8 dark:bg-[#0f0830]">
              {/* Decorative gradient + sheen */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-80"
                style={{
                  backgroundImage:
                    "radial-gradient(ellipse 60% 60% at 100% 0%, rgba(168,85,247,0.25) 0%, transparent 60%), radial-gradient(ellipse 60% 60% at 0% 100%, rgba(99,102,241,0.18) 0%, transparent 60%)",
                }}
              />
              <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.08]"
                viewBox="0 0 600 500"
                preserveAspectRatio="none"
              >
                <path
                  d="M 0 400 Q 200 200 400 300 T 700 100"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                />
                <path
                  d="M 0 480 Q 250 320 450 400 T 700 250"
                  stroke="white"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>

              <div className="relative">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {stats.map((stat, index) => (
                    <motion.div
                      key={stat.label + index}
                      initial={{ opacity: 0, y: 16 }}
                      animate={
                        isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                      }
                      transition={{
                        duration: 0.5,
                        ease: "easeOut",
                        delay: 0.2 + index * 0.07,
                      }}
                      className="flex flex-col gap-1 rounded-xl bg-white/95 p-5 ring-1 ring-white/10 md:p-6 dark:bg-white/90"
                    >
                      <span className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
                        {stat.value}
                      </span>
                      <span className="text-xs md:text-sm text-muted-foreground">
                        {stat.label}
                      </span>
                    </motion.div>
                  ))}
                </div>

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={
                    isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }
                  }
                  transition={{ duration: 0.6, ease: "easeOut", delay: 0.55 }}
                  className="mt-6 text-xs md:text-sm leading-relaxed text-white/80 underline decoration-white/30 underline-offset-4 md:mt-8"
                >
                  Every score in GIRAI is grounded in publicly verifiable
                  evidence, reviewed through a structured research and
                  validation process.
                </motion.p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
