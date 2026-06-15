"use client";

import React from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { PILLARS } from "@/data/2026/taxonomy";
import { PILLAR_COPY } from "@/lib/pillar-copy";

function CategoryColumn({
  heading,
  body,
  image,
  index,
}: {
  heading: string;
  body: string;
  image: string;
  index: number;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.08 }}
      className="flex flex-col gap-4"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={heading}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
      </div>
      <h3 className="text-lg font-semibold text-foreground md:text-xl">
        {heading}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
    </motion.div>
  );
}

export function IndicatorCategorySection() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="indicators"
      ref={sectionRef}
      className="relative w-full overflow-hidden py-20 md:py-20"
    >
      <Image
        src="/impact/circular-rings.svg"
        alt=""
        aria-hidden
        width={398}
        height={479}
        className="pointer-events-none absolute rotate-180 right-0 top-[0px] w-[260px] opacity-90 md:w-[340px] lg:w-[340px]"
      />
      <Image
        src="/impact/circular-rings.svg"
        alt=""
        aria-hidden
        width={398}
        height={479}
        className="pointer-events-none absolute -bottom-16 -left-16 w-[220px]  opacity-90 md:w-[300px] lg:w-[360px]"
      />

      <div className="relative mx-auto max-w-6xl px-3 md:px-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.1] tracking-tight">
            <span className="text-primary">Three Categories</span>
            <span className="text-foreground">
              {" "}
              of Responsible AI Indicators
            </span>
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            To provide a comprehensive picture, the indicators for the Global
            Index of Responsible AI are grouped into three categories
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-6 lg:gap-8">
          {PILLARS.map((pillar, index) => {
            const copy = PILLAR_COPY[pillar.slug];
            return (
              <CategoryColumn
                key={pillar.slug}
                heading={copy.heading}
                body={copy.body}
                image={copy.image}
                index={index}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
