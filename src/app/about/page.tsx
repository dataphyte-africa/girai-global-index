import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
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
import { getAboutContent } from "@/content/about";

export const metadata = {
  title: "About | GIRAI Global Index",
  description:
    "A global framework for assessing how countries govern, deploy, and safeguard artificial intelligence in line with human rights, ethics, and democratic values.",
};

export default async function AboutPage() {
  const content = await getAboutContent();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />

      <main className="flex-1">
        <AboutHero content={content} />
        <AboutIntroSection content={content} />
        <AboutWhyGiraiMattersSection content={content} />
        <AboutGcgLedSection content={content} />
        <AboutWhatIndexMeasuresSection content={content} />
        <AboutContributorsSection content={content} />
        <IndicatorCategorySection />
        <AboutWhoGiraiIsForSection content={content} />
        <AboutPeopleBehindResearchSection content={content} />
        <ShapingIntelligenceSection />
        <AboutFooterHero content={content} />
      </main>

      <SiteFooter />
    </div>
  );
}
