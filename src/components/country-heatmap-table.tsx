"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ColumnDef,
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
  ArrowRight,
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
import { CountryDrawer } from "@/components/country-drawer";
import type { CountryRanking } from "@/lib/girai";
import { flagUrlForIso3 } from "@/lib/geo-iso";
import {
  DIMENSIONS,
  PILLARS,
  type DimensionSlug,
  type PillarSlug,
} from "@/data/2026/taxonomy";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Fixed-scale heat map
//
// Scores are on a 0–100 scale. The bands below are FIXED (independent of the
// data shown), so a colour always means the same score range whether the user
// is looking at dimensions, pillars, all countries, or a filtered subset.

type HeatBand = {
  /** Inclusive lower bound on the 0–100 scale. */
  min: number;
  /** Pill background + text classes (light + dark). */
  className: string;
  /** Solid swatch colour for the legend. */
  swatch: string;
};

const HEAT_BANDS: HeatBand[] = [
  {
    min: 80,
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200",
    swatch: "bg-emerald-400",
  },
  {
    min: 60,
    className:
      "bg-lime-100 text-lime-800 dark:bg-lime-500/20 dark:text-lime-200",
    swatch: "bg-lime-400",
  },
  {
    min: 40,
    className:
      "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-200",
    swatch: "bg-amber-400",
  },
  {
    min: 20,
    className:
      "bg-orange-100 text-orange-800 dark:bg-orange-500/20 dark:text-orange-200",
    swatch: "bg-orange-400",
  },
  {
    min: 0,
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-200",
    swatch: "bg-rose-400",
  },
];

const EMPTY_HEAT = "bg-muted text-muted-foreground";

function heatClass(score: number | null): string {
  if (score == null || Number.isNaN(score)) return EMPTY_HEAT;
  const clamped = Math.max(0, Math.min(100, score));
  return (HEAT_BANDS.find((b) => clamped >= b.min) ?? HEAT_BANDS[HEAT_BANDS.length - 1])
    .className;
}

function HeatCell({ score }: { score: number | null }) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[3.5rem] w-full items-center justify-center px-2 text-sm font-semibold tabular-nums",
        heatClass(score)
      )}
    >
      {score == null || Number.isNaN(score) ? "—" : score.toFixed(1)}
    </div>
  );
}

function HeatLegend() {
  return (
    <div className="flex items-center gap-2 text-xs text-muted-foreground">
      <span>Low</span>
      <div className="flex overflow-hidden rounded-full">
        {[...HEAT_BANDS].reverse().map((band) => (
          <span key={band.min} className={cn("h-2.5 w-6", band.swatch)} />
        ))}
      </div>
      <span>High</span>
    </div>
  );
}

// ---------------------------------------------------------------------------

type Mode = "dimensions" | "pillars";

function CountryCell({ country, iso3 }: { country: string; iso3: string }) {
  const flagUrl = flagUrlForIso3(iso3);
  return (
    <div className="flex min-w-[180px] items-center gap-3">
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
      <div className="min-w-0 max-w-[180px] md:max-w-[240px]">
        <p
          className="truncate text-sm font-semibold text-foreground"
          title={country}
        >
          {country}
        </p>
        <p className="truncate text-xs text-muted-foreground">{iso3}</p>
      </div>
    </div>
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
  align?: "left" | "center";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground",
        align === "center" && "mx-auto text-center"
      )}
    >
      <span className="whitespace-normal leading-tight">{label}</span>
      {sorted === "asc" ? (
        <ArrowUp className="size-3.5 shrink-0" />
      ) : sorted === "desc" ? (
        <ArrowDown className="size-3.5 shrink-0" />
      ) : (
        <ChevronsUpDown className="size-3.5 shrink-0 opacity-50" />
      )}
    </button>
  );
}

export interface CountryHeatmapTableProps {
  data: CountryRanking[];
}

