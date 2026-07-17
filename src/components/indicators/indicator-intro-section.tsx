export interface IndicatorIntroSectionProps {
  primary: string;
  /** Optional — an indicator whose editor cleared it renders the primary alone. */
  secondary?: string;
}

/**
 * Centered split-tone statement below the indicator detail hero —
 * mirrors MethodologyIntroSection / TakeawaysIntroSection.
 *
 * Both clauses are editor-optional: an empty secondary drops the muted span,
 * and an empty primary drops the section entirely.
 */
export function IndicatorIntroSection({
  primary,
  secondary,
}: IndicatorIntroSectionProps) {
  if (!primary) return null;

  return (
    <section className="w-full bg-background px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[1.75rem] font-medium leading-[1.22] tracking-tight md:text-[2.5rem] md:leading-[1.2] lg:text-[2.75rem] lg:leading-[1.18]">
          <span className="text-foreground">
            {secondary ? `${primary.trimEnd()} ` : primary.trimEnd()}
          </span>
          {secondary ? (
            <span className="text-muted-foreground">{secondary}</span>
          ) : null}
        </p>
      </div>
    </section>
  );
}
