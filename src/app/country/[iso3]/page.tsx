import { notFound } from "next/navigation";
import { getFullRankingData } from "@/lib/parse-ranking";
import { CountryHero } from "@/components/country-story/country-hero";
import { IndicatorStorySection } from "@/components/country-story/indicator-story";
import { RegionalComparison } from "@/components/country-story/regional-comparison";
import { Header } from "@/components/header";

interface PageProps {
  params: Promise<{
    iso3: string;
  }>;
}

// Generate static params for all countries
export async function generateStaticParams() {
  const countries = getFullRankingData();
  return countries.map((country) => ({
    iso3: country.iso3,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps) {
  const { iso3 } = await params;
  const countries = getFullRankingData();
  const country = countries.find(
    (c) => c.iso3.toLowerCase() === iso3.toLowerCase()
  );

  if (!country) {
    return {
      title: "Country Not Found | GIRAI Global Index",
    };
  }

  return {
    title: `${country.country} | GIRAI Global Index`,
    description: `Explore ${country.country}'s performance in the Global Responsible AI Index. Ranked #${country.ranking} globally with an index score of ${country.indexScore.toFixed(2)}.`,
  };
}

export default async function CountryStoryPage({ params }: PageProps) {
  const { iso3 } = await params;
  const countries = getFullRankingData();

  // Find the country by ISO3 code (case-insensitive)
  const country = countries.find(
    (c) => c.iso3.toLowerCase() === iso3.toLowerCase()
  );

  if (!country) {
    notFound();
  }

  // Get all countries in the same region
  const regionalCountries = countries.filter(
    (c) => c.giraiRegion === country.giraiRegion
  );

  // Calculate regional rank
  const sortedRegional = [...regionalCountries].sort(
    (a, b) => b.indexScore - a.indexScore
  );
  const regionalRank =
    sortedRegional.findIndex((c) => c.iso3 === country.iso3) + 1;
  const totalInRegion = sortedRegional.length;

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans dark:bg-black">
      <Header />
      <main className="flex-1">
        <CountryHero
          country={country}
          regionalRank={regionalRank}
          totalInRegion={totalInRegion}
        />
        <IndicatorStorySection country={country} />
        <RegionalComparison
          country={country}
          regionalCountries={regionalCountries}
        />
      </main>
      
      {/* Footer */}
      <footer className="border-t py-8 bg-muted/20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            GIRAI Global Index 2025 Research
          </p>
        </div>
      </footer>
    </div>
  );
}
