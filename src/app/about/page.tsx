import { Header } from "@/components/header";
import { FooterSection } from "@/components/footer-section";
import {
  AboutHero,
  AboutIntroSection,
  AboutWhyGiraiMattersSection,
  AboutGcgLedSection,
  AboutWhatIndexMeasuresSection,
  AboutContributorsSection,
  AboutWhoGiraiIsForSection,
  AboutPeopleBehindResearchSection,
  AboutFooterHero,
} from "@/components/about";
import { IndicatorCategorySection } from "@/components/indicator-category-section";
import { ShapingIntelligenceSection } from "@/components/shaping-intelligence-section";

export const metadata = {
  title: "About | GIRAI Global Index",
  description:
    "A global framework for assessing how countries govern, deploy, and safeguard artificial intelligence in line with human rights, ethics, and democratic values.",
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <Header />

      <main className="flex-1">
        <AboutHero />
        <AboutIntroSection />
        <AboutWhyGiraiMattersSection />
        <AboutGcgLedSection />
        <AboutWhatIndexMeasuresSection />
        <AboutContributorsSection />
        <IndicatorCategorySection />
        <AboutWhoGiraiIsForSection />
        <AboutPeopleBehindResearchSection />
        <ShapingIntelligenceSection />
        <AboutFooterHero />
      </main>

      <FooterSection />
    </div>
  );
}
