"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";
const BODY_COLOR = "#6B7280";
const BORDER_COLOR = "rgba(113, 80, 244, 0.22)";

const TERMS = [
  {
    title: "Thematic area",
    definition:
      "Composite indicator measuring the performance of the responsible AI ecosystem in relation to a sub-component of responsible AI",
  },
  {
    title: "Dimension",
    definition:
      "One of five interconnected areas that structure GIRAI's assessment of national responsible AI — spanning inclusion, ethics, labour, trust, and public-sector use.",
  },
  {
    title: "Pillar",
    definition:
      "A structural layer assessed within each thematic area, distinguishing government frameworks, government actions, and non-state actor contributions to responsible AI.",
  },
  {
    title: "Government frameworks",
    definition:
      "The laws, policies, strategies, and institutional arrangements through which governments commit to governing AI responsibly.",
  },
  {
    title: "Government actions",
    definition:
      "Operational measures taken by government to implement responsible AI — including enforcement, oversight, procurement, and deployment in public services.",
  },
  {
    title: "Non-state actors",
    definition:
      "Initiatives and contributions from civil society, academia, industry, and other non-government actors that shape, scrutinise, and advance responsible AI.",
  },
] as const;

function KeyTermItem({
  title,
  definition,
  isOpen,
  onToggle,
}: {
  title: string;
  definition: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className="overflow-hidden rounded-2xl border bg-white shadow-[0_2px_20px_rgba(113,80,244,0.07)]"
      style={{ borderColor: BORDER_COLOR }}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left md:px-7 md:py-5"
      >
        <span
          className="text-base font-medium leading-snug md:text-[1.0625rem]"
          style={{ color: HEADING_DARK }}
        >
          {title}
        </span>
        <span
          className="flex size-6 shrink-0 items-center justify-center"
          style={{ color: PURPLE }}
          aria-hidden
        >
          {isOpen ? (
            <Minus className="size-5 stroke-[1.75]" />
          ) : (
            <Plus className="size-5 stroke-[1.75]" />
          )}
        </span>
      </button>

      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="mx-6 border-t md:mx-7" style={{ borderColor: "#ECEEF2" }} />
          <p
            className="px-6 pb-5 pt-4 text-sm leading-[1.65] md:px-7 md:pb-6 md:pt-4 md:text-[0.9375rem] md:leading-[1.68]"
            style={{ color: BODY_COLOR }}
          >
            {definition}
          </p>
        </div>
      </div>
    </div>
  );
}

/**
 * Key Terms and Definitions — single-open accordion list.
 */
export function MethodologyKeyTermsSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="relative w-full overflow-hidden px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[#FAFBFF]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-90"
        style={{
          backgroundImage:
            "radial-gradient(ellipse 55% 45% at 8% 12%, rgba(113,80,244,0.09) 0%, transparent 58%), radial-gradient(ellipse 50% 40% at 92% 88%, rgba(99,102,241,0.07) 0%, transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-3xl">
        <header className="mx-auto mb-10 max-w-2xl text-center md:mb-12 lg:mb-14">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            <span style={{ color: PURPLE }}>Key Terms </span>
            <span style={{ color: HEADING_DARK }}>and Definitions</span>
          </h2>

          <p
            className="mt-4 text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            The core concepts that shape GIRAI&apos;s methodology, clearly
            defined for transparency and consistency.
          </p>
        </header>

        <div className="flex flex-col gap-4">
          {TERMS.map((term, index) => (
            <KeyTermItem
              key={term.title}
              title={term.title}
              definition={term.definition}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
