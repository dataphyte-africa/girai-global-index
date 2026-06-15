"use client";

import { Suspense } from "react";
import { EvidenceExplorer } from "@/components/evidence-explorer";

export interface CountryEvidenceExplorerSectionProps {
  iso3: string;
  countryName: string;
  evidenceCount: number;
}

function CountryEvidenceExplorerInner({
  iso3,
  countryName,
  evidenceCount,
}: CountryEvidenceExplorerSectionProps) {
  return (
    <EvidenceExplorer
      presetCountryIso3={iso3}
      heading={
        <>
          Evidence for <span className="text-[#6c5cff]">{countryName}</span>
        </>
      }
      subheading={
        evidenceCount > 0
          ? `${evidenceCount.toLocaleString()} evidence items documenting laws, policies, strategies, and institutional actions in ${countryName}.`
          : `No evidence items are on file for ${countryName} in the 2026 dataset.`
      }
    />
  );
}

export function CountryEvidenceExplorerSection(
  props: CountryEvidenceExplorerSectionProps
) {
  return (
    <section
      id="country-evidence"
      aria-labelledby="country-evidence-heading"
      className="scroll-mt-20 border-t border-border/60 bg-background py-16 md:py-24"
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <h2 id="country-evidence-heading" className="text-3xl md:text-4xl lg:text-5xl sr-only">
          Evidence for {props.countryName}
        </h2>
        <Suspense
          fallback={
            <div className="py-16 text-center text-sm text-muted-foreground">
              Loading evidence explorer…
            </div>
          }
        >
          <CountryEvidenceExplorerInner {...props} />
        </Suspense>
      </div>
    </section>
  );
}
