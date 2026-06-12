import { Suspense } from "react";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/footer-section";
import { EvidenceExplorer } from "@/components/evidence-explorer";
import {
  EvidenceHero,
  EvidenceHubUrlDefaults,
  PathwayIndicatorTable,
  PathwayPicker,
} from "@/components/evidence-hub";
import { getEvidenceArtifact, getTaxonomy } from "@/lib/girai";

export const metadata = {
  title: "Evidence Explorer | GIRAI Global Index",
  description:
    "Search and filter every law, policy, strategy and institutional action behind the GIRAI scores.",
};

function EvidenceHubContent() {
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
      <EvidenceHero
        countriesIndexed={countriesIndexed}
        frameworkCount={frameworkCount}
        evidenceItemCount={evidenceItemCount}
        indicatorCount={evidenceIndicatorCount}
      />
      <PathwayPicker totals={totals} />
      <PathwayIndicatorTable />
      <section id="evidence-explorer" className="scroll-mt-20">
        <EvidenceExplorer
          subheading={`${evidenceItemCount.toLocaleString()} unique evidence items from laws, strategies, policies, and institutional actions in the ${countriesIndexed}-country GIRAI index.`}
        />
      </section>
    </>
  );
}

export default function EvidencePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <Header />
      <main className="flex-1">
        <Suspense fallback={null}>
          <EvidenceHubContent />
        </Suspense>
      </main>
      <FooterSection />
    </div>
  );
}
