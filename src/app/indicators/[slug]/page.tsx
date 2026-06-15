import Link from "next/link";
import { notFound } from "next/navigation";
import { ExternalLink } from "lucide-react";
import { Header } from "@/components/header";
import { ScoreLeaderboard } from "@/components/score-leaderboard";
import {
  IndicatorDetailHero,
  IndicatorIntroSection,
  IndicatorCountriesMap,
  IndicatorBackgroundRelevanceSection,
  IndicatorEvidenceExplorerSection,
  IndicatorReportDownloadSection,
  IndicatorPerformanceByRegionSection,
} from "@/components/indicators";
import {
  getAllCountries,
  getIndicatorLeaderboard,
  getIndicatorScoreStats,
  getIndicatorRegionalAverages,
  getEvidenceByIndicator,
} from "@/lib/girai";
import {
  getIndicatorBackgroundRelevance,
  getIndicatorPageCopy,
} from "@/lib/indicator-copy";
import {
  INDICATORS,
  getIndicator,
  type IndicatorDef,
} from "@/data/2026/taxonomy";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return INDICATORS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const ind = INDICATORS.find((i) => i.slug === slug);
  if (!ind) return { title: "Indicator not found | GIRAI Global Index" };
  return {
    title: `${ind.name} | GIRAI Global Index 2026`,
    description: `Country leaderboard and evidence for the ${ind.name} indicator (${ind.pillar} pillar) in the 2026 GIRAI Index.`,
  };
}

export default async function IndicatorPage({ params }: PageProps) {
  const { slug } = await params;
  let ind: IndicatorDef;
  try {
    ind = getIndicator(slug);
  } catch {
    notFound();
  }

  const pageCopy = getIndicatorPageCopy(ind.slug);
  const { background, relevance } = getIndicatorBackgroundRelevance(
    ind.slug,
    ind.name
  );
  const allCountries = getAllCountries();
  const scoreStats = getIndicatorScoreStats(ind.slug);
  const regionalScores = getIndicatorRegionalAverages(ind.slug);
  const leaderboard = getIndicatorLeaderboard(ind.slug);
  const evidence = ind.hasEvidence ? getEvidenceByIndicator(ind.slug) : [];

  const evidenceByCountry = new Map<string, typeof evidence>();
  for (const e of evidence) {
    const list = evidenceByCountry.get(e.country.iso3) ?? [];
    list.push(e);
    evidenceByCountry.set(e.country.iso3, list);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <Header />

      <main className="flex-1">
        <IndicatorDetailHero name={ind.name} lead={pageCopy.heroLead} />
        <IndicatorIntroSection
          primary={pageCopy.introPrimary}
          secondary={pageCopy.introSecondary}
        />

        <IndicatorCountriesMap
          rankingData={allCountries}
          indicatorSlug={ind.slug}
          indicatorName={ind.name}
          scoreStats={scoreStats}
        />

        <IndicatorBackgroundRelevanceSection
          indicatorName={ind.name}
          background={background}
          relevance={relevance}
        />

        <IndicatorEvidenceExplorerSection
          indicatorSlug={ind.slug}
          indicatorName={ind.name}
        />


        <IndicatorPerformanceByRegionSection
          indicatorName={ind.name}
          regionalScores={regionalScores}
        />

<IndicatorReportDownloadSection />


        {/* <div className="container mx-auto grid grid-cols-1 gap-10 px-4 py-12 lg:grid-cols-3 lg:gap-12">
          <section className="lg:col-span-2">
            <h2 className="text-3xl md:text-4xl lg:text-5xl mb-4 font-semibold">Top countries</h2>
            <ScoreLeaderboard entries={leaderboard} limit={20} />
            <p className="mt-3 text-sm text-muted-foreground">
              Showing the top {Math.min(20, leaderboard.length)} of{" "}
              {leaderboard.length} countries scored on this indicator.
            </p>
          </section>

          <aside className="space-y-4">
            {ind.hasEvidence ? (
              <div className="rounded-2xl border border-border bg-card/60 shadow-sm">
                <div className="border-b border-border px-4 py-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    Evidence by country
                  </h3>
                </div>
                <ul className="divide-y divide-border/60">
                  {[...evidenceByCountry.entries()]
                    .sort((a, b) => b[1].length - a[1].length)
                    .slice(0, 10)
                    .map(([iso3, items]) => (
                      <li key={iso3}>
                        <Link
                          href={`/countries/${iso3}`}
                          className="flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-muted/50"
                        >
                          <span className="font-medium text-foreground">
                            {items[0].country.name}
                          </span>
                          <span className="tabular-nums text-muted-foreground">
                            {items.length}
                          </span>
                        </Link>
                      </li>
                    ))}
                </ul>
                <div className="border-t border-border px-4 py-3 text-right text-sm">
                  <Link
                    href={`/evidence?indicator=${ind.slug}`}
                    className="inline-flex items-center gap-1 text-primary underline-offset-2 hover:underline"
                  >
                    Open in Evidence Explorer
                    <ExternalLink className="size-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-border bg-card/60 p-4 text-sm text-muted-foreground">
                This indicator is sourced from an external index rather than
                GIRAI-collected evidence. Country scores reflect the underlying
                dataset and there are no individual evidence rows to inspect.
              </div>
            )}
          </aside>
        </div> */}
      </main>
    </div>
  );
}
