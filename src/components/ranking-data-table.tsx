"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MultiSelectFilter } from "@/components/ui/multi-select-filter";
import { GroupedMultiSelectFilter } from "@/components/ui/grouped-multi-select-filter";
import { CountryDrawer } from "@/components/country-drawer";
import type { CountryRanking } from "@/lib/girai";
import { flagUrlForIso3 } from "@/lib/geo-iso";
import type { DimensionSlug, PillarSlug } from "@/data/2026/taxonomy";
import {
  buildRegionalScoreRankMap,
  buildScoreRankMap,
  resolvePerformanceScore,
  scoreColumnLabel,
  usesCustomScoreFilter,
} from "@/lib/performance-score";
import {
  buildScoreFilterGroups,
  parseScoreFilterValues,
  scoreFilterSelectedValues,
} from "@/lib/score-filter-options";
import { cn } from "@/lib/utils";

function ordinal(n: number): string {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  switch (n % 10) {
    case 1:
      return `${n}st`;
    case 2:
      return `${n}nd`;
    case 3:
      return `${n}rd`;
    default:
      return `${n}th`;
  }
}

type RankBadgeTone = "emerald" | "sky" | "amber" | "rose" | "slate";

function rankTone(rank: number | null, total: number): RankBadgeTone {
  if (!rank || total <= 0) return "slate";
  const ratio = rank / total;
  if (ratio <= 0.25) return "emerald";
  if (ratio <= 0.5) return "sky";
  if (ratio <= 0.75) return "amber";
  return "rose";
}

const RANK_BADGE_STYLES: Record<RankBadgeTone, string> = {
  emerald: "bg-emerald-50 text-emerald-700",
  sky: "bg-sky-50 text-sky-700",
  amber: "bg-amber-50 text-amber-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-muted text-muted-foreground",
};

function RankPill({
  rank,
  total,
}: {
  rank: number | null;
  total: number;
}) {
  if (rank == null) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }
  const tone = rankTone(rank, total);
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium tabular-nums",
        RANK_BADGE_STYLES[tone]
      )}
    >
      {ordinal(rank)} of {total}
    </span>
  );
}

function CountryCell({
  country,
  iso3,
  score,
}: {
  country: string;
  iso3: string;
  score: number | null;
}) {
  const flagUrl = flagUrlForIso3(iso3);
  const pct = score == null ? 0 : Math.max(0, Math.min(100, score));

  return (
    <div className="flex min-w-[200px] items-center gap-3">
      <span className="relative h-7 w-10 shrink-0 overflow-hidden rounded-md border border-border/80 bg-muted">
        {flagUrl ? (
          <Image
            src={flagUrl}
            alt=""
            fill
            sizes="40px"
            className="object-cover"
            unoptimized
          />
        ) : null}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-foreground">{country}</p>
        <div className="mt-1.5 h-1 w-full max-w-[140px] overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function IndexBadge({ value }: { value: number | null }) {
  if (value === null) {
    return <span className="text-sm text-muted-foreground">—</span>;
  }
  return (
    <span className="inline-flex min-w-[52px] items-center justify-center rounded-md bg-primary/10 px-2.5 py-1 text-sm font-semibold text-primary tabular-nums">
      {value.toFixed(1)}
    </span>
  );
}

function SortableHeader({
  label,
  sorted,
  onClick,
  align = "left",
}: {
  label: string;
  sorted: false | "asc" | "desc";
  onClick: () => void;
  align?: "left" | "right" | "center";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
        align === "right" && "ml-auto",
        align === "center" && "mx-auto"
      )}
    >
      {label}
      {sorted === "asc" ? (
        <ArrowUp className="size-3.5" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3.5" />
      ) : (
        <ChevronsUpDown className="size-3.5 opacity-50" />
      )}
    </button>
  );
}

export interface RankingDataTableProps {
  data: CountryRanking[];
  /**
   * When set, the table is locked to a single dimension: the score selector
   * is hidden, scores/ranks reflect that dimension, and the default sort is
   * by dimension score (descending).
   */
  dimensionSlug?: DimensionSlug;
  /** When set, scores/ranks reflect this indicator and the score selector is hidden. */
  indicatorSlug?: string;
  indicatorName?: string;
}

