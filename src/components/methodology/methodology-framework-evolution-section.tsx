import Image from "next/image";
import { Sparkles } from "lucide-react";
import { methodologyDefaults, type MethodologyContent } from "@/content/methodology.defaults";

function FrameworkEvolutionQuoteCard({
  quoteText,
  quoteAttribution,
}: {
  quoteText: string;
  quoteAttribution: string;
}) {
  return (
    <figure className="methodology-feature-gradient relative min-h-[300px] overflow-hidden rounded-[24px] p-8 shadow-[0_24px_48px_rgba(26,26,46,0.18)] md:min-h-[360px] md:p-10 lg:min-h-[400px] lg:p-12 dark:shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
      <Image
        src="/impact/circular-rings.svg"
        alt=""
        aria-hidden
        width={398}
        height={479}
        className="pointer-events-none absolute -right-8 -top-10 w-[min(58%,13rem)] max-w-[200px] select-none opacity-[0.22] brightness-0 invert"
      />
      <Image
        src="/impact/circular-rings.svg"
        alt=""
        aria-hidden
        width={398}
        height={479}
        className="pointer-events-none absolute -bottom-12 -left-10 w-[min(52%,11rem)] max-w-[176px] rotate-180 select-none opacity-[0.18] brightness-0 invert"
      />

      <blockquote className="relative z-10 flex h-full min-h-[220px] flex-col justify-between gap-10 md:min-h-[280px]">
        <p className="text-xl font-medium italic leading-[1.45] text-white md:text-2xl md:leading-[1.4] lg:text-[1.75rem] lg:leading-[1.38]">
          &ldquo;{quoteText}&rdquo;
        </p>

        <figcaption className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/55">
          {quoteAttribution}
        </figcaption>
      </blockquote>
    </figure>
  );
}

/**
 * Why the Framework Evolved — scrolling copy left, sticky quote card right.
 */
export function MethodologyFrameworkEvolutionSection({
  content = methodologyDefaults,
}: {
  content?: MethodologyContent;
}) {
  return (
    <section className="w-full bg-card px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
        <div className="flex max-w-xl flex-col gap-6 lg:gap-7">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            {content.evolutionBadge}
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.18] tracking-tight md:leading-[1.15]">
            <span className="text-foreground">{content.evolutionHeadingLead}</span>
            <span className="text-primary">{content.evolutionHeadingAccent}</span>
          </h2>

          <div className="flex flex-col gap-5 text-base leading-[1.7] text-muted-foreground md:gap-6 md:text-[1.0625rem] md:leading-[1.68]">
            {content.evolutionParagraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="self-start lg:sticky lg:top-24">
          <FrameworkEvolutionQuoteCard
            quoteText={content.evolutionQuoteText}
            quoteAttribution={content.evolutionQuoteAttribution}
          />
        </div>
      </div>
    </section>
  );
}
