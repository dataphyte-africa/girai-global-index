import Image from "next/image";
import { Sparkles } from "lucide-react";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const BODY_COLOR = "#6B7280";
const BADGE_BG = "#F0EDFF";

const PARAGRAPHS = [
  "Since the first edition of GIRAI, the global AI governance environment has evolved significantly. Governments have moved from high-level strategy development toward implementation and regulatory experimentation. Oversight mechanisms have matured, public debate has deepened, and expectations around responsible AI have become more precise.",
  "To remain analytically relevant, the GIRAI framework was refined to better capture these developments. The evolution reflects lessons learned from the previous cycle, feedback from researchers and stakeholders, and the need to distinguish more clearly between policy intent, operational action, and structural capacity.",
] as const;

function FrameworkEvolutionQuoteCard() {
  return (
    <figure className="relative min-h-[300px] overflow-hidden rounded-[24px] bg-gradient-to-br from-[#4F3AAF] via-[#35267A] to-[#1A1038] p-8 shadow-[0_24px_48px_rgba(26,26,46,0.18)] md:min-h-[360px] md:p-10 lg:min-h-[400px] lg:p-12">
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
          &ldquo;The core principles of GIRAI remain unchanged. What has evolved
          is the precision with which those principles are measured.&rdquo;
        </p>

        <figcaption className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-white/55">
          GIRAI Methodology — Second Edition
        </figcaption>
      </blockquote>
    </figure>
  );
}

/**
 * Why the Framework Evolved — scrolling copy left, sticky quote card right.
 */
export function MethodologyFrameworkEvolutionSection() {
  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
        <div className="flex max-w-xl flex-col gap-6 lg:gap-7">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]"
            style={{ backgroundColor: BADGE_BG, color: PURPLE }}
          >
            <Sparkles className="size-3.5" aria-hidden />
            Framework Evolution
          </span>

          <h2 className="text-[1.75rem] font-bold leading-[1.18] tracking-tight md:text-4xl md:leading-[1.15] lg:text-[2.5rem]">
            <span style={{ color: HEADING_DARK }}>Why the Framework </span>
            <span style={{ color: PURPLE }}>Evolved</span>
          </h2>

          <div
            className="flex flex-col gap-5 text-base leading-[1.7] md:gap-6 md:text-[1.0625rem] md:leading-[1.68]"
            style={{ color: BODY_COLOR }}
          >
            {PARAGRAPHS.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>

        <div className="self-start lg:sticky lg:top-24">
          <FrameworkEvolutionQuoteCard />
        </div>
      </div>
    </section>
  );
}
