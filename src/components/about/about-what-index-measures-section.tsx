import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { aboutDefaults, type AboutContent } from "@/content/about.defaults";

const PURPLE = "#7150F4";

/**
 * Two-column section explaining what GIRAI measures — image left, copy right.
 */
export function AboutWhatIndexMeasuresSection({
  content = aboutDefaults,
}: {
  content?: AboutContent;
}) {
  const image = content.measuresImage.url ?? aboutDefaults.measuresImage.url!;
  return (
    <section className="relative w-full overflow-hidden bg-white px-4 py-16 dark:bg-background md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div className="order-2 flex justify-center lg:order-1 lg:justify-start">
          <Image
            src={image}
            alt={
              content.measuresImage.alt ??
              "Professionals discussing AI governance against a connected city skyline"
            }
            width={582}
            height={561}
            className="h-auto w-full max-w-[582px] drop-shadow-[0_24px_48px_rgba(113,80,244,0.16)]"
            sizes="(max-width: 1024px) 90vw, 582px"
          />
        </div>

        <div className="order-1 flex flex-col gap-6 lg:order-2 lg:max-w-xl">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F0EDFF] px-3.5 py-1.5 text-xs font-medium dark:bg-primary/20"
            style={{ color: PURPLE }}
          >
            <Sparkles className="size-3.5" aria-hidden />
            {content.measuresBadge}
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.18] tracking-tight md:leading-[1.15]">
            <span className="text-foreground">{content.measuresHeadingLead}</span>
            <span style={{ color: PURPLE }}>{content.measuresHeadingAccent}</span>
          </h2>

          <p className="max-w-lg text-base leading-[1.65] text-muted-foreground md:text-[1.0625rem]">
            {content.measuresBody}
          </p>

          <Button asChild size="lg" className="w-fit gap-2">
            <Link href="/methodology">
              View full methodology
              <ArrowUpRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
