import type { Metadata } from "next";
import { Header } from "@/components/header";
import { FooterSection } from "@/components/footer-section";
import { ComparisonSection } from "@/components/comparison-section";
import { ReportDownloadSection } from "@/components/report-download-section";
import {
  RegionsHero,
  RegionsPerformanceOverview,
} from "@/components/regions";
import {
  getAllCountries,
  getGlobalAverages,
  getRegionAverages,
  getRegionSummaries,
  getRegions,
} from "@/lib/girai";
import {
  generateArcData,
  selectMixedCountries,
  type Country,
} from "@/data/countries";

export const metadata: Metadata = {
  title: "Regions | GIRAI Global Index",
  description:
    "Compare regional approaches to AI oversight, implementation, and institutional capacity across the Global Index on Responsible AI.",
};

const DEFAULT_COMPARE_REGION_COUNT = 3;

export default function RegionsPage() {
  const allCountries = getAllCountries();
  const regions = getRegions();
  const regionAverages = getRegionAverages();
  const regionSummaries = getRegionSummaries();

  const initialSlots = regionSummaries
    .slice(0, DEFAULT_COMPARE_REGION_COUNT)
    .map((summary) => ({ kind: "region" as const, name: summary.region }));

  const globeCandidates = allCountries.map((c) => ({
    iso3: c.iso3,
    name: c.name,
    region: c.region,
    rankGlobal: c.rankGlobal,
    girai: c.girai,
  }));
  const markers: Country[] = selectMixedCountries(globeCandidates, 20);
  const arcData = generateArcData(markers, 15);

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <Header />
      <main className="flex-1">
        <RegionsHero arcData={arcData} markers={markers} />
        <RegionsPerformanceOverview summaries={regionSummaries} />
        <ComparisonSection
          countries={allCountries}
          regions={regions}
          regionAverages={regionAverages}
          globalAverages={getGlobalAverages()}
          initialSlots={initialSlots}
          heading={
            <>
              Compare responsible AI{" "}
              <span className="text-primary">across regions</span>
            </>
          }
          subheading="Explore how regions perform relative to each other across GIRAI's governance dimensions, scores, and structural indicators."
        />
        <ReportDownloadSection />
      </main>
      <FooterSection />
    </div>
  );
}
