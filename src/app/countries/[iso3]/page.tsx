import { notFound } from "next/navigation";
import { getAllCountries, getCountryByIso3, getDatasetProvenance } from "@/lib/girai";
import { CountryHero } from "@/components/country-story/country-hero";
import { IndicatorStorySection } from "@/components/country-story/indicator-story";
import { RegionalComparison } from "@/components/country-story/regional-comparison";
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

  const regionalCountries = getAllCountries().filter(
    (c) => c.region === country.region
  );

  const { generatedAt } = getDatasetProvenance();

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans dark:bg-black">
      <Header />
      <main className="flex-1">
        <CountryHero country={country} />
        <IndicatorStorySection country={country} />
        <RegionalComparison
          country={country}
          regionalCountries={regionalCountries}
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
