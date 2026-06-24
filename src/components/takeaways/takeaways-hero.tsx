import Image from "next/image";
import { takeawaysDefaults, type TakeawaysContent } from "@/content/takeaways.defaults";

const HERO_TITLE_ACCENT = "#9FE8C7";

/**
 * Wide banner hero for the Top Takeaways page. Matches methodology hero sizing;
 * copy, stats, and background image are Takeaways-specific.
 */
export function TakeawaysHero({ content = takeawaysDefaults }: { content?: TakeawaysContent }) {
  const heroImage = content.heroImage.url ?? takeawaysDefaults.heroImage.url!;
  return (
    <section className="w-full px-4 pt-6 md:px-6 md:min-h-[565px]">
      <div className="w-full min-h-[565px]">
        <div className="relative overflow-hidden rounded-[28px] md:rounded-[32px]">
          <Image
            src={heroImage}
            alt={content.heroImage.alt ?? ""}
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

          <div className="relative flex min-h-[360px] flex-col justify-center px-8 py-12 md:min-h-[565px] md:max-w-[58%] md:px-14 md:py-16 lg:min-h-[565px]">
            <div>
              <h1 className="text-[2rem] font-medium leading-[1.12] tracking-tight md:text-6xl lg:text-[3.25rem]">
                <span className="text-white">{content.heroTitleLead}</span>
                <span style={{ color: HERO_TITLE_ACCENT }}>{content.heroTitleAccent}</span>
              </h1>

              <p className="mt-5 max-w-xl text-base leading-relaxed text-white md:mt-6 md:text-lg">
                {content.heroLead}
              </p>
            </div>

            <dl className="mt-10 flex flex-wrap gap-x-12 gap-y-4 md:mt-8">
              {content.heroStats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-1">
                  <dt className="text-xs font-medium text-white/55 md:text-sm">
                    {stat.label}
                  </dt>
                  <dd className="text-xl font-medium text-white md:text-2xl">
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
