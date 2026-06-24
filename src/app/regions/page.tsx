import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ComparisonSection } from "@/components/comparison-section";
import { ReportDownloadSection } from "@/components/report-download-section";
import {
  RegionsHero,
  RegionsPerformanceOverview,
} from "@/components/regions";
import { getRegionsContent } from "@/content/regions";
import {
  getAllCountries,
  getGlobalAverages,
  getRegionAverages,
  getRegionSummaries,
  getRegions,
} from "@/lib/girai";

export const metadata: Metadata = {
  title: "Regions | GIRAI Global Index",
  description:
    "Compare regional approaches to AI oversight, implementation, and institutional capacity across the Global Index on Responsible AI.",
};

const DEFAULT_COMPARE_REGION_COUNT = 3;

export default async function RegionsPage() {
  const content = await getRegionsContent();
  const allCountries = getAllCountries();
  const regions = getRegions();
  const regionAverages = getRegionAverages();
  const regionSummaries = getRegionSummaries();

  const initialSlots = regionSummaries
    .slice(0, DEFAULT_COMPARE_REGION_COUNT)
    .map((summary) => ({ kind: "region" as const, name: summary.region }));

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />
      <main className="flex-1">
        <RegionsHero content={content} />
        <RegionsPerformanceOverview summaries={regionSummaries} content={content} />
        <ComparisonSection
          countries={allCountries}
          regions={regions}
          regionAverages={regionAverages}
          globalAverages={getGlobalAverages()}
          initialSlots={initialSlots}
          heading={
            <>
              {content.compareHeadingLead}
              <span className="text-primary">{content.compareHeadingAccent}</span>
            </>
          }
          subheading={content.compareSubheading}
        />
        <ReportDownloadSection />
      </main>
      <SiteFooter />
    </div>
  );
}
