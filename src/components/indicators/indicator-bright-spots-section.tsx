import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";

import { BrightSpotCallout } from "@/components/bright-spot-callout";
import type { IndicatorBrightSpot } from "@/content/indicatorPages";

export interface IndicatorBrightSpotsSectionProps {
  indicatorName: string;
  brightSpots: IndicatorBrightSpot[];
}

/** Matches the bright spot body on the key findings accordion. */
const brightSpotComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-muted-foreground">
        {children}
      </ol>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-foreground">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = (value as { href?: string })?.href ?? "#";
      const external = /^https?:\/\//.test(href);
      return (
        <a
          href={href}
          className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
        >
          {children}
        </a>
      );
    },
  },
};

/**
 * Up to two country examples for an indicator, stacked below the Background /
 * Relevance section. Authored in Sanity only (no code fallback), so the whole
 * section is absent until an editor adds one — see src/content/indicatorPages.ts.
 *
 * No top padding: the section above already ends with its own bottom padding,
 * so these read as a continuation of that argument rather than a new slab.
 */
export function IndicatorBrightSpotsSection({
  indicatorName,
  brightSpots,
}: IndicatorBrightSpotsSectionProps) {
  if (brightSpots.length === 0) return null;

  return (
    <section className="w-full bg-background px-4 pb-16 md:px-6 md:pb-24 lg:pb-28">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto mb-8 max-w-2xl text-center md:mb-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight lg:leading-[1.12]">
            <span className="text-primary">Bright </span>
            <span className="text-foreground">Spots</span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base md:leading-[1.65]">
            Where countries are making real progress on {indicatorName}
          </p>
        </header>

        <div className="mx-auto max-w-3xl">
          {brightSpots.map((spot, index) => (
            <BrightSpotCallout key={spot._key ?? index} country={spot.country}>
              {spot.body ? (
                <PortableText
                  value={spot.body}
                  components={brightSpotComponents}
                />
              ) : null}
            </BrightSpotCallout>
          ))}
        </div>
      </div>
    </section>
  );
}
