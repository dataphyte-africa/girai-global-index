"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus, X, Globe, TrendingUp } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { RegionSummary } from "@/lib/girai";
import { DIMENSIONS, PILLARS } from "@/data/2026/taxonomy";

// Color palette for different regions
const REGION_COLORS = [
  { bg: "bg-primary", bar: "from-primary to-primary/80", text: "text-primary" },
  { bg: "bg-indigo-400", bar: "from-indigo-400 to-indigo-300", text: "text-indigo-500" },
  { bg: "bg-emerald-500", bar: "from-emerald-500 to-emerald-400", text: "text-emerald-500" },
  { bg: "bg-amber-500", bar: "from-amber-500 to-amber-400", text: "text-amber-500" },
  { bg: "bg-rose-500", bar: "from-rose-500 to-rose-400", text: "text-rose-500" },
];

interface RegionalComparisonSectionProps {
  regions: string[];
  regionData: RegionSummary[];
}

function ScoreCard({
  region,
  data,
  colorIndex,
  index,
}: {
  region: string;
  data: RegionSummary;
  colorIndex: number;
  index: number;
}) {
  const color = REGION_COLORS[colorIndex % REGION_COLORS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      layout
      className="bg-card border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          className={`w-3 h-3 rounded-full ${color.bg}`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: index * 0.1 + 0.2 }}
        />
        <span className="text-sm font-medium text-muted-foreground">{region}</span>
      </div>
      
      <motion.div
        className="text-4xl font-bold mb-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: index * 0.1 + 0.3 }}
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          key={data.averageGirai}
        >
          {data.averageGirai.toFixed(2)}
        </motion.span>
      </motion.div>
      
      <div className="flex flex-col gap-4 text-xs">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
          className="flex items-center gap-1 bg-primary/10 rounded-lg p-2"
        >
          <Globe className="w-3 h-3 text-primary" />
          <span className="text-primary font-medium">Global: {data.globalRank}{getOrdinalSuffix(data.globalRank)}</span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
          className="flex items-center gap-1 bg-teal-50 rounded-lg p-2"
        >
          <TrendingUp className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground">{data.countryCount} countries</span>
        </motion.div>
      </div>
    </motion.div>
  );
}

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

