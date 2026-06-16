"use client";

import React from "react";
import { motion, useInView } from "motion/react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

type CarouselTakeaway = {
  category: string;
  title: string;
  description: string;
  stat: string;
  statCaption: string;
};

const takeaways: CarouselTakeaway[] = [
  {
    category: "Governance",
    title: "AI is accelerating faster than governments can govern it in the public interest",
    description:
      "Diffusion of AI is expanding, with 53% of the global population having used generative AI tools. Yet average GIRAI scores remain low, at roughly 35 out of 100, and evidence of implementation exists in only 55% of cases where frameworks are active, falling to 45% in Global South countries.",
    stat: "53%",
    statCaption: "of the global population has used generative AI tools",
  },
  {
    category: "Global South",
    title: "Responsible AI governance is expanding but binding protections remain weak",
    description:
      "Global South countries substantially broadened responsible AI content in their national frameworks — topics covered rose from 2.5 to 4.7, an 88% increase. Yet 78% of responsible AI framework cases in these countries are non-binding, compared with 42% in Global North countries.",
    stat: "88%",
    statCaption: "increase in responsible AI topics covered by Global South frameworks",
  },
  {
    category: "Safety",
    title: "AI safety is governed as a technical problem while human harms remain under-addressed",
    description:
      "AI safety and security is one of the fastest-growing areas, but much of it focuses on technical safeguards. The Index found credible evidence of government misuse of AI in 35 of 135 countries, and only 36% of countries have frameworks addressing AI-facilitated misinformation and violence.",
    stat: "35",
    statCaption: "countries with credible evidence of government AI misuse",
  },
  {
    category: "Transparency",
    title: "Governments are regulating AI transparency but not disclosing their own use of AI",
    description:
      "Transparency and Explainability is the strongest-performing indicator, with 58% of countries having some form of framework. Yet Public Disclosure of Government Algorithmic Systems is the weakest-performing indicator.",
    stat: "18%",
    statCaption: "of countries require disclosure of government AI systems",
  },
  {
    category: "Gender",
    title: "Gender is increasingly recognised but protection from gendered harms remains weak",
    description:
      "Gender equality is gaining visibility, with 29 new countries addressing gender and AI since the 1st Edition, but only 24 of 55 countries with gender-related frameworks show evidence of implementation.",
    stat: "29",
    statCaption: "new countries addressing gender and AI since the 1st Edition",
  },
  {
    category: "Education",
    title: "Future generations are prepared for the AI economy but not protected from harms",
    description:
      "AI Literacy is one of the strongest-performing indicators, with 71 countries (53%) having a framework in place. By contrast, only 55 countries (41%) have frameworks addressing Children's Rights in AI, and only 27 show evidence of implementation.",
    stat: "53%",
    statCaption: "of countries have an AI literacy framework in place",
  },
  {
    category: "Environment",
    title: "AI's environmental footprint remains a blind spot in responsible AI governance",
    description:
      "Only 27% of countries have frameworks addressing AI's environmental effects, and 83% of those frameworks are non-binding. Very few governments require disclosure of AI's energy use, water use, or environmental impact.",
    stat: "27%",
    statCaption: "of countries have frameworks on AI's environmental effects",
  },
  {
    category: "Inclusion",
    title: "Governments recognise the need for local-language AI but do not require developers to deliver it",
    description:
      "Governments are investing in local-language technologies, with 52 countries (39%) showing government-led initiatives. Only 47 countries (35%) have frameworks addressing Cultural and Linguistic Diversity, and few require developers to use diverse datasets.",
    stat: "35%",
    statCaption: "of countries have a cultural and linguistic diversity framework",
  },
  {
    category: "Labour",
    title: "Governments are investing in AI skills but neglecting workers' rights",
    description:
      "Labour protection frameworks exist in only 39 countries (29%), compared with 72 countries (53%) with frameworks on reskilling and upskilling. Few countries address workers' rights to organise and collectively bargain.",
    stat: "29%",
    statCaption: "of countries have a labour protection framework",
  },
  {
    category: "Equity",
    title: "Global AI governance is fragmenting before a shared floor of protection is established",
    description:
      "Average GIRAI scores range from 55 in Global North to 27 in Global South countries. Only 73 of 135 countries (54%) have adopted a national AI policy, and just 36 countries (27%) have operational mechanisms for civil society participation.",
    stat: "54%",
    statCaption: "of countries have adopted a national AI policy or equivalent",
  },
];

