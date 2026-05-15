"use client";

import { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Plus, X, Globe, MapPin } from "lucide-react";
import { SearchableSelect, type SearchableSelectOption } from "@/components/ui/searchable-select";
import type { CountryRanking } from "@/lib/girai";
import { countryFlags } from "@/data/countries";
import { DIMENSIONS, PILLARS } from "@/data/2026/taxonomy";

// Color palette for different countries
const COUNTRY_COLORS = [
  { bg: "bg-primary", bar: "from-primary to-primary/80", text: "text-primary" },
  { bg: "bg-indigo-400", bar: "from-indigo-400 to-indigo-300", text: "text-indigo-500" },
  { bg: "bg-emerald-500", bar: "from-emerald-500 to-emerald-400", text: "text-emerald-500" },
  { bg: "bg-amber-500", bar: "from-amber-500 to-amber-400", text: "text-amber-500" },
  { bg: "bg-rose-500", bar: "from-rose-500 to-rose-400", text: "text-rose-500" },
];

interface CountryComparisonSectionProps {
  countries: CountryRanking[];
}

function CountryScoreCard({
  country,
  index,
}: {
  country: CountryRanking;
  index: number;
}) {
  const flag = countryFlags[country.iso3] || "🏳️";

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
        <motion.span
          className="text-2xl"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 500, delay: index * 0.1 + 0.2 }}
        >
          {flag}
        </motion.span>
        <span className="text-sm font-medium text-muted-foreground truncate">
          {country.name}
        </span>
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
          key={country.girai ?? 0}
        >
          {(country.girai ?? 0).toFixed(2)}
        </motion.span>
      </motion.div>

      <div className="flex flex-col gap-2 text-xs">
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.4 }}
          className="flex items-center gap-1 bg-primary/10 rounded-lg p-2"
        >
          <Globe className="w-3 h-3 text-primary" />
          <span className="text-primary font-medium">
            Rank: {country.rankGlobal ?? "—"}
            {country.rankGlobal !== null ? getOrdinalSuffix(country.rankGlobal) : ""}
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 + 0.5 }}
          className="flex items-center gap-1 bg-teal-50 dark:bg-teal-950/30 rounded-lg p-2"
        >
          <MapPin className="w-3 h-3 text-muted-foreground" />
          <span className="text-muted-foreground truncate">{country.region}</span>
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

