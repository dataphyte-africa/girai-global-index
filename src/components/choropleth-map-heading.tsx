"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function ChoroplethMapHeading() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.8 });

  return (
    <div ref={ref} className="flex flex-col gap-2 mb-10 text-center">
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl font-bold gap-2"
      >
        Explore the <span className="text-primary">Global Index</span> Scores
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        className="text-muted-foreground"
      >
        Hover over a country to see its rank and score. Click to view full
        pillar, dimension, and coefficient data.
      </motion.p>
    </div>
  );
}