function TakeawayCarouselCard({
  item,
  index,
}: {
  item: CarouselTakeaway;
  index: number;
}) {
  const numberLabel = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: (index % 3) * 0.08 }}
      className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl bg-white/90 p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_40px_-24px_rgba(76,29,149,0.22)] ring-1 ring-black/4 backdrop-blur-sm sm:w-[340px] sm:p-7 md:w-[500px] dark:bg-card/70 dark:ring-white/10 dark:shadow-[0_1px_2px_rgba(0,0,0,0.4),0_20px_40px_-24px_rgba(0,0,0,0.6)]"
    >
      <div className="flex items-start justify-between">
        <span className="text-4xl font-semibold leading-none tracking-tight text-foreground/10 tabular-nums sm:text-5xl dark:text-white/10">
          {numberLabel}
        </span>
        <span className="inline-flex items-center rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary">
          {item.category}
        </span>
      </div>

      <h3 className="mt-6 text-lg font-medium leading-snug tracking-tight text-foreground sm:text-xl">
        {item.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {item.description}
      </p>

      <div className="mt-6 h-px w-full bg-border/70" />

      <div className="mt-5">
        <div className="text-3xl font-medium tracking-tight text-primary sm:text-4xl">
          {item.stat}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
          {item.statCaption}
        </p>
      </div>
    </motion.article>
  );
}

interface TopTakeawaysCarouselSectionProps {
  showCta?: boolean;
}

export function TopTakeawaysCarouselSection({
  showCta = true,
}: TopTakeawaysCarouselSectionProps = {}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative isolate overflow-hidden py-20 md:py-28"
    >
      {/* Light: theme background + Figma mesh image; Dark: theme background + violet radial mesh */}
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
            // Cool teal/cyan wash on the left (matches the mint of the light mesh)
            "radial-gradient(60% 55% at 5% 55%, rgba(56, 189, 248, 0.16) 0%, rgba(56, 189, 248, 0) 70%)",
            // Pale lavender column slightly left of center
            "radial-gradient(35% 80% at 28% 60%, rgba(167, 139, 250, 0.18) 0%, rgba(167, 139, 250, 0) 70%)",
            // Violet blob upper-center
            "radial-gradient(40% 35% at 55% 10%, rgba(139, 92, 246, 0.22) 0%, rgba(139, 92, 246, 0) 70%)",
            // Indigo/lilac wash on the right
            "radial-gradient(55% 70% at 95% 40%, rgba(129, 140, 248, 0.18) 0%, rgba(129, 140, 248, 0) 70%)",
            // Soft cool highlight bottom-right
            "radial-gradient(50% 50% at 80% 95%, rgba(96, 165, 250, 0.12) 0%, rgba(96, 165, 250, 0) 70%)",
            // Subtle violet core to mimic the bright center
            "radial-gradient(45% 40% at 45% 50%, rgba(168, 85, 247, 0.14) 0%, rgba(168, 85, 247, 0) 70%)",
          ].join(", "),
        }}
      />

      <div className="relative">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between"
          >
            <div className="flex max-w-xl flex-col gap-4">
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
                <Sparkles className="h-3.5 w-3.5" strokeWidth={2.2} />
                Takeaway
              </span>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
                <span className="text-primary">Top 10</span>{" "}
                <span className="text-foreground">take away</span>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                What the data from 135 countries and jurisdictions reveals about
                the state of AI governance worldwide.
              </p>
            </div>

            {showCta ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-fit shrink-0 border-primary/40 bg-background/60 px-6 text-primary hover:bg-primary/5 hover:text-primary dark:bg-background/30 dark:hover:bg-primary/10"
              >
                <a href="/takeaways">View All Takeaways</a>
              </Button>
            ) : null}
          </motion.div>
        </div>

        <div className="mt-10 md:mt-14">
          <div
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 scroll-pl-[max(1rem,calc((100vw-72rem)/2+1rem))] pl-[max(1rem,calc((100vw-72rem)/2+1rem))] pr-[max(1rem,calc((100vw-72rem)/2+1rem))] [-ms-overflow-style:none] scrollbar-none md:scroll-pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:pr-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] [&::-webkit-scrollbar]:hidden"
          >
            {takeaways.map((item, index) => (
              <TakeawayCarouselCard key={item.title} item={item} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
