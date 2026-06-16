"use client";

import React from "react";
import { AnimatePresence, motion, useInView } from "motion/react";
import { Plus } from "lucide-react";
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

function TakeawayAccordionItem({
  item,
  index,
  isOpen,
  onToggle,
}: {
  item: Takeaway;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
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
          {item.title}
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
              <p className="pt-4 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
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
  const [openIndex, setOpenIndex] = React.useState<number | null>(0);

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

      <div className="relative mx-auto max-w-3xl px-4 md:px-6">
        {showHeader ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mx-auto mb-10 flex max-w-2xl flex-col items-center gap-3 text-center md:mb-14"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">
              <span className="text-primary">Top 10</span>{" "}
              <span className="text-foreground">take away</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
              Strengthening Clarity, Comparability, and Implementation Focus
            </p>
          </motion.div>
        ) : null}

        <div className="flex flex-col gap-3 md:gap-4">
          {takeaways.map((item, index) => (
            <TakeawayAccordionItem
              key={item.title}
              item={item}
              index={index}
              isOpen={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            />
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
