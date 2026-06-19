import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowUp, Medal, TrendingUp } from "lucide-react";
import type { ScoreLeaderboardEntry } from "@/lib/girai";
import { flagUrlForIso3 } from "@/lib/geo-iso";

export interface DimensionGlobalRankingsProps {
  dimensionName: string;
  subtitle: string;
  leaderboard: ScoreLeaderboardEntry[];
}

const MEDAL_TONES = ["#f5b50a", "#9aa3b2", "#c8804a"];

/**
 * Small trend "artifact" next to the country name. We don't store an
 * edition-over-edition rank, so we surface a real, available signal instead:
 * how the country ranks on *this* dimension versus its overall GIRAI rank.
 * Ranking better here than overall reads as an upward move (green), worse as
 * a downward move (amber).
 */
function RankDeltaBadge({ delta }: { delta: number }) {
  if (delta === 0) return null;
  const up = delta > 0;
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-0.5 text-xs font-semibold tabular-nums ${
        up
          ? "text-emerald-600 dark:text-emerald-400"
          : "text-amber-600 dark:text-amber-400"
      }`}
    >
      <Icon className="size-3" />
      {Math.abs(delta)}
    </span>
  );
}

function RankRow({
  entry,
  rank,
}: {
  entry: ScoreLeaderboardEntry;
  rank: number;
}) {
  const c = entry.country;
  const flagUrl = flagUrlForIso3(c.iso3);
  const pct = Math.max(2, Math.min(100, entry.score));
  const medalTone = rank <= 3 ? MEDAL_TONES[rank - 1] : null;
  const delta = c.rankGlobal !== null ? c.rankGlobal - rank : 0;

  return (
    <Link
      href={`/countries/${c.iso3}`}
      className="flex items-center gap-4 rounded-2xl border border-border bg-card px-4 py-4 transition-colors hover:bg-muted/40"
    >
      {/* Position tile with the flag floating at its top-right corner */}
      <div className="relative shrink-0">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-muted">
          {medalTone ? (
            <span className="relative flex items-center justify-center">
              <Medal className="size-9" style={{ color: medalTone }} />
              <span className="absolute inset-0 flex items-center justify-center pt-2 text-[10px] font-bold text-white">
                {rank}
              </span>
            </span>
          ) : (
            <span className="text-xl font-bold tabular-nums text-muted-foreground">
              {rank}
            </span>
          )}
        </div>
        <span className="absolute -right-1.5 -top-1.5 size-6 overflow-hidden rounded-lg border-2 border-card bg-muted">
          {flagUrl ? (
            <Image
              src={flagUrl}
              alt=""
              fill
              sizes="24px"
              className="object-cover"
              unoptimized
            />
          ) : null}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate text-base font-semibold text-foreground">
            {c.name}
          </p>
          <RankDeltaBadge delta={delta} />
        </div>
        <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-primary/15">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <span className="shrink-0 text-right text-2xl font-bold tabular-nums text-primary">
        {entry.score.toFixed(0)}
      </span>
    </Link>
  );
}

export function DimensionGlobalRankings({
  dimensionName,
  subtitle,
  leaderboard,
}: DimensionGlobalRankingsProps) {
  const top = leaderboard.slice(0, 10);
  // "Emerging" = the highest scorers on this dimension that don't already sit
  // in the overall GIRAI top 20. We keep each country's true leaderboard rank
  // (index in the score-sorted list) so the displayed rank stays meaningful.
  const emerging = leaderboard
    .map((entry, idx) => ({ entry, rank: idx + 1 }))
    .filter(({ entry }) => (entry.country.rankGlobal ?? Infinity) > 20)
    .slice(0, 10);

  return (
    <section className="w-full px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight">
            <span className="text-foreground">Global Rankings for </span>
            <span className="text-primary">{dimensionName}</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <TrendingUp className="size-4" />
              </span>
              <h3 className="text-lg font-medium">Top 10 Countries</h3>
            </div>
            <ol className="flex flex-col gap-2.5">
              {top.map((entry, idx) => (
                <li key={entry.country.iso3}>
                  <RankRow entry={entry} rank={idx + 1} />
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <TrendingUp className="size-4" />
              </span>
              <h3 className="text-lg font-medium">Emerging Countries</h3>
            </div>
            <ol className="flex flex-col gap-2.5">
              {emerging.map(({ entry, rank }) => (
                <li key={entry.country.iso3}>
                  <RankRow entry={entry} rank={rank} />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
