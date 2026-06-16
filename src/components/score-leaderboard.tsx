import Link from "next/link";
import Image from "next/image";
import { iso3ToIso2 } from "@/data/countries";
import type { ScoreLeaderboardEntry } from "@/lib/girai";
import { cn } from "@/lib/utils";

interface ScoreLeaderboardProps {
  /** Pre-sorted leaderboard rows (descending by score, no nulls). */
  entries: ScoreLeaderboardEntry[];
  /** How many rows to show. Defaults to 10. */
  limit?: number;
  /** Title shown above the list. */
  title?: string;
  /** When set, highlights this country in the list. */
  highlightIso3?: string;
  /** Maximum score for normalising the bar width. Defaults to 100. */
  maxScore?: number;
  className?: string;
}

/**
 * Leaderboard list used by the dimension, pillar and indicator pages.
 * Each row is a link to `/countries/{ISO3}` per the URL contract in
 * ADR 0007.
 */
export function ScoreLeaderboard({
  entries,
  limit = 10,
  title,
  highlightIso3,
  maxScore = 100,
  className,
}: ScoreLeaderboardProps) {
  const visible = entries.slice(0, limit);

  return (
    <div className={cn("rounded-2xl border border-border bg-card/60 shadow-sm", className)}>
      {title ? (
        <div className="border-b border-border px-4 py-3">
          <h3 className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            {title}
          </h3>
        </div>
      ) : null}

      <ol className="divide-y divide-border/60">
        {visible.length === 0 ? (
          <li className="px-4 py-6 text-center text-sm text-muted-foreground">
            No countries scored.
          </li>
        ) : null}

        {visible.map((entry, idx) => {
          const c = entry.country;
          const iso2 = iso3ToIso2[c.iso3];
          const flagUrl = iso2 ? `https://flagcdn.com/w40/${iso2}.png` : null;
          const isHighlight = c.iso3 === highlightIso3;
          const pct = Math.max(0, Math.min(100, (entry.score / maxScore) * 100));

          return (
            <li key={c.iso3}>
              <Link
                href={`/countries/${c.iso3}`}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50",
                  isHighlight && "bg-primary/5"
                )}
              >
                <span className="w-6 shrink-0 text-sm font-medium tabular-nums text-muted-foreground">
                  {idx + 1}
                </span>
                <span className="relative size-6 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
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
                <span className="flex-1 truncate text-sm font-medium text-foreground">
                  {c.name}
                  {isHighlight ? (
                    <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold uppercase text-primary-foreground">
                      Current
                    </span>
                  ) : null}
                </span>
                <span className="hidden h-1 w-32 overflow-hidden rounded-full bg-muted sm:block">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </span>
                <span className="w-12 shrink-0 text-right text-sm font-semibold tabular-nums text-foreground">
                  {entry.score.toFixed(1)}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
