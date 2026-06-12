import Image from "next/image";
import { Sparkles } from "lucide-react";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const BODY_COLOR = "#6B7280";
const BADGE_BG = "#F0EDFF";

/**
 * Two-column section explaining what GIRAI measures — image left, copy right.
 */
export function AboutWhatIndexMeasuresSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
          <Image
            src="/about/what-index-measures.png"
            alt="Professionals discussing AI governance against a connected city skyline"
            width={582}
            height={561}
            className="h-auto w-full max-w-[582px] drop-shadow-[0_24px_48px_rgba(113,80,244,0.16)]"
            sizes="(max-width: 1024px) 90vw, 582px"
          />
        </div>

        <div className="order-1 flex flex-col gap-6 lg:order-2 lg:max-w-xl">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium"
            style={{ backgroundColor: BADGE_BG, color: PURPLE }}
          >
            <Sparkles className="size-3.5" aria-hidden />
            What it measures
          </span>

          <h2 className="text-[1.75rem] font-bold leading-[1.18] tracking-tight md:text-4xl md:leading-[1.15] lg:text-[2.5rem]">
            <span style={{ color: HEADING_DARK }}>What the Index Measures </span>
            <span style={{ color: PURPLE }}>Across AI Governance</span>
          </h2>

          <p
            className="max-w-lg text-base leading-[1.65] md:text-[1.0625rem]"
            style={{ color: BODY_COLOR }}
          >
            GIRAI evaluates countries across core dimensions of responsible AI,
            capturing how governments, institutions, and societies address the
            risks and opportunities of AI. The index goes beyond policy intent to
            assess implementation, participation, and broader national context.
          </p>
        </div>
      </div>
    </section>
  );
}
