"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { methodologyDefaults, type MethodologyContent } from "@/content/methodology.defaults";

const NUMBER_DECORATOR = "/methodology/number-decorator.svg";
const RINGS_DECOR = "/methodology/circular-rings.svg";

const STEP_COLORS = [
  "var(--process-step-1)",
  "var(--process-step-2)",
  "var(--process-step-3)",
  "var(--process-step-4)",
  "var(--process-step-5)",
] as const;

function ProcessStepCard({
  index,
  title,
  description,
  color,
  cardRef,
}: {
  index: number;
  title: string;
  description: string;
  color: string;
  cardRef: (node: HTMLDivElement | null) => void;
}) {
  return (
    <article
      ref={cardRef}
      data-step-index={index}
      className="overflow-hidden rounded-2xl border-t-4 bg-card shadow-[0_2px_24px_rgba(26,26,46,0.06)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.25)]"
      style={{ borderTopColor: color }}
    >
      <div className="p-6 md:p-7">
        <div className="relative mb-5 w-fit">
          <Image
            src={NUMBER_DECORATOR}
            alt=""
            aria-hidden
            width={31}
            height={57}
            className="pointer-events-none absolute -left-1.5 -top-3 select-none"
          />
          <span className="relative flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_4px_14px_color-mix(in_oklab,var(--primary)_32%,transparent)]">
            {index}
          </span>
        </div>

        <h3 className="text-lg font-medium leading-snug tracking-tight text-foreground md:text-xl">
          {title}
        </h3>

        <p className="mt-3 text-sm leading-[1.65] text-muted-foreground md:text-[0.9375rem] md:leading-[1.68]">
          {description}
        </p>
      </div>
    </article>
  );
}

/**
 * Research and Review Process — stats header, sticky intro left, timeline cards right.
 */
export function MethodologyResearchProcessSection({
  content = methodologyDefaults,
}: {
  content?: MethodologyContent;
}) {
  const [activeStep, setActiveStep] = useState(0);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);
  const steps = content.processSteps.map((step, i) => ({
    ...step,
    color: STEP_COLORS[i % STEP_COLORS.length],
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (!visible[0]) return;

        const index = Number(visible[0].target.getAttribute("data-step-index"));
        if (!Number.isNaN(index)) setActiveStep(index);
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    const nodes = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full bg-card px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <Image
        src={RINGS_DECOR}
        alt=""
        aria-hidden
        width={456}
        height={1110}
        className="pointer-events-none absolute -bottom-24 -left-28 hidden w-[min(42vw,22rem)] select-none opacity-80 dark:opacity-30 lg:block"
      />
      <Image
        src={RINGS_DECOR}
        alt=""
        aria-hidden
        width={456}
        height={1110}
        className="pointer-events-none absolute top-1/2 -right-32 hidden w-[min(38vw,20rem)] -translate-y-1/4 select-none opacity-70 dark:opacity-25 lg:block"
      />

      <div className="relative mx-auto max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight lg:leading-[1.12]">
            <span className="text-foreground">{content.processHeadingLead}</span>
            <span className="text-primary">{content.processHeadingAccent}</span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base md:leading-[1.65]">
            {content.processSubtitle}
          </p>
        </header>

        <div className="mt-12 grid grid-cols-2 border-y border-border py-10 md:mt-14 md:grid-cols-4 md:py-12 lg:mt-16">
          {content.processStats.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "px-4 py-3 text-center md:px-6 md:py-0",
                (index === 1 || index === 3) && "border-l border-border",
                index >= 2 && "border-t border-border md:border-t-0",
                index > 0 && "md:border-t-0 md:border-l md:border-border"
              )}
            >
              <p className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm leading-snug text-muted-foreground md:text-[0.9375rem]">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:mt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-16">
          <div className="self-start lg:sticky lg:top-24">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
              <Sparkles className="size-3.5" aria-hidden />
              {content.processBadge}
            </span>

            <h3 className="mt-5 text-[1.75rem] font-medium leading-[1.18] tracking-tight md:text-4xl md:leading-[1.15] lg:text-[2.5rem]">
              <span className="text-primary">{content.processStagesHeadingAccent}</span>
              <span className="text-foreground">{content.processStagesHeadingTail}</span>
            </h3>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base md:leading-[1.65]">
              {content.processStagesIntro}
            </p>
          </div>

          <div className="relative flex flex-col">
            <div
              className="absolute left-4 top-5 bottom-5 w-px bg-border md:left-5"
              aria-hidden
            />

            <div className="flex flex-col gap-6 md:gap-8">
              {steps.map((step, index) => {
                const isFilled = index <= activeStep;

                return (
                  <div key={step.title} className="relative flex gap-5 md:gap-6">
                    <div className="relative flex w-8 shrink-0 justify-center pt-8 md:w-10">
                      <span
                        className="relative z-10 size-4 rounded-full border-2 transition-all duration-300"
                        style={{
                          borderColor: step.color,
                          backgroundColor: isFilled ? step.color : "var(--card)",
                          boxShadow: isFilled
                            ? `0 0 0 4px color-mix(in oklab, ${step.color} 13%, transparent)`
                            : undefined,
                        }}
                        aria-hidden
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <ProcessStepCard
                        index={index + 1}
                        title={step.title}
                        description={step.description}
                        color={step.color}
                        cardRef={(node) => {
                          cardRefs.current[index] = node;
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div aria-hidden className="hidden h-16 lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
