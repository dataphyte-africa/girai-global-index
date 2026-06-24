"use client";

import { motion } from "motion/react";
import { Shimmer } from "@/components/ai-elements/shimmer";

export function AiLoadingState() {
  return (
    <div className="relative mt-3 overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/5 via-card to-hero-accent/5 p-4">
      <motion.div
        animate={{ x: ["-100%", "200%"] }}
        className="pointer-events-none absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5"
        transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />
      <div className="relative flex items-center gap-3">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 1, 0.4] }}
              className="size-2 rounded-full bg-primary"
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                delay: i * 0.18,
              }}
            />
          ))}
        </div>
        <Shimmer className="text-sm font-medium" duration={1.8}>
          Analyzing GIRAI data…
        </Shimmer>
      </div>
    </div>
  );
}
