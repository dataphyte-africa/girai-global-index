import { NumberedImpactCard } from "@/components/numbered-impact-card";
import { aboutDefaults, type AboutContent } from "@/content/about.defaults";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";

function SectionAccent({
  className,
  color,
}: {
  className?: string;
  color: "blue" | "pink";
}) {
  const bg = color === "blue" ? "bg-[#3B82F6]" : "bg-[#EC4899]";
  return (
    <span
      aria-hidden
      className={`block h-0.5 w-10 rounded-full ${bg} ${className ?? ""}`}
    />
  );
}

/**
 * Six-card grid explaining why GIRAI matters — numbered badges, ring
 * accents, and centered section header with decorative line markers.
 */
export function AboutWhyGiraiMattersSection({
  content = aboutDefaults,
}: {
  content?: AboutContent;
}) {
  return (
    <section className="relative w-full overflow-hidden bg-[#F7F8FA] px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-[58%] hidden h-20 w-px -translate-y-1/2 bg-[#3B82F6] md:left-5 lg:block"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-[58%] hidden h-20 w-px -translate-y-1/2 bg-[#3B82F6] md:right-5 lg:block"
      />

      <div className="relative mx-auto max-w-7xl">
        <header className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center md:mb-14 lg:mb-16">
          <SectionAccent color="blue" className="mb-5" />

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight lg:leading-[1.12]">
            <span style={{ color: HEADING_DARK }}>{content.whyHeadingLead}</span>
            <span style={{ color: PURPLE }}>{content.whyHeadingAccent}</span>
            <span style={{ color: HEADING_DARK }}>{content.whyHeadingTail}</span>
          </h2>

          <p
            className="mt-4 max-w-xl text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            {content.whySubtitle}
          </p>

          <SectionAccent color="pink" className="mt-5" />
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {content.whyCards.map((card, index) => (
            <NumberedImpactCard
              key={card.title}
              index={index + 1}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>

        <div className="mt-14 flex justify-center md:mt-16">
          <SectionAccent color="blue" />
        </div>
      </div>
    </section>
  );
}
