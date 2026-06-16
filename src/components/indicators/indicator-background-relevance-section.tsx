import type { IndicatorParagraph } from "@/lib/indicator-copy";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const BODY_COLOR = "#6B7280";
const DIVIDER_COLOR = "#E5E7EB";

export interface IndicatorBackgroundRelevanceSectionProps {
  indicatorName: string;
  background: IndicatorParagraph[];
  relevance: IndicatorParagraph[];
}

function RichParagraph({ segments }: { segments: IndicatorParagraph }) {
  return (
    <p
      className="text-base leading-[1.7] md:text-[1.0625rem] md:leading-[1.75]"
      style={{ color: BODY_COLOR }}
    >
      {segments.map((segment, index) =>
        segment.href ? (
          <a
            key={`${segment.text}-${index}`}
            href={segment.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[#9CA3AF] underline-offset-[3px] transition-colors hover:decoration-[#7150F4]"
            style={{ color: BODY_COLOR }}
          >
            {segment.text}
          </a>
        ) : (
          <span key={`${segment.text}-${index}`}>{segment.text}</span>
        )
      )}
    </p>
  );
}

function Column({
  label,
  indicatorName,
  paragraphs,
}: {
  label: string;
  indicatorName: string;
  paragraphs: IndicatorParagraph[];
}) {
  return (
    <div>
      <h2
        className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.2] tracking-tight md:leading-[1.18]"
        style={{ color: HEADING_DARK }}
      >
        {label}{" "}
        <span style={{ color: PURPLE }}>{indicatorName}</span>
      </h2>

      <div className="mt-6 space-y-5 md:mt-8 md:space-y-6">
        {paragraphs.map((paragraph, index) => (
          <RichParagraph key={index} segments={paragraph} />
        ))}
      </div>
    </div>
  );
}

/**
 * Two-column Background / Relevance section below the indicator choropleth.
 */
export function IndicatorBackgroundRelevanceSection({
  indicatorName,
  background,
  relevance,
}: IndicatorBackgroundRelevanceSectionProps) {
  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-0">
          <div className="md:pr-10 lg:pr-14">
            <Column
              label="Background of"
              indicatorName={indicatorName}
              paragraphs={background}
            />
          </div>

          <div
            className="md:border-l md:pl-10 lg:pl-14"
            style={{ borderColor: DIVIDER_COLOR }}
          >
            <Column
              label="Relevance of"
              indicatorName={indicatorName}
              paragraphs={relevance}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
