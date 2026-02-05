import { HeroSection } from "@/components/hero-section";
import { ChoroplethMapSection } from "@/components/choropleth-map-section";
import { DimensionsSection } from "@/components/dimensions-section";
import { getHeroGlobeData, getTopAndBottomCountries, getRegionalAggregatedData, getUniqueRegions, getFullRankingData } from "@/lib/parse-ranking";
import type { ArcPosition, Country } from "@/data/countries";
import { Header } from "@/components/header";
import { IndicatorCategorySection } from "@/components/indicator-category-section";
import { GlobalPerformanceSection } from "@/components/global-performance-section";
import { RegionalComparisonSection } from "@/components/regional-comparison-section";
import { CountryComparisonSection } from "@/components/country-comparison-section";
import { WhyGIRAIMattersSection } from "@/components/why-girai-matters-section";
import { ShapingIntelligenceSection } from "@/components/shaping-intelligence-section";
import { FooterSection } from "@/components/footer-section";

export default async function Home() {
  const { arcData, markers }: { arcData: ArcPosition[]; markers: Country[] } =
    getHeroGlobeData();
  const { topCountries, bottomCountries } = getTopAndBottomCountries(10);
  const regions = getUniqueRegions();
  const regionData = getRegionalAggregatedData();
  const allCountries = getFullRankingData();
  
  return (
    <div className="flex flex-col min-h-screen  bg-background font-sans dark:bg-black">
      <Header />
      <HeroSection arcData={arcData} markers={markers} />
      <ChoroplethMapSection />
      <DimensionsSection />
      <IndicatorCategorySection />
      <RegionalComparisonSection 
        regions={regions}
        regionData={regionData}
      />
      <CountryComparisonSection 
        countries={allCountries}
      />
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
