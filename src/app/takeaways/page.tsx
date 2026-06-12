import { Header } from "@/components/header";
import { FooterSection } from "@/components/footer-section";
import { ReportDownloadSection } from "@/components/report-download-section";
import { TopTakeawaysSection } from "@/components/top-takeaways-section";
import {
  TakeawaysHero,
  TakeawaysIntroSection,
  TakeawaysKeyInsightsSection,
} from "@/components/takeaways";

export const metadata = {
  title: "Top 10 Takeaways | GIRAI Global Index",
  description:
    "The most important insights shaping how countries govern artificial intelligence responsibly across regions and contexts.",
};

export default function TakeawaysPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <Header />

      <main className="flex-1">
        <TakeawaysHero />
        <TakeawaysIntroSection />
        <TopTakeawaysSection showHeader={true} showCta={true} />
        <TakeawaysKeyInsightsSection />
        <ReportDownloadSection />
      </main>

      <FooterSection />
    </div>
  );
}