export function RankingDataTable({
  data,
  dimensionSlug,
  indicatorSlug,
  indicatorName,
}: RankingDataTableProps) {
  const locked = Boolean(dimensionSlug || indicatorSlug);
  const [sorting, setSorting] = useState<SortingState>(
    locked ? [{ id: "score", desc: true }] : [{ id: "ranking", desc: false }]
  );
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [selectedDimensions, setSelectedDimensions] = useState<DimensionSlug[]>(
    []
  );
  const [selectedPillars, setSelectedPillars] = useState<PillarSlug[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedIncomeGroups, setSelectedIncomeGroups] = useState<string[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<CountryRanking | null>(null);

  const scoreFilter = useMemo(
    () => ({ dimensions: selectedDimensions, pillars: selectedPillars }),
    [selectedDimensions, selectedPillars]
  );

  const resolveScore = useCallback(
    (row: CountryRanking) => {
      if (indicatorSlug) return row.indicatorScores[indicatorSlug] ?? null;
      return resolvePerformanceScore(row, scoreFilter, {
        lockedDimensionSlug: dimensionSlug,
      });
    },
    [scoreFilter, dimensionSlug, indicatorSlug]
  );

  const customScore = indicatorSlug
    ? true
    : usesCustomScoreFilter(scoreFilter, dimensionSlug);
  const indexHeader = indicatorSlug
    ? (indicatorName ?? "Score")
    : scoreColumnLabel(scoreFilter, {
        lockedDimensionSlug: dimensionSlug,
      });

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const row of data) if (row.region) set.add(row.region);
    return Array.from(set).sort();
  }, [data]);

  const incomeGroups = useMemo(() => {
    const set = new Set<string>();
    for (const row of data) if (row.incomeGroup) set.add(row.incomeGroup);
    return Array.from(set).sort();
  }, [data]);

  const geoFilteredData = useMemo(() => {
    let rows = data;
    if (selectedRegions.length > 0) {
      rows = rows.filter((r) => selectedRegions.includes(r.region));
    }
    if (selectedIncomeGroups.length > 0) {
      rows = rows.filter((r) => selectedIncomeGroups.includes(r.incomeGroup));
    }
    return rows;
  }, [data, selectedRegions, selectedIncomeGroups]);

  const rankMap = useMemo(
    () =>
      customScore
        ? buildScoreRankMap(geoFilteredData, resolveScore)
        : new Map<string, number>(),
    [geoFilteredData, resolveScore, customScore]
  );

  const regionalRankMap = useMemo(
    () =>
      indicatorSlug
        ? buildRegionalScoreRankMap(geoFilteredData, resolveScore)
        : new Map<string, number>(),
    [geoFilteredData, resolveScore, indicatorSlug]
  );

  const scoreFilterGroups = buildScoreFilterGroups({
    showDimensions: !locked,
    showPillars: !indicatorSlug,
  });
  const scoreFilterSelected = scoreFilterSelectedValues(
    selectedDimensions,
    selectedPillars
  );

  const applyScoreSorting = (hasCustom: boolean) => {
    setSorting(
      hasCustom || locked
        ? [{ id: "score", desc: true }]
        : [{ id: "ranking", desc: false }]
    );
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  };

  const regionRankTotal = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of data) {
      if (row.region) counts.set(row.region, (counts.get(row.region) ?? 0) + 1);
    }
    return counts;
  }, [data]);

  const incomeRankTotal = useMemo(() => {
    const counts = new Map<string, number>();
    for (const row of data) {
      if (row.incomeGroup) {
        counts.set(row.incomeGroup, (counts.get(row.incomeGroup) ?? 0) + 1);
      }
    }
    return counts;
  }, [data]);

  const columns = useMemo<ColumnDef<CountryRanking>[]>(() => {
    const globalRank = (row: CountryRanking) => {
      if (customScore) return rankMap.get(row.iso3) ?? null;
      if (dimensionSlug) return row.dimensionRanksGlobal[dimensionSlug] ?? null;
      return row.rankGlobal;
    };

    const regionalRank = (row: CountryRanking) => {
      if (indicatorSlug) return regionalRankMap.get(row.iso3) ?? null;
      if (dimensionSlug) return row.dimensionRanksRegional[dimensionSlug] ?? null;
      return row.rankRegional;
    };

    return [
      {
        id: "ranking",
        accessorFn: (row) => globalRank(row) ?? Number.MAX_SAFE_INTEGER,
        header: "Rank",
        cell: ({ row }) => (
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium tabular-nums text-muted-foreground">
            {globalRank(row.original) ?? "—"}
          </span>
        ),
        size: 72,
      },
      {
        id: "country",
        accessorFn: (row) => row.name,
        header: "Country",
        cell: ({ row }) => (
          <CountryCell
            country={row.original.name}
            iso3={row.original.iso3}
            score={resolveScore(row.original)}
          />
        ),
      },
      {
        id: "score",
        accessorFn: (row) => resolveScore(row) ?? -1,
        header: indexHeader,
        cell: ({ row }) => <IndexBadge value={resolveScore(row.original)} />,
        sortingFn: (a, b) => {
          const av = resolveScore(a.original) ?? -1;
          const bv = resolveScore(b.original) ?? -1;
          return av - bv;
        },
      },
      {
        id: "region",
        accessorFn: (row) => row.region,
        header: "Region",
        cell: ({ row }) => (
          <span className="text-sm text-foreground/80">
            {row.original.region || "—"}
          </span>
        ),
        filterFn: (row, _id, value) => {
          const list = value as string[] | undefined;
          if (!list || list.length === 0) return true;
          return list.includes(row.original.region);
        },
      },
      {
        id: "regionRank",
        accessorFn: (row) => regionalRank(row) ?? Number.MAX_SAFE_INTEGER,
        header: "Region Rank",
        cell: ({ row }) => (
          <RankPill
            rank={regionalRank(row.original)}
            total={regionRankTotal.get(row.original.region) ?? data.length}
          />
        ),
      },
      {
        id: "incomeGroup",
        accessorFn: (row) => row.incomeGroup,
        header: "Income Group Rank",
        filterFn: (row, _id, value) => {
          const list = value as string[] | undefined;
          if (!list || list.length === 0) return true;
          return list.includes(row.original.incomeGroup);
        },
        cell: ({ row }) => {
          const group = row.original.incomeGroup;
          if (!group) {
            return <span className="text-sm text-muted-foreground">—</span>;
          }
          const rank = row.original.rankIncomeGroup;
          const total = incomeRankTotal.get(group) ?? data.length;
          const tone = rankTone(rank, total);
          return (
            <span
              className={cn(
                "inline-flex max-w-[160px] items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                RANK_BADGE_STYLES[tone]
              )}
            >
              <span className="truncate">{group}</span>
            </span>
          );
        },
      },
    ];
  }, [
    indexHeader,
    resolveScore,
    customScore,
    rankMap,
    regionalRankMap,
    regionRankTotal,
    incomeRankTotal,
    data.length,
    dimensionSlug,
    indicatorSlug,
  ]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    autoResetPageIndex: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    globalFilterFn: (row, _id, value) => {
      if (!value) return true;
      const needle = String(value).toLowerCase();
      return (
        row.original.name.toLowerCase().includes(needle) ||
        row.original.iso3.toLowerCase().includes(needle) ||
        (row.original.region ?? "").toLowerCase().includes(needle) ||
        (row.original.subregion ?? "").toLowerCase().includes(needle) ||
        (row.original.incomeGroup ?? "").toLowerCase().includes(needle)
      );
    },
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const pageIndex = pagination.pageIndex;
  const pageSize = pagination.pageSize;
  const pageCount = table.getPageCount();
  const pageStart = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const pageEnd = Math.min(totalRows, (pageIndex + 1) * pageSize);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      <div className="flex flex-col gap-3 border-b border-border bg-background/50 px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
        <div className="relative w-full md:max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search countries"
            className="h-10 rounded-xl border-border bg-background pl-9 shadow-none"
          />
        </div>
        <div className="relative z-10 flex flex-wrap items-center gap-2">
          {!indicatorSlug ? (
            <GroupedMultiSelectFilter
              placeholder="Overall GIRAI"
              groups={scoreFilterGroups}
              selected={scoreFilterSelected}
              onChange={(values) => {
                const { dimensions, pillars } = parseScoreFilterValues(values);
                setSelectedDimensions(dimensions);
                setSelectedPillars(pillars);
                applyScoreSorting(
                  locked
                    ? pillars.length > 0
                    : dimensions.length > 0 || pillars.length > 0
                );
              }}
              className="w-[220px]"
            />
          ) : null}
          <MultiSelectFilter
            placeholder="All regions"
            options={regions}
            selected={selectedRegions}
            onChange={(next) => {
              setSelectedRegions(next);
              table
                .getColumn("region")
                ?.setFilterValue(next.length === 0 ? undefined : next);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="w-[170px]"
          />
          <MultiSelectFilter
            placeholder="All income groups"
            options={incomeGroups}
            selected={selectedIncomeGroups}
            onChange={(next) => {
              setSelectedIncomeGroups(next);
              table
                .getColumn("incomeGroup")
                ?.setFilterValue(next.length === 0 ? undefined : next);
              setPagination((prev) => ({ ...prev, pageIndex: 0 }));
            }}
            className="w-[190px]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[880px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b border-border bg-muted/30 hover:bg-muted/30"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const headerDef = header.column.columnDef.header;
                  const label =
                    typeof headerDef === "string" ? headerDef : String(header.column.id);
                  return (
                    <TableHead
                      key={header.id}
                      className="h-11 px-4 text-xs font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder ? null : canSort ? (
                        <SortableHeader
                          label={label}
                          sorted={sorted}
                          onClick={header.column.getToggleSortingHandler() as () => void}
                        />
                      ) : (
                        flexRender(headerDef, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-28 text-center text-sm text-muted-foreground"
                >
                  No countries match your filters.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => setSelectedCountry(row.original)}
                  className="cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/25"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3.5">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-background/50 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between md:px-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Showing</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              const n = Number(v);
              setPagination((prev) => ({ ...prev, pageSize: n, pageIndex: 0 }));
            }}
          >
            <SelectTrigger className="h-8 w-[118px] rounded-lg border-border bg-background text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[10, 25, 50, 100].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} entries
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <span className="hidden sm:inline">
            {totalRows === 0 ? "0 of 0" : `${pageStart}–${pageEnd} of ${totalRows}`}
          </span>
        </div>

        <PaginationControls table={table} pageCount={pageCount} pageIndex={pageIndex} />
      </div>

      <CountryDrawer
        country={selectedCountry}
        open={!!selectedCountry}
        onClose={() => setSelectedCountry(null)}
      />
    </div>
  );
}

