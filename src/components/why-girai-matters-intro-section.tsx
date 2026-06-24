"use client";

import React from "react";
import { motion, useInView } from "motion/react";
import { Button } from "@/components/ui/button";
import { homeDefaults, type HomeContent } from "@/content/home.defaults";

export function WhyGIRAIMattersIntroSection({
  content = homeDefaults,
}: {
  content?: HomeContent;
}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-clip bg-[#1a0f4d] text-white dark:bg-[#0f0830]"
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
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight tracking-tight text-white">
                {content.whyHeading}
              </h2>
              <p className="max-w-md text-base md:text-lg leading-relaxed text-white/70">
                {content.whySubtitle}
              </p>
              <div>
                <Button
                  asChild
                  size="lg"
                  className="bg-white px-6 text-[#1a0f4d] hover:bg-white/90"
                >
                  <a href="#learn-more">{content.whyCtaLabel}</a>
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
            {content.whyParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 40)}>{paragraph}</p>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
