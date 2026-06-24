"use client";

import React from "react";
import { motion, useInView } from "motion/react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { homeDefaults, type HomeContent } from "@/content/home.defaults";

type CarouselTakeaway = {
  category: string;
  title: string;
  description: string;
  stat: string;
  statCaption: string;
};

type CardTheme = {
  bg: string;
  accent: string;
  dark: {
    bg: string;
    accent: string;
    pillBg: string;
  };
};

/** Light pastels + dark chromatic-depth pairs — each hue preserved, not neutralized. */
const cardThemes: CardTheme[] = [
  {
    bg: "#D3C9FC",
    accent: "#7150F4",
    dark: { bg: "#1A152E", accent: "#A78BFA", pillBg: "rgba(167, 139, 250, 0.14)" },
  },
  {
    bg: "#F7FEE7",
    accent: "#84CC16",
    dark: { bg: "#171F0E", accent: "#BEF264", pillBg: "rgba(190, 242, 100, 0.12)" },
  },
  {
    bg: "#EFF6FF",
    accent: "#3B82F6",
    dark: { bg: "#0F1829", accent: "#60A5FA", pillBg: "rgba(96, 165, 250, 0.14)" },
  },
  {
    bg: "#FAF5FF",
    accent: "#A855F7",
    dark: { bg: "#1A1225", accent: "#C084FC", pillBg: "rgba(192, 132, 252, 0.14)" },
  },
  {
    bg: "#F0F9FF",
    accent: "#0EA5E9",
    dark: { bg: "#0B1C25", accent: "#38BDF8", pillBg: "rgba(56, 189, 248, 0.14)" },
  },
  {
    bg: "#EEF2FF",
    accent: "#6366F1",
    dark: { bg: "#131428", accent: "#818CF8", pillBg: "rgba(129, 140, 248, 0.14)" },
  },
  {
    bg: "#ECFEFF",
    accent: "#06B6D4",
    dark: { bg: "#0B1C20", accent: "#22D3EE", pillBg: "rgba(34, 211, 238, 0.14)" },
  },
  {
    bg: "#ECFDF5",
    accent: "#10B981",
    dark: { bg: "#0C1C16", accent: "#34D399", pillBg: "rgba(52, 211, 153, 0.14)" },
  },
  {
    bg: "#FDF4FF",
    accent: "#D946EF",
    dark: { bg: "#1F1022", accent: "#E879F9", pillBg: "rgba(232, 121, 249, 0.14)" },
  },
  {
    bg: "#F1EEFE",
    accent: "#7150F4",
    dark: { bg: "#181325", accent: "#B794F6", pillBg: "rgba(183, 148, 246, 0.14)" },
  },
];

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
  const theme = cardThemes[index] ?? cardThemes[0];
  const numberLabel = String(index + 1).padStart(2, "0");

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: (index % 3) * 0.08 }}
      data-carousel-card
      style={
        {
          "--card-bg": theme.bg,
          "--card-accent": theme.accent,
          "--pill-bg": "#ffffff",
          "--card-bg-dark": theme.dark.bg,
          "--card-accent-dark": theme.dark.accent,
          "--pill-bg-dark": theme.dark.pillBg,
        } as React.CSSProperties
      }
      className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl bg-(--card-bg) p-6 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_20px_40px_-24px_rgba(76,29,149,0.22)] ring-1 ring-black/4 sm:w-[340px] sm:p-7 md:w-[500px] dark:bg-(--card-bg-dark) dark:shadow-[0_4px_32px_-8px_rgba(0,0,0,0.55)] dark:ring-white/8"
    >
      <div className="flex items-start justify-between">
        <span className="text-4xl font-semibold leading-none tracking-tight tabular-nums text-(--card-accent) sm:text-5xl dark:text-(--card-accent-dark)">
          {numberLabel}
        </span>
        <span className="inline-flex items-center rounded-full bg-(--pill-bg) px-4 py-2 text-xs font-medium text-(--card-accent) dark:bg-(--pill-bg-dark) dark:text-(--card-accent-dark)">
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
        <div className="text-3xl font-medium tracking-tight text-(--card-accent) sm:text-4xl dark:text-(--card-accent-dark)">
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
  content?: HomeContent;
}

export function TopTakeawaysCarouselSection({
  showCta = true,
  content = homeDefaults,
}: TopTakeawaysCarouselSectionProps = {}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);

  const updateScrollState = React.useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const maxScrollLeft = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 1);
    setCanScrollRight(el.scrollLeft < maxScrollLeft - 1);
  }, []);

  React.useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByDirection = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const firstCard = el.querySelector<HTMLElement>("[data-carousel-card]");
    const gap = 20;
    const amount = firstCard ? firstCard.offsetWidth + gap : el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

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
                {content.takeawaysBadge}
              </span>
              <h2 className="text-3xl font-medium tracking-tight md:text-4xl lg:text-5xl">
                <span className="text-primary">{content.takeawaysHeadingAccent}</span>{" "}
                <span className="text-foreground">{content.takeawaysHeadingTail}</span>
              </h2>
              <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
                {content.takeawaysSubtitle}
              </p>
            </div>

            {showCta ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-fit shrink-0 border-primary/40 bg-background/60 px-6 text-primary hover:bg-primary/5 hover:text-primary dark:bg-background/30 dark:hover:bg-primary/10"
              >
                <a href="/takeaways">{content.takeawaysViewAllLabel}</a>
              </Button>
            ) : null}
          </motion.div>
        </div>

        <div className="mt-10 md:mt-14">
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 scroll-pl-[max(1rem,calc((100vw-72rem)/2+1rem))] pl-[max(1rem,calc((100vw-72rem)/2+1rem))] pr-[max(1rem,calc((100vw-72rem)/2+1rem))] [-ms-overflow-style:none] scrollbar-none md:scroll-pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:pr-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] [&::-webkit-scrollbar]:hidden"
          >
            {takeaways.map((item, index) => (
              <TakeawayCarouselCard key={item.title} item={item} index={index} />
            ))}
          </div>

          <div className="mx-auto mt-6 flex max-w-6xl justify-end gap-3 px-4 md:px-6">
            <button
              type="button"
              aria-label="Scroll takeaways left"
              onClick={() => scrollByDirection("left")}
              disabled={!canScrollLeft}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-background/70 text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-background/30 dark:hover:bg-primary/10"
            >
              <ChevronLeft className="h-5 w-5" strokeWidth={2.2} />
            </button>
            <button
              type="button"
              aria-label="Scroll takeaways right"
              onClick={() => scrollByDirection("right")}
              disabled={!canScrollRight}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-primary/30 bg-background/70 text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-background/30 dark:hover:bg-primary/10"
            >
              <ChevronRight className="h-5 w-5" strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
