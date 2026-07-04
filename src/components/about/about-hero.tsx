import Image from "next/image";
import Link from "next/link";
import { BookOpen, Download, Search } from "lucide-react";
import { DataDownloadOpenButton } from "@/components/data-download/data-download-trigger";
import { aboutDefaults, type AboutContent } from "@/content/about.defaults";

const HERO_TITLE_ACCENT = "#9FE8C7";

const SECONDARY_CTA_CLASS =
  "inline-flex items-center gap-2.5 rounded-full border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/20";

/**
 * Wide banner hero for the About page. Matches dimension detail hero sizing;
 * copy and background image are About-specific (editable via Sanity).
 */
export function AboutHero({ content = aboutDefaults }: { content?: AboutContent }) {
  const heroImage = content.heroImage.url ?? aboutDefaults.heroImage.url!;
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
                "linear-gradient(90deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.38) 42%, rgba(0,0,0,0.12) 68%, rgba(0,0,0,0) 85%)",
            }}
          />

          <div className="relative flex min-h-[360px] flex-col justify-center px-8 py-12 md:min-h-[565px] md:max-w-[58%] md:px-14 md:py-16 lg:min-h-[565px]">
            <h1 className="text-[2rem] font-semibold leading-[1.12] tracking-tight md:text-5xl lg:text-[3.25rem]">
              <span className="text-white">{content.heroTitleLead}</span>
              <span style={{ color: HERO_TITLE_ACCENT }}>{content.heroTitleAccent}</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-white md:mt-6 md:text-lg">
              {content.heroLead}
            </p>

            <div className="mt-8 flex flex-col flex-wrap gap-3 sm:flex-row sm:items-center">
              <DataDownloadOpenButton
                assetType="report"
                edition="second"
                source="about-hero"
                className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/25 transition-opacity hover:opacity-90"
              >
                <Download className="size-4" aria-hidden />
                Read the Report
              </DataDownloadOpenButton>

              <Link href="/evidence" className={SECONDARY_CTA_CLASS}>
                <Search className="size-4" aria-hidden />
                Explore the Evidence
              </Link>

              <Link href="/methodology" className={SECONDARY_CTA_CLASS}>
                <BookOpen className="size-4" aria-hidden />
                Understand the Methodology
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
