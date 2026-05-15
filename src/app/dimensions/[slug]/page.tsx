import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { ScoreLeaderboard } from "@/components/score-leaderboard";
import {
  getDimensionLeaderboard,
  getEvidenceByDimension,
  getGlobalAverages,
  getIndicatorsByDimension,
  countEvidenceByIndicator,
} from "@/lib/girai";
import { DIMENSIONS, getDimension, type DimensionDef } from "@/data/2026/taxonomy";
import { DIMENSIONS as DIMENSIONS_UI } from "@/data/dimensions-data";
import { dimensionColors, dimensionGradients } from "@/lib/narratives";

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
  return {
    title: `${dim.name} | GIRAI Global Index 2026`,
    description: `Country leaderboard, indicator catalogue and evidence for the ${dim.name} dimension of the 2026 GIRAI Index.`,
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

  const uiCopy = DIMENSIONS_UI.find((d) => d.id === dim.slug);
  const indicators = getIndicatorsByDimension(dim.slug);
  const leaderboard = getDimensionLeaderboard(dim.slug);
  const evidenceItems = getEvidenceByDimension(dim.slug);
  const evidenceCounts = countEvidenceByIndicator();
  const globalAvg = getGlobalAverages().dimensions[dim.slug];
  const color = dimensionColors[dim.slug];
  const gradient = dimensionGradients[dim.slug];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <Header />

      {/* Hero */}
      <section
        className="relative overflow-hidden border-b border-border"
        style={{ background: `linear-gradient(180deg, ${color}10 0%, transparent 100%)` }}
      >
        <div className="container mx-auto px-4 py-10">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Index
            </Button>
          </Link>

          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Dimension
          </p>
          <div className="mt-2 flex flex-wrap items-end gap-4">
            <h1
              className="text-4xl font-bold tracking-tight md:text-5xl"
              style={{ color }}
            >
              {dim.name}
            </h1>
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold text-white shadow-sm"
              style={{ background: gradient }}
            >
              {indicators.length} indicators
            </span>
          </div>

          {uiCopy ? (
            <p className="mt-6 max-w-3xl whitespace-pre-line text-base leading-relaxed text-muted-foreground">
              {uiCopy.description}
            </p>
          ) : null}

          <dl className="mt-8 grid grid-cols-2 gap-4 md:max-w-md md:grid-cols-3">
            <SummaryStat
              label="Global average"
              value={globalAvg !== null ? globalAvg.toFixed(1) : "—"}
            />
            <SummaryStat label="Countries scored" value={String(leaderboard.length)} />
            <SummaryStat label="Evidence items" value={String(evidenceItems.length)} />
          </dl>
        </div>
      </section>

      <main className="container mx-auto grid grid-cols-1 gap-10 px-4 py-12 lg:grid-cols-3 lg:gap-12">
        {/* Indicator catalogue */}
        <section className="lg:col-span-2">
          <h2 className="mb-4 text-xl font-semibold">
            Indicators in this dimension
          </h2>
          <ul className="divide-y divide-border/60 rounded-2xl border border-border bg-card/60">
            {indicators.map((ind) => {
              const count = evidenceCounts[ind.slug] ?? 0;
              return (
                <li key={ind.slug}>
                  <Link
                    href={`/indicators/${ind.slug}`}
                    className="group flex items-center gap-4 px-4 py-3 transition-colors hover:bg-muted/50"
                  >
                    <span
                      className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
                      style={{ backgroundColor: color }}
                    >
                      {ind.pillar.replace(/-/g, " ")}
                    </span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {ind.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {ind.family}{" "}
                        {ind.hasEvidence ? `· ${count} evidence items` : ""}
                      </p>
                    </div>
                    <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>

        {/* Country leaderboard */}
        <aside>
          <ScoreLeaderboard
            entries={leaderboard}
            limit={10}
            title={`Top countries — ${dim.name}`}
          />
          <div className="mt-4 text-right text-sm">
            <Link
              href={`/evidence?dimension=${dim.slug}`}
              className="text-primary underline-offset-2 hover:underline"
            >
              View all evidence in Explorer →
            </Link>
          </div>
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
