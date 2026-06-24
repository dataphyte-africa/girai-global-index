import { aboutDefaults, type AboutContent } from "@/content/about.defaults";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";
const PILL_TEXT = "#333333";

function ContributorPill({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-normal shadow-[0_1px_2px_rgba(26,26,46,0.04)]">
      <span style={{ color: PILL_TEXT }}>{name}</span>
    </span>
  );
}

/**
 * Researchers and contributors — centered heading with a wrapping pill cloud.
 */
export function AboutPeopleBehindResearchSection({
  content = aboutDefaults,
}: {
  content?: AboutContent;
}) {
  return (
    <section className="w-full bg-[#F9FAFB] px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight lg:leading-[1.12]">
            <span style={{ color: HEADING_DARK }}>{content.peopleHeadingLead}</span>
            <span style={{ color: PURPLE }}>{content.peopleHeadingAccent}</span>
            <span style={{ color: HEADING_DARK }}>{content.peopleHeadingTail}</span>
          </h2>

          <p
            className="mx-auto mt-4 max-w-xl text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            {content.peopleSubtitle}
          </p>
        </header>

        <div className="mt-10 flex flex-wrap justify-center gap-3 md:mt-12 md:gap-3.5">
          {content.people.map((name) => (
            <ContributorPill key={name} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
