import { Header } from "@/components/header";
import { FooterSection } from "@/components/footer-section";
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

export const metadata = {
  title: "Methodology | GIRAI Global Index",
  description:
    "How GIRAI measures responsible artificial intelligence—turning global principles into clear, comparable evidence on how countries govern and use AI in the public interest.",
};

export default function MethodologyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans">
      <Header />

      <main className="flex-1">
        <MethodologyHero />
        <MethodologyIntroSection />
        <MethodologyPrinciplesSection />
        <MethodologyWhatMeasuresSection />
        <MethodologyFrameworkEvolutionSection />
        <MethodologyFrameworkRefinedSection />
        <MethodologyEditionChangesSection />
        <MethodologyKeyTermsSection />
        <MethodologyEvidenceStandardsSection />
        <MethodologyAccessDataSection />
        <MethodologyResearchProcessSection />
        <MethodologyFooterHero />
      </main>

      <FooterSection />
    </div>
  );
}
