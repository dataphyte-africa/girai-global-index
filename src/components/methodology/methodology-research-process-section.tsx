"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const BODY_COLOR = "#6B7280";
const SUBTITLE_COLOR = "#6B7280";
const BADGE_BG = "#F0EDFF";
const LINE_COLOR = "#E5E7EB";
const NUMBER_DECORATOR = "/methodology/number-decorator.svg";
const RINGS_DECOR = "/methodology/circular-rings.svg";

const STATS = [
  { value: "150+", label: "Researchers engaged globally" },
  { value: "3-Tier", label: "Independent review structure" },
  { value: "25", label: "Indicators assessed" },
  { value: "100%", label: "Public evidence verified" },
] as const;

const STEPS = [
  {
    title: "Expert-Led Research",
    description:
      "In-country researchers collect and document evidence using standardized questionnaires and methodological guidance.",
    color: "#7150F4",
  },
  {
    title: "Researcher Submission",
    description:
      "Completed questionnaires and supporting evidence are formally submitted through the survey system for review.",
    color: "#22C55E",
  },
  {
    title: "Country Coordinator Review",
    description:
      "Country coordinators review submissions, verify evidence quality, and ensure alignment with methodological requirements.",
    color: "#F97316",
  },
  {
    title: "Regional Supervision",
    description:
      "Regional supervisors conduct oversight, spot-check submissions, and address inconsistencies across countries.",
    color: "#EC4899",
  },
  {
    title: "Global Review",
    description:
      "Final global review and validation to ensure consistency, accuracy, and cross-country comparability.",
    color: "#EF4444",
  },
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
      className="overflow-hidden rounded-2xl bg-white shadow-[0_2px_24px_rgba(26,26,46,0.06)]"
      style={{ borderTop: `4px solid ${color}` }}
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
          <span
            className="relative flex size-9 items-center justify-center rounded-full text-sm font-semibold text-white shadow-[0_4px_14px_rgba(113,80,244,0.32)]"
            style={{ backgroundColor: PURPLE }}
          >
            {index}
          </span>
        </div>

        <h3
          className="text-lg font-bold leading-snug tracking-tight md:text-xl"
          style={{ color: HEADING_DARK }}
        >
          {title}
        </h3>

        <p
          className="mt-3 text-sm leading-[1.65] md:text-[0.9375rem] md:leading-[1.68]"
          style={{ color: BODY_COLOR }}
        >
          {description}
        </p>
      </div>
    </article>
  );
}

/**
 * Research and Review Process — stats header, sticky intro left, timeline cards right.
 */
export function MethodologyResearchProcessSection() {
  const [activeStep, setActiveStep] = useState(0);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

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
    <section className="relative w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <Image
        src={RINGS_DECOR}
        alt=""
        aria-hidden
        width={456}
        height={1110}
        className="pointer-events-none absolute -bottom-24 -left-28 hidden w-[min(42vw,22rem)] select-none opacity-80 lg:block"
      />
      <Image
        src={RINGS_DECOR}
        alt=""
        aria-hidden
        width={456}
        height={1110}
        className="pointer-events-none absolute top-1/2 -right-32 hidden w-[min(38vw,20rem)] -translate-y-1/4 select-none opacity-70 lg:block"
      />

      <div className="relative mx-auto max-w-7xl">
        <header className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight lg:leading-[1.12]">
            <span style={{ color: HEADING_DARK }}>Research and </span>
            <span style={{ color: PURPLE }}>Review Process</span>
          </h2>

          <p
            className="mt-4 text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            How multi-layered review ensures consistency, independence, and
            methodological rigor.
          </p>
        </header>

        <div
          className="mt-12 grid grid-cols-2 border-y py-10 md:mt-14 md:grid-cols-4 md:py-12 lg:mt-16"
          style={{ borderColor: LINE_COLOR }}
        >
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={cn(
                "px-4 py-3 text-center md:px-6 md:py-0",
                (index === 1 || index === 3) && "border-l",
                index >= 2 && "border-t md:border-t-0",
                index > 0 && "md:border-t-0 md:border-l"
              )}
              style={{ borderColor: LINE_COLOR }}
            >
              <p
                className="text-3xl font-bold tracking-tight md:text-4xl"
                style={{ color: HEADING_DARK }}
              >
                {stat.value}
              </p>
              <p
                className="mt-2 text-sm leading-snug md:text-[0.9375rem]"
                style={{ color: BODY_COLOR }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-1 items-start gap-10 lg:mt-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14 xl:gap-16">
          <div className="self-start lg:sticky lg:top-24">
            <span
              className="inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]"
              style={{ backgroundColor: BADGE_BG, color: PURPLE }}
            >
              <Sparkles className="size-3.5" aria-hidden />
              Research Process
            </span>

            <h3 className="mt-5 text-[1.75rem] font-bold leading-[1.18] tracking-tight md:text-4xl md:leading-[1.15] lg:text-[2.5rem]">
              <span style={{ color: PURPLE }}>Five Stages</span>
              <span style={{ color: HEADING_DARK }}> of Evidence Review</span>
            </h3>

            <p
              className="mt-4 max-w-md text-sm leading-relaxed md:text-base md:leading-[1.65]"
              style={{ color: BODY_COLOR }}
            >
              From in-country fieldwork to global validation, each submission
              advances through structured, independent checkpoints.
            </p>
          </div>

          <div className="relative flex flex-col">
            <div
              className="absolute left-4 top-5 bottom-5 w-px md:left-5"
              style={{ backgroundColor: LINE_COLOR }}
              aria-hidden
            />

            <div className="flex flex-col gap-6 md:gap-8">
              {STEPS.map((step, index) => {
                const isFilled = index <= activeStep;

                return (
                  <div key={step.title} className="relative flex gap-5 md:gap-6">
                    <div className="relative flex w-8 shrink-0 justify-center pt-8 md:w-10">
                      <span
                        className="relative z-10 size-4 rounded-full border-2 transition-all duration-300"
                        style={{
                          borderColor: step.color,
                          backgroundColor: isFilled ? step.color : "white",
                          boxShadow: isFilled
                            ? `0 0 0 4px ${step.color}22`
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
