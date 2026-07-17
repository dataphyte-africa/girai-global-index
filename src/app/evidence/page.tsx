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
import { getHomeContent } from "@/content/home";
import { getPathwayCopy } from "@/content/pathways";
import { getIndicatorNames } from "@/content/indicatorPages";
import { getEvidenceArtifact } from "@/lib/girai";

export const metadata = {
  title: "Evidence Explorer | GIRAI Global Index",
  description:
    "Search and filter every law, policy, strategy and institutional action behind the GIRAI scores.",
};

async function EvidenceHubContent({ content }: { content: EvidenceContent }) {
  const pathwayCopy = await getPathwayCopy();
  const indicatorNames = await getIndicatorNames();
  // The hero tiles are editorial figures shared with the homepage Evidence
  // Explorer card; everything below the hero stays computed from the artifact.
  const homeContent = await getHomeContent();
  const { totals } = getEvidenceArtifact();
  const countriesIndexed = totals.countriesIndexed ?? totals.countriesWithItems;
  const evidenceItemCount = totals.uniqueItems ?? totals.items;

  return (
    <>
      <EvidenceHubUrlDefaults />
      <EvidenceHubScrollGuide />
      <EvidenceHero stats={homeContent.evidenceStats} content={content} />
      <PathwayPicker totals={totals} content={content} pathwayCopy={pathwayCopy} />
      <PathwayIndicatorTable pathwayCopy={pathwayCopy} />
      <EvidenceExplorer
        heading={content.searchTitle}
        subheading={`${evidenceItemCount.toLocaleString()} unique evidence items from laws, strategies, policies, and institutional actions in the ${countriesIndexed}-country GIRAI index.`}
        indicatorNames={indicatorNames}
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
