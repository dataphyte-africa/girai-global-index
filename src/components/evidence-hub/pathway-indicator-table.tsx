"use client";

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  EvidenceIndexArtifact,
  EvidenceIndexRow,
  IndicatorAdoptionArtifact,
  IndicatorAdoptionEntry,
} from "@/lib/girai/types";
import {
  getMisuseTypeDisplay,
  MISUSE_TYPE_ORDER,
} from "@/lib/girai/misuse-types";
import {
  ADOPTION_INDEX_URL,
  getIndicatorsForPathway,
  getPathwayFromKindParam,
  type PathwayConfig,
} from "./pathway-config";
import {
  EVIDENCE_HUB_SECTIONS,
  scrollToEvidenceHubSection,
} from "./scroll";

const INDEX_URL = "/data/2026/evidence-index.json";

type ViewMode = "count" | "percent";

interface FrameworkRow {
  slug: string;
  name: string;
  adopted: number;
  draft: number;
  notAdopted: number;
  total: number;
}

interface YesNoRow {
  slug: string;
  name: string;
  yes: number;
  no: number;
  total: number;
}

interface MisuseTypeRow {
  type: string;
  name: string;
  yes: number;
  no: number;
  total: number;
}

function formatCell(value: number, total: number, mode: ViewMode): string {
  if (mode === "percent") {
    if (total === 0) return "0%";
    return `${Math.round((value / total) * 100)}%`;
  }
  return value.toLocaleString();
}

function splitTableTitle(title: string): { prefix: string; accent: string } {
  const parts = title.trim().split(/\s+/);
  if (parts.length <= 1) return { prefix: "", accent: title };
  const accent = parts.pop()!;
  return { prefix: parts.join(" "), accent };
}

