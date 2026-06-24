import Image from "next/image";
import type { EvidenceContent } from "@/content/evidence.defaults";
import { evidenceDefaults } from "@/content/evidence.defaults";

export interface EvidenceHeroProps {
  countriesIndexed: number;
  frameworkCount: number;
  evidenceItemCount: number;
  indicatorCount: number;
  content?: EvidenceContent;
}

export function EvidenceHero({
  countriesIndexed,
  frameworkCount,
  evidenceItemCount,
  indicatorCount,
  content = evidenceDefaults,
}: EvidenceHeroProps) {
  const values = [
    countriesIndexed.toLocaleString(),
    frameworkCount.toLocaleString(),
    evidenceItemCount.toLocaleString(),
    indicatorCount.toLocaleString(),
  ];
  const labels = content.heroStatLabels;
  const stats = values.map((value, index) => ({
    value,
    label: labels[index] ?? evidenceDefaults.heroStatLabels[index] ?? "",
  }));

  return (
    <section
      id="evidence-hero"
      className="relative scroll-mt-20 overflow-hidden border-b border-border/60 bg-[#F8F9FF] py-16 md:py-20 dark:bg-[#0c0718]"
    >
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

      <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-6">
        <h1 className="max-w-3xl text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {content.heroTitleLead}
          <span className="text-primary">{content.heroTitleAccent}</span>
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
          {content.heroSubtitle}
        </p>

        <dl className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <dt className="text-2xl font-medium tracking-tight text-primary md:text-3xl">
                {stat.value}
              </dt>
              <dd className="text-xs text-muted-foreground md:text-sm">
                {stat.label}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
