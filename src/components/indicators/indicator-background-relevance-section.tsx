import {
  PortableText,
  type PortableTextComponents,
} from "@portabletext/react";

import type { PortableBlock } from "@/content/updates";

export interface IndicatorBackgroundRelevanceSectionProps {
  indicatorName: string;
  background: PortableBlock[];
  relevance: PortableBlock[];
}

const richTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-base leading-[1.7] text-muted-foreground md:text-[1.0625rem] md:leading-[1.75]">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc space-y-2 pl-6 text-base leading-[1.7] text-muted-foreground md:text-[1.0625rem] md:leading-[1.75]">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal space-y-2 pl-6 text-base leading-[1.7] text-muted-foreground md:text-[1.0625rem] md:leading-[1.75]">
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
          className="text-muted-foreground underline decoration-muted-foreground/60 underline-offset-[3px] transition-colors hover:decoration-primary"
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

function Column({
  label,
  indicatorName,
  body,
}: {
  label: string;
  indicatorName: string;
  body: PortableBlock[];
}) {
  return (
    <div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.2] tracking-tight text-foreground md:leading-[1.18]">
        {label} <span className="text-primary">{indicatorName}</span>
      </h2>

      <div className="mt-6 space-y-5 md:mt-8 md:space-y-6">
        <PortableText value={body} components={richTextComponents} />
      </div>
    </div>
  );
}

/**
 * Two-column Background / Relevance section below the indicator choropleth.
 * Copy is Portable Text (rich text with links) authored in Sanity, with a
 * code fallback (see src/content/indicatorPages.ts).
 */
export function IndicatorBackgroundRelevanceSection({
  indicatorName,
  background,
  relevance,
}: IndicatorBackgroundRelevanceSectionProps) {
  return (
    <section className="w-full bg-background px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0">
          <div className="md:pr-10 lg:pr-14">
            <Column
              label="Background of"
              indicatorName={indicatorName}
              body={background}
            />
          </div>

          <div className="md:border-l md:border-border md:pl-10 lg:pl-14">
            <Column
              label="Relevance of"
              indicatorName={indicatorName}
              body={relevance}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
