import Image from "next/image";

const HERO_TITLE_ACCENT = "#9FE8C7";

/**
 * Wide banner hero for the Updates page. Mirrors the About/Dimension hero
 * treatment (rounded banner, left-anchored copy, gradient scrim).
 */
export function UpdatesHero() {
  return (
    <section className="w-full px-4 pt-6 md:px-6">
      <div className="relative overflow-hidden rounded-[28px] md:rounded-[32px]">
        <Image
          src="/updates/hero-updates.png"
          alt=""
          fill
          priority
          sizes="(max-width: 1280px) 100vw, 1280px"
          className="object-cover object-[center_35%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.5) 40%, rgba(0,0,0,0.2) 70%, rgba(0,0,0,0.05) 100%)",
          }}
        />

        <div className="relative flex min-h-[340px] flex-col justify-center px-8 py-14 md:min-h-[440px] md:max-w-[60%] md:px-14 md:py-16">
          <h1 className="text-[2.25rem] font-semibold leading-[1.08] tracking-tight md:text-6xl">
            <span className="text-white">Updates from </span>
            <span style={{ color: HERO_TITLE_ACCENT }}>GIRAI</span>
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-white/90 md:mt-6 md:text-lg">
            Exploring governance patterns, reforms, and debates shaping AI
            oversight globally.
          </p>
        </div>
      </div>
    </section>
  );
}
