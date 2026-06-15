"use client";

import { useEffect, useRef, useState } from "react";
import {
  AlertTriangle,
  Baby,
  Bird,
  BookOpen,
  Building2,
  ChevronRight,
  CircleDot,
  ClipboardCheck,
  Eye,
  FileCheck,
  FileSearch,
  Gavel,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Info,
  Landmark,
  Languages,
  Leaf,
  Lock,
  MonitorSmartphone,
  OctagonAlert,
  Scale,
  Share2,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  UserCheck,
  Users,
  Wifi,
  Wind,
  type LucideIcon,
} from "lucide-react";
import type { PillarSlug } from "@/data/2026/taxonomy";
import { getIndicatorCopy, PILLAR_LABELS } from "@/lib/indicator-copy";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  AlertTriangle,
  Baby,
  Bird,
  BookOpen,
  Building2,
  CircleDot,
  ClipboardCheck,
  Eye,
  FileCheck,
  FileSearch,
  Gavel,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Info,
  Landmark,
  Languages,
  Leaf,
  Lock,
  MonitorSmartphone,
  OctagonAlert,
  Scale,
  Share2,
  ShieldAlert,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  UserCheck,
  Users,
  Wifi,
  Wind,
};

function Icon({ name, className }: { name: string; className?: string }) {
  const Cmp = ICONS[name] ?? CircleDot;
  return <Cmp className={className} />;
}

export interface KeyIndicator {
  slug: string;
  name: string;
  pillar: PillarSlug;
}

export interface DimensionKeyIndicatorsProps {
  indicators: KeyIndicator[];
  /** Dimension accent colour (hex). */
  color: string;
}

export function DimensionKeyIndicators({
  indicators,
  color,
}: DimensionKeyIndicatorsProps) {
  const [activeSlug, setActiveSlug] = useState(indicators[0]?.slug ?? "");
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          const slug = visible[0].target.getAttribute("data-slug");
          if (slug) setActiveSlug(slug);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    const nodes = Object.values(cardRefs.current).filter(Boolean) as HTMLDivElement[];
    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [indicators]);

  const handleSelect = (slug: string) => {
    cardRefs.current[slug]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <section className="w-full px-4 py-16 md:px-8 md:py-24">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
            <span className="text-primary">Key Indicators</span>{" "}
            <span className="text-foreground">Within This Dimension</span>
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground md:text-base">
            These indicators translate high-level principles into measurable,
            verifiable outcomes.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[340px_1fr] lg:gap-12">
          {/* Sticky left rail */}
          <div className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 px-1 text-lg font-semibold">
                {indicators.length} Key Indicators
              </h3>
              <ul className="flex flex-col gap-1.5">
                {indicators.map((ind) => {
                  const isActive = ind.slug === activeSlug;
                  const copy = getIndicatorCopy(ind.slug);
                  return (
                    <li key={ind.slug}>
                      <button
                        type="button"
                        onClick={() => handleSelect(ind.slug)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition-colors",
                          isActive
                            ? "bg-primary/5"
                            : "hover:bg-muted/60"
                        )}
                        style={
                          isActive
                            ? { borderColor: `${color}40`, backgroundColor: `${color}12` }
                            : undefined
                        }
                      >
                        <span
                          className="flex size-8 shrink-0 items-center justify-center rounded-lg text-white"
                          style={{
                            backgroundColor: isActive ? color : `${color}1f`,
                            color: isActive ? "#fff" : color,
                          }}
                        >
                          <Icon name={copy.icon} className="size-4" />
                        </span>
                        <span
                          className={cn(
                            "flex-1 truncate text-sm font-medium",
                            isActive ? "text-foreground" : "text-foreground/75"
                          )}
                        >
                          {ind.name}
                        </span>
                        <ChevronRight
                          className={cn(
                            "size-4 shrink-0 text-muted-foreground transition-transform",
                            isActive && "translate-x-0.5"
                          )}
                          style={isActive ? { color } : undefined}
                        />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          {/* Scrolling cards */}
          <div className="flex flex-col gap-5">
            {indicators.map((ind) => {
              const copy = getIndicatorCopy(ind.slug);
              const isActive = ind.slug === activeSlug;
              return (
                <div
                  key={ind.slug}
                  data-slug={ind.slug}
                  ref={(el) => {
                    cardRefs.current[ind.slug] = el;
                  }}
                  className={cn(
                    "scroll-mt-24 rounded-2xl border bg-card p-6 shadow-sm transition-all md:p-7",
                    isActive ? "shadow-md" : "border-border"
                  )}
                  style={isActive ? { borderColor: `${color}66` } : undefined}
                >
                  <div className="flex items-start gap-4">
                    <span
                      className="flex size-11 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: `${color}1f`, color }}
                    >
                      <Icon name={copy.icon} className="size-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-lg font-semibold text-foreground">
                        {ind.name}
                      </h4>
                      <div className="mt-1 flex items-center gap-2">
                        <span
                          className="h-0.5 w-5 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          {PILLAR_LABELS[ind.pillar]}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {copy.description}
                  </p>

                  <div
                    className="mt-4 rounded-xl border-l-2 bg-muted/40 px-4 py-3"
                    style={{ borderColor: color }}
                  >
                    <p className="text-sm leading-relaxed text-foreground/80">
                      <span className="font-semibold text-foreground">
                        Why this matters:
                      </span>{" "}
                      {copy.whyItMatters}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
