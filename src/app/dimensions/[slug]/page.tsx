import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import {
  DimensionHero,
  DimensionKeyIndicators,
  DimensionCountriesMap,
  DimensionGlobalRankings,
  DimensionAggregateStatsSection,
  DimensionRegionalPerformance,
  DimensionCountryExplorer,
} from "@/components/dimension-story";
import {
  getAllCountries,
  getDimensionLeaderboard,
  getIndicatorsByDimension,
  getRegions,
  getDimensionScoreStats,
  getDimensionAggregateStats,
  getDimensionRegionalIndicatorAverages,
  getDimensionRegionalPillarAverages,
} from "@/lib/girai";
import { DIMENSIONS, getDimension, type DimensionDef } from "@/data/2026/taxonomy";
import { DIMENSIONS as DIMENSIONS_UI } from "@/data/dimensions-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return DIMENSIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const dim = DIMENSIONS.find((d) => d.slug === slug);
  if (!dim) return { title: "Dimension not found | GIRAI Global Index" };
  const ui = DIMENSIONS_UI.find((d) => d.id === slug);
  return {
    title: `${dim.name} | GIRAI Global Index 2026`,
    description:
      ui?.heroLead ??
      `Country leaderboard, indicators and evidence for the ${dim.name} dimension of the 2026 GIRAI Index.`,
  };
}

export default async function DimensionPage({ params }: PageProps) {
  const { slug } = await params;
  let dim: DimensionDef;
  try {
    dim = getDimension(slug as DimensionDef["slug"]);
  } catch {
    notFound();
  }

  const ui = DIMENSIONS_UI.find((d) => d.id === dim.slug)!;
  // The Key Indicators section keeps the shared brand purple across every
  // dimension (rather than the per-dimension accent) for visual consistency.
  const indicatorAccent = "#6c5cff";

  const allCountries = getAllCountries();
  const indicators = getIndicatorsByDimension(dim.slug);
  const leaderboard = getDimensionLeaderboard(dim.slug);
  const regions = getRegions();

  const scoreStats = getDimensionScoreStats(dim.slug);
  const aggregateStats = getDimensionAggregateStats(dim.slug);
  const regionalIndicatorRows = getDimensionRegionalIndicatorAverages(dim.slug);
  const regionalPillarRows = getDimensionRegionalPillarAverages(dim.slug);

  const keyIndicators = indicators.map((i) => ({
    slug: i.slug,
    name: i.name,
    pillar: i.pillar,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />

      <main className="flex-1">
        <DimensionHero
          name={dim.name}
          lead={ui.heroLead}
          heroImage={ui.heroImage}
        />

        <DimensionKeyIndicators indicators={keyIndicators} color={indicatorAccent} />

        <DimensionCountriesMap
          rankingData={allCountries}
          dimensionSlug={dim.slug}
          dimensionName={dim.name}
          scoreStats={scoreStats}
        />

        <DimensionGlobalRankings
          dimensionName={dim.name}
          subtitle={ui.rankingSubtitle}
          leaderboard={leaderboard}
        />

        <DimensionAggregateStatsSection stats={aggregateStats} />

        <DimensionRegionalPerformance
          regions={regions}
          indicatorRows={regionalIndicatorRows}
          pillarRows={regionalPillarRows}
        />

        <DimensionCountryExplorer
          dimensionSlug={dim.slug}
          dimensionName={dim.name}
          leaderboard={leaderboard}
          indicators={keyIndicators}
        />
      </main>

      <SiteFooter />
    </div>
  );
}
