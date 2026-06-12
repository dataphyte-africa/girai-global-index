import { regionColor } from "@/lib/girai";
import type { IndicatorRegionalScore } from "@/lib/girai";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";
const TRACK_BG = "#ECEEF2";
const DOT_PATTERN = {
  backgroundImage: "radial-gradient(circle, #D1D5DB 1px, transparent 1px)",
  backgroundSize: "10px 10px",
};

/** Short legend labels aligned with the design comp. */
const REGION_DISPLAY_LABELS: Record<string, string> = {
  Europe: "Europe",
  "Northern America": "America",
  "Asia and Oceania": "AsiaPacific",
  "Middle East": "Middleeast",
  Africa: "Africa",
  "South and Central America": "South & Central America",
  Caribbean: "Caribbean",
};

const LEGEND_REGION_ORDER = [
  "Europe",
  "Northern America",
  "Asia and Oceania",
  "Middle East",
  "Africa",
  "South and Central America",
  "Caribbean",
];

function regionLabel(region: string): string {
  return REGION_DISPLAY_LABELS[region] ?? region;
}

function RegionBar({
  score,
  color,
}: {
  score: number;
  color: string;
}) {
  const widthPct = Math.max(0, Math.min(100, score));
  const showInside = widthPct >= 14;

  return (
    <div
      className="relative h-9 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: TRACK_BG, ...DOT_PATTERN }}
    >
      <div
        className="absolute inset-y-0 left-0 flex items-center justify-end rounded-full"
        style={{ width: `${widthPct}%`, backgroundColor: color }}
      >
        {showInside ? (
          <span className="pr-3 text-sm font-semibold tabular-nums text-white">
            {score.toFixed(1)}
          </span>
        ) : null}
      </div>
      {!showInside ? (
        <span
          className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold tabular-nums"
          style={{ color: HEADING_DARK }}
        >
          {score.toFixed(1)}
        </span>
      ) : null}
    </div>
  );
}

export interface IndicatorPerformanceByRegionSectionProps {
  indicatorName: string;
  regionalScores: IndicatorRegionalScore[];
}

/**
 * Horizontal bar chart of regional averages for one indicator.
 */
export function IndicatorPerformanceByRegionSection({
  indicatorName,
  regionalScores,
}: IndicatorPerformanceByRegionSectionProps) {
  const scoreByRegion = new Map(
    regionalScores.map((row) => [row.region, row.score])
  );

  const chartRegions = LEGEND_REGION_ORDER.flatMap((region) => {
    const score = scoreByRegion.get(region);
    if (score === null || score === undefined) return [];
    return [{ region, score }];
  });

  const legendRegions = chartRegions.map((row) => row.region);

  const indicatorLabel = indicatorName.toLowerCase();

  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto mb-10 max-w-2xl text-center md:mb-12">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            <span style={{ color: PURPLE }}>Performance </span>
            <span style={{ color: HEADING_DARK }}>by Region</span>
          </h2>

          <p
            className="mt-4 text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            How different regions perform in the {indicatorLabel} indicator,
            revealing both progress and persistent challenges
          </p>
        </header>

        <div className="mb-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
          {legendRegions.map((region) => (
            <div key={region} className="flex items-center gap-2">
              <span
                className="size-3.5 shrink-0 rounded-[4px]"
                style={{ backgroundColor: regionColor(region) }}
              />
              <span
                className="text-sm font-medium"
                style={{ color: SUBTITLE_COLOR }}
              >
                {regionLabel(region)}
              </span>
            </div>
          ))}
        </div>

        <div className="mx-auto max-w-4xl">
          <p
            className="mb-4 text-sm font-semibold"
            style={{ color: HEADING_DARK }}
          >
            {indicatorName}
          </p>

          <div className="flex flex-col gap-3">
            {chartRegions.map((row) => (
              <RegionBar
                key={row.region}
                score={row.score}
                color={regionColor(row.region)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
