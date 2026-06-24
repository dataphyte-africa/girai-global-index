import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ReportDownloadSection } from "@/components/report-download-section";
import { TopTakeawaysSection } from "@/components/top-takeaways-section";
import {
  TakeawaysHero,
  TakeawaysIntroSection,
  TakeawaysKeyInsightsSection,
} from "@/components/takeaways";
import { getTakeawaysContent } from "@/content/takeaways";

export const metadata = {
  title: "Top 10 Takeaways | GIRAI Global Index",
  description:
    "The most important insights shaping how countries govern artificial intelligence responsibly across regions and contexts.",
};

export default async function TakeawaysPage() {
  const content = await getTakeawaysContent();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />

      <main className="flex-1">
        <TakeawaysHero content={content} />
        <TakeawaysIntroSection content={content} />
        <TopTakeawaysSection showHeader={true} showCta={true} />
        <TakeawaysKeyInsightsSection content={content} />
        <ReportDownloadSection />
      </main>

      <SiteFooter />
    </div>
  );
}
