import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { CountriesHero } from "@/components/countries";
import { ChoroplethMapSection } from "@/components/choropleth-map-section";
import { ComparisonSection } from "@/components/comparison-section";
import { TopTakeawaysSection } from "@/components/top-takeaways-section";
import { ReportDownloadSection } from "@/components/report-download-section";
import { getCountriesContent } from "@/content/countries";
import {
  getAllCountries,
  getGlobalAverages,
  getRegionAverages,
  getRegions,
} from "@/lib/girai";
import {
  selectMixedCountries,
  generateArcData,
  type Country,
} from "@/data/countries";

export const metadata: Metadata = {
  title: "Countries | GIRAI Global Index",
  description:
    "Compare national approaches to AI oversight, implementation, and institutional capacity across the Global Index on Responsible AI.",
};

export default async function CountriesPage() {
  const content = await getCountriesContent();
  const allCountries = getAllCountries();
  const regions = getRegions();
  const regionAverages = getRegionAverages();

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
      <SiteHeader />
      <main className="flex-1">
        <CountriesHero arcData={arcData} markers={markers} content={content} />
        <ChoroplethMapSection />
        <ComparisonSection
          countries={allCountries}
          regions={regions}
          regionAverages={regionAverages}
          globalAverages={getGlobalAverages()}
          heading={
            <>
              {content.compareHeadingLead}
              <span className="text-primary">{content.compareHeadingAccent}</span>
            </>
          }
          subheading={content.compareSubheading}
        />
        <TopTakeawaysSection
          headingAccent={content.takeawaysHeadingAccent}
          headingTail={content.takeawaysHeadingTail}
          headerSubtitle={content.takeawaysSubtitle}
        />
        <ReportDownloadSection />
      </main>
      <SiteFooter />
    </div>
  );
}
