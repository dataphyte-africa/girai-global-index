import Image from "next/image";
import { Download } from "lucide-react";
import { DataDownloadOpenButton } from "@/components/data-download/data-download-trigger";
import { methodologyDefaults, type MethodologyContent } from "@/content/methodology.defaults";

/**
 * Wide banner hero for the Methodology page. Matches dimension detail hero sizing;
 * copy, CTA, and background image are Methodology-specific.
 */
export function MethodologyHero({
  content = methodologyDefaults,
}: {
  content?: MethodologyContent;
}) {
  const heroImage = content.heroImage.url ?? methodologyDefaults.heroImage.url!;
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
            className="object-cover object-left md:object-[left_center]"
          />
          {/* <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.52) 38%, rgba(0,0,0,0.22) 62%, rgba(0,0,0,0.08) 78%, rgba(0,0,0,0) 92%)",
            }}
          /> */}

          <div className="relative flex min-h-[360px] flex-col justify-center px-8 py-12 md:min-h-[565px] md:max-w-[58%] md:px-14 md:py-16 lg:min-h-[565px]">
            <h1 className="text-[2rem] font-medium leading-[1.12] tracking-tight md:text-5xl lg:text-[3.25rem]">
              <span className="text-white">{content.heroTitleLine1Lead}</span>
              <span className="text-hero-accent">{content.heroTitleLine1Accent}</span>
              <br />
              <span className="text-hero-accent">{content.heroTitleLine2Accent}</span>
              <span className="text-white">{content.heroTitleLine2Tail}</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white md:mt-6 md:text-lg">
              {content.heroLead}
            </p>

            <div className="mt-8">
              <DataDownloadOpenButton
                assetType="methodology"
                source="methodology-hero"
                className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/25 transition-opacity hover:opacity-90"
              >
                <Download className="size-4" aria-hidden />
                {content.heroCtaLabel}
              </DataDownloadOpenButton>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
