"use client";

import { Suspense } from "react";
import { Info } from "lucide-react";
import { EvidenceExplorer } from "@/components/evidence-explorer";
import { getCountryNote, type CountryNote } from "@/content/countryNotes";

export interface CountryEvidenceExplorerSectionProps {
  iso3: string;
  countryName: string;
  /** Distinct pieces of evidence (deduped across indicators). */
  uniqueEvidenceCount: number;
  /** Indicator cases — one row per indicator a piece of evidence is assessed under. */
  indicatorCaseCount: number;
  /** Studio-edited indicator names by slug, for the explorer's labels. */
  indicatorNames?: Record<string, string>;
}

function CountryEvidenceExplorerInner({
  iso3,
  countryName,
  uniqueEvidenceCount,
  indicatorCaseCount,
  indicatorNames,
}: CountryEvidenceExplorerSectionProps) {
  return (
    <EvidenceExplorer
      presetCountryIso3={iso3}
      indicatorNames={indicatorNames}
      heading={
        <>
          Evidence for <span className="text-[#6c5cff]">{countryName}</span>
        </>
      }
      subheading={
        uniqueEvidenceCount > 0
          ? `${uniqueEvidenceCount.toLocaleString()} pieces of evidence assessed across ${indicatorCaseCount.toLocaleString()} indicator cases — laws, policies, strategies, and institutional actions in ${countryName}.`
          : `No evidence items are on file for ${countryName} in the 2026 dataset.`
      }
    />
  );
}

function CountryNoteCallout({
  countryName,
  note,
}: {
  countryName: string;
  note: CountryNote;
}) {
  return (
    <aside
      aria-label={`Note on ${countryName}'s assessment`}
      className="mb-8 flex items-start gap-3 rounded-xl border border-border bg-muted/40 px-5 py-4 md:px-6 dark:bg-muted/20"
    >
      <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden />
      <p className="text-sm leading-relaxed text-muted-foreground">
        {note.map((segment, i) =>
          typeof segment === "string" ? (
            segment
          ) : (
            <a
              key={i}
              href={segment.href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-sm font-medium text-primary underline underline-offset-2 hover:text-primary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {segment.text}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )
        )}
      </p>
    </aside>
  );
}

export function CountryEvidenceExplorerSection(
  props: CountryEvidenceExplorerSectionProps
) {
  const note = getCountryNote(props.iso3);
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
        {note ? (
          <CountryNoteCallout countryName={props.countryName} note={note} />
        ) : null}
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
