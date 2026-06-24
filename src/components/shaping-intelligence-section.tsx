"use client";

import React from "react";
import Image from "next/image";
import { motion, useInView } from "motion/react";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient-animation";
import { homeDefaults, type HomeContent } from "@/content/home.defaults";

export function ShapingIntelligenceSection({
  content = homeDefaults,
}: {
  content?: HomeContent;
}) {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden py-32 md:py-44 lg:py-56"
    >
      {/* Background image */}
      <Image
        src="/shaping-intelligence.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="absolute inset-0 z-0 object-cover object-center select-none pointer-events-none dark:invert dark:hue-rotate-180 dark:brightness-[0.45] dark:contrast-125 dark:opacity-80 mix-blend-multiply dark:mix-blend-screen"
      />

      {/* Animated gradient background */}
      {/* <BackgroundGradientAnimation
        // Light mode: softer gradient, Dark mode: richer gradient
        gradientBackgroundStart="rgb(250, 245, 255)" // Light lavender for light mode base
        gradientBackgroundEnd="rgb(240, 253, 250)" // Light teal tint for light mode
        // Purple
        firstColor="147, 51, 234"
        // Pink
        secondColor="236, 72, 153"
        // Teal
        thirdColor="20, 184, 166"
        // Light blue
        fourthColor="56, 189, 248"
        // Purple-pink blend
        fifthColor="168, 85, 247"
        pointerColor="99, 102, 241"
        size="100%"
        blendingValue="soft-light"
        interactive={true}
        containerClassName="!h-full !w-full !absolute !inset-0 dark:!bg-[linear-gradient(40deg,rgb(30,10,60),rgb(10,30,50))]"
        className="absolute inset-0 z-10"
      /> */}

      {/* Radial fade overlay for smooth edge blending */}
      {/* <div className="absolute inset-0 shaping-vignette pointer-events-none z-20" /> */}

      {/* Text content */}
      <motion.div
        className="relative z-30 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.1] tracking-tight text-foreground drop-shadow-sm">
          {content.shapingHeadingLines.map((line, index) => (
            <React.Fragment key={line}>
              {line}
              {index < content.shapingHeadingLines.length - 1 ? <br /> : null}
            </React.Fragment>
          ))}
        </h2>
      </motion.div>
    </section>
  );
}
