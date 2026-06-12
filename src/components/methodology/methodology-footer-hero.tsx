import Image from "next/image";
import Link from "next/link";
import { FileText } from "lucide-react";

const PURPLE = "#7150F4";
const TITLE_ACCENT = "#9FE8C7";
const FOOTER_IMAGE = "/methodology/footer-hero.png";

/**
 * Closing CTA banner for the Methodology page — handbook download over
 * footer photography with copy on the left.
 */
export function MethodologyFooterHero() {
  return (
    <section className="w-full px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <div className="relative mx-auto min-h-[360px] max-w-7xl overflow-hidden rounded-[28px] md:min-h-[480px] md:rounded-[32px] lg:min-h-[565px]">
        <Image
          src={FOOTER_IMAGE}
          alt=""
          aria-hidden
          fill
          className="object-cover object-right"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.78) 34%, rgba(0,0,0,0.42) 58%, rgba(0,0,0,0.12) 78%, transparent 100%)",
          }}
        />

        <div className="relative z-10 flex min-h-[360px] flex-col justify-center px-8 py-14 sm:px-12 md:min-h-[480px] md:px-14 md:py-16 lg:min-h-[565px] lg:max-w-[56%] lg:px-16">
          <h2 className="max-w-lg text-[2rem] font-bold leading-[1.12] tracking-tight md:text-4xl md:leading-[1.1] lg:text-[2.75rem]">
            <span className="text-white">Download GIRAI Research</span>
            <br />
            <span style={{ color: TITLE_ACCENT }}>Methodology Handbook</span>
          </h2>

          <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 md:mt-6 md:text-lg">
            Access the full technical documentation behind the GIRAI
            methodology.
          </p>

          <div className="mt-8">
            <Link
              href="#download-methodology"
              className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/25 transition-opacity hover:opacity-90"
              style={{ backgroundColor: PURPLE }}
            >
              <FileText className="size-4" aria-hidden />
              Download book
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
