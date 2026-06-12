import Image from "next/image";

const HERO_TITLE_ACCENT = "#9FE8C7";

const HERO_IMAGE = "/about/about-hero.png";
const HERO_LEAD =
  "A global framework for assessing how countries govern, deploy, and safeguard artificial intelligence in line with human rights, ethics, and democratic values.";

/**
 * Wide banner hero for the About page. Matches dimension detail hero sizing;
 * copy and background image are About-specific.
 */
export function AboutHero() {
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
            className="object-cover object-[center_30%] md:object-right"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0.12) 68%, rgba(0,0,0,0) 85%)",
            }}
          />

          <div className="relative flex min-h-[360px] flex-col justify-center px-8 py-12 md:min-h-[565px] md:max-w-[58%] md:px-14 md:py-16 lg:min-h-[565px]">
            <h1 className="text-[2rem] font-bold leading-[1.12] tracking-tight md:text-5xl lg:text-[3.25rem]">
              <span className="text-white">About the Global Index on </span>
              <span style={{ color: HERO_TITLE_ACCENT }}>Responsible AI</span>
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
