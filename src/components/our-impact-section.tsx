"use client";

import React from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { homeDefaults } from "@/content/home.defaults";
import type { Card } from "@/content/about.defaults";

type ImpactCard = Card;

/**
 * Minimal content shape the impact section reads. Both the home page
 * (`HomeContent`) and the About page satisfy this structurally, so the section
 * can be reused on either.
 */
export type ImpactSectionContent = {
  impactHeadingLead: string;
  impactHeadingAccent: string;
  impactSubtitle: string;
  impactCards: Card[];
  impactCtaLabel: string;
  impactCtaHref: string;
};

// Museum / exhibition imagery — mapped to cards by order.
const CARD_IMAGES = ["/impact/1.png", "/impact/2.png", "/impact/3.png"];

function ImpactPanel({
  item,
  image,
  index,
  isActive,
  onActivate,
}: {
  item: ImpactCard;
  image: string;
  index: number;
  isActive: boolean;
  onActivate: () => void;
}) {
  return (
    <motion.div
      layout
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={onActivate}
      tabIndex={0}
      role="button"
      aria-expanded={isActive}
      style={{ flexGrow: isActive ? 7 : 1 }}
      transition={{ type: "spring", stiffness: 220, damping: 30 }}
      className={cn(
        "group relative isolate flex min-h-[120px] flex-1 cursor-pointer flex-col justify-end overflow-hidden rounded-2xl outline-none",
        "ring-1 ring-inset ring-white/10 focus-visible:ring-2 focus-visible:ring-primary/70",
        // On desktop panels sit in a row and get a generous height.
        "md:min-h-0 md:basis-0",
      )}
    >
      {/* Photo */}
      <Image
        src={image}
        alt={item.title}
        fill
        sizes="(max-width: 768px) 100vw, 70vw"
        priority={index === 0}
        className={cn(
          "-z-10 object-cover transition-all duration-700 ease-out",
          isActive
            ? "scale-100 saturate-100"
            : "scale-[1.08] saturate-[0.85] group-hover:saturate-100",
        )}
      />

      {/* Flat tint across the whole image for baseline legibility */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-700",
          isActive ? "bg-black/5" : "bg-black/5",
        )}
      />

      {/* Directional gradient anchoring text at the bottom */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 z-0 transition-opacity duration-700",
          isActive
            ? "bg-gradient-to-t from-black/95 via-black/60 to-black/20"
            : "bg-gradient-to-t from-black/90 via-black/50 to-black/10",
        )}
      />

      {/* Violet accent wash on the active panel */}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 mix-blend-soft-light transition-opacity duration-700",
          "bg-[radial-gradient(120%_90%_at_15%_100%,var(--color-primary),transparent_60%)]",
          isActive ? "opacity-60" : "opacity-0",
        )}
      />

      {/* Collapsed label — vertical on desktop, hidden once active */}
      <div
        aria-hidden={isActive}
        className={cn(
          "absolute inset-0 flex items-end p-5 transition-opacity duration-300 md:items-center md:justify-center",
          isActive ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <span className="flex items-center gap-3 md:flex-col md:gap-4">
          <span className="font-mono text-xs tracking-[0.25em] text-white/60 md:[writing-mode:vertical-rl] md:rotate-180">
            0{index + 1}
          </span>
          <span className="text-base font-medium leading-tight text-white md:whitespace-nowrap md:text-lg md:[writing-mode:vertical-rl] md:rotate-180">
            {item.title}
          </span>
        </span>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.4, ease: "easeOut", delay: 0.12 }}
            className="relative z-10 flex flex-col gap-3 p-6 md:max-w-md md:p-8"
          >
            <span className="font-mono text-xs tracking-[0.25em] text-primary-foreground/70">
              0{index + 1} — GIRAI
            </span>
            <h3 className="text-2xl font-semibold leading-tight text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.55)] md:text-3xl">
              {item.title}
            </h3>
            <p className="max-w-prose text-sm leading-relaxed text-white/90 [text-shadow:0_1px_10px_rgba(0,0,0,0.5)]">
              {item.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function OurImpactSection({
  content = homeDefaults,
}: {
  content?: ImpactSectionContent;
}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const cards = content.impactCards;
  const [activeIndex, setActiveIndex] = React.useState(0);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28"
    >
      {/* Decorative circular rings — top right + bottom left */}
      {/* <Image
        src="/impact/circular-rings.svg"
        alt=""
        aria-hidden
        width={398}
        height={479}
        className="pointer-events-none absolute -right-16 -top-10 w-[260px] opacity-90 md:w-[340px] lg:w-[400px]"
      />
      <Image
        src="/impact/circular-rings.svg"
        alt=""
        aria-hidden
        width={398}
        height={479}
        className="pointer-events-none absolute -bottom-16 -left-16 w-[220px] rotate-180 opacity-90 md:w-[300px] lg:w-[360px]"
      /> */}

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight leading-[1.1]">
            <span className="text-foreground">{content.impactHeadingLead}</span>
            <span className="text-primary">{content.impactHeadingAccent}</span>
          </h2>
          <p className="max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
            {content.impactSubtitle}
          </p>
        </motion.div>

        {/* Expanding panel carousel */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          className="flex flex-col gap-3 md:h-[460px] md:flex-row lg:h-[520px]"
        >
          {cards.map((item, index) => (
            <ImpactPanel
              key={item.title}
              item={item}
              image={CARD_IMAGES[index % CARD_IMAGES.length]}
              index={index}
              isActive={activeIndex === index}
              onActivate={() => setActiveIndex(index)}
            />
          ))}
        </motion.div>

        {/* GIRAI in Action — links to an article showcasing citations of the Index.
            Hidden until an article URL is set in Sanity. */}
        {content.impactCtaHref ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.25 }}
            className="mt-10 flex justify-center md:mt-12"
          >
            <Button asChild size="lg" className="gap-2">
              <a
                href={content.impactCtaHref}
                target="_blank"
                rel="noopener noreferrer"
              >
                {content.impactCtaLabel}
                <ArrowUpRight className="h-4 w-4" aria-hidden />
              </a>
            </Button>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
