"use client";

import { useState, useCallback, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { RadialDimensionsChart } from "@/components/radial-dimensions-chart";
import { DimensionCard } from "@/components/dimension-card";
import { DIMENSIONS } from "@/data/dimensions-data";

export function DimensionsSection() {
  const [selectedId, setSelectedId] = useState<string | null>(
    DIMENSIONS[0]?.id ?? null,
  );
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: false, amount: 0.8 });

  const selectedDimension = selectedId
    ? DIMENSIONS.find((d) => d.id === selectedId) ?? null
    : null;

  const handleSelect = useCallback((id: string | null) => {
    setSelectedId(id);
  }, []);

  return (
    <section
      id="dimensions"
      className="w-full px-4 py-16 md:py-24 overflow-visible"
    >
      <div className="mx-auto max-w-6xl overflow-visible">
        <div ref={headingRef} className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-medium tracking-tight md:text-4xl"
          >
            The Five Dimensions of <span className="text-primary">Responsible AI</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-3 text-muted-foreground"
          >
            Explore the framework used to assess national AI governance across
            countries
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12 overflow-visible">
          <div className="flex flex-col md:min-h-[500px]  md:justify-center overflow-visible">
            <RadialDimensionsChart
              dimensions={DIMENSIONS}
              selectedId={selectedId}
              onSelect={handleSelect}
            />
          </div>
          <div className="flex min-h-[400px] flex-col md:justify-center">
            <DimensionCard dimension={selectedDimension} />
          </div>
        </div>
      </div>
    </section>
  );
}
