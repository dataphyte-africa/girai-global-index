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
import type { CountryRanking } from "@/lib/girai";
import { iso3ToIso2 } from "@/data/countries";
import { DIMENSIONS, PILLARS } from "@/data/2026/taxonomy";

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

function getOrdinalSuffix(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

export function CountryDrawer({
  country,
  open,
  onClose,
}: {
  country: CountryRanking | null;
  open: boolean;
  onClose: () => void;
}) {
  const [key, setKey] = useState(0);

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
              alt={`${country.name} flag`}
              className="h-10 w-auto rounded-sm shadow-sm object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
            <div className="text-left">
              <SheetTitle className="text-lg font-semibold">
                {country.name}
              </SheetTitle>
              <SheetDescription className="text-xs text-muted-foreground">
                2026 Edition · {country.region}
              </SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div key={key} className="flex-1 overflow-y-auto px-4">
          {/* Global Index Score */}
          <div className="text-center py-6">
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Global Index Score
            </p>
            <p className="text-4xl font-bold text-primary tabular-nums">
              <AnimatedNumber value={country.girai ?? 0} duration={1200} decimals={2} />
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
              {country.rankGlobal !== null && (
                <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Global: {country.rankGlobal}
                  {getOrdinalSuffix(country.rankGlobal)}
                </span>
              )}
              {country.rankRegional !== null && (
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  Regional: {country.rankRegional}
                  {getOrdinalSuffix(country.rankRegional)}
                </span>
              )}
              {country.rankIncomeGroup !== null && (
                <span className="inline-flex items-center rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                  Income: {country.rankIncomeGroup}
                  {getOrdinalSuffix(country.rankIncomeGroup)}
                </span>
              )}
            </div>
          </div>

          {/* Dimension-Level Performance */}
          <div className="border-t pt-4">
            <SectionTitle>Dimension Scores</SectionTitle>
            <div className="space-y-4 rounded-lg border bg-card p-4">
              {DIMENSIONS.map((d, i) => (
                <AnimatedProgressBar
                  key={d.slug}
                  label={d.name}
                  value={country.dimensionScores[d.slug] ?? 0}
                  delay={100 * (i + 1)}
                />
              ))}
            </div>
          </div>

          {/* Pillar Scores */}
          <div className="pt-4">
            <SectionTitle>Pillar Scores</SectionTitle>
            <div className="space-y-4 rounded-lg border bg-card p-4">
              {PILLARS.map((p, i) => (
                <AnimatedProgressBar
                  key={p.slug}
                  label={p.name}
                  value={country.pillarScores[p.slug] ?? 0}
                  delay={100 * (DIMENSIONS.length + i + 1)}
                />
              ))}
            </div>
          </div>

          {country.uraiCount > 0 && (
            <div className="pt-4 pb-2">
              <SectionTitle>Government Misuse (URAI)</SectionTitle>
              <div className="rounded-lg border bg-card p-4">
                <p className="text-sm text-foreground">
                  <strong className="tabular-nums">{country.uraiCount}</strong>{" "}
                  documented case{country.uraiCount === 1 ? "" : "s"}
                </p>
                {country.uraiPenalty !== null && country.uraiPenalty < 1 && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Applied penalty: ×{country.uraiPenalty.toFixed(2)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        <SheetFooter className="border-t pt-4">
          <Link href={`/countries/${country.iso3}`} className="w-full">
            <Button className="w-full rounded-full" size="lg">
              View country page
            </Button>
          </Link>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
