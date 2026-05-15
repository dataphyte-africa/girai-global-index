import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ScoreLeaderboard } from "@/components/score-leaderboard";
import {
  getIndicatorLeaderboard,
  getEvidenceByIndicator,
  getGlobalAverages,
} from "@/lib/girai";
import {
  INDICATORS,
  getIndicator,
  getDimension,
  getPillar,
  type IndicatorDef,
} from "@/data/2026/taxonomy";
import { dimensionColors } from "@/lib/narratives";

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

const FAMILY_LABEL: Record<IndicatorDef["family"], string> = {
  "ai-policy": "AI Policy",
  cse: "Civil Society Engagement",
  "enabling-conditions": "Enabling Conditions",
};

export default async function IndicatorPage({ params }: PageProps) {
  const { slug } = await params;
  let ind: IndicatorDef;
  try {
    ind = getIndicator(slug);
  } catch {
    notFound();
  }

  const dim = getDimension(ind.dimension);
  const pillar = getPillar(ind.pillar);
  const leaderboard = getIndicatorLeaderboard(ind.slug);
  const evidence = ind.hasEvidence ? getEvidenceByIndicator(ind.slug) : [];
  const globalAvg = getGlobalAverages().indicators[ind.slug] ?? null;
  const color = dimensionColors[dim.slug];

  // Group evidence by country, then sort by count desc.
  const evidenceByCountry = new Map<string, typeof evidence>();
  for (const e of evidence) {
    const list = evidenceByCountry.get(e.country.iso3) ?? [];
    list.push(e);
    evidenceByCountry.set(e.country.iso3, list);
  }

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <Header />

      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-border"
        style={{ background: `linear-gradient(180deg, ${color}10 0%, transparent 100%)` }}
      >
        <div className="container mx-auto px-4 py-10">
          <Link href={`/dimensions/${dim.slug}`}>
            <Button variant="ghost" size="sm" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to {dim.name}
            </Button>
          </Link>

          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Indicator · {FAMILY_LABEL[ind.family]}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">
            {ind.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <Link
              href={`/dimensions/${dim.slug}`}
              className="rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: color }}
            >
              {dim.name}
            </Link>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {pillar.name}
            </span>
            {!ind.hasEvidence ? (
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                Externally-sourced indicator
              </span>
            ) : null}
          </div>

          <dl className="mt-8 grid grid-cols-2 gap-4 md:max-w-md md:grid-cols-3">
            <SummaryStat
              label="Global average"
              value={globalAvg !== null ? globalAvg.toFixed(1) : "—"}
            />
            <SummaryStat
              label="Countries scored"
              value={String(leaderboard.length)}
            />
            <SummaryStat
              label="Evidence items"
              value={ind.hasEvidence ? String(evidence.length) : "—"}
            />
          </dl>
        </div>
      </section>

      <main className="container mx-auto grid grid-cols-1 gap-10 px-4 py-12 lg:grid-cols-3 lg:gap-12">
        <section className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">Top countries</h2>
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
      </main>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border bg-card p-3">
      <dt className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 text-2xl font-semibold tabular-nums text-foreground">
        {value}
      </dd>
    </div>
  );
}