export function CountryHeatmapTable({ data }: CountryHeatmapTableProps) {
  const [mode, setMode] = useState<Mode>("dimensions");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "ranking", desc: false },
  ]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [selectedCountry, setSelectedCountry] = useState<CountryRanking | null>(
    null
  );

  const categories = useMemo(
    () =>
      mode === "dimensions"
        ? DIMENSIONS.map((d) => ({ slug: d.slug as string, name: d.name }))
        : PILLARS.map((p) => ({ slug: p.slug as string, name: p.name })),
    [mode]
  );

  const scoreFor = useCallback(
    (row: CountryRanking, slug: string) =>
      mode === "dimensions"
        ? row.dimensionScores[slug as DimensionSlug] ?? null
        : row.pillarScores[slug as PillarSlug] ?? null,
    [mode]
  );

  const columns = useMemo<ColumnDef<CountryRanking>[]>(() => {
    const categoryColumns: ColumnDef<CountryRanking>[] = categories.map(
      (cat) => ({
        id: `cat:${cat.slug}`,
        accessorFn: (row) => scoreFor(row, cat.slug) ?? -1,
        header: cat.name,
        cell: ({ row }) => <HeatCell score={scoreFor(row.original, cat.slug)} />,
        sortingFn: (a, b) =>
          (scoreFor(a.original, cat.slug) ?? -1) -
          (scoreFor(b.original, cat.slug) ?? -1),
      })
    );

    return [
      {
        id: "ranking",
        accessorFn: (row) => row.rankGlobal ?? Number.MAX_SAFE_INTEGER,
        header: "Rank",
        cell: ({ row }) => (
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-sm font-medium tabular-nums text-muted-foreground">
            {row.original.rankGlobal ?? "—"}
          </span>
        ),
        size: 64,
      },
      {
        id: "country",
        accessorFn: (row) => row.name,
        header: "Country",
        cell: ({ row }) => (
          <CountryCell country={row.original.name} iso3={row.original.iso3} />
        ),
      },
      {
        id: "index",
        accessorFn: (row) => row.girai ?? -1,
        header: "Index",
        cell: ({ row }) => <HeatCell score={row.original.girai} />,
        sortingFn: (a, b) => (a.original.girai ?? -1) - (b.original.girai ?? -1),
      },
      ...categoryColumns,
      {
        id: "diveDeep",
        header: "",
        enableSorting: false,
        cell: ({ row }) => (
          <Button
            asChild
            variant="outline"
            size="sm"
            className="ml-auto h-8 rounded-full px-3 text-xs font-medium text-primary hover:text-primary"
            onClick={(e) => e.stopPropagation()}
          >
            <Link href={`/countries/${row.original.iso3}`}>
              Dive Deep
              <ArrowRight className="size-3.5" />
            </Link>
          </Button>
        ),
      },
    ];
  }, [categories, scoreFor]);

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
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

        <div className="flex shrink-0 items-center gap-6 text-sm">
          {(
            [
              ["dimensions", "By Dimensions"],
              ["pillars", "By Pillars"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              className={cn(
                "relative pb-2 font-medium transition-colors",
                mode === value
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
              {mode === value && (
                <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table className="min-w-[1000px]">
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
                    typeof headerDef === "string"
                      ? headerDef
                      : String(header.column.id);
                  return (
                    <TableHead
                      key={header.id}
                      className="h-12 px-4 align-middle text-xs font-medium text-muted-foreground"
                    >
                      {header.isPlaceholder || label === "" ? null : canSort ? (
                        <SortableHeader
                          label={label}
                          sorted={sorted}
                          onClick={
                            header.column.getToggleSortingHandler() as () => void
                          }
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
                  No countries match your search.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  onClick={() => setSelectedCountry(row.original)}
                  className="cursor-pointer border-b border-border/50 transition-colors hover:bg-muted/25"
                >
                  {row.getVisibleCells().map((cell) => {
                    const isHeat =
                      cell.column.id === "index" ||
                      cell.column.id.startsWith("cat:");
                    return (
                      <TableCell
                        key={cell.id}
                        className={cn(
                          "align-middle",
                          isHeat ? "p-0" : "px-4 py-3"
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-3 border-t border-border bg-background/50 px-4 py-3 text-sm md:flex-row md:items-center md:justify-between md:px-5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
          <div className="flex items-center gap-2">
            <span>Showing</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) =>
                setPagination((prev) => ({
                  ...prev,
                  pageSize: Number(v),
                  pageIndex: 0,
                }))
              }
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
              {totalRows === 0
                ? "0 of 0"
                : `${pageStart}–${pageEnd} of ${totalRows}`}
            </span>
          </div>
          <HeatLegend />
        </div>

        <PaginationControls
          table={table}
          pageCount={pageCount}
          pageIndex={pageIndex}
        />
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
  const pages = useMemo(
    () => buildPageList(pageIndex, pageCount),
    [pageIndex, pageCount]
  );
  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
        aria-label="Previous page"
        className="size-8 border border-border bg-background"
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
              "size-8 text-sm tabular-nums",
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
        className="size-8 border border-border bg-background"
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
