import Image from "next/image";
import Link from "next/link";
import { Download, Sparkles } from "lucide-react";

const ACCESS_DATA_IMAGE = "/methodology/access-data.png";

/**
 * Access Data — report image left, open-data copy and download CTA right.
 */
export function MethodologyAccessDataSection() {
  return (
    <section className="w-full bg-card px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div className="flex justify-center lg:justify-start">
          <Image
            src={ACCESS_DATA_IMAGE}
            alt="Hand holding the GIRAI report"
            width={582}
            height={564}
            className="h-auto w-full max-w-[582px] rounded-2xl object-cover shadow-[0_20px_48px_rgba(26,26,46,0.1)] dark:shadow-[0_20px_48px_rgba(0,0,0,0.35)]"
            sizes="(max-width: 1024px) 90vw, 582px"
          />
        </div>

        <div className="flex flex-col gap-6 lg:max-w-xl">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3.5 py-1.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-primary">
            <Sparkles className="size-3.5" aria-hidden />
            OPEN DATA
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.18] tracking-tight md:leading-[1.15]">
            <span className="text-primary">Access the Data</span>
            <br />
            <span className="text-foreground">Behind the Index</span>
          </h2>

          <p className="max-w-lg text-base leading-[1.65] text-muted-foreground md:text-[1.0625rem]">
            Download the full dataset and explore the structured evidence,
            indicators, and documentation that underpin GIRAI scores across
            countries.
          </p>

          <div className="pt-1">
            <Link
              href="/data"
              className="inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Download className="size-4" aria-hidden />
              Download data
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
