const HEADING_DARK = "#1A1A2E";
const HEADING_MUTED = "#A8ADB6";

export interface IndicatorIntroSectionProps {
  primary: string;
  secondary: string;
}

/**
 * Centered split-tone statement below the indicator detail hero —
 * mirrors MethodologyIntroSection / TakeawaysIntroSection.
 */
export function IndicatorIntroSection({
  primary,
  secondary,
}: IndicatorIntroSectionProps) {
  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[1.75rem] font-bold leading-[1.22] tracking-tight md:text-[2.5rem] md:leading-[1.2] lg:text-[2.75rem] lg:leading-[1.18]">
          <span style={{ color: HEADING_DARK }}>{primary} </span>
          <span style={{ color: HEADING_MUTED }}>{secondary}</span>
        </p>
      </div>
    </section>
  );
}
