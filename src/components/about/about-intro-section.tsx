const HEADING_DARK = "#1A1A2E";
const HEADING_MUTED = "#A8ADB6";
const BODY_COLOR = "#5C6370";

/**
 * Two-column intro below the About hero — large split-tone heading with
 * supporting body copy on the right.
 */
export function AboutIntroSection() {
  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <h2 className="text-[2rem] font-bold leading-[1.14] tracking-tight md:text-[2.75rem] lg:text-[3.125rem] lg:leading-[1.12]">
            <span style={{ color: HEADING_DARK }}>
              The GIRAI provides an evidence-based assessment{" "}
            </span>
            <span style={{ color: HEADING_MUTED }}>
              of national approaches to responsible AI.
            </span>
          </h2>

          <p
            className="max-w-md text-base leading-[1.65] md:text-[1.0625rem] lg:pt-2"
            style={{ color: BODY_COLOR }}
          >
            By examining policy frameworks, institutional practices, and
            enabling conditions, GIRAI offers a comparative view of how
            countries are ensuring AI systems serve society equitably, safely,
            and transparently.
          </p>
        </div>
      </div>
    </section>
  );
}
