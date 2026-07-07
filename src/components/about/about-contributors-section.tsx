import Image from "next/image";
import { aboutDefaults, type AboutContent, type Partner } from "@/content/about.defaults";
import { type FunderLogo } from "@/content/footer.defaults";

function SectionAccent({
  className,
  color,
}: {
  className?: string;
  color: "blue" | "pink";
}) {
  const bg = color === "blue" ? "bg-[#3B82F6]" : "bg-[#EC4899]";
  return (
    <span
      aria-hidden
      className={`block h-0.5 w-10 rounded-full ${bg} ${className ?? ""}`}
    />
  );
}

function PartnerLogo({ name, logoSrc }: { name: string; logoSrc?: string }) {
  if (logoSrc) {
    // A white chip keeps mixed-format logos legible on the light and dark
    // section backgrounds (matches the home "trusted by" treatment).
    return (
      <span className="flex h-16 items-center justify-center rounded-xl bg-white px-5 shadow-sm ring-1 ring-black/5 transition duration-300 hover:shadow-md md:h-[4.5rem] md:px-6">
        <Image
          src={logoSrc}
          alt={name}
          width={200}
          height={56}
          className="h-9 w-auto max-w-[11rem] object-contain object-center md:h-11 md:max-w-[13rem]"
        />
      </span>
    );
  }

  return (
    <span
      aria-label={`${name} logo placeholder`}
      className="flex h-16 min-w-[6.5rem] shrink-0 items-center justify-center rounded-xl border border-dashed border-[#D1D5DB] bg-white/80 px-4 text-sm font-semibold tracking-tight text-[#9CA3AF] dark:border-border dark:bg-card/60 dark:text-muted-foreground md:h-[4.5rem] md:min-w-[7.5rem] md:px-5"
    >
      {name}
    </span>
  );
}

function PartnerMarquee({ partners }: { partners: Partner[] }) {
  const track = [...partners, ...partners];

  return (
    <div className="relative mt-10 overflow-hidden md:mt-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#F7F8FA] to-transparent dark:from-background md:w-20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#F7F8FA] to-transparent dark:from-background md:w-20"
      />

      <div className="about-partners-marquee-track flex w-max items-center gap-12 md:gap-16 lg:gap-20">
        {track.map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className="flex shrink-0 items-center"
          >
            <PartnerLogo name={partner.name} logoSrc={partner.logo?.url ?? undefined} />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes about-partners-marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .about-partners-marquee-track {
          animation: about-partners-marquee 42s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .about-partners-marquee-track {
            animation: none;
            flex-wrap: wrap;
            width: 100%;
            justify-content: center;
            gap: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}

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
  // Match the white-chip treatment used for the partner logos above so the two
  // rows read as one section on both light and dark backgrounds.
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
 * Static row of funder logos, sourced from the same footer Sanity section
 * (`footer.funderLogos`) so the two stay in sync — edit once, updates both.
 */
function FunderRow({ funders }: { funders: FunderLogo[] }) {
  return (
    <div className="mt-14 flex flex-wrap items-center justify-center gap-4 md:mt-16 md:gap-6">
      {funders.map((funder, index) => (
        <FunderChip key={`${funder.name || funder.logo?.url}-${index}`} funder={funder} />
      ))}
    </div>
  );
}

/**
 * Contributors and partners — centered header with an infinitely scrolling
 * logo strip (placeholder logos until assets are supplied).
 */
export function AboutContributorsSection({
  content = aboutDefaults,
  funderLogos = [],
}: {
  content?: AboutContent;
  funderLogos?: FunderLogo[];
}) {
  return (
    <section className="w-full bg-[#F7F8FA] px-4 py-16 dark:bg-muted/20 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <SectionAccent color="blue" className="mb-5" />

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground lg:leading-[1.12]">
            {content.contributorsHeading}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base md:leading-[1.65]">
            {content.contributorsSubtitle}
          </p>

          <SectionAccent color="pink" className="mt-5" />
        </header>

        <PartnerMarquee partners={content.partners} />

        {funderLogos.length > 0 ? <FunderRow funders={funderLogos} /> : null}

        <div className="mt-14 flex justify-center md:mt-16">
          <SectionAccent color="blue" />
        </div>
      </div>
    </section>
  );
}
