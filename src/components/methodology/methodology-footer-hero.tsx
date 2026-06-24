import Image from "next/image";
import { FileText } from "lucide-react";
import { DataDownloadOpenButton } from "@/components/data-download/data-download-trigger";
import { methodologyDefaults, type MethodologyContent } from "@/content/methodology.defaults";

/**
 * Closing CTA banner for the Methodology page — handbook download over
 * footer photography with copy on the left.
 */
export function MethodologyFooterHero({
  content = methodologyDefaults,
}: {
  content?: MethodologyContent;
}) {
  const footerImage = content.footerImage.url ?? methodologyDefaults.footerImage.url!;
  return (
    <section className="w-full px-4 py-12 md:px-6 md:py-16 lg:py-20">
      <div className="relative mx-auto min-h-[360px] max-w-7xl overflow-hidden rounded-[28px] md:min-h-[480px] md:rounded-[32px] lg:min-h-[565px]">
        <Image
          src={footerImage}
          alt={content.footerImage.alt ?? ""}
          aria-hidden={!content.footerImage.alt}
          fill
          className="object-cover object-right"
          sizes="(max-width: 1280px) 100vw, 1280px"
        />
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.78) 34%, rgba(0,0,0,0.42) 58%, rgba(0,0,0,0.12) 78%, transparent 100%)",
          }}
        />

        <div className="relative z-10 flex min-h-[360px] flex-col justify-center px-8 py-14 sm:px-12 md:min-h-[480px] md:px-14 md:py-16 lg:min-h-[565px] lg:max-w-[56%] lg:px-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl max-w-lg font-medium leading-[1.12] tracking-tight md:leading-[1.1]">
            <span className="text-white">{content.footerHeadingLine1}</span>
            <br />
            <span className="text-hero-accent">{content.footerHeadingLine2}</span>
          </h2>

          <p className="mt-5 max-w-md text-base leading-relaxed text-white/80 md:mt-6 md:text-lg">
            {content.footerBody}
          </p>

          <div className="mt-8">
            <DataDownloadOpenButton
              assetType="methodology"
              source="methodology-footer-hero"
              className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/25 transition-opacity hover:opacity-90"
            >
              <FileText className="size-4" aria-hidden />
              {content.footerCtaLabel}
            </DataDownloadOpenButton>
          </div>
        </div>
      </div>
    </section>
  );
}
