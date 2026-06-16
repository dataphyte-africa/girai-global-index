import Image from "next/image";

const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";

/** Replace `logoSrc` when real partner assets are available. */
const PARTNERS = [
  { name: "Google", logoSrc: undefined },
  { name: "Microsoft", logoSrc: undefined },
  { name: "Facebook", logoSrc: undefined },
  { name: "IBM", logoSrc: undefined },
  { name: "Andela", logoSrc: undefined },
  { name: "Internet Society Foundation", logoSrc: undefined },
] as const;

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

function PartnerLogo({
  name,
  logoSrc,
}: {
  name: string;
  logoSrc?: string;
}) {
  if (logoSrc) {
    return (
      <Image
        src={logoSrc}
        alt={name}
        width={160}
        height={40}
        className="h-8 w-auto max-w-[10rem] object-contain object-center md:h-9"
      />
    );
  }

  return (
    <span
      aria-label={`${name} logo placeholder`}
      className="flex h-9 min-w-[6.5rem] shrink-0 items-center justify-center rounded-md border border-dashed border-[#D1D5DB] bg-white/80 px-4 text-sm font-semibold tracking-tight text-[#9CA3AF] md:h-10 md:min-w-[7.5rem] md:px-5"
    >
      {name}
    </span>
  );
}

function PartnerMarquee() {
  const track = [...PARTNERS, ...PARTNERS];

  return (
    <div className="relative mt-10 overflow-hidden md:mt-12">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-[#F7F8FA] to-transparent md:w-20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-[#F7F8FA] to-transparent md:w-20"
      />

      <div className="about-partners-marquee-track flex w-max items-center gap-12 md:gap-16 lg:gap-20">
        {track.map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className="flex shrink-0 items-center"
          >
            <PartnerLogo name={partner.name} logoSrc={partner.logoSrc} />
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

/**
 * Contributors and partners — centered header with an infinitely scrolling
 * logo strip (placeholder logos until assets are supplied).
 */
export function AboutContributorsSection() {
  return (
    <section className="w-full bg-[#F7F8FA] px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <SectionAccent color="blue" className="mb-5" />

          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight lg:leading-[1.12]"
            style={{ color: HEADING_DARK }}
          >
            Contributors and Partners
          </h2>

          <p
            className="mt-4 max-w-xl text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            Recognising the researchers, authors, and organisations whose
            expertise and support make GIRAI possible.
          </p>

          <SectionAccent color="pink" className="mt-5" />
        </header>

        <PartnerMarquee />

        <div className="mt-14 flex justify-center md:mt-16">
          <SectionAccent color="blue" />
        </div>
      </div>
    </section>
  );
}
