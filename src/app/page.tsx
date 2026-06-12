import { HeroSection } from "@/components/hero-section";
import { ChoroplethMapSection } from "@/components/choropleth-map-section";
import { DimensionsSection } from "@/components/dimensions-section";
import {
  getAllCountries,
  getAllEvidenceItems,
  getIndicatorDefs,
  getRegionAverages,
  getRegions,
  getTopAndBottomCountries,
} from "@/lib/girai";
import {
  selectMixedCountries,
  generateArcData,
  type ArcPosition,
  type Country,
} from "@/data/countries";
import { Header } from "@/components/header";
import { IndicatorCategorySection } from "@/components/indicator-category-section";
import { GlobalPerformanceSection } from "@/components/global-performance-section";
import { ComparisonSection } from "@/components/comparison-section";
import { WhyGIRAIMattersSection } from "@/components/why-girai-matters-section";
import { WhyGIRAIMattersIntroSection } from "@/components/why-girai-matters-intro-section";
import { ShapingIntelligenceSection } from "@/components/shaping-intelligence-section";
import { TopTakeawaysSection } from "@/components/top-takeaways-section";
import { ReportDownloadSection } from "@/components/report-download-section";
import { EvidenceExplorerSection } from "@/components/evidence-explorer-section";
import { OurImpactSection } from "@/components/our-impact-section";
import { LimitsOfMeasurementSection } from "@/components/limits-of-measurement-section";
import { WhatMotivatedUsSection } from "@/components/what-motivated-us-section";
import { FooterSection } from "@/components/footer-section";

// Rounds an exact count down to the nearest 100 and appends a "+" so the
// stat reads as a confident floor (e.g. 2,977 → "2,900+").
function formatRoundedCount(n: number): string {
  if (n < 100) return `${n}`;
  const floored = Math.floor(n / 100) * 100;
  return `${floored.toLocaleString("en-US")}+`;
}

export default async function Home() {
  const allCountries = getAllCountries();

  // Hero globe: pick a mix of countries with known coordinates and flag art.
  const globeCandidates = allCountries.map((c) => ({
    iso3: c.iso3,
    name: c.name,
    region: c.region,
    rankGlobal: c.rankGlobal,
    girai: c.girai,
  }));
  const markers: Country[] = selectMixedCountries(globeCandidates, 20);
  const arcData: ArcPosition[] = generateArcData(markers, 15);

  const { topCountries, bottomCountries } = getTopAndBottomCountries(10);
  const regions = getRegions();
  const regionAverages = getRegionAverages();

  const evidenceCount = getAllEvidenceItems().length;
  const indicatorCount = getIndicatorDefs().length;
  const evidenceStats = [
    {
      value: formatRoundedCount(evidenceCount),
      label: "Documents reviewed",
    },
    {
      value: `${allCountries.length}`,
      label: "Countries assessed",
    },
    {
      value: `${indicatorCount}`,
      label: "Indicators covered",
    },
    {
      value: `${regions.length}`,
      label: "Global regions",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen  bg-background font-sans dark:bg-black">
      <Header />
      <HeroSection arcData={arcData} markers={markers} />
      <WhyGIRAIMattersIntroSection />
      <DimensionsSection />
      <ReportDownloadSection />
      <TopTakeawaysSection />
      <EvidenceExplorerSection stats={evidenceStats} />
      <ChoroplethMapSection />
      <ComparisonSection
        countries={allCountries}
        regions={regions}
        regionAverages={regionAverages}
      />
      <IndicatorCategorySection />
      <LimitsOfMeasurementSection />
      <OurImpactSection />
     {/* { <WhatMotivatedUsSection /> */}
     {/* <WhyGIRAIMattersSection /> */}
      <ShapingIntelligenceSection />

      {/* <GlobalPerformanceSection
        topCountries={topCountries}
        bottomCountries={bottomCountries}
      /> */}

      <FooterSection />
    </div>
  );
}
