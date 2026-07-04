"use client";

import React from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TAKEAWAYS } from "@/components/takeaways/takeaways-data";
import { TakeawayVisualRenderer } from "@/components/takeaways/takeaway-visual-renderer";
import {
  FindingSummary,
  FindingBody,
  FindingBrightSpotBody,
} from "@/components/takeaways/finding-content";
import type { Takeaway } from "@/components/takeaways/types";
import type { KeyFinding } from "@/content/keyFindings";

/**
 * Accordion shell: the animated card, trigger button and expand/collapse
 * behaviour. Panel content is provided by the caller so both the CMS-driven
 * findings and the built-in static takeaways share identical chrome.
 */
function AccordionCard({
  title,
  index,
  isOpen,
  onToggle,
  children,
}: {
  title: React.ReactNode;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{
        duration: 0.45,
        ease: "easeOut",
        delay: index * 0.04,
      }}
      className="rounded-2xl bg-white/90 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(76,29,149,0.18)] ring-1 ring-black/4 backdrop-blur-sm dark:bg-card/60 dark:ring-white/10"
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left md:px-6 md:py-5"
      >
        <span className="text-sm md:text-base font-medium leading-snug text-foreground">
          {title}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors ${
            isOpen ? "bg-primary/10 text-primary" : "bg-transparent"
          }`}
        >
          <motion.span
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="flex"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
          </motion.span>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen ? (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 md:px-6 md:pb-6">
              <div className="h-px w-full bg-border/60" />
              {children}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

/** Bright Spot callout shared by both content variants. */
function BrightSpotCallout({
  country,
  children,
}: {
  country?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 rounded-xl bg-primary/5 px-4 py-3 dark:bg-primary/10">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Bright Spot{country ? ` · ${country}` : ""}
      </p>
      {children}
    </div>
  );
}

/** CMS-driven finding: rich text summary, body (charts/tables) and callout. */
function FindingPanel({ item }: { item: KeyFinding }) {
  return (
    <>
      {item.summary ? <FindingSummary value={item.summary} /> : null}
      {item.body ? <FindingBody value={item.body} /> : null}
      {item.brightSpotCountry || item.brightSpotBody ? (
        <BrightSpotCallout country={item.brightSpotCountry}>
          {item.brightSpotBody ? (
            <FindingBrightSpotBody value={item.brightSpotBody} />
          ) : null}
        </BrightSpotCallout>
      ) : null}
    </>
  );
}

/** Static fallback finding rendered from the built-in report data. */
function TakeawayPanel({ item }: { item: Takeaway }) {
  return (
    <>
      <p className="pt-4 text-sm font-medium leading-relaxed text-foreground/90">
        {item.summary}
      </p>
      <ul className="mt-3 space-y-2">
        {item.narrative.map((point, i) => (
          <li
            key={i}
            className="flex gap-2 text-sm leading-relaxed text-muted-foreground"
          >
            <span
              aria-hidden
              className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/50"
            />
            <span>{point}</span>
          </li>
        ))}
      </ul>

      {item.visuals.map((visual, i) => (
        <TakeawayVisualRenderer key={i} visual={visual} />
      ))}

      {item.brightSpot ? (
        <BrightSpotCallout country={item.brightSpot.country}>
          <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
            {item.brightSpot.body}
          </p>
        </BrightSpotCallout>
      ) : null}
    </>
  );
}

interface TopTakeawaysSectionProps {
  /** CMS-driven findings. When absent/empty, the built-in report data is used. */
  findings?: KeyFinding[] | null;
  showHeader?: boolean;
  showCta?: boolean;
  headingAccent?: string;
  headingTail?: string;
  headerSubtitle?: string;
}

export function TopTakeawaysSection({
  findings,
  showHeader = true,
  showCta = true,
  headingAccent = "Top 10",
  headingTail = "take away",
  headerSubtitle = "Strengthening Clarity, Comparability, and Implementation Focus",
}: TopTakeawaysSectionProps = {}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

  const cmsFindings =
    findings && findings.length > 0 ? findings : null;
  const count = cmsFindings ? cmsFindings.length : TAKEAWAYS.length;

  const toggle = (index: number) =>
    setOpenIndex((current) => (current === index ? null : index));

  return (
    <section
      id="all-takeaways"
      ref={sectionRef}
      className="relative isolate overflow-hidden py-20 md:py-28"
    >
      {/* Light: theme background + Figma mesh image; Dark: theme background + subtle violet radial mesh */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-background"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat dark:hidden"
        style={{
          backgroundImage: "url('/takeaways/takeaways-mesh-bg.jpg')",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden dark:block"
        style={{
          backgroundImage: [
            "radial-gradient(60% 55% at 5% 55%, rgba(56, 189, 248, 0.16) 0%, rgba(56, 189, 248, 0) 70%)",
            "radial-gradient(35% 80% at 28% 60%, rgba(167, 139, 250, 0.18) 0%, rgba(167, 139, 250, 0) 70%)",
            "radial-gradient(40% 35% at 55% 10%, rgba(139, 92, 246, 0.22) 0%, rgba(139, 92, 246, 0) 70%)",
            "radial-gradient(55% 70% at 95% 40%, rgba(129, 140, 248, 0.18) 0%, rgba(129, 140, 248, 0) 70%)",
            "radial-gradient(50% 50% at 80% 95%, rgba(96, 165, 250, 0.12) 0%, rgba(96, 165, 250, 0) 70%)",
            "radial-gradient(45% 40% at 45% 50%, rgba(168, 85, 247, 0.14) 0%, rgba(168, 85, 247, 0) 70%)",
          ].join(", "),
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 md:px-6">
        {showHeader ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-3 text-center md:mb-14"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight">
              <span className="text-primary">{headingAccent}</span>{" "}
              <span className="text-foreground">{headingTail}</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
              {headerSubtitle}
            </p>
          </motion.div>
        ) : null}

        <div className="flex flex-col gap-3 md:gap-4">
          {cmsFindings
            ? cmsFindings.map((item, index) => (
                <AccordionCard
                  key={index}
                  title={item.title}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={() => toggle(index)}
                >
                  <FindingPanel item={item} />
                </AccordionCard>
              ))
            : TAKEAWAYS.map((item, index) => (
                <AccordionCard
                  key={item.title}
                  title={item.title}
                  index={index}
                  isOpen={openIndex === index}
                  onToggle={() => toggle(index)}
                >
                  <TakeawayPanel item={item} />
                </AccordionCard>
              ))}
        </div>

        {count > 0 && showCta ? (
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
              className="border-primary/40 bg-background/60 px-8 text-primary hover:bg-primary/5 hover:text-primary dark:bg-background/30 dark:hover:bg-primary/10"
            >
              <a href="/takeaways">View All Takeaways</a>
            </Button>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
