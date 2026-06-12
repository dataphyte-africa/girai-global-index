"use client";

import { Suspense } from "react";
import { EvidenceExplorer } from "@/components/evidence-explorer";

const PURPLE = "#7150F4";

export interface IndicatorEvidenceExplorerSectionProps {
  indicatorSlug: string;
  indicatorName: string;
}

function IndicatorEvidenceExplorerInner({
  indicatorSlug,
}: IndicatorEvidenceExplorerSectionProps) {
  return (
    <EvidenceExplorer
      presetIndicatorSlug={indicatorSlug}
      heading={
        <>
          What&apos;s <span style={{ color: PURPLE }}>Behind</span> the Scores
        </>
      }
      subheading="Explore the laws, policies, and governance actions that support each country's GIRAI score. Move beyond numbers — into evidence."
      searchPlaceholder="Search policies, laws, countries, indicators"
    />
  );
}

/**
 * Evidence Explorer on the indicator detail page — pre-filtered to the
 * indicator being viewed, with the "What's Behind the Scores" heading.
 */
export function IndicatorEvidenceExplorerSection({
  indicatorSlug,
  indicatorName,
}: IndicatorEvidenceExplorerSectionProps) {
  return (
    <section
      id="indicator-evidence"
      aria-labelledby="indicator-evidence-heading"
      className="scroll-mt-20 bg-[#F7F8FA] py-16 md:py-24"
    >
      <h2 id="indicator-evidence-heading" className="sr-only">
        Evidence for {indicatorName}
      </h2>
      <Suspense
        fallback={
          <div className="py-16 text-center text-sm text-muted-foreground">
            Loading evidence explorer…
          </div>
        }
      >
        <IndicatorEvidenceExplorerInner
          indicatorSlug={indicatorSlug}
          indicatorName={indicatorName}
        />
      </Suspense>
    </section>
  );
}
