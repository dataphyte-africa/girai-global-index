import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ComparisonSection } from "@/components/comparison-section";
import { ReportDownloadSection } from "@/components/report-download-section";
import {
  RegionHero,
  RegionCountryExplorer,
  RegionEvidenceExplorerSection,
} from "@/components/region";
import { getReportDownloadContent } from "@/content/reportDownload";
import {
  getAllCountries,
  getEvidenceByRegion,
  countUniqueEvidence,
  getGlobalAverages,
  getRegionAverages,
  getRegions,
} from "@/lib/girai";
import { regionToSlug } from "@/lib/regions";
import { getRegionCopy } from "@/content/regionCopy";
import { PageViewEvent } from "@/components/analytics/page-view-event";
import { EVENTS } from "@/lib/analytics/events";

interface PageProps {
  params: Promise<{ slug: string }>;
}

/** Resolve a slug back to its canonical region name (or undefined). */
function regionFromSlug(slug: string): string | undefined {
  return getRegions().find((r) => regionToSlug(r) === slug);
}

export function generateStaticParams() {
  return getRegions().map((region) => ({ slug: regionToSlug(region) }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const regionName = regionFromSlug(slug);
  if (!regionName) return { title: "Region not found | GIRAI Global Index" };
  return {
    title: `${regionName} | GIRAI Global Index`,
    description: (await getRegionCopy(regionName)).blurb,
  };
}

export default async function RegionPage({ params }: PageProps) {
  const { slug } = await params;
  const regionName = regionFromSlug(slug);
  if (!regionName) notFound();

  const copy = await getRegionCopy(regionName);
  const reportDownload = await getReportDownloadContent();
  const regionCountries = getAllCountries().filter(
    (c) => c.region === regionName
  );
  const regionAverages = getRegionAverages();

  // Strongest performers in the region, by regional rank then score.
  const ranked = [...regionCountries].sort((a, b) => {
    const ra = a.rankRegional ?? Number.POSITIVE_INFINITY;
    const rb = b.rankRegional ?? Number.POSITIVE_INFINITY;
    if (ra !== rb) return ra - rb;
    return (b.girai ?? 0) - (a.girai ?? 0);
  });

  const regionAvg = regionAverages[regionName]?.girai ?? null;
  const regionEvidence = getEvidenceByRegion(regionName);

  // Pre-seed the comparison with the region's two leaders plus the regional
  // average, so the section is populated on first paint.
  const initialSlots = [
    ranked[0] ? { kind: "country" as const, iso3: ranked[0].iso3 } : null,
    ranked[1] ? { kind: "country" as const, iso3: ranked[1].iso3 } : null,
    regionAvg != null ? { kind: "region" as const, name: regionName } : null,
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <SiteHeader />
      <PageViewEvent
        event={EVENTS.REGION_PAGE_VIEWED}
        properties={{
          region: regionName,
          country_count: regionCountries.length,
          region_avg_girai: regionAvg,
        }}
      />
      <main className="flex-1">
        <RegionHero regionName={regionName} blurb={copy.blurb} />

        <RegionCountryExplorer
          regionName={regionName}
          countries={regionCountries}
        />

        <ComparisonSection
          countries={regionCountries}
          regions={[regionName]}
          regionAverages={regionAverages}
          globalAverages={getGlobalAverages()}
          initialSlots={initialSlots}
          heading={
            <>
              Compare <span className="text-primary">{regionName}</span> countries
            </>
          }
          subheading={`See how countries in ${regionName} perform relative to each other and the regional average across GIRAI's dimensions and indicators.`}
        />

        <RegionEvidenceExplorerSection
          regionName={regionName}
          uniqueEvidenceCount={countUniqueEvidence(regionEvidence)}
          indicatorCaseCount={regionEvidence.length}
        />

        <ReportDownloadSection content={reportDownload} />
      </main>
      <SiteFooter />
    </div>
  );
}
