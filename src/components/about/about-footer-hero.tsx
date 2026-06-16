import Image from "next/image";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

const PURPLE = "#7150F4";

/**
 * Closing CTA banner for the About page — dark gradient over footer-hero
 * photography with copy and an Explore Index button on the left.
 */
export function AboutFooterHero() {
  return (
    <section className="w-full px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <div className="relative mx-auto min-h-[340px] max-w-7xl overflow-hidden rounded-[28px] md:min-h-[420px] md:rounded-[32px] lg:min-h-[480px]">
        <Image
          src="/about/footer-hero.png"
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
              "linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.72) 32%, rgba(0,0,0,0.35) 58%, rgba(0,0,0,0.08) 78%, transparent 100%)",
          }}
        />

        <div className="relative z-10 flex min-h-[340px] flex-col justify-center px-8 py-14 sm:px-12 md:min-h-[420px] md:px-14 md:py-16 lg:min-h-[480px] lg:max-w-[52%] lg:px-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl max-w-md font-medium leading-[1.12] tracking-tight text-white md:leading-[1.1]">
            Discover How AI Is Governed
          </h2>

          <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 md:mt-6 md:text-lg">
            Explore country scores, regional insights, and the evidence behind
            responsible AI governance.
          </p>

          <div className="mt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 rounded-full px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-black/25 transition-opacity hover:opacity-90"
              style={{ backgroundColor: PURPLE }}
            >
              <BarChart3 className="size-4" aria-hidden />
              Explore Index
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
