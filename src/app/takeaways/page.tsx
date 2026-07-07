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
import { getReportDownloadContent } from "@/content/reportDownload";
import { getKeyFindings } from "@/content/keyFindings";

export const metadata = {
  title: "Key Findings | GIRAI Global Index",
  description:
    "The most important insights shaping how countries govern artificial intelligence responsibly across regions and contexts.",
};

export default async function TakeawaysPage() {
  const content = await getTakeawaysContent();
  const reportDownload = await getReportDownloadContent();
  const keyFindings = await getKeyFindings();

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />

      <main className="flex-1">
        <TakeawaysHero content={content} />
        <TakeawaysIntroSection content={content} />
        <TopTakeawaysSection
          findings={keyFindings?.findings}
          showHeader={true}
          showCta={false}
          headingAccent={keyFindings?.headingAccent ?? "Key"}
          headingTail={keyFindings?.headingTail ?? "Findings"}
          headerSubtitle={
            keyFindings?.subtitle ??
            "Strengthening Clarity, Comparability, and Implementation Focus"
          }
        />
        <TakeawaysKeyInsightsSection content={content} />
        <ReportDownloadSection content={reportDownload} />
      </main>

      <SiteFooter />
    </div>
  );
}
