const HEADING_DARK = "#1A1A2E";
const HEADING_MUTED = "#A8ADB6";

/**
 * Centered split-tone statement below the Methodology hero.
 */
export function MethodologyIntroSection() {
  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[1.75rem] font-bold leading-[1.22] tracking-tight md:text-[2.5rem] md:leading-[1.2] lg:text-[2.75rem] lg:leading-[1.18]">
          <span style={{ color: HEADING_DARK }}>
            Designed for transparency and rigor, the methodology enables{" "}
          </span>
          <span style={{ color: HEADING_MUTED }}>
            meaningful comparison across diverse legal, institutional, and
            development contexts.
          </span>
        </p>
      </div>
    </section>
  );
}
