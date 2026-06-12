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
    title:
      "AI is accelerating faster than governments can govern it in the public interest",
    description:
      "Diffusion of AI is expanding, with 53% of the global population having used generative AI tools. Yet average GIRAI scores remain low, at roughly 35 out of 100, and evidence of implementation exists in only 55% of cases where frameworks are active, falling to 45% in Global South countries.",
  },
  {
    title:
      "Responsible AI governance is expanding in Global South countries, but binding protections remain scarce",
    description:
      "Since the 1st Edition, Global South countries substantially broadened the responsible AI content of their national frameworks. On average, the number of GIRAI topics covered rose from 2.5 to 4.7, an 88% increase. In Global North countries, the number rose from 8.2 to 11.1, a 35% increase. Global South countries account for 203 of the 306 new country cases of indicators covered by frameworks identified since the 1st Edition. Despite this progress, most of the growth is in soft law: 78% of responsible AI framework cases in these countries are non-binding, compared with 42% in Global North countries.",
  },
  {
    title:
      "AI safety is being governed as a technical problem, while human harms remain under-addressed",
    description:
      "AI safety and security is one of the fastest-growing areas of governance, but much of it focuses on technical safeguards. Meanwhile, the Index found credible evidence of government misuse of AI in 35 of 135 countries, and only 49 countries (36%) have frameworks addressing AI-facilitated misinformation and violence.",
  },
  {
    title:
      "Governments are regulating AI transparency but not disclosing their own use of AI",
    description:
      "Transparency and Explainability is the strongest-performing indicator, with 58% of countries having some form of framework. Yet implementation lags behind the existence of frameworks. For government use of AI, Public Disclosure of Government Algorithmic Systems is the weakest-performing indicator, with only 18% of countries requiring disclosure of government AI systems.",
  },
  {
    title:
      "Gender is increasingly recognised in AI governance, but protection from gendered harms remains weak",
    description:
      "Gender equality is gaining visibility, with 29 new countries addressing gender and AI since the 1st Edition, but only 24 of 55 countries with gender-related frameworks show evidence of implementation. Protection from gendered AI harms remains limited.",
  },
  {
    title:
      "Future generations are being prepared for the AI economy but not protected from AI-related harms",
    description:
      "AI Literacy is one of the strongest-performing indicators, with 71 countries (53%) having some framework in place and 106 countries showing evidence of some activity in this area. By contrast, only 55 countries (41%) have frameworks addressing Children’s Rights in AI, and only 27 of them show evidence of implementation.",
  },
  {
    title:
      "AI’s environmental footprint remains a blind spot in responsible AI governance",
    description:
      "Only 27% of countries have frameworks addressing AI’s environmental effects, and 83% of those frameworks are non-binding. Very few governments require disclosure of AI’s energy use, water use, or environmental impact, contributing to making the environmental impact of AI a global blind spot.",
  },
  {
    title:
      "Governments recognise the need for local-language AI but do not require developers to deliver it",
    description:
      "Governments are investing in local-language technologies and cultural inclusion, with 52 countries (39%) showing government-led initiatives. Only 47 countries (35%) have frameworks addressing Cultural and Linguistic Diversity, and few require developers to use diverse datasets or adapt systems to local contexts.",
  },
  {
    title: "Governments are investing in AI skills but neglecting workers’ rights",
    description:
      "Labour protection frameworks exist in only 39 countries (29%), compared with 72 countries (53%) with frameworks on reskilling and upskilling. Few countries address workers’ rights to organise and collectively bargain in response to AI-driven workplace change.",
  },
  {
    title:
      "Global AI governance is fragmenting before a shared floor of protection has been established",
    description:
      "Average GIRAI scores range from 55 in Global North countries to 27 in Global South countries. Available evidence shows that 164 of 215 recent AI-related frameworks are non-binding, and multi-stakeholder consultations appear only 31 times in the global implementation record. Only 73 of 135 countries (54%) have adopted a national AI policy or equivalent framework, and just 36 countries (27%) have operational mechanisms for participation of civil society organisations (CSOs) in AI governance. Without a shared rights-based floor, interoperability risks serving markets before it protects people.",
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

interface TopTakeawaysSectionProps {
  showHeader?: boolean;
  showCta?: boolean;
}

export function TopTakeawaysSection({
  showHeader = true,
  showCta = true,
}: TopTakeawaysSectionProps = {}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      id="all-takeaways"
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
        {showHeader ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mb-12 flex max-w-2xl flex-col items-center gap-4 text-center md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
              <span className="text-primary">Key</span>{" "}
              <span className="text-foreground">Findings</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
              What the data from 135 countries and jurisdictions reveals about
              the state of AI governance worldwide.
            </p>
          </motion.div>
        ) : null}

        {/* Grid of takeaways */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {takeaways.map((item, index) => (
            <TakeawayCard key={item.title} item={item} index={index} />
          ))}
        </div>

        {showCta ? (
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
              <a href="/takeaways">View All Takeaways</a>
            </Button>
          </motion.div>
        ) : null}
      </div>
    </section>
  );
}
