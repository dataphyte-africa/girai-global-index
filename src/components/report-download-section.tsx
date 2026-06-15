"use client";

import React from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ReportDownloadSection() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28"
    >
      {/* Subtle backdrop accents to match adjacent sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-background via-background to-violet-50/40 dark:to-violet-950/20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 50% 40% at 80% 20%, rgba(99,102,241,0.10) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 10% 80%, rgba(168,85,247,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-center gap-12 md:gap-16 lg:grid-cols-2">
          {/* Left: Report cover */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex justify-center lg:justify-start"
          >
            <div className="relative">
              {/* Soft glow behind cover */}
              <div
                aria-hidden
                className="absolute -inset-6 -z-10 rounded-3xl bg-primary/10 blur-2xl dark:bg-primary/20"
              />
              <Image
                src="/report-image.png"
                alt="Global Index on Responsible AI 2026 Report cover"
                width={420}
                height={560}
                priority={false}
                className="h-auto w-[260px] rounded-md  sm:w-[320px] md:w-[360px] lg:w-[400px] dark:ring-white/10"
              />
            </div>
          </motion.div>

          {/* Right: Copy + CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
            className="flex flex-col items-start gap-6"
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              REPORT 2024
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
              <span className="text-foreground">
                Global Index on Responsible AI —{" "}
              </span>
              <span className="text-primary">2026 Report</span>
            </h2>

            <p className="max-w-xl text-sm md:text-base leading-relaxed text-muted-foreground">
              Download the 2024 edition of the Global Index on Responsible AI,
              offering comparative insights into how countries govern and use
              artificial intelligence.
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <Button
                asChild
                size="lg"
                className="bg-primary px-6 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
              >
                <a href="#download-report">
                  <Download className="h-4 w-4" aria-hidden />
                  Download Report
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-primary/40 bg-background/60 px-6 text-primary hover:bg-primary/5 hover:text-primary dark:bg-background/30 dark:hover:bg-primary/10"
              >
                <a href="#download-2025">
                  <Download className="h-4 w-4" aria-hidden />
                  Download 2025 report
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
