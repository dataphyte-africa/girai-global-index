import Image from "next/image";
import Link from "next/link";
import { Medal, TrendingUp } from "lucide-react";
import type { ScoreLeaderboardEntry } from "@/lib/girai";
import { flagUrlForIso3 } from "@/lib/geo-iso";

export interface DimensionGlobalRankingsProps {
  dimensionName: string;
  subtitle: string;
  leaderboard: ScoreLeaderboardEntry[];
  /** Dimension accent colour (hex). */
  color: string;
}

const MEDAL_TONES = ["#f5b50a", "#9aa3b2", "#c8804a"];

function RankRow({
  entry,
  rank,
  color,
}: {
  entry: ScoreLeaderboardEntry;
  rank: number;
  color: string;
}) {
  const c = entry.country;
  const flagUrl = flagUrlForIso3(c.iso3);
  const pct = Math.max(2, Math.min(100, entry.score));
  const medalTone = rank <= 3 ? MEDAL_TONES[rank - 1] : null;

  return (
    <Link
      href={`/countries/${c.iso3}`}
      className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 transition-colors hover:bg-muted/40"
    >
      <span className="flex w-7 shrink-0 items-center justify-center">
        {medalTone ? (
          <Medal className="size-5" style={{ color: medalTone }} />
        ) : (
          <span className="text-sm font-semibold tabular-nums text-muted-foreground">
            {rank}
          </span>
        )}
      </span>

      <span className="relative size-7 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
        {flagUrl ? (
          <Image src={flagUrl} alt="" fill sizes="28px" className="object-cover" unoptimized />
        ) : null}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{c.name}</p>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full"
            style={{ width: `${pct}%`, backgroundColor: color }}
          />
        </div>
      </div>

      <span className="w-10 shrink-0 text-right text-sm font-bold tabular-nums text-foreground">
        {entry.score.toFixed(0)}
      </span>
    </Link>
  );
}

export function DimensionGlobalRankings({
  dimensionName,
  subtitle,
  leaderboard,
  color,
}: DimensionGlobalRankingsProps) {
  const top = leaderboard.slice(0, 10);
  const emerging = leaderboard.slice(-10);
  const emergingStartRank = Math.max(0, leaderboard.length - 10) + 1;

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
              <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <TrendingUp className="size-4" />
              </span>
              <h3 className="text-lg font-medium">Top 10 Countries</h3>
            </div>
            <ol className="flex flex-col gap-2.5">
              {top.map((entry, idx) => (
                <li key={entry.country.iso3}>
                  <RankRow entry={entry} rank={idx + 1} color={color} />
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className="mb-4 flex items-center gap-2">
              <span
                className="flex size-7 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${color}1f`, color }}
              >
                <TrendingUp className="size-4" />
              </span>
              <h3 className="text-lg font-medium">Emerging Countries</h3>
            </div>
            <ol className="flex flex-col gap-2.5">
              {emerging.map((entry, idx) => (
                <li key={entry.country.iso3}>
                  <RankRow
                    entry={entry}
                    rank={emergingStartRank + idx}
                    color={color}
                  />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
