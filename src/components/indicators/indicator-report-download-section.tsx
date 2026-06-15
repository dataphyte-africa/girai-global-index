import Image from "next/image";
import Link from "next/link";
import { Download, Sparkles } from "lucide-react";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const BODY_COLOR = "#6B7280";
const BADGE_BG = "#F0EDFF";
const REPORT_IMAGE = "/indicator/report-section.png";

/**
 * Download report CTA — copy left, report cover graphic right.
 */
export function IndicatorReportDownloadSection() {
  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div className="flex flex-col gap-6 lg:max-w-xl">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em]"
            style={{ backgroundColor: BADGE_BG, color: PURPLE }}
          >
            <Sparkles className="size-3.5" aria-hidden />
            REPORT 2024
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-[1.18] tracking-tight md:leading-[1.15]">
            <span style={{ color: HEADING_DARK }}>
              Global Index on Responsible AI —{" "}
            </span>
            <span style={{ color: PURPLE }}>2024 Report</span>
          </h2>

          <p
            className="max-w-lg text-base leading-[1.65] md:text-[1.0625rem]"
            style={{ color: BODY_COLOR }}
          >
            Download the 2024 edition of the Global Index on Responsible AI,
            offering comparative insights into how countries govern and use
            artificial intelligence.
          </p>

          <div className="pt-1">
            <Link
              href="#download-report"
              className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: PURPLE }}
            >
              <Download className="size-4" aria-hidden />
              Download Report
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Image
            src={REPORT_IMAGE}
            alt="Global Responsible AI Index 2024 report cover"
            width={640}
            height={640}
            className="h-auto w-full max-w-[640px] object-contain"
            sizes="(max-width: 1024px) 90vw, 640px"
          />
        </div>
      </div>
    </section>
  );
}
