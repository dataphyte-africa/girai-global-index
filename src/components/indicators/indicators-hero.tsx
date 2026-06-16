import Image from "next/image";

const HERO_TITLE_ACCENT = "#9FE8C7";
const HERO_IMAGE = "/indicator/hero-indicator.png";

const HERO_LEAD =
  "The full set of structured indicators used to evaluate how countries govern, regulate, and implement responsible artificial intelligence.";

/**
 * Wide banner hero for the Indicators index page.
 */
export function IndicatorsHero() {
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
            <h1 className="text-[2rem] font-medium leading-[1.12] tracking-tight md:text-5xl lg:text-[3.25rem]">
              <span style={{ color: HERO_TITLE_ACCENT }}>Indicators used </span>
              <span className="text-white">for Index measurement</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white md:mt-6 md:text-lg">
              {HERO_LEAD}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
