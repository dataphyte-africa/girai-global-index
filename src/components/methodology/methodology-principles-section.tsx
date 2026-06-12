import Image from "next/image";
import { Sparkles } from "lucide-react";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const BODY_COLOR = "#6B7280";
const BADGE_BG = "#F0EDFF";
const HERO_IMAGE = "/methodology/methodology-principle.png";

const PRINCIPLES = [
  {
    title: "Responsibility over capability",
    description:
      "GIRAI does not rank countries by AI sophistication. It evaluates the quality of governance, safeguards, and oversight shaping AI use.",
  },
  {
    title: "Evidence-based by design",
    description:
      "All assessments rely on public, verifiable evidence, documented and reviewed through standardized processes.",
  },
  {
    title: "Human-centred and rights-based",
    description:
      "Indicators are aligned with international human rights norms, ensuring AI is assessed through its impact on people and society.",
  },
  {
    title: "Globally comparable, locally grounded",
    description:
      "The same indicators apply worldwide, while research guidance allows for context-sensitive interpretation.",
  },
  {
    title: "Transparent and reviewable",
    description:
      "Methodological choices, indicators, and evidence rules are clearly defined so results can be understood, scrutinized, and improved.",
  },
] as const;

const NUMBER_DECORATOR = "/methodology/number-decorator.svg";

function PrincipleCard({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl border border-[#ECEEF2] bg-white p-8 md:p-10">
      <div className="relative mb-5 w-fit md:mb-6">
        <Image
          src={NUMBER_DECORATOR}
          alt=""
          aria-hidden
          width={31}
          height={57}
          className="pointer-events-none absolute -left-1.5 -top-3 select-none"
        />
        <span
          className="relative flex size-10 items-center justify-center rounded-full text-base font-semibold text-white shadow-[0_4px_14px_rgba(113,80,244,0.32)]"
          style={{ backgroundColor: PURPLE }}
        >
          {index}
        </span>
      </div>

      <h3
        className="text-[1.75rem] font-bold leading-[1.2] tracking-tight md:text-[2rem] md:leading-[1.18]"
        style={{ color: HEADING_DARK }}
      >
        {title}
      </h3>

      <p
        className="mt-3 max-w-[42ch] text-base leading-[1.55] md:mt-4 md:text-[1.0625rem] md:leading-[1.6]"
        style={{ color: BODY_COLOR }}
      >
        {description}
      </p>
    </article>
  );
}

/**
 * Methodological principles — sticky portrait left, scrolling principle cards right.
 *
 * Layout mirrors CountryPerformanceOverview / CountryMisuseEvidenceSection:
 * the left column pins while the taller right column scrolls past it.
 */
export function MethodologyPrinciplesSection() {
  return (
    <section className="relative w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-16 top-8 h-64 w-64 rounded-full bg-[#7150F4]/10 blur-3xl md:-right-8 md:top-12 md:h-80 md:w-80"
      />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          {/* Sticky image column */}
          <div className="self-start lg:sticky lg:top-24">
            <div className="relative mx-auto aspect-4/5 w-full max-w-[520px] min-h-[360px] md:min-h-[565px] lg:mx-0 lg:max-w-none lg:aspect-auto lg:h-[565px]">
              <Image
                src={HERO_IMAGE}
                alt="Wooden blocks stacked in balance, representing methodological rigor"
                fill
                className="object-contain object-left"
                sizes="(max-width: 1024px) 90vw, 50vw"
                priority={false}
              />
            </div>
          </div>

          {/* Scrolling content column */}
          <div className="flex flex-col">
            <header className="max-w-xl pb-8 md:pb-10">
              <span
                className="inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]"
                style={{ backgroundColor: BADGE_BG, color: PURPLE }}
              >
                <Sparkles className="size-3.5" aria-hidden />
                Methodological Principles
              </span>

              <h2 className="mt-5 text-[1.75rem] font-bold leading-[1.18] tracking-tight md:text-4xl md:leading-[1.15] lg:text-[2.5rem]">
                <span style={{ color: PURPLE }}>Built for Trust</span>
                <span style={{ color: HEADING_DARK }}>
                  , Rigor, and Fair Comparison
                </span>
              </h2>

              <p
                className="mt-4 text-sm leading-relaxed md:text-base md:leading-[1.65]"
                style={{ color: BODY_COLOR }}
              >
                GIRAI&apos;s methodology is grounded in five core principles:
              </p>
            </header>

            <div className="flex flex-col gap-6 md:gap-8">
              {PRINCIPLES.map((principle, index) => (
                <PrincipleCard
                  key={principle.title}
                  index={index + 1}
                  title={principle.title}
                  description={principle.description}
                />
              ))}
            </div>

            {/* Extra runway so the image stays pinned through the last card */}
            <div aria-hidden className="hidden h-24 lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
