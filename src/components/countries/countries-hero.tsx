import Image from "next/image";
import { GlobeDemo } from "@/components/hero-globe";
import type { ArcPosition, Country } from "@/data/countries";

interface CountriesHeroProps {
  arcData: ArcPosition[];
  markers: Country[];
}

export function CountriesHero({ arcData, markers }: CountriesHeroProps) {
  return (
    <section className="relative overflow-hidden bg-[#F8F9FF] dark:bg-[#0c0718]">
      {/* Faint world-map watermark */}
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
          <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.5rem] lg:leading-[1.05]">
            <span className="block text-foreground">Responsible AI</span>
            <span className="block text-primary">Governance by Country</span>
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-muted-foreground md:text-lg">
            Compare national approaches to AI oversight, implementation, and
            institutional capacity across the Global Index.
          </p>
        </div>

        <div className="relative min-h-[220px] overflow-visible sm:min-h-[240px] md:min-h-[280px] lg:min-h-[320px]">
          <GlobeDemo
            arcData={arcData}
            markers={markers}
            className="mx-auto max-w-md md:h-[18rem] lg:h-[20rem]"
          />
        </div>
      </div>
    </section>
  );
}
