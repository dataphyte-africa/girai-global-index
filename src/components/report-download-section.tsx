"use client";

import React from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { Download, Sparkles } from "lucide-react";
import { DataDownloadTrigger } from "@/components/data-download/data-download-trigger";
import {
  reportDownloadDefaults,
  type ReportDownloadContent,
} from "@/content/reportDownload.defaults";

export function ReportDownloadSection({
  content = reportDownloadDefaults,
}: {
  content?: ReportDownloadContent;
}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="report-download"
      ref={sectionRef}
      className="relative scroll-mt-24 overflow-hidden py-20 md:py-28"
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
                src={content.coverImage.url ?? "/report-image.jpg"}
                alt={
                  content.coverImage.alt ??
                  "Global Index on Responsible AI 2026 Report cover"
                }
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
              {content.badge}
            </span>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]">
              <span className="text-foreground">{content.headingLead}</span>
              <span className="text-primary">{content.headingAccent}</span>
            </h2>

            <p className="max-w-xl text-sm md:text-base leading-relaxed text-muted-foreground">
              {content.body}
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
              <DataDownloadTrigger
                assetType="report"
                edition="second"
                source="report-download-section-primary"
                size="lg"
                className="bg-primary px-6 text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90"
              >
                <Download className="h-4 w-4" aria-hidden />
                {content.primaryCtaLabel}
              </DataDownloadTrigger>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
