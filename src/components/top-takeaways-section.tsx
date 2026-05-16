"use client";

import React from "react";
import { motion, useInView } from "motion/react";
import { Button } from "@/components/ui/button";

type Takeaway = {
  title: string;
  description: string;
};

const takeaways: Takeaway[] = [
  {
    title: "AI Governance Is Expanding — But Unevenly",
    description:
      "More countries have introduced AI strategies and policy frameworks, yet depth, clarity, and enforcement vary significantly.",
  },
  {
    title: "Implementation Remains the Central Challenge",
    description:
      "Policy commitments often outpace operational oversight, enforcement, and monitoring mechanisms.",
  },
  {
    title: "Oversight Systems Are Still Developing",
    description:
      "Independent AI oversight bodies, audits, and structured accountability frameworks remain limited in many jurisdictions.",
  },
  {
    title: "Civil Society Engagement Strengthens Governance",
    description:
      "Countries with active civil society and academic participation tend to demonstrate stronger transparency and inclusivity.",
  },
  {
    title: "Data Protection Frameworks Provide a Strong Foundation",
    description:
      "Established privacy and digital rights regimes correlate with broader responsible AI governance maturity.",
  },
  {
    title: "Public Sector AI Deployment Is Acceleration",
    description:
      "Governments are increasingly adopting AI tools, but transparency in procurement and safeguards is inconsistent.",
  },
  {
    title: "Institutional Capacity Shapes Outcomes",
    description:
      "Rule of law, administrative capacity, and digital infrastructure significantly influence AI governance performance.",
  },
  {
    title: "Responsible AI Is Not Limited to High-Income Countries",
    description:
      "Governance progress is visible across diverse income levels, reflecting institutional choices rather than economic scale alone.",
  },
  {
    title: "Regional Governance Models Differ",
    description:
      "Distinct regulatory traditions and policy priorities shape how regions approach responsible AI.",
  },
  {
    title: "Progress Is Visible — Structural Gaps Persist",
    description:
      "While many countries show measurable improvement, sustained investment in oversight and inclusive governance remains essential.",
  },
];

function TakeawayCard({ item, index }: { item: Takeaway; index: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: (index % 2) * 0.05 + Math.floor(index / 2) * 0.06,
      }}
      className="group flex gap-4 rounded-xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-card md:p-6 dark:bg-card/40 dark:hover:bg-card/70"
    >
      <span className="font-mono text-xs font-medium tabular-nums text-muted-foreground/80 pt-0.5 select-none">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="flex flex-col gap-2">
        <h3 className="text-base md:text-lg font-semibold leading-snug text-foreground">
          {item.title}
        </h3>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

export function TopTakeawaysSection() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28"
    >
      {/* Soft lavender gradient background — light/dark aware */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-violet-50/80 via-background to-background dark:from-violet-950/30 dark:via-background dark:to-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60 dark:opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 60% 50% at 20% 0%, rgba(168,85,247,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 90% 10%, rgba(99,102,241,0.10) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-primary">Top 10</span>{" "}
            <span className="text-foreground">take away</span>
          </h2>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
            What the data from 135 countries and jurisdictions reveals about the
            state of AI governance worldwide.
          </p>
        </motion.div>

        {/* Grid of takeaways */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {takeaways.map((item, index) => (
            <TakeawayCard key={item.title} item={item} index={index} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="mt-12 flex justify-center md:mt-16"
        >
          <Button
            asChild
            variant="outline"
            size="lg"
            className="rounded-full border-primary/40 bg-background/60 px-8 text-primary hover:bg-primary/5 hover:text-primary dark:bg-background/30 dark:hover:bg-primary/10"
          >
            <a href="#all-takeaways">View All Takeaways</a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
