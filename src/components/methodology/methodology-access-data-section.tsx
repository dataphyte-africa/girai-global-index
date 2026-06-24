import Image from "next/image";
import { Download, Sparkles } from "lucide-react";
import { DataDownloadOpenButton } from "@/components/data-download/data-download-trigger";
import { methodologyDefaults, type MethodologyContent } from "@/content/methodology.defaults";

/**
 * Access Data — report image left, open-data copy and download CTA right.
 */
export function MethodologyAccessDataSection({
  content = methodologyDefaults,
}: {
  content?: MethodologyContent;
}) {
  const accessImage = content.accessImage.url ?? methodologyDefaults.accessImage.url!;
  return (
    <section className="w-full bg-card px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div className="flex justify-center lg:justify-start">
          <Image
            src={accessImage}
            alt={content.accessImage.alt ?? "Hand holding the GIRAI report"}
            width={582}
            height={564}
            className="h-auto w-full max-w-[582px] rounded-2xl object-cover shadow-[0_20px_48px_rgba(26,26,46,0.1)] dark:shadow-[0_20px_48px_rgba(0,0,0,0.35)]"
            sizes="(max-width: 1024px) 90vw, 582px"
          />
        </div>

        <div className="flex flex-col gap-6 lg:max-w-xl">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            {content.accessBadge}
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.18] tracking-tight md:leading-[1.15]">
            <span className="text-primary">{content.accessHeadingLead}</span>
            <br />
            <span className="text-foreground">{content.accessHeadingTail}</span>
          </h2>

          <p className="max-w-lg text-base leading-[1.65] text-muted-foreground md:text-[1.0625rem]">
            {content.accessBody}
          </p>

          <div className="pt-1">
            <DataDownloadOpenButton
              assetType="data"
              edition="second"
              source="methodology-access-data-section"
              className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Download className="size-4" aria-hidden />
              {content.accessCta.label}
            </DataDownloadOpenButton>
          </div>
        </div>
      </div>
    </section>
  );
}
