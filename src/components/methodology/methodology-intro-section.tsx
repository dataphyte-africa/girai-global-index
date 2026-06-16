/**
 * Centered split-tone statement below the Methodology hero.
 */
export function MethodologyIntroSection() {
  return (
    <section className="w-full bg-card px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[1.75rem] font-medium leading-[1.22] tracking-tight md:text-[2.5rem] md:leading-[1.2] lg:text-[2.75rem] lg:leading-[1.18]">
          <span className="text-foreground">
            Designed for transparency and rigor, the methodology enables{" "}
          </span>
          <span className="text-heading-muted">
            meaningful comparison across diverse legal, institutional, and
            development contexts.
          </span>
        </p>
      </div>
    </section>
  );
}
