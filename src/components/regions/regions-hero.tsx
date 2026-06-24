import Image from "next/image";
import { regionsDefaults, type RegionsContent } from "@/content/regions.defaults";

interface RegionsHeroProps {
  content?: RegionsContent;
}

/**
 * Hero for the regions overview page. Matches the countries index hero layout
 * and uses the same world-map watermark background.
 */
export function RegionsHero({ content = regionsDefaults }: RegionsHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F8F9FF] dark:bg-[#0c0718]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.35] dark:opacity-[0.12]"
      >
        <Image
          src="/countries/world-map-watermark.svg"
          alt=""
          width={1200}
          height={600}
          priority
          className="h-auto w-[min(140%,1200px)] max-w-none select-none object-contain"
        />
      </div>

      <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-6 px-4 py-12 sm:px-6 md:grid-cols-2 md:gap-8 md:py-16 lg:px-8 lg:py-20">
        <div className="flex flex-col gap-4 md:gap-5">
          <h1 className="text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            <span className="block text-foreground">{content.heroTitleLine1}</span>
            <span className="block text-primary">{content.heroTitleAccent}</span>
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            {content.heroSubtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
