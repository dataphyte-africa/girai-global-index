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
      <h3 className="text-lg md:text-xl font-semibold text-foreground">
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
  // Framing: all but the last card are the "problem" (what the Index can / cannot
  // do); the final card is GIRAI's "response", rendered as a prominent block.
  const limitationCards = cards.slice(0, -1);
  const responseCard = cards[cards.length - 1];

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
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]">
            <span className="text-foreground">{content.limitsHeadingLead}</span>
            <span className="text-primary">{content.limitsHeadingAccent}</span>
          </h2>
          <p className="max-w-xl text-sm md:text-base text-muted-foreground leading-relaxed">
            {content.limitsSubtitle}
          </p>
        </motion.div>

        <div className="flex flex-col gap-6">
          {/* The framing: what the Index can and cannot do */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {limitationCards.map((item, index) => (
              <LimitCardItem key={item.title} item={item} index={index} />
            ))}
          </div>

          {/* GIRAI's response — deliberately distinct and prominent */}
          {responseCard ? (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
              transition={{ duration: 0.55, ease: "easeOut", delay: 0.2 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-violet-600 p-8 text-primary-foreground shadow-xl shadow-primary/25 md:p-10"
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/10 blur-2xl"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/5 blur-2xl"
              />
              <div className="relative flex flex-col gap-5 md:flex-row md:items-start md:gap-8">
                <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15 ring-1 ring-inset ring-white/25">
                  <Lightbulb className="h-6 w-6" aria-hidden />
                </span>
                <div className="flex flex-col gap-3">
                  <h3 className="text-xl md:text-2xl font-semibold">
                    {responseCard.title}
                  </h3>
                  <p className="max-w-3xl text-sm leading-relaxed text-primary-foreground/90 md:text-base">
                    {responseCard.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
