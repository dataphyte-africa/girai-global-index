import Image from "next/image";

const HERO_TITLE_ACCENT = "#9FE8C7";
const HERO_IMAGE = "/takeaways/hero-takeaways.png";

const HERO_LEAD =
  "The most important insights shaping how countries govern artificial intelligence responsibly across regions and contexts.";

const HERO_STATS = [
  { label: "Edition", value: "2026" },
  { label: "Countries Assessed", value: "135" },
] as const;

/**
 * Wide banner hero for the Top Takeaways page. Matches methodology hero sizing;
 * copy, stats, and background image are Takeaways-specific.
 */
export function TakeawaysHero() {
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
                "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.52) 38%, rgba(0,0,0,0.22) 62%, rgba(0,0,0,0.08) 78%, rgba(0,0,0,0) 92%)",
            }}
          />

          <div className="relative flex min-h-[360px] flex-col justify-between px-8 py-12 md:min-h-[565px] md:max-w-[58%] md:px-14 md:py-16 lg:min-h-[565px]">
            <div>
              <h1 className="text-[2rem] font-bold leading-[1.12] tracking-tight md:text-5xl lg:text-[3.25rem]">
                <span className="text-white">Top 10 </span>
                <span style={{ color: HERO_TITLE_ACCENT }}>Takeaways</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white md:mt-6 md:text-lg">
                {HERO_LEAD}
              </p>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 md:mt-8">
              {HERO_STATS.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dt className="text-xs font-medium text-white/55 md:text-sm">
                    {stat.label}
                  </dt>
                  <dd className="text-xl font-bold text-white md:text-2xl">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
