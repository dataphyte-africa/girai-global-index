import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  MethodologyHero,
  MethodologyIntroSection,
  MethodologyPrinciplesSection,
  MethodologyWhatMeasuresSection,
  MethodologyFrameworkEvolutionSection,
  MethodologyFrameworkRefinedSection,
  MethodologyEditionChangesSection,
  MethodologyKeyTermsSection,
  MethodologyEvidenceStandardsSection,
  MethodologyAccessDataSection,
  MethodologyResearchProcessSection,
  MethodologyFooterHero,
} from "@/components/methodology";
import { getMethodologyContent } from "@/content/methodology";

export const metadata = {
  title: "Methodology | GIRAI Global Index",
  description:
    "How GIRAI measures responsible artificial intelligence—turning global principles into clear, comparable evidence on how countries govern and use AI in the public interest.",
};

export default async function MethodologyPage() {
  const content = await getMethodologyContent();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <SiteHeader />

      <main className="flex-1">
        <MethodologyHero content={content} />
        <MethodologyIntroSection content={content} />
        <MethodologyPrinciplesSection content={content} />
        <MethodologyWhatMeasuresSection content={content} />
        <MethodologyFrameworkEvolutionSection content={content} />
        <MethodologyFrameworkRefinedSection content={content} />
        <MethodologyEditionChangesSection content={content} />
        <MethodologyKeyTermsSection content={content} />
        <MethodologyEvidenceStandardsSection content={content} />
        <MethodologyAccessDataSection content={content} />
        <MethodologyResearchProcessSection content={content} />
        <MethodologyFooterHero content={content} />
      </main>

      <SiteFooter />
    </div>
  );
}
