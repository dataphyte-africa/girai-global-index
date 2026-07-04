"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { takeawaysDefaults, type TakeawaysContent } from "@/content/takeaways.defaults";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";
const BODY_COLOR = "#6B7280";
const BORDER_COLOR = "#ECEEF2";
const LABEL_COLOR = "#B8BDC6";

function InsightCard({
  index,
  title,
  description,
  className,
}: {
  index: number;
  title: string;
  description: string;
  className?: string;
}) {
  const numberLabel = String(index).padStart(2, "0");

  return (
    <article
      className={cn(
        "flex snap-start flex-col bg-white px-8 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14",
        "w-[min(85vw,20rem)] shrink-0 md:w-[22rem] lg:w-[23rem]",
        className
      )}
    >
      <div className="flex flex-col">
        <span
          className="text-[2.5rem] font-medium leading-none tabular-nums md:text-[2.75rem]"
          style={{ color: LABEL_COLOR }}
        >
          {numberLabel}
        </span>
        <span
          className="mt-1.5 text-[0.625rem] font-medium uppercase tracking-[0.22em]"
          style={{ color: LABEL_COLOR }}
        >
          Priority
        </span>
      </div>

      <h3
        className="mt-8 text-lg font-medium leading-snug tracking-tight md:mt-9 md:text-xl md:leading-[1.3]"
        style={{ color: HEADING_DARK }}
      >
        {title}
      </h3>

      <p
        className="mt-4 max-w-[38ch] text-sm leading-[1.68] md:mt-5 md:text-[0.9375rem] md:leading-[1.7]"
        style={{ color: BODY_COLOR }}
      >
        {description}
      </p>
    </article>
  );
}

function ArrowButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "prev" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={direction === "prev" ? "Previous priorities" : "Next priorities"}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full border bg-white transition",
        "hover:border-[#7150F4] hover:text-[#7150F4]",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:border-[#ECEEF2] disabled:hover:text-current"
      )}
      style={{ borderColor: BORDER_COLOR, color: HEADING_DARK }}
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={direction === "prev" ? "rotate-180" : undefined}
        aria-hidden="true"
      >
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
      </svg>
    </button>
  );
}

/**
 * Horizontal-scroll carousel of the report's priorities below the Top Takeaways intro.
 */
export function TakeawaysKeyInsightsSection({
  content = takeawaysDefaults,
}: {
  content?: TakeawaysContent;
}) {
  const insights = content.insights;
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateArrows = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollPrev(scrollLeft > 1);
    setCanScrollNext(scrollLeft < scrollWidth - clientWidth - 1);
  }, []);

  useEffect(() => {
    updateArrows();
    const el = scrollerRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [updateArrows]);

  const scrollBy = useCallback((direction: "prev" | "next") => {
    const el = scrollerRef.current;
    if (!el) return;
    const firstCard = el.querySelector("article");
    const step = firstCard ? (firstCard as HTMLElement).offsetWidth : el.clientWidth * 0.8;
    el.scrollBy({ left: direction === "next" ? step : -step, behavior: "smooth" });
  }, []);

  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto mb-12 flex max-w-4xl flex-col items-center gap-6 text-center md:mb-14 md:flex-row md:items-end md:justify-between md:gap-8 md:text-left lg:mb-16">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight lg:leading-[1.12]">
              <span style={{ color: PURPLE }}>{content.keyInsightsHeadingAccent}</span>
              <span style={{ color: HEADING_DARK }}>{content.keyInsightsHeadingTail}</span>
            </h2>

            <p
              className="mt-4 text-sm leading-relaxed md:text-base md:leading-[1.65]"
              style={{ color: SUBTITLE_COLOR }}
            >
              {content.keyInsightsSubtitle}
            </p>
          </div>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <ArrowButton
              direction="prev"
              disabled={!canScrollPrev}
              onClick={() => scrollBy("prev")}
            />
            <ArrowButton
              direction="next"
              disabled={!canScrollNext}
              onClick={() => scrollBy("next")}
            />
          </div>
        </header>

        <div
          className="overflow-hidden border bg-white"
          style={{ borderColor: BORDER_COLOR }}
        >
          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {insights.map((item, index) => (
              <InsightCard
                key={item.title}
                index={index + 1}
                title={item.title}
                description={item.description}
                className={cn(
                  index < insights.length - 1 && "border-r",
                  "border-[#ECEEF2]"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
