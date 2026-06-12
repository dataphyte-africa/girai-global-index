import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";

const HERO_TITLE_ACCENT = "#9FE8C7";
const HERO_IMAGE = "/methodology/hero.png";
const PURPLE = "#7150F4";

const HERO_LEAD =
  "GIRAI's methodology turns global principles for responsible AI into clear, comparable evidence—assessing how countries govern and use AI in the public interest, not how advanced their technology is.";

/**
 * Wide banner hero for the Methodology page. Matches dimension detail hero sizing;
 * copy, CTA, and background image are Methodology-specific.
 */
export function MethodologyHero() {
  return (
    <section className="w-full px-4 pt-6 md:px-6 md:min-h-[565px]">
      <div className="w-full min-h-[565px]">
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[32px]">
          <Image
            src={HERO_IMAGE}
            alt=""
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1280px"
            className="object-cover object-left md:object-[left_center]"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.52) 38%, rgba(0,0,0,0.22) 62%, rgba(0,0,0,0.08) 78%, rgba(0,0,0,0) 92%)",
            }}
          />

          <div className="relative flex min-h-[360px] flex-col justify-center px-8 py-12 md:min-h-[565px] md:max-w-[58%] md:px-14 md:py-16 lg:min-h-[565px]">
            <h1 className="text-[2rem] font-bold leading-[1.12] tracking-tight md:text-5xl lg:text-[3.25rem]">
              <span className="text-white">How GIRAI </span>
              <span style={{ color: HERO_TITLE_ACCENT }}>Measures</span>
              <br />
              <span style={{ color: HERO_TITLE_ACCENT }}>Responsible </span>
              <span className="text-white">Artificial Intelligence</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white md:mt-6 md:text-lg">
              {HERO_LEAD}
            </p>

            <div className="mt-8">
              <Link
                href="#download-methodology"
                className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/25 transition-opacity hover:opacity-90"
                style={{ backgroundColor: PURPLE }}
              >
                <Download className="size-4" aria-hidden />
                Download Methodology
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
