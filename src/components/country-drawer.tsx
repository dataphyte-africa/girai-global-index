"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { FullRankingData } from "@/data/countries";
import { iso3ToIso2 } from "@/data/countries";

// Animated number counter
function AnimatedNumber({
  value,
  duration = 1000,
  decimals = 1,
}: {
  value: number;
  duration?: number;
  decimals?: number;
}) {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    startTimeRef.current = null;

    const animate = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(eased * value);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [value, duration]);

  return <span>{displayValue.toFixed(decimals)}</span>;
}

// Animated progress bar
function AnimatedProgressBar({
  label,
  value,
  maxValue = 100,
  delay = 0,
}: {
  label: string;
  value: number;
  maxValue?: number;
  delay?: number;
}) {
  const [isVisible, setIsVisible] = useState(false);
  const percentage = Math.min((value / maxValue) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{label}</span>
        <span className="text-sm font-semibold tabular-nums text-primary">
          {isVisible ? <AnimatedNumber value={value} duration={800} /> : "0.0"}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted/50">
        <div
          className="h-full rounded-full bg-linear-to-r from-primary/80 to-primary transition-all duration-1000 ease-out"
          style={{
            width: isVisible ? `${percentage}%` : "0%",
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="text-sm font-semibold text-foreground mt-6 mb-4 first:mt-0">
      {children}
    </h4>
  );
}

export function CountryDrawer({
  country,
  open,
  onClose,
}: {
  country: FullRankingData | null;
  open: boolean;
  onClose: () => void;
}) {
  const [key, setKey] = useState(0);

  // Reset animations when country changes
  useEffect(() => {
    if (country) {
      setKey((prev) => prev + 1);
    }
  }, [country?.iso3]);

  if (!country) return null;

  const iso2 = iso3ToIso2[country.iso3] ?? country.iso3.slice(0, 2).toLowerCase();
  const flagUrl = `https://flagcdn.com/w80/${iso2}.png`;

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent
        side="right"
        className="sm:max-w-sm overflow-y-auto z-1000 flex flex-col"
      >
        <SheetHeader className="pb-2">
          <div className="flex items-center gap-3">
            <img
              src={flagUrl}
              alt={`${country.country} flag`}
              className="h-10 w-auto rounded-sm shadow-sm object-cover"
              onError={(e) => {
                // Fallback to a default if flag image fails to load
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="text-left">
              <SheetTitle className="text-lg font-semibold">
                {country.country}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                2025 Research
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div key={key} className="flex-1 overflow-y-auto px-4">
          {/* Global Index Score */}
          <div className="text-center py-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Global Index
            </p>
            <p className="text-4xl font-bold text-primary tabular-nums">
              <AnimatedNumber value={country.indexScore} duration={1200} decimals={2} />
            </p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Global: {country.ranking}th
              </span>
              {country.giraiRegion && (
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  Regional: {getRegionalRank(country)}
                </span>
              )}
            </div>
          </div>

          {/* Dimension-Level Performance */}
          <div className="border-t pt-4">
            <SectionTitle>Dimension-Level Performance</SectionTitle>
            <div className="space-y-4 rounded-lg border bg-card p-4">
              <AnimatedProgressBar
                label="Human Rights and AI"
                value={country.dimensionScores.humanRightsAI}
                delay={100}
              />
              <AnimatedProgressBar
                label="Responsible AI Governance"
                value={country.dimensionScores.responsibleAIGovernance}
                delay={200}
              />
              <AnimatedProgressBar
                label="Responsible AI Capacities"
                value={country.dimensionScores.responsibleAICapacities}
                delay={300}
              />
            </div>
          </div>

          {/* Pillar Scores */}
          <div className="pt-4">
            <SectionTitle>Pillar Scores</SectionTitle>
            <div className="space-y-4 rounded-lg border bg-card p-4">
              <AnimatedProgressBar
                label="Government Frameworks"
                value={country.pillarScores.governmentFrameworks}
                delay={400}
              />
              <AnimatedProgressBar
                label="Government Actions"
                value={country.pillarScores.governmentActions}
                delay={500}
              />
              <AnimatedProgressBar
                label="Non-State Actors"
                value={country.pillarScores.nonStateActors}
                delay={600}
              />
            </div>
          </div>

          {/* Global Index Trend (Placeholder) */}
          <div className="pt-4 pb-2">
            <SectionTitle>Global Index Trend</SectionTitle>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-xs text-muted-foreground">
                See how index change over time
              </p>
              <div className="h-16 flex items-center justify-center text-muted-foreground/50 text-sm">
                {/* Placeholder for trend chart */}
                <span className="text-xs">—</span>
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="border-t pt-4">
          <Link href={`/country/${country.iso3}`} className="w-full">
            <Button className="w-full rounded-full" size="lg">
              Read story
            </Button>
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// Helper function to calculate regional rank (placeholder - needs actual data)
function getRegionalRank(_country: FullRankingData): string {
  // This would ideally come from the data
  // For now, return a placeholder
  return "—";
}
