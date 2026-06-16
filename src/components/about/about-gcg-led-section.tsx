import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const BODY_COLOR = "#6B7280";
const BADGE_BG = "#F0EDFF";
const GCG_URL = "https://globalcenter.ai";

/**
 * Two-column section introducing GCG as the organisation behind GIRAI.
 */
export function AboutGcgLedSection() {
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F8F9FF] to-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div className="flex flex-col gap-6 lg:max-w-xl">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium"
            style={{ backgroundColor: BADGE_BG, color: PURPLE }}
          >
            <Sparkles className="size-3.5" aria-hidden />
            The Group
          </span>

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.18] tracking-tight md:leading-[1.15]"
            style={{ color: HEADING_DARK }}
          >
            GIRAI is led by the Global Center on AI Governance (GCG)
          </h2>

          <p
            className="max-w-lg text-base leading-[1.65] md:text-[1.0625rem]"
            style={{ color: BODY_COLOR }}
          >
            The Global Index on Responsible AI is a flagship initiative of the
            Global Center on AI Governance (GCG), advancing equitable AI
            governance through research, evidence, and global knowledge exchange.
          </p>

          <div className="pt-1">
            <Link
              href={GCG_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: PURPLE }}
            >
              Visit GCG
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Image
            src="/about/girai-led.png"
            alt="Global Center on AI Governance"
            width={582}
            height={564}
            className="h-auto w-full max-w-[582px] drop-shadow-[0_24px_48px_rgba(113,80,244,0.16)]"
            sizes="(max-width: 1024px) 90vw, 582px"
          />
        </div>
      </div>
    </section>
  );
}
