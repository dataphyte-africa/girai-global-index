"use client";
import React from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";

const defaultContent = [
  {
    title: "Benchmark Responsible AI Performance",
    description:
      "See how your country performs on responsible AI using clear, evidence-based scores that are comparable across countries.",
    image: "/why-girai-matters/benchmark.png",
  },
  {
    title: "Identify Gaps in AI Policy and Practice",
    description:
      "Uncover measurable gaps between AI principles, policies, and real-world implementation.",
    image: "/why-girai-matters/ai-policy.png",
  },
  {
    title: "Strengthen Accountability",
    description:
      "Support stronger AI governance through transparent data that drives policy reform.",
    image: "/why-girai-matters/accountability.png",
  },
];

const cardThemes = [
  {
    borderColor: "border-violet-400/60",
    bgTint: "bg-violet-50",
    darkBgTint: "dark:bg-violet-950/30",
    shadowColor: "shadow-violet-200/40",
    darkShadowColor: "dark:shadow-violet-900/20",
  },
  {
    borderColor: "border-orange-400/60",
    bgTint: "bg-orange-50",
    darkBgTint: "dark:bg-orange-950/30",
    shadowColor: "shadow-orange-200/40",
    darkShadowColor: "dark:shadow-orange-900/20",
  },
  {
    borderColor: "border-blue-400/60",
    bgTint: "bg-blue-50",
    darkBgTint: "dark:bg-blue-950/30",
    shadowColor: "shadow-blue-200/40",
    darkShadowColor: "dark:shadow-blue-900/20",
  },
];

function StickyCard({
  item,
  index,
  theme,
}: {
  item: { title: string; description: string; image: string };
  index: number;
  theme: (typeof cardThemes)[number];
}) {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });

  // Each card stacks slightly lower so they peek behind each other
  const topOffset = 100 + index * 30;

  return (
    <motion.div
      ref={cardRef}
      style={{ top: `${topOffset}px`, zIndex: 10 + index }}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="sticky will-change-transform"
    >
      <div
        className={`
          grid grid-cols-1 md:grid-cols-2 
          overflow-hidden rounded-2xl border 
          ${theme.bgTint} ${theme.darkBgTint}
          ${theme.borderColor}
          shadow-lg ${theme.shadowColor} ${theme.darkShadowColor}
          transition-shadow duration-300
        `}
      >
        {/* Image half */}
        <div className="relative aspect-4/3 md:aspect-auto md:min-h-[280px] overflow-hidden">
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>

        {/* Text half with subtle tinted background */}
        <div
          className={`
            flex flex-col justify-center gap-3 p-8 md:p-10
            ${theme.bgTint} ${theme.darkBgTint}
          `}
        >
          <h3 className="text-xl md:text-2xl font-medium text-foreground leading-tight">
            {item.title}
          </h3>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-sm">
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export const WhyGIRAIMattersSection = ({
  content = defaultContent,
}: {
  content?: {
    title: string;
    description: string;
    image: string;
  }[];
  contentClassName?: string;
  backgroundColors?: string[];
  cardLinearGradients?: string[];
}) => {
  return (
    <section className="relative py-16 md:py-24">
      {/* Header */}
      <div className="flex flex-col gap-4 justify-center items-center text-center mb-12 px-4">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium">
          Why <span className="text-primary">GIRAI</span> Matters
        </h2>
        <p className="text-muted-foreground max-w-lg">
          Turning AI ethics into measurable action for governments, society, and
          public trust.
        </p>
      </div>

      {/* Sticky scroll cards */}
      <div className="relative mx-auto max-w-4xl px-4 md:px-6 flex flex-col gap-8 pb-[20vh]">
        {content.map((item, index) => (
          <StickyCard
            key={item.title}
            item={item}
            index={index}
            theme={cardThemes[index % cardThemes.length]}
          />
        ))}
      </div>
    </section>
  );
};