export function PathwayIndicatorTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathway = getPathwayFromKindParam(searchParams.get("kind"));
  const indicators = getIndicatorsForPathway(pathway);

  const [viewMode, setViewMode] = React.useState<ViewMode>("count");
  const [adoption, setAdoption] = React.useState<IndicatorAdoptionArtifact | null>(
    null
  );
  const [index, setIndex] = React.useState<EvidenceIndexArtifact | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const tasks: Promise<void>[] = [];

    if (pathway.statusColumnMode === "framework") {
      tasks.push(
        fetch(ADOPTION_INDEX_URL)
          .then((r) => r.json())
          .then((data: IndicatorAdoptionArtifact) => {
            if (!cancelled) setAdoption(data);
          })
      );
    } else {
      setAdoption(null);
    }

    if (pathway.statusColumnMode === "yesNo") {
      tasks.push(
        fetch(INDEX_URL)
          .then((r) => r.json())
          .then((data: EvidenceIndexArtifact) => {
            if (!cancelled) setIndex(data);
          })
      );
    } else {
      setIndex(null);
    }

    Promise.all(tasks)
      .catch(console.error)
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [pathway.id, pathway.statusColumnMode]);

  const totalCountries =
    adoption?.totalCountries ??
    index?.totals.countriesIndexed ??
    (index ? new Set(index.rows.map((r) => r.country.iso3)).size : 135);

  const frameworkRows: FrameworkRow[] = React.useMemo(() => {
    if (pathway.statusColumnMode !== "framework" || !adoption) return [];
    return indicators.map((ind) => {
      const counts: IndicatorAdoptionEntry =
        adoption.frameworks[ind.slug] ?? {
          adopted: 0,
          draft: 0,
          notAdopted: 0,
          total: totalCountries,
        };
      return {
        slug: ind.slug,
        name: ind.name,
        adopted: counts.adopted,
        draft: counts.draft,
        notAdopted: counts.notAdopted,
        total: counts.total || totalCountries,
      };
    });
  }, [pathway.statusColumnMode, adoption, indicators, totalCountries]);

  const yesNoRows: YesNoRow[] = React.useMemo(() => {
    if (pathway.statusColumnMode !== "yesNo" || pathway.id === "misuse" || !index)
      return [];
    const kindSet = new Set(pathway.kinds);
    const yesBySlug = new Map<string, Set<string>>();
    for (const row of index.rows) {
      if (!kindSet.has(row.kind)) continue;
      if (!indicators.some((i) => i.slug === row.indicatorSlug)) continue;
      let set = yesBySlug.get(row.indicatorSlug);
      if (!set) {
        set = new Set();
        yesBySlug.set(row.indicatorSlug, set);
      }
      set.add(row.country.iso3);
    }
    return indicators.map((ind) => {
      const yes = yesBySlug.get(ind.slug)?.size ?? 0;
      return {
        slug: ind.slug,
        name: ind.name,
        yes,
        no: Math.max(0, totalCountries - yes),
        total: totalCountries,
      };
    });
  }, [pathway, index, indicators, totalCountries]);

  const misuseRows: MisuseTypeRow[] = React.useMemo(() => {
    if (pathway.id !== "misuse" || !index) return [];
    const countriesByType = new Map<string, Set<string>>();
    for (const row of index.rows) {
      if (row.kind !== "government-misuse" || !row.type) continue;
      const countries = countriesByType.get(row.type) ?? new Set<string>();
      countries.add(row.country.iso3);
      countriesByType.set(row.type, countries);
    }

    const order = new Map(MISUSE_TYPE_ORDER.map((type, i) => [type, i]));
    return Array.from(countriesByType.entries())
      .map(([type, countries]) => {
        const yes = countries.size;
        return {
          type,
          name: getMisuseTypeDisplay(type).shortLabel,
          yes,
          no: Math.max(0, totalCountries - yes),
          total: totalCountries,
        };
      })
      .sort((a, b) => {
        const orderA = order.get(a.type as (typeof MISUSE_TYPE_ORDER)[number]) ?? 999;
        const orderB = order.get(b.type as (typeof MISUSE_TYPE_ORDER)[number]) ?? 999;
        if (orderA !== orderB) return orderA - orderB;
        return a.name.localeCompare(b.name);
      });
  }, [pathway.id, index, totalCountries]);

  const exploreIndicator = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("kind", pathway.kindParam);
    const current = params.get("indicator")?.split(",").filter(Boolean) ?? [];
    if (!current.includes(slug)) current.push(slug);
    params.set("indicator", current.join(","));
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    scrollToEvidenceHubSection(EVIDENCE_HUB_SECTIONS.explorer);
  };

  const exploreMisuseType = (type: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("kind", pathway.kindParam);
    params.set("type", type);
    params.delete("indicator");
    params.delete("page");
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    scrollToEvidenceHubSection(EVIDENCE_HUB_SECTIONS.explorer);
  };

  const { prefix, accent } = splitTableTitle(pathway.tableTitle);
  const rowCount = pathway.id === "misuse" ? misuseRows.length : indicators.length;
  const rowNoun = pathway.id === "misuse" ? "misuse types" : "indicators";

  return (
    <section
      id="pathway-indicator-table"
      className="scroll-mt-20 bg-muted/30 py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
          {prefix ? (
            <>
              {prefix}{" "}
              <span className={pathway.theme.accentText}>{accent}</span>
            </>
          ) : (
            <span className={pathway.theme.accentText}>{accent}</span>
          )}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {pathway.id === "misuse"
            ? "Select a misuse type to filter the evidence listed below."
            : "Select an indicator to filter the evidence listed below."}
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm">
          <div className="flex flex-col gap-4 border-b border-border/60 px-4 py-4 sm:flex-row sm:items-center sm:justify-between md:px-6">
            <span className="text-sm font-medium text-muted-foreground">
              {rowCount} {rowNoun}
            </span>
            <ViewModeToggle mode={viewMode} onChange={setViewMode} />
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-sm text-muted-foreground">
              Loading indicator data…
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm">
                <thead>
                  <tr className="border-b border-border/60 bg-muted/50 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 md:px-6">
                      {pathway.id === "misuse" ? "Misuse type" : "Indicator"}
                    </th>
                    {pathway.statusColumnMode === "framework" ? (
                      <>
                        <th className="px-3 py-3 text-center">Adopted</th>
                        <th className="px-3 py-3 text-center">Draft</th>
                        <th className="px-3 py-3 text-center">No framework</th>
                      </>
                    ) : pathway.id === "misuse" ? (
                      <>
                        <th className="px-3 py-3 text-center">No</th>
                        <th className="px-3 py-3 text-center">Yes</th>
                      </>
                    ) : (
                      <>
                        <th className="px-3 py-3 text-center">Yes</th>
                        <th className="px-3 py-3 text-center">No</th>
                      </>
                    )}
                    <th className="px-3 py-3 text-center">Total</th>
                    <th className="px-4 py-3 md:px-6" />
                  </tr>
                </thead>
                <tbody>
                  {pathway.statusColumnMode === "framework"
                    ? frameworkRows.map((row) => (
                        <IndicatorTableRow
                          key={row.slug}
                          name={row.name}
                          pathway={pathway}
                          viewMode={viewMode}
                          onExplore={() => exploreIndicator(row.slug)}
                          cells={[
                            row.adopted,
                            row.draft,
                            row.notAdopted,
                            row.total,
                          ]}
                          total={row.total}
                        />
                      ))
                    : pathway.id === "misuse"
                      ? misuseRows.map((row) => (
                          <IndicatorTableRow
                            key={row.type}
                            name={row.name}
                            pathway={pathway}
                            viewMode={viewMode}
                            onExplore={() => exploreMisuseType(row.type)}
                            cells={[row.no, row.yes, row.total]}
                            total={row.total}
                          />
                        ))
                      : yesNoRows.map((row) => (
                        <IndicatorTableRow
                          key={row.slug}
                          name={row.name}
                          pathway={pathway}
                          viewMode={viewMode}
                          onExplore={() => exploreIndicator(row.slug)}
                          cells={[row.yes, row.no, row.total]}
                          total={row.total}
                        />
                      ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function ViewModeToggle({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (m: ViewMode) => void;
}) {
  return (
    <div
      className="inline-flex rounded-lg border border-border bg-muted/50 p-0.5 text-xs font-medium"
      role="group"
      aria-label="Display mode"
    >
      <button
        type="button"
        onClick={() => onChange("count")}
        className={cn(
          "rounded-md px-3 py-1.5 transition-colors",
          mode === "count"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        No Of Country
      </button>
      <button
        type="button"
        onClick={() => onChange("percent")}
        className={cn(
          "rounded-md px-3 py-1.5 transition-colors",
          mode === "percent"
            ? "bg-background text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        Percentage
      </button>
    </div>
  );
}

function IndicatorTableRow({
  name,
  pathway,
  viewMode,
  onExplore,
  cells,
  total,
}: {
  name: string;
  pathway: PathwayConfig;
  viewMode: ViewMode;
  onExplore: () => void;
  cells: number[];
  total: number;
}) {
  const dataCells = cells.slice(0, -1);
  const totalVal = cells[cells.length - 1]!;

  return (
    <tr className="border-b border-border/40 last:border-0 hover:bg-muted/30">
      <td className="px-4 py-3 font-medium text-foreground md:px-6">{name}</td>
      {dataCells.map((val, i) => (
        <td key={i} className="px-3 py-3 text-center tabular-nums text-foreground">
          {formatCell(val, total, viewMode)}
        </td>
      ))}
      <td className="px-3 py-3 text-center tabular-nums font-medium text-foreground">
        {formatCell(totalVal, total, viewMode)}
      </td>
      <td className="px-4 py-3 text-right md:px-6">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onExplore}
          className="border-primary/30 text-primary hover:bg-primary/5"
        >
          Explore
          <ArrowRight className="ml-1 h-3.5 w-3.5" aria-hidden />
        </Button>
      </td>
    </tr>
  );
}
