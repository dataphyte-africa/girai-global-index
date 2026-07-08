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
  AboutAdvisoryCommitteeSection,
  AboutFooterHero,
} from "@/components/about";
import { OurImpactSection } from "@/components/our-impact-section";
import { ShapingIntelligenceSection } from "@/components/shaping-intelligence-section";
import { getAboutContent } from "@/content/about";
import { getFooterContent } from "@/content/footer";

export const metadata = {
  title: "About | GIRAI Global Index",
  description:
    "A global framework for assessing how countries govern, deploy, and safeguard artificial intelligence in line with human rights, ethics, and democratic values.",
};

export default async function AboutPage() {
  const [content, footerContent] = await Promise.all([
    getAboutContent(),
    getFooterContent(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />

      <main className="flex-1">
        <AboutHero content={content} />
        <AboutIntroSection content={content} />
        <AboutWhyGiraiMattersSection content={content} />
        <AboutGcgLedSection
          content={content}
          funderLogos={footerContent.funderLogos}
        />
        <AboutWhatIndexMeasuresSection content={content} />
        <OurImpactSection
          content={{
            impactHeadingLead: content.impactHeadingLead,
            impactHeadingAccent: content.impactHeadingAccent,
            impactSubtitle: content.impactSubtitle,
            impactCards: content.impactCards,
            impactCtaLabel: content.impactCtaLabel,
            impactCtaHref: content.impactCtaHref,
          }}
        />
        <AboutContributorsSection content={content} />
        <AboutPeopleBehindResearchSection content={content} />
        <AboutAdvisoryCommitteeSection content={content} />
        <AboutWhoGiraiIsForSection content={content} />
        <ShapingIntelligenceSection />
        <AboutFooterHero content={content} />
      </main>

      <SiteFooter />
    </div>
  );
}
