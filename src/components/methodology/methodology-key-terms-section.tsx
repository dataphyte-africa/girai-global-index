"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

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
    <div className="overflow-hidden rounded-2xl border border-primary/20 bg-card shadow-[0_2px_20px_color-mix(in_oklab,var(--primary)_7%,transparent)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left md:px-7 md:py-5"
      >
        <span className="text-base font-medium leading-snug text-foreground md:text-[1.0625rem]">
          {title}
        </span>
        <span className="flex size-6 shrink-0 items-center justify-center text-primary" aria-hidden>
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
          <div className="mx-6 border-t border-border md:mx-7" />
          <p className="px-6 pb-5 pt-4 text-sm leading-[1.65] text-muted-foreground md:px-7 md:pb-6 md:pt-4 md:text-[0.9375rem] md:leading-[1.68]">
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
        className="methodology-key-terms-bg pointer-events-none absolute inset-0"
      />

      <div className="relative mx-auto max-w-3xl">
        <header className="mx-auto mb-10 max-w-2xl text-center md:mb-12 lg:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight lg:leading-[1.12]">
            <span className="text-primary">Key Terms </span>
            <span className="text-foreground">and Definitions</span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base md:leading-[1.65]">
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
