import { notFound } from "next/navigation";
import {
  getAllCountries,
  getCountryByIso3,
  getDatasetProvenance,
  getGovernmentMisuseByCountry,
  getEvidenceByCountry,
  getCountryPillarHighlights,
  getRegionAverages,
  getIncomeGroupAverages,
  getRegions,
  getCountryEditionEvidenceStatus,
  getEditionEvidenceStatusArtifact,
} from "@/lib/girai";
import { CountryScoreHero } from "@/components/country-story/country-score-hero";
import { CountryPerformanceOverview } from "@/components/country-story/country-performance-overview";
import {
  CountryMisuseEvidenceSection,
  CountryPerformanceDrivers,
  CountryEvidenceExplorerSection,
  CountryEditionComparisonSection,
} from "@/components/country-story";
import { ComparisonSection } from "@/components/comparison-section";
import { Header } from "@/components/header";

interface PageProps {
  params: Promise<{ iso3: string }>;
}

/** Statically pre-render every country (per ADR 0007 — stable URL contract). */
export async function generateStaticParams() {
  return getAllCountries().map((c) => ({ iso3: c.iso3 }));
}

export async function generateMetadata({ params }: PageProps) {
  const { iso3 } = await params;
  const country = getCountryByIso3(iso3.toUpperCase());

  if (!country) {
    return { title: "Country Not Found | GIRAI Global Index" };
  }

  const score = country.girai !== null ? country.girai.toFixed(2) : "—";
  const rank = country.rankGlobal !== null ? `#${country.rankGlobal}` : "unranked";
  return {
    title: `${country.name} | GIRAI Global Index 2026`,
    description: `Explore ${country.name}'s performance in the 2026 Global Index on Responsible AI. Ranked ${rank} globally with an index score of ${score}.`,
  };
}

export default async function CountryStoryPage({ params }: PageProps) {
  const { iso3 } = await params;
  const country = getCountryByIso3(iso3.toUpperCase());
  if (!country) notFound();

  const allCountries = getAllCountries();
  const regions = getRegions();
  const regionAverages = getRegionAverages();

  const regionAggregates = regionAverages[country.region] ?? null;
  const incomeGroupAggregates =
    getIncomeGroupAverages()[country.incomeGroup] ?? null;

  const { generatedAt } = getDatasetProvenance();
  const misuseEvidence = getGovernmentMisuseByCountry(country.iso3);
  const pillarHighlights = getCountryPillarHighlights(country.iso3);
  const countryEvidence = getEvidenceByCountry(country.iso3);
  const editionStatus = getCountryEditionEvidenceStatus(country.iso3);
  const editionArtifact = getEditionEvidenceStatusArtifact();

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans dark:bg-black">
      <Header />
      <main className="flex-1">
        <CountryScoreHero country={country} />
       { /* <IndicatorStorySection country={country} /> */}
        <CountryPerformanceOverview
          country={country}
          regionAggregates={regionAggregates}
          incomeGroupAggregates={incomeGroupAggregates}
        />
        {editionStatus ? (
          <CountryEditionComparisonSection
            countryName={country.name}
            editionStatus={editionStatus}
            indicatorCount={editionArtifact.indicatorCount}
            indicators={editionArtifact.indicators}
          />
        ) : null}
        <ComparisonSection
          countries={allCountries}
          regions={regions}
          regionAverages={regionAverages}
          initialSlots={[
            { kind: "country", iso3: country.iso3 },
            { kind: "region", name: country.region },
          ]}
        />
        <CountryMisuseEvidenceSection items={misuseEvidence} />
        {pillarHighlights ? (
          <CountryPerformanceDrivers
            country={country}
            highlights={pillarHighlights}
            allCountries={allCountries}
          />
        ) : null}
        <CountryEvidenceExplorerSection
          iso3={country.iso3}
          countryName={country.name}
          evidenceCount={countryEvidence.length}
        />
      </main>

      <footer className="border-t py-8 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            GIRAI Global Index 2026 · Dataset built {new Date(generatedAt).toISOString().slice(0, 10)}
          </p>
        </div>
      </footer>
    </div>
  );
}
