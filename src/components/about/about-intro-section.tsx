import { aboutDefaults, type AboutContent } from "@/content/about.defaults";

const HEADING_DARK = "#1A1A2E";
const HEADING_MUTED = "#A8ADB6";
const BODY_COLOR = "#5C6370";

/**
 * Two-column intro below the About hero — large split-tone heading with
 * supporting body copy on the right.
 */
export function AboutIntroSection({ content = aboutDefaults }: { content?: AboutContent }) {
  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.14] tracking-tight lg:leading-[1.12]">
            <span style={{ color: HEADING_DARK }}>{content.introHeadingLead}</span>
            <span style={{ color: HEADING_MUTED }}>{content.introHeadingMuted}</span>
          </h2>

          <p
            className="max-w-md text-base leading-[1.65] md:text-[1.0625rem] lg:pt-2"
            style={{ color: BODY_COLOR }}
          >
            {content.introBody}
          </p>
        </div>
      </div>
    </section>
  );
}
