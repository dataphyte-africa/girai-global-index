import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { IndicatorsHero, IndicatorsListSection } from "@/components/indicators";
import { getIndicatorsContent } from "@/content/indicators";

export const metadata = {
  title: "Indicators | GIRAI Global Index",
  description:
    "The full set of structured indicators used to evaluate how countries govern, regulate, and implement responsible artificial intelligence.",
};

export default async function IndicatorsPage() {
  const content = await getIndicatorsContent();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />

      <main className="flex-1">
        <IndicatorsHero content={content} />
        <IndicatorsListSection />
      </main>

      <SiteFooter />
    </div>
  );
}
