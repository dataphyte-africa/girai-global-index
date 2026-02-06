"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion, useInView } from "motion/react";
import { cn } from "@/lib/utils";

export const CategoryStickScroll = ({
  content,
  contentClassName,
  backgroundColors: bgColors,
  cardLinearGradients: cardLinearGradients,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
  }[];
  contentClassName?: string;
  backgroundColors?: string[];
  cardLinearGradients?: string[];
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    // Use target (page scroll) instead of container (internal scroll)
    target: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0,
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = bgColors || [
    "#0f172a", // slate-900
    "#000000", // black
    "#171717", // neutral-900
  ];

  return (
    <div
      ref={ref}
      className="relative flex flex-col lg:flex-row justify-center gap-10 px-4 md:px-10 py-16 md:py-24"
    >
      {/* Sticky left panel — title */}
      <div
        className={cn(
          "sticky top-24 hidden h-fit w-80 shrink-0 lg:block self-start",
          contentClassName,
        )}
      >
        <div className="flex flex-col gap-3">
          <h3 className="text-3xl md:text-4xl font-bold leading-tight">
            Three Categories of{" "}
            <motion.span
              style={{
                color:
                  backgroundColors[activeCard % backgroundColors.length],
              }}
            >
              Responsible AI
            </motion.span>{" "}
            Indicators
          </h3>
          <p className="text-sm text-muted-foreground">
            To provide a comprehensive picture, the indicators for the Global
            Index of Responsible AI are grouped into three categories
          </p>
        </div>
      </div>

      {/* Mobile title (non-sticky, shown above cards) */}
      <div className="lg:hidden flex flex-col gap-3 text-center mb-4">
        <h3 className="text-2xl sm:text-3xl font-bold leading-tight">
          Three Categories of{" "}
          <motion.span
            style={{
              color:
                backgroundColors[activeCard % backgroundColors.length],
            }}
          >
            Responsible AI
          </motion.span>{" "}
          Indicators
        </h3>
        <p className="text-sm text-muted-foreground">
          To provide a comprehensive picture, the indicators for the Global
          Index of Responsible AI are grouped into three categories
        </p>
      </div>

      {/* Sticky-stacking content cards — flows with page scroll */}
      <div className="relative flex flex-col gap-8 max-w-2xl w-full pb-[15vh]">
        {content.map((item, index) => {
          if (!item.content) return null;
          const topOffset = 100 + index * 30;
          return (
            <StickyCard
              key={item.title + index}
              item={item}
              index={index}
              topOffset={topOffset}
              isActive={activeCard === index || activeCard >= content.length - 1}
            />
          );
        })}
      </div>
    </div>
  );
};

function StickyCard({
  item,
  index,
  topOffset,
  isActive,
}: {
  item: { title: string; description: string; content?: React.ReactNode };
  index: number;
  topOffset: number;
  isActive: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={cardRef}
      style={{ top: `${topOffset}px`, zIndex: 10 + index }}
      initial={{ opacity: 0, y: 40 }}
      animate={
        isInView
          ? { opacity: isActive ? 1 : 0.4, y: 0 }
          : { opacity: 0, y: 40 }
      }
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="sticky will-change-transform"
    >
      {item.content}
    </motion.div>
  );
}
