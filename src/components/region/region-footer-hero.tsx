"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { BarChart3 } from "lucide-react";

interface RegionFooterHeroProps {
  regionName: string;
  blurb: string;
  /** Background photo; defaults to the shared regions footer asset. */
  imageSrc?: string;
}

export function RegionFooterHero({
  regionName,
  blurb,
  imageSrc = "/regions/footer-hero-bg.png",
}: RegionFooterHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="w-full px-4 py-12 sm:px-6 lg:px-8">
      <div
        ref={ref}
        className="relative mx-auto min-h-[340px] max-w-7xl overflow-hidden rounded-3xl md:min-h-[565px]"
      >
        <Image
          src={imageSrc}
          alt=""
          aria-hidden
          fill
          className="object-cover object-[center_20%]"
          sizes="(max-width: 1280px) 100vw, 1280px"
          priority={false}
        />
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.55) 35%, rgba(0,0,0,0.15) 65%, transparent 100%)",
          }}
        />

        <div className="relative z-10 flex min-h-[340px] flex-col justify-center px-8 py-14 sm:px-12 md:min-h-[565px] md:px-16 md:py-16">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="max-w-xl text-3xl font-bold leading-tight text-white sm:text-4xl md:text-[2.75rem] md:leading-[1.15]"
          >
            Advancing Responsible AI Across {regionName}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
            className="mt-5 max-w-lg text-base leading-relaxed text-white/85 md:text-lg"
          >
            {blurb}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-8"
          >
            <Link
              href="#results"
              className="inline-flex items-center gap-2.5 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-black/25 transition-transform hover:scale-[1.02]"
            >
              <BarChart3 className="size-4" />
              Explore Index
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