function ComparisonBar({
  label,
  values,
  colorIndices,
  maxValue = 100,
  index,
}: {
  label: string;
  values: { region: string; value: number }[];
  colorIndices: number[];
  maxValue?: number;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: false, amount: 0.5 }}
      className="mb-6"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium text-foreground">{label}</span>
      </div>
      
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {values.map((item, idx) => {
            const color = REGION_COLORS[colorIndices[idx] % REGION_COLORS.length];
            const percentage = Math.min((item.value / maxValue) * 100, 100);
            
            return (
              <motion.div
                key={item.region}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                layout
                className="relative"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-7 bg-muted rounded-full overflow-hidden relative">
                    <motion.div
                      className={`h-full rounded-full bg-linear-to-r ${color.bar}`}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${percentage}%` }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.1 + idx * 0.15,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                      viewport={{ once: false }}
                    />
                    <motion.div
                      className="absolute inset-y-0 left-3 flex items-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + idx * 0.15 + 0.3 }}
                    >
                      <span className="text-xs font-medium text-white drop-shadow-sm">
                        {item.region}
                      </span>
                    </motion.div>
                  </div>
                  <motion.span
                    className={`text-sm font-semibold min-w-[50px] text-right ${color.text}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.1 + idx * 0.15 + 0.6,
                    }}
                    viewport={{ once: false }}
                  >
                    {item.value.toFixed(1)}
                  </motion.span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function Legend({
  selectedRegions,
  colorIndices,
}: {
  selectedRegions: string[];
  colorIndices: number[];
}) {
  return (
    <motion.div
      className="flex flex-wrap gap-4 justify-end mb-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatePresence mode="popLayout">
        {selectedRegions.map((region, idx) => {
          const color = REGION_COLORS[colorIndices[idx] % REGION_COLORS.length];
          return (
            <motion.div
              key={region}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
              className="flex items-center gap-2"
            >
              <div className={`w-4 h-4 rounded ${color.bg}`} />
              <span className="text-sm text-muted-foreground">{region}</span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

export function RegionalComparisonSection({
  regions,
  regionData,
}: RegionalComparisonSectionProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([
    regions[0] || "",
    regions[1] || "",
  ]);
  
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: false, amount: 0.5 });

  // Map region names to their data
  const regionDataMap = useMemo(() => {
    const map = new Map<string, RegionSummary>();
    for (const data of regionData) {
      map.set(data.region, data);
    }
    return map;
  }, [regionData]);

  // Get data for selected regions
  const selectedRegionData = useMemo(() => {
    return selectedRegions
      .filter(Boolean)
      .map((region) => regionDataMap.get(region))
      .filter((data): data is RegionSummary => data !== undefined);
  }, [selectedRegions, regionDataMap]);

  // Color indices for consistent coloring
  const colorIndices = useMemo(() => {
    return selectedRegions.map((_, idx) => idx);
  }, [selectedRegions]);

  const handleRegionChange = (index: number, value: string) => {
    const newSelected = [...selectedRegions];
    newSelected[index] = value;
    setSelectedRegions(newSelected);
  };

  const addRegion = () => {
    if (selectedRegions.length < 5) {
      const availableRegions = regions.filter((r) => !selectedRegions.includes(r));
      if (availableRegions.length > 0) {
        setSelectedRegions([...selectedRegions, availableRegions[0]]);
      }
    }
  };

  const removeRegion = (index: number) => {
    if (selectedRegions.length > 2) {
      const newSelected = selectedRegions.filter((_, i) => i !== index);
      setSelectedRegions(newSelected);
    }
  };

  // Get available regions for each selector (exclude already selected except current)
  const getAvailableRegions = (currentIndex: number) => {
    return regions.filter(
      (r) => r === selectedRegions[currentIndex] || !selectedRegions.includes(r)
    );
  };

  // Prepare comparison data: 5 dimensions + 3 pillars from the 2026 taxonomy.
  const dimensionComparisonData = useMemo(() => {
    const dimensions = DIMENSIONS.map((d) => ({
      key: `dimension:${d.slug}`,
      label: d.name,
      values: selectedRegionData.map((data) => ({
        region: data.region,
        value: data.dimensions[d.slug] ?? 0,
      })),
    }));

    const pillars = PILLARS.map((p) => ({
      key: `pillar:${p.slug}`,
      label: p.name,
      values: selectedRegionData.map((data) => ({
        region: data.region,
        value: data.pillars[p.slug] ?? 0,
      })),
    }));

    return [...dimensions, ...pillars];
  }, [selectedRegionData]);

  return (
    <section id="regions" className="w-full px-4 py-16 md:py-24 bg-background">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div ref={headingRef} className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight md:text-4xl"
          >
            Responsible AI{" "}
            <span className="text-primary">Across Regions</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-3 text-muted-foreground max-w-xl mx-auto"
          >
            Comparing regional performance and governance approaches.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Region Selectors */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="lg:col-span-4"
          >
            <h3 className="text-lg font-semibold mb-6">
              Select regions you want to compare
            </h3>
            
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {selectedRegions.map((region, index) => (
                  <motion.div
                    key={`selector-${index}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    layout
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground mb-1.5 block">
                          {index === 0 ? "Compare" : index === 1 ? "With" : `Region ${index + 1}`}
                        </label>
                        <Select
                          value={region}
                          onValueChange={(value) => handleRegionChange(index, value)}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a region" />
                          </SelectTrigger>
                          <SelectContent>
                            {getAvailableRegions(index).map((r) => (
                              <SelectItem key={r} value={r}>
                                {r}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {selectedRegions.length > 2 && (
                        <motion.button
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeRegion(index)}
                          className="mt-6 p-2 rounded-full hover:bg-muted transition-colors"
                        >
                          <X className="w-4 h-4 text-muted-foreground" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {selectedRegions.length < 5 && selectedRegions.length < regions.length && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addRegion}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add another region</span>
                </motion.button>
              )}
            </div>
          </motion.div>

          {/* Right Column - Comparison Results */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: false }}
            className="lg:col-span-8"
          >
            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
              <AnimatePresence mode="popLayout">
                {selectedRegionData.map((data, index) => (
                  <ScoreCard
                    key={data.region}
                    region={data.region}
                    data={data}
                    colorIndex={colorIndices[index]}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Dimension Comparison */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h4 className="text-lg font-semibold">Dimension-Level Comparison</h4>
                <Legend
                  selectedRegions={selectedRegions.filter(Boolean)}
                  colorIndices={colorIndices}
                />
              </div>

              <div className="space-y-2">
                {dimensionComparisonData.map((dimension, index) => (
                  <ComparisonBar
                    key={dimension.key}
                    label={dimension.label}
                    values={dimension.values}
                    colorIndices={colorIndices}
                    index={index}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