function CountryComparisonBar({
  label,
  values,
  colorIndices,
  maxValue = 100,
  index,
}: {
  label: string;
  values: { country: string; iso3: string; value: number }[];
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
            const color = COUNTRY_COLORS[colorIndices[idx] % COUNTRY_COLORS.length];
            const percentage = Math.min((item.value / maxValue) * 100, 100);
            const flag = countryFlags[item.iso3] || "🏳️";
            
            return (
              <motion.div
                key={item.iso3}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                layout
                className="relative"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden relative">
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
                      className="absolute inset-y-0 left-2 flex items-center gap-1.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.1 + idx * 0.15 + 0.3 }}
                    >
                      <span className="text-sm">{flag}</span>
                      <span className="text-xs font-medium text-white drop-shadow-sm">
                        {item.country.length > 20 ? item.country.slice(0, 20) + "..." : item.country}
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

function CountryLegend({
  selectedCountries,
  colorIndices,
}: {
  selectedCountries: CountryRanking[];
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
        {selectedCountries.map((country, idx) => {
          const color = COUNTRY_COLORS[colorIndices[idx] % COUNTRY_COLORS.length];
          const flag = countryFlags[country.iso3] || "🏳️";
          return (
            <motion.div
              key={country.iso3}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              layout
              className="flex items-center gap-2"
            >
              <span className="text-lg">{flag}</span>
              <div className={`w-3 h-3 rounded ${color.bg}`} />
              <span className="text-sm text-muted-foreground">
                {country.name.length > 15 ? country.name.slice(0, 15) + "..." : country.name}
              </span>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

export function CountryComparisonSection({
  countries,
}: CountryComparisonSectionProps) {
  // Default to top 2 countries
  const [selectedISO3s, setSelectedISO3s] = useState<string[]>([
    countries[0]?.iso3 || "",
    countries[1]?.iso3 || "",
  ]);
  
  const headingRef = useRef(null);
  const isInView = useInView(headingRef, { once: false, amount: 0.5 });

  // Map ISO3 codes to their data
  const countryDataMap = useMemo(() => {
    const map = new Map<string, CountryRanking>();
    for (const data of countries) {
      map.set(data.iso3, data);
    }
    return map;
  }, [countries]);

  // Get data for selected countries
  const selectedCountryData = useMemo(() => {
    return selectedISO3s
      .filter(Boolean)
      .map((iso3) => countryDataMap.get(iso3))
      .filter((data): data is CountryRanking => data !== undefined);
  }, [selectedISO3s, countryDataMap]);

  // Color indices for consistent coloring
  const colorIndices = useMemo(() => {
    return selectedISO3s.map((_, idx) => idx);
  }, [selectedISO3s]);

  const handleCountryChange = (index: number, value: string) => {
    const newSelected = [...selectedISO3s];
    newSelected[index] = value;
    setSelectedISO3s(newSelected);
  };

  const addCountry = () => {
    if (selectedISO3s.length < 5) {
      const availableCountries = countries.filter((c) => !selectedISO3s.includes(c.iso3));
      if (availableCountries.length > 0) {
        setSelectedISO3s([...selectedISO3s, availableCountries[0].iso3]);
      }
    }
  };

  const removeCountry = (index: number) => {
    if (selectedISO3s.length > 2) {
      const newSelected = selectedISO3s.filter((_, i) => i !== index);
      setSelectedISO3s(newSelected);
    }
  };

  // Get available countries for each selector (exclude already selected except current)
  const getAvailableCountries = (currentIndex: number) => {
    return countries.filter(
      (c) => c.iso3 === selectedISO3s[currentIndex] || !selectedISO3s.includes(c.iso3)
    );
  };

  // Prepare comparison data: 5 dimensions + 3 pillars from the 2026 taxonomy.
  const dimensionComparisonData = useMemo(() => {
    const dimensions = DIMENSIONS.map((d) => ({
      key: `dimension:${d.slug}`,
      label: d.name,
      values: selectedCountryData.map((data) => ({
        country: data.name,
        iso3: data.iso3,
        value: data.dimensionScores[d.slug] ?? 0,
      })),
    }));

    const pillars = PILLARS.map((p) => ({
      key: `pillar:${p.slug}`,
      label: p.name,
      values: selectedCountryData.map((data) => ({
        country: data.name,
        iso3: data.iso3,
        value: data.pillarScores[p.slug] ?? 0,
      })),
    }));

    return [...dimensions, ...pillars];
  }, [selectedCountryData]);

  return (
    <section
      id="countries"
      className="w-full px-4 py-16 md:py-24 bg-muted/30"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div ref={headingRef} className="mb-12 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-3xl font-bold tracking-tight md:text-4xl"
          >
            Country-Level{" "}
            <span className="text-primary">Comparison</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="mt-3 text-muted-foreground max-w-xl mx-auto"
          >
            Compare responsible AI performance across individual nations.
          </motion.p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column - Country Selectors */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: false }}
            className="lg:col-span-4"
          >
            <h3 className="text-lg font-semibold mb-6">
              Select countries you want to compare
            </h3>
            
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {selectedISO3s.map((iso3, index) => {
                  const currentCountry = countryDataMap.get(iso3);
                  const flag = currentCountry ? countryFlags[currentCountry.iso3] || "🏳️" : "🏳️";
                  
                  // Build options for this selector
                  const countryOptions: SearchableSelectOption[] = getAvailableCountries(index).map((c) => ({
                    value: c.iso3,
                    label: c.name,
                    searchTerms: `${c.iso3} ${c.region} ${c.subregion}`,
                    icon: <span className="text-lg">{countryFlags[c.iso3] || "🏳️"}</span>,
                    suffix: (
                      <span className="text-muted-foreground text-xs">
                        {c.rankGlobal !== null ? `#${c.rankGlobal}` : ""}
                      </span>
                    ),
                  }));
                  
                  return (
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
                            {index === 0 ? "Compare" : index === 1 ? "With" : `Country ${index + 1}`}
                          </label>
                          <SearchableSelect
                            options={countryOptions}
                            value={iso3}
                            onValueChange={(value) => handleCountryChange(index, value)}
                            placeholder="Select a country"
                            searchPlaceholder="Search by name, code, or region..."
                            renderSelectedValue={(option) => (
                              <div className="flex items-center gap-2">
                                <span className="text-lg">{flag}</span>
                                <span className="truncate">
                                  {option?.label || "Select a country"}
                                </span>
                              </div>
                            )}
                          />
                        </div>
                        
                        {selectedISO3s.length > 2 && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeCountry(index)}
                            className="mt-6 p-2 rounded-full hover:bg-muted transition-colors"
                          >
                            <X className="w-4 h-4 text-muted-foreground" />
                          </motion.button>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
              
              {selectedISO3s.length < 5 && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={addCountry}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg text-muted-foreground hover:border-primary hover:text-primary transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Add another country</span>
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
                {selectedCountryData.map((data, index) => (
                  <CountryScoreCard
                    key={data.iso3}
                    country={data}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Dimension Comparison */}
            <div className="bg-card border rounded-xl p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h4 className="text-lg font-semibold">Indicator Comparison</h4>
                <CountryLegend
                  selectedCountries={selectedCountryData}
                  colorIndices={colorIndices}
                />
              </div>

              <div className="space-y-2">
                {dimensionComparisonData.map((dimension, index) => (
                  <CountryComparisonBar
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
