"use client";

import { CountryMapSVG } from "./country-map-svg";
import { iso3ToIso2 } from "@/data/countries";
import { getIndexNarrative, getOrdinalSuffix } from "@/lib/narratives";
import type { CountryRanking } from "@/lib/girai";
import { cn } from "@/lib/utils";

interface CountryScoreHeroProps {
  country: CountryRanking;
  className?: string;
}

const BADGE_STYLES = {
  global: {
    border: "border-[#7C3AED] dark:border-violet-400/70",
    text: "text-[#7C3AED] dark:text-violet-300",
  },
  regional: {
    border: "border-[#3B82F6] dark:border-sky-400/70",
    text: "text-[#3B82F6] dark:text-sky-300",
  },
  income: {
    border: "border-[#10B981] dark:border-emerald-400/70",
    text: "text-[#10B981] dark:text-emerald-300",
  },
} as const;

function RankBadge({
  label,
  rank,
  variant,
}: {
  label: string;
  rank: number;
  variant: keyof typeof BADGE_STYLES;
}) {
  const styles = BADGE_STYLES[variant];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border bg-white px-4 py-1.5 text-sm font-medium whitespace-nowrap dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm",
        styles.border,
        styles.text
      )}
    >
      {label}: {getOrdinalSuffix(rank)}
    </span>
  );
}

export function CountryScoreHero({ country, className }: CountryScoreHeroProps) {
  const iso2 = iso3ToIso2[country.iso3] ?? country.iso3.slice(0, 2).toLowerCase();
  const flagUrl = `https://flagcdn.com/w160/${iso2}.png`;

  const indexScore = country.girai ?? 0;
  const indexNarrative = getIndexNarrative(country.name, indexScore);

  return (
    <section
      className={cn(
        "relative overflow-hidden bg-[#F8F9FF] px-4 py-16 md:py-20",
        "dark:bg-[#0c0718] dark:bg-gradient-to-b dark:from-[#130d24] dark:via-[#0c0718] dark:to-background",
        className
      )}
    >
      {/* Country map silhouette */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center text-[#C4B5FD] opacity-[0.28] dark:text-[#6D28D9] dark:opacity-20"
        aria-hidden
      >
        <CountryMapSVG
          iso3={country.iso3}
          fillColor="currentColor"
          strokeWidth={0}
          width={720}
          height={560}
          className="h-auto w-[min(92vw,640px)] max-w-none select-none"
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center text-center">
        <img
          src={flagUrl}
          alt={`${country.name} flag`}
          width={80}
          height={54}
          className="mb-5 h-12 w-auto object-cover shadow-sm ring-1 ring-black/5 md:h-14 dark:ring-white/10"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />

        <p className="mb-2 text-sm font-medium tracking-wide text-[#6B7280] dark:text-muted-foreground md:text-base">
          Global Index Score
        </p>

        <p
          className="mb-6 text-6xl font-bold tabular-nums tracking-tight text-[#7C3AED] dark:text-violet-400 md:text-7xl"
          aria-label={`Global Index Score: ${indexScore.toFixed(2)}`}
        >
          {indexScore.toFixed(2)}
        </p>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-2.5 md:gap-3">
          {country.rankGlobal !== null && (
            <RankBadge label="Global" rank={country.rankGlobal} variant="global" />
          )}
          {country.rankRegional !== null && (
            <RankBadge label="Regional" rank={country.rankRegional} variant="regional" />
          )}
          {country.rankIncomeGroup !== null && (
            <RankBadge
              label="Income Group"
              rank={country.rankIncomeGroup}
              variant="income"
            />
          )}
        </div>

        <p className="max-w-lg text-sm leading-relaxed text-[#374151] dark:text-foreground/75 md:text-[15px] md:leading-7">
          {indexNarrative.narrative}
        </p>
      </div>
    </section>
  );
}
