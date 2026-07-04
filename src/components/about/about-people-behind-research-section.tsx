"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { aboutDefaults, type AboutContent } from "@/content/about.defaults";

const PURPLE = "#7150F4";

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.025 } },
};

const pill: Variants = {
  hidden: { opacity: 0, y: 8, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

function ContributorPill({ name }: { name: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      variants={pill}
      whileHover={reduce ? undefined : { y: -3, scale: 1.05 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="inline-flex cursor-default items-center rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-normal text-[#333333] shadow-[0_1px_2px_rgba(26,26,46,0.04)] transition-[color,background-color,border-color,box-shadow] duration-200 ease-out hover:border-[#7150F4]/50 hover:bg-[#7150F4]/5 hover:text-[#7150F4] hover:shadow-[0_6px_16px_-6px_rgba(113,80,244,0.4)] dark:border-border dark:bg-card dark:text-card-foreground dark:shadow-none dark:hover:border-primary/60 dark:hover:bg-primary/10 dark:hover:text-primary"
    >
      {name}
    </motion.span>
  );
}

/**
 * Researchers and contributors — centered heading with a wrapping pill cloud
 * that staggers into view and lifts toward the brand accent on hover.
 */
export function AboutPeopleBehindResearchSection({
  content = aboutDefaults,
}: {
  content?: AboutContent;
}) {
  return (
    <section className="w-full bg-[#F9FAFB] px-4 py-16 dark:bg-muted/20 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="mx-auto max-w-2xl text-center"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight lg:leading-[1.12]">
            <span className="text-foreground">{content.peopleHeadingLead}</span>
            <span style={{ color: PURPLE }}>{content.peopleHeadingAccent}</span>
            <span className="text-foreground">{content.peopleHeadingTail}</span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base md:leading-[1.65]">
            {content.peopleSubtitle}
          </p>
        </motion.header>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12 md:gap-3.5"
        >
          {content.people.map((name) => (
            <ContributorPill key={name} name={name} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
