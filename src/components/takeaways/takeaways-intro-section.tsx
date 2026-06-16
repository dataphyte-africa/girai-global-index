const HEADING_DARK = "#1A1A2E";
const HEADING_MUTED = "#A8ADB6";

/**
 * Centered split-tone statement below the Top Takeaways hero.
 */
export function TakeawaysIntroSection() {
  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[1.75rem] font-medium leading-[1.22] tracking-tight md:text-[2.5rem] md:leading-[1.2] lg:text-[2.75rem] lg:leading-[1.18]">
          <span style={{ color: HEADING_DARK }}>
            Across regions and income levels, countries are taking distinct
            approaches to governing artificial intelligence.{" "}
          </span>
          <span style={{ color: HEADING_MUTED }}>
            The findings below highlight the most significant global patterns
            emerging from this edition of GIRAI
          </span>
        </p>
      </div>
    </section>
  );
}
