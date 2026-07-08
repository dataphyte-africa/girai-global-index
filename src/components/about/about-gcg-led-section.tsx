import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import { aboutDefaults, type AboutContent } from "@/content/about.defaults";
import { type FunderLogo } from "@/content/footer.defaults";

const PURPLE = "#7150F4";

function FunderChip({ funder }: { funder: FunderLogo }) {
  const logo = funder.logo?.url ? (
    <Image
      src={funder.logo.url}
      alt={funder.logo.alt ?? funder.name}
      width={200}
      height={56}
      className="h-9 w-auto max-w-[11rem] object-contain object-center md:h-11 md:max-w-[13rem]"
    />
  ) : (
    <span className="text-sm font-semibold tracking-tight text-[#9CA3AF] dark:text-muted-foreground">
      {funder.name}
    </span>
  );
  // A white chip keeps mixed-format logos legible on light and dark backgrounds.
  const chipClass =
    "flex h-16 items-center justify-center rounded-xl bg-white px-5 shadow-sm ring-1 ring-black/5 transition duration-300 hover:shadow-md md:h-[4.5rem] md:px-6";

  return funder.url ? (
    <a
      href={funder.url}
      target="_blank"
      rel="noopener noreferrer"
      title={funder.name}
      className={chipClass}
    >
      {logo}
    </a>
  ) : (
    <div className={chipClass}>{logo}</div>
  );
}

/**
 * Static row of funder logos, sourced from the footer Sanity section
 * (`footer.funderLogos`) so the two stay in sync — edit once, updates both.
 */
function FunderRow({ funders }: { funders: FunderLogo[] }) {
  return (
    <div className="mx-auto mt-14 flex max-w-4xl flex-wrap items-center justify-center gap-4 md:mt-16 md:gap-6">
      {funders.map((funder, index) => (
        <FunderChip key={`${funder.name || funder.logo?.url}-${index}`} funder={funder} />
      ))}
    </div>
  );
}

/**
 * Two-column section introducing GCG as the organisation behind GIRAI.
 */
export function AboutGcgLedSection({
  content = aboutDefaults,
  funderLogos = [],
}: {
  content?: AboutContent;
  funderLogos?: FunderLogo[];
}) {
  const image = content.gcgImage.url ?? aboutDefaults.gcgImage.url!;
  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#F8F9FF] to-white px-4 py-16 dark:from-muted/20 dark:to-background md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
        <div className="flex flex-col gap-6 lg:max-w-xl">
          <span
            className="inline-flex w-fit items-center gap-1.5 rounded-full bg-[#F0EDFF] px-3.5 py-1.5 text-xs font-medium dark:bg-primary/20"
            style={{ color: PURPLE }}
          >
            <Sparkles className="size-3.5" aria-hidden />
            {content.gcgBadge}
          </span>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.18] tracking-tight text-foreground md:leading-[1.15]">
            {content.gcgHeading}
          </h2>

          <p className="max-w-lg text-base leading-[1.65] text-muted-foreground md:text-[1.0625rem]">
            {content.gcgBody}
          </p>

          <div className="pt-1">
            <Link
              href={content.gcgCta.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: PURPLE }}
            >
              {content.gcgCta.label}
            </Link>
          </div>
        </div>

        <div className="flex justify-center lg:justify-end">
          <Image
            src={image}
            alt={content.gcgImage.alt ?? "Global Center on AI Governance"}
            width={582}
            height={564}
            className="h-auto w-full max-w-[582px] drop-shadow-[0_24px_48px_rgba(113,80,244,0.16)]"
            sizes="(max-width: 1024px) 90vw, 582px"
          />
        </div>
      </div>

      {funderLogos.length > 0 ? (
        <div className="mx-auto max-w-7xl">
          <FunderRow funders={funderLogos} />
        </div>
      ) : null}
    </section>
  );
}
