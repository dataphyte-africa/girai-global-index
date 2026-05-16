"use client";

import React from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { Button } from "@/components/ui/button";

type ImpactCard = {
  title: string;
  description: string;
  href: string;
};

const cards: ImpactCard[] = [
  {
    title: "International Organisation",
    description:
      "GIRAI provides clear benchmarks and comparative insights that help policymakers identify gaps, track progress, and design stronger governance frameworks for artificial intelligence.",
    href: "#impact-international",
  },
  {
    title: "Global Policy makers",
    description:
      "By making scores traceable to public evidence, GIRAI promotes greater openness in how AI governance is measured and encourages accountable decision-making across institutions.",
    href: "#impact-policy",
  },
  {
    title: "Media Institutions",
    description:
      "Researchers, advocates, and civil society organisations use GIRAI data to inform public debate, support advocacy efforts, and advance more inclusive approaches to responsible AI.",
    href: "#impact-media",
  },
];

function ImpactCardItem({ item, index }: { item: ImpactCard; index: number }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.55, ease: "easeOut", delay: index * 0.08 }}
      className="flex flex-col gap-5 rounded-2xl border border-border/60 bg-card/80 p-6 backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-card md:p-7 dark:bg-card/40 dark:hover:bg-card/70"
    >
      <h3 className="text-lg md:text-xl font-semibold text-foreground">
        {item.title}
      </h3>
      <p className="text-sm leading-relaxed text-muted-foreground">
        {item.description}
      </p>
      <div className="mt-auto pt-2">
        <Button
          asChild
          size="sm"
          className="rounded-md bg-primary px-4 text-primary-foreground hover:bg-primary/90"
        >
          <a href={item.href}>Read more</a>
        </Button>
      </div>
    </motion.div>
  );
}

export function OurImpactSection() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-20 md:py-28"
    >
      {/* Decorative circular rings — top right + bottom left */}
      <Image
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
      />

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-4 text-center md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-[1.1]">
            <span className="text-foreground">Our Impact on </span>
            <span className="text-primary">Responsible AI Governance</span>
          </h2>
          <p className="max-w-2xl text-sm md:text-base text-muted-foreground leading-relaxed">
            How GIRAI is helping governments, researchers, civil society, and
            institutions understand and strengthen responsible AI governance
            worldwide.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {cards.map((item, index) => (
            <ImpactCardItem key={item.title} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
