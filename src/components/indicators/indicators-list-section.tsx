import {
  DIMENSIONS,
  INDICATORS,
  type DimensionDef,
  type IndicatorDef,
} from "@/data/2026/taxonomy";
import { IndicatorCard } from "./indicator-card";

const HEADING_DARK = "#1A1A2E";

/** Prefer the ampersand alias when present (matches Figma headings). */
function dimensionDisplayName(dimension: DimensionDef): string {
  const ampersandAlias = dimension.aliases.find((alias) => alias.includes("&"));
  return ampersandAlias ?? dimension.name;
}

function indicatorsForDimension(slug: DimensionDef["slug"]): IndicatorDef[] {
  return INDICATORS.filter((indicator) => indicator.dimension === slug);
}

/**
 * All indicators grouped under their parent dimension headings.
 */
export function IndicatorsListSection() {
  const sortedDimensions = [...DIMENSIONS].sort((a, b) => a.order - b.order);

  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl space-y-16 md:space-y-20 lg:space-y-24">
        {sortedDimensions.map((dimension) => {
          const indicators = indicatorsForDimension(dimension.slug);

          return (
            <div key={dimension.slug}>
              <h2
                className="text-2xl font-bold tracking-tight md:text-3xl lg:text-[2rem]"
                style={{ color: HEADING_DARK }}
              >
                {dimensionDisplayName(dimension)}
              </h2>

              <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {indicators.map((indicator, index) => (
                  <IndicatorCard
                    key={indicator.slug}
                    index={index + 1}
                    slug={indicator.slug}
                    name={indicator.name}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
