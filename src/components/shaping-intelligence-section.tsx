"use client";

import React from "react";
import { motion, useInView } from "motion/react";

export function ShapingIntelligenceSection() {
  const sectionRef = React.useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center justify-center overflow-hidden py-32 md:py-44 lg:py-56"
    >
      {/* Animated gradient background */}
      <div className="absolute inset-0 shaping-gradient-bg" />

      {/* Horizontal light streaks */}
      {/* <div className="absolute inset-0 pointer-events-none">
        <div className="shaping-streak shaping-streak-1" />
        <div className="shaping-streak shaping-streak-2" />
        <div className="shaping-streak shaping-streak-3" />
        <div className="shaping-streak shaping-streak-4" />
        <div className="shaping-streak shaping-streak-5" />
        <div className="shaping-streak shaping-streak-6" />
      </div> */}

      {/* Radial fade overlay to white edges */}
      <div className="absolute inset-0 shaping-vignette pointer-events-none" />

      {/* Text content */}
      <motion.div
        className="relative z-10 text-center px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight text-foreground">
          Shaping
          <br />
          Responsible
          <br />
          Intelligence
        </h2>
      </motion.div>
    </section>
  );
}
