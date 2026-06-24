import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { EvidenceExplorer } from "@/components/evidence-explorer";
import {
  EvidenceHero,
  EvidenceHubScrollGuide,
  EvidenceHubUrlDefaults,
  PathwayIndicatorTable,
  PathwayPicker,
} from "@/components/evidence-hub";
import { getEvidencePageContent } from "@/content/evidencePage";
import type { EvidenceContent } from "@/content/evidence.defaults";
import { getEvidenceArtifact, getTaxonomy } from "@/lib/girai";

export const metadata = {
  title: "Evidence Explorer | GIRAI Global Index",
  description:
    "Search and filter every law, policy, strategy and institutional action behind the GIRAI scores.",
};

function EvidenceHubContent({ content }: { content: EvidenceContent }) {
  const { totals } = getEvidenceArtifact();
  const { indicators } = getTaxonomy();
  const countriesIndexed = totals.countriesIndexed ?? totals.countriesWithItems;
  const frameworkCount = totals.uniqueTitlesByKind.framework ?? totals.byKind.framework ?? 0;
  const evidenceItemCount = totals.uniqueItems ?? totals.items;
  const evidenceIndicatorCount = indicators.filter(
    (indicator) =>
      indicator.pillar === "ai-policy" || indicator.pillar === "cso-engagement"
  ).length;

  return (
    <>
      <EvidenceHubUrlDefaults />
      <EvidenceHubScrollGuide />
      <EvidenceHero
        countriesIndexed={countriesIndexed}
        frameworkCount={frameworkCount}
        evidenceItemCount={evidenceItemCount}
        indicatorCount={evidenceIndicatorCount}
        content={content}
      />
      <PathwayPicker totals={totals} content={content} />
      <PathwayIndicatorTable />
      <EvidenceExplorer
        subheading={`${evidenceItemCount.toLocaleString()} unique evidence items from laws, strategies, policies, and institutional actions in the ${countriesIndexed}-country GIRAI index.`}
      />
    </>
  );
}

export default async function EvidencePage() {
  const content = await getEvidencePageContent();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />
      <main className="flex-1">
        <Suspense fallback={null}>
          <EvidenceHubContent content={content} />
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}
