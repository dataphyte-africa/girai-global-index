"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  FileText,
  CalendarDays,
  Users,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { EvidenceArtifact } from "@/lib/girai/types";
import {
  PATHWAYS,
  getPathwayFromKindParam,
  itemCountForPathway,
  type PathwayConfig,
} from "./pathway-config";
import {
  EVIDENCE_HUB_SECTIONS,
  scrollToEvidenceHubSection,
} from "./scroll";

const PATHWAY_ICONS: Record<PathwayConfig["id"], LucideIcon> = {
  frameworks: FileText,
  initiatives: CalendarDays,
  nonGov: Users,
  misuse: ShieldAlert,
};

export interface PathwayPickerProps {
  totals: EvidenceArtifact["totals"];
}

export function PathwayPicker({ totals }: PathwayPickerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activePathway = getPathwayFromKindParam(searchParams.get("kind"));

  const selectPathway = (pathway: PathwayConfig) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("kind", pathway.kindParam);
    params.delete("indicator");
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    scrollToEvidenceHubSection(EVIDENCE_HUB_SECTIONS.indicatorTable);
  };

  return (
    <section
      id="pathway-picker"
      className="scroll-mt-20 border-b border-border/60 bg-background py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl text-center font-medium tracking-tight text-foreground">
          What would you like to explore?
        </h2>
        <p className="mx-auto mt-2 max-w-xl text-center text-sm text-muted-foreground md:text-base">
          Choose an evidence pathway to begin exploring the data behind GIRAI
          scores.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PATHWAYS.map((pathway) => {
            const Icon = PATHWAY_ICONS[pathway.id];
            const isActive = pathway.id === activePathway.id;
            const itemCount = itemCountForPathway(
              pathway,
              totals.byKind,
              totals.uniqueItemsByKind,
              totals.uniqueTitlesByKind
            );
            const countryCount =
              totals.countriesByPathway?.[pathway.id] ?? totals.countriesWithItems;
            const meta =
              pathway.id === "misuse"
                ? `${countryCount} countries`
                : `${itemCount.toLocaleString()} ${pathway.itemNoun} · ${countryCount} countries`;

            return (
              <button
                key={pathway.id}
                type="button"
                onClick={() => selectPathway(pathway)}
                className={cn(
                  "flex flex-col rounded-2xl border p-5 text-left transition-all",
                  "hover:border-primary/40 hover:shadow-md",
                  isActive
                    ? "border-primary/50 bg-card shadow-md ring-2 ring-primary/20"
                    : "border-border/80 bg-card/50"
                )}
              >
                <div
                  className={cn(
                    "mb-4 flex h-11 w-11 items-center justify-center rounded-xl",
                    pathway.theme.iconBg
                  )}
                >
                  <Icon
                    className={cn("h-5 w-5", pathway.theme.iconText)}
                    aria-hidden
                  />
                </div>
                <h3 className="text-sm font-medium text-foreground md:text-base">
                  {pathway.title}
                </h3>
                <p className="mt-2 flex-1 text-xs leading-relaxed text-muted-foreground">
                  {pathway.description}
                </p>
                <span
                  className={cn(
                    "mt-4 inline-flex w-fit rounded-full px-3 py-1 text-xs font-medium",
                    pathway.theme.badgeBg,
                    pathway.theme.badgeText
                  )}
                >
                  {meta}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
