"use client";

import React from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { homeDefaults, type HomeContent } from "@/content/home.defaults";
import type { Partner } from "@/content/about.defaults";

function PartnerLogo({ name, logoSrc }: { name: string; logoSrc?: string }) {
  if (logoSrc) {
    // Logos come in mixed formats (transparent, white- and colour-background).
    // A white chip keeps them all legible and consistent in light and dark mode.
    return (
      <span className="flex h-16 items-center justify-center rounded-xl bg-white px-5 shadow-sm ring-1 ring-black/5 transition duration-300 hover:shadow-md md:h-[4.5rem] md:px-6">
        <Image
          src={logoSrc}
          alt={name}
          width={200}
          height={56}
          className="h-9 w-auto max-w-[10rem] object-contain object-center md:h-11 md:max-w-[12rem]"
        />
      </span>
    );
  }

  return (
    <span
      aria-label={`${name} logo`}
      className="flex h-16 min-w-[7rem] shrink-0 items-center justify-center whitespace-nowrap rounded-xl border border-dashed border-border bg-card/60 px-4 text-sm font-semibold tracking-tight text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground md:h-[4.5rem] md:min-w-[8rem] md:px-5"
    >
      {name}
    </span>
  );
}

function LogoMarquee({ partners }: { partners: Partner[] }) {
  // Duplicate the list so the -50% translate loops seamlessly.
  const track = [...partners, ...partners];

  return (
    <div className="relative mt-10 overflow-hidden md:mt-12">
      {/* Edge fades */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-background to-transparent md:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-background to-transparent md:w-24"
      />

      <div className="used-by-marquee-track flex w-max items-center gap-12 md:gap-16 lg:gap-20">
        {track.map((partner, index) => (
          <div
            key={`${partner.name}-${index}`}
            className="flex shrink-0 items-center"
            aria-hidden={index >= partners.length}
          >
            <PartnerLogo
              name={partner.name}
              logoSrc={partner.logo?.url ?? undefined}
            />
          </div>
        ))}
      </div>

      <style>{`
        @keyframes used-by-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .used-by-marquee-track {
          animation: used-by-marquee 45s linear infinite;
        }
        .used-by-marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .used-by-marquee-track {
            animation: none;
            flex-wrap: wrap;
            width: 100%;
            justify-content: center;
            gap: 1.5rem 2.5rem;
          }
        }
      `}</style>
    </div>
  );
}

export function UsedByMarqueeSection({
  content = homeDefaults,
}: {
  content?: HomeContent;
}) {
  const ref = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const partners = content.usedByPartners;

  if (!partners || partners.length === 0) return null;

  return (
    <section ref={ref} className="relative overflow-hidden pb-20 md:pb-28">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
          className="mx-auto flex max-w-2xl flex-col items-center gap-3 text-center"
        >
          <span aria-hidden className="h-px w-10 rounded-full bg-primary/60" />
          <h2 className="text-xl font-semibold tracking-tight text-foreground md:text-2xl">
            {content.usedByHeading}
          </h2>
          {content.usedBySubtitle ? (
            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
              {content.usedBySubtitle}
            </p>
          ) : null}
        </motion.div>

        <LogoMarquee partners={partners} />
      </div>
    </section>
  );
}
