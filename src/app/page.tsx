import { HeroSection } from "@/components/hero-section";
import { ChoroplethMapSection } from "@/components/choropleth-map-section";
import { DimensionsSection } from "@/components/dimensions-section";
import {
  getAllCountries,
  getRegionSummaries,
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
import { RegionalComparisonSection } from "@/components/regional-comparison-section";
import { CountryComparisonSection } from "@/components/country-comparison-section";
import { WhyGIRAIMattersSection } from "@/components/why-girai-matters-section";
import { ShapingIntelligenceSection } from "@/components/shaping-intelligence-section";
import { FooterSection } from "@/components/footer-section";

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
  const regionData = getRegionSummaries();

  return (
    <div className="flex flex-col min-h-screen  bg-background font-sans dark:bg-black">
      <Header />
      <HeroSection arcData={arcData} markers={markers} />
      <ChoroplethMapSection />
      <DimensionsSection />
      <IndicatorCategorySection />
      <RegionalComparisonSection regions={regions} regionData={regionData} />
      <CountryComparisonSection countries={allCountries} />
      <WhyGIRAIMattersSection />
      <ShapingIntelligenceSection />

      <GlobalPerformanceSection
        topCountries={topCountries}
        bottomCountries={bottomCountries}
      />

      <FooterSection />
    </div>
  );
}