function PaginationControls({
  table,
  pageCount,
  pageIndex,
}: {
  table: ReturnType<typeof useReactTable<CountryRanking>>;
  pageCount: number;
  pageIndex: number;
}) {
  const pages = useMemo(() => buildPageList(pageIndex, pageCount), [pageIndex, pageCount]);
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        aria-label="Previous page"
        className="size-8 rounded-lg border border-border bg-background"
      >
        <ChevronLeft className="size-4" />
      </Button>
      {pages.map((p, idx) =>
        p === "…" ? (
          <span
            key={`ellipsis-${idx}`}
            className="inline-flex size-8 items-center justify-center text-muted-foreground"
          >
            …
          </span>
        ) : (
          <Button
            key={p}
            variant={p - 1 === pageIndex ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => table.setPageIndex(p - 1)}
            className={cn(
              "size-8 rounded-lg text-sm tabular-nums",
              p - 1 === pageIndex
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {p}
          </Button>
        )
      )}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage()}
        aria-label="Next page"
        className="size-8 rounded-lg border border-border bg-background"
      >
        <ChevronRight className="size-4" />
      </Button>
    </div>
  );
}

function buildPageList(currentIndex: number, pageCount: number): (number | "…")[] {
  if (pageCount <= 0) return [1];
  const current = currentIndex + 1;
  const delta = 1;
  const range: (number | "…")[] = [];
  const rangeWithDots: (number | "…")[] = [];
  let l: number | null = null;

  for (let i = 1; i <= pageCount; i++) {
    if (
      i === 1 ||
      i === pageCount ||
      (i >= current - delta && i <= current + delta)
    ) {
      range.push(i);
    }
  }

  for (const i of range) {
    if (l !== null && typeof i === "number" && i - l > 1) {
      rangeWithDots.push("…");
    }
    rangeWithDots.push(i);
    if (typeof i === "number") l = i;
  }

  return rangeWithDots;
}
