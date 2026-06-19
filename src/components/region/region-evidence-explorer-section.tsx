"use client";

import { Suspense } from "react";
import { EvidenceExplorer } from "@/components/evidence-explorer";

export interface RegionEvidenceExplorerSectionProps {
  regionName: string;
  evidenceCount: number;
}

function RegionEvidenceExplorerInner({
  regionName,
  evidenceCount,
}: RegionEvidenceExplorerSectionProps) {
  return (
    <EvidenceExplorer
      presetRegion={regionName}
      heading={
        <>
          Evidence in <span className="text-[#6c5cff]">{regionName}</span>
        </>
      }
      subheading={
        evidenceCount > 0
          ? `${evidenceCount.toLocaleString()} evidence items documenting laws, policies, strategies, and institutional actions across ${regionName}.`
          : `No evidence items are on file for ${regionName} in the 2026 dataset.`
      }
    />
  );
}

export function RegionEvidenceExplorerSection(
  props: RegionEvidenceExplorerSectionProps
) {
  return (
    <section
      id="region-evidence"
      aria-labelledby="region-evidence-heading"
      className="scroll-mt-20 border-t border-border/60 bg-background py-16 md:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <h2
          id="region-evidence-heading"
          className="text-3xl md:text-4xl lg:text-5xl sr-only"
        >
          Evidence in {props.regionName}
        </h2>
        <Suspense
          fallback={
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading evidence explorer…
            </div>
          }
        >
          <RegionEvidenceExplorerInner {...props} />
        </Suspense>
      </div>
    </section>
  );
}
