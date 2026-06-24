"use client";

import React from "react";
import { motion, useInView } from "motion/react";
import { Scale, AlertCircle, Lightbulb, type LucideIcon } from "lucide-react";
import { homeDefaults, type HomeContent } from "@/content/home.defaults";
import type { Card } from "@/content/about.defaults";

type LimitCard = Card & {
  Icon: LucideIcon;
  iconClass: string;
};

const CARD_META = [
  {
    Icon: Scale,
    iconClass:
      "bg-primary/10 text-primary ring-1 ring-inset ring-primary/20 dark:bg-primary/15",
  },
  {
    Icon: AlertCircle,
    iconClass:
      "bg-orange-100 text-orange-600 ring-1 ring-inset ring-orange-200 dark:bg-orange-500/15 dark:text-orange-400 dark:ring-orange-500/30",
  },
  {
    Icon: Lightbulb,
    iconClass:
      "bg-sky-100 text-sky-600 ring-1 ring-inset ring-sky-200 dark:bg-sky-500/15 dark:text-sky-400 dark:ring-sky-500/30",
  },
] as const;

function toLimitCards(cards: Card[]): LimitCard[] {
  return cards.map((card, index) => ({
    ...card,
    ...CARD_META[index % CARD_META.length],
  }));
}

function LimitCardItem({ item, index }: { item: LimitCard; index: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const { Icon } = item;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.08 }}
      className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-card md:p-7 dark:bg-card/40 dark:hover:bg-card/70"
    >
      <span
        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${item.iconClass}`}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <h3 className="text-lg md:text-xl font-medium text-foreground">
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {item.description}
      </p>
    </motion.div>
  );
}

export function LimitsOfMeasurementSection({
  content = homeDefaults,
}: {
  content?: HomeContent;
}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const cards = toLimitCards(content.limitsCards);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-violet-50/80 via-violet-50/30 to-background dark:from-violet-950/30 dark:via-violet-950/10 dark:to-background"
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.1]">
            <span className="text-foreground">{content.limitsHeadingLead}</span>
            <span className="text-primary">{content.limitsHeadingAccent}</span>
          </h2>
          <p className="max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed">
            {content.limitsSubtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {cards.map((item, index) => (
            <LimitCardItem key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
