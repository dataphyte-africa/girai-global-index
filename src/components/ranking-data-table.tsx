"use client";

import { useMemo, useState } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CountryDrawer } from "@/components/country-drawer";
import type { CountryRanking } from "@/lib/girai";
import { iso3ToIso2 } from "@/data/countries";
import { DIMENSIONS, PILLARS } from "@/data/2026/taxonomy";
import { cn } from "@/lib/utils";

type ScoreKeyId = string; // "all" | `dimension:${slug}` | `pillar:${slug}`

interface ScoreOption {
  id: ScoreKeyId;
  label: string;
  group: "all" | "dimension" | "pillar";
  resolve: (row: CountryRanking) => number | null;
}

const ALL_OPTION: ScoreOption = {
  id: "all",
  label: "Overall GIRAI",
  group: "all",
  resolve: (row) => row.girai,
};

const SCORE_OPTIONS: ScoreOption[] = [
  ALL_OPTION,
  ...DIMENSIONS.map<ScoreOption>((d) => ({
    id: `dimension:${d.slug}`,
    label: d.name,
    group: "dimension",
    resolve: (row) => row.dimensionScores[d.slug] ?? null,
  })),
  ...PILLARS.map<ScoreOption>((p) => ({
    id: `pillar:${p.slug}`,
    label: p.name,
    group: "pillar",
    resolve: (row) => row.pillarScores[p.slug] ?? null,
  })),
];

function ScoreBar({ value }: { value: number | null }) {
  if (value === null) {
    return (
      <span className="text-sm text-muted-foreground tabular-nums">—</span>
    );
  }
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className="flex items-center gap-3">
      <Badge
        variant="outline"
        className="h-6 min-w-[52px] rounded-md border-primary/20 bg-primary/10 px-2 text-primary tabular-nums"
      >
        {value.toFixed(1)}
      </Badge>
      <div className="relative hidden h-1 w-28 flex-1 overflow-hidden rounded-full bg-muted sm:block">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-linear-to-r from-primary/60 to-primary"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function CountryCell({ country, iso3 }: { country: string; iso3: string }) {
  const iso2 = iso3ToIso2[iso3];
  const flagUrl = iso2 ? `https://flagcdn.com/w40/${iso2}.png` : null;
  return (
    <div className="flex items-center gap-3 rounded-full border border-border bg-background/60 py-1 pr-3 pl-1 w-fit min-w-[180px]">
      <span className="relative size-6 shrink-0 overflow-hidden rounded-full border border-border bg-muted">
        {flagUrl ? (
          <Image
            src={flagUrl}
            alt={country}
            fill
            sizes="24px"
            className="object-cover"
            unoptimized
          />
        ) : null}
      </span>
      <span className="truncate text-sm font-medium text-foreground">{country}</span>
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
  align?: "left" | "right" | "center";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground transition-colors hover:text-foreground",
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
        <ChevronsUpDown className="size-3.5 opacity-60" />
      )}
    </button>
  );
}

export interface RankingDataTableProps {
  data: CountryRanking[];
}

export function RankingDataTable({ data }: RankingDataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "ranking", desc: false }]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [scoreKeyId, setScoreKeyId] = useState<ScoreKeyId>("all");
  const [region, setRegion] = useState<string>("all");
  const [selectedCountry, setSelectedCountry] = useState<CountryRanking | null>(null);

  const regions = useMemo(() => {
    const set = new Set<string>();
    for (const row of data) if (row.region) set.add(row.region);
    return Array.from(set).sort();
  }, [data]);

  const scoreOption = useMemo(
    () => SCORE_OPTIONS.find((o) => o.id === scoreKeyId) ?? ALL_OPTION,
    [scoreKeyId]
  );

  const columns = useMemo<ColumnDef<CountryRanking>[]>(() => {
    return [
      {
        id: "ranking",
        accessorFn: (row) => row.rankGlobal ?? Number.MAX_SAFE_INTEGER,
        header: "Rank",
        cell: ({ row }) => (
          <span className="text-sm font-medium tabular-nums text-muted-foreground">
            {row.original.rankGlobal ?? "—"}
          </span>
        ),
        size: 60,
      },
      {
        id: "country",
        accessorFn: (row) => row.name,
        header: "Country",
        cell: ({ row }) => (
          <CountryCell country={row.original.name} iso3={row.original.iso3} />
        ),
        filterFn: (row, _id, value) => {
          if (!value) return true;
          const needle = String(value).toLowerCase();
          return (
            row.original.name.toLowerCase().includes(needle) ||
            row.original.iso3.toLowerCase().includes(needle)
          );
        },
      },
      {
        id: "score",
        accessorFn: (row) => scoreOption.resolve(row) ?? -1,
        header: scoreOption.label,
        cell: ({ row }) => <ScoreBar value={scoreOption.resolve(row.original)} />,
        sortingFn: (a, b) => {
          const av = scoreOption.resolve(a.original) ?? -1;
          const bv = scoreOption.resolve(b.original) ?? -1;
          return av - bv;
        },
      },
      {
        id: "region",
        accessorFn: (row) => row.region,
        header: "Region",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.region || "—"}
          </span>
        ),
        filterFn: (row, _id, value) => {
          if (!value || value === "all") return true;
          return row.original.region === value;
        },
      },
      {
        id: "subregion",
        accessorFn: (row) => row.subregion,
        header: "Subregion",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.original.subregion || "—"}
          </span>
        ),
      },
      {
        id: "ai-policy",
        accessorFn: (row) => row.pillarScores["ai-policy"] ?? -1,
        header: "AI Policy",
        cell: ({ row }) => (
          <span className="text-sm font-medium tabular-nums text-foreground">
            {row.original.pillarScores["ai-policy"]?.toFixed(1) ?? "—"}
          </span>
        ),
      },
      {
        id: "cso-engagement",
        accessorFn: (row) => row.pillarScores["cso-engagement"] ?? -1,
        header: "CSO Engagement",
        cell: ({ row }) => (
          <span className="text-sm font-medium tabular-nums text-foreground">
            {row.original.pillarScores["cso-engagement"]?.toFixed(1) ?? "—"}
          </span>
        ),
      },
    ];
  }, [scoreOption]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      pagination: { pageIndex: 0, pageSize },
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
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
        (row.original.subregion ?? "").toLowerCase().includes(needle)
      );
    },
  });

  const totalRows = table.getFilteredRowModel().rows.length;
  const pageIndex = table.getState().pagination.pageIndex;
  const pageCount = table.getPageCount();
  const pageStart = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const pageEnd = Math.min(totalRows, (pageIndex + 1) * pageSize);

  return (
    <div className="rounded-2xl border border-border bg-card/60 shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border px-4 py-4 md:flex-row md:items-center md:justify-between md:px-5">
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            placeholder="Search countries"
            className="h-9 rounded-lg bg-background pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value="2026" onValueChange={() => {}}>
            <SelectTrigger className="h-9 w-[110px] rounded-lg text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2026">2026</SelectItem>
            </SelectContent>
          </Select>
          <Select value={scoreKeyId} onValueChange={(v) => setScoreKeyId(v as ScoreKeyId)}>
            <SelectTrigger className="h-9 w-[230px] rounded-lg text-sm">
              <SelectValue placeholder="Overall GIRAI" />
            </SelectTrigger>
            <SelectContent>
              {SCORE_OPTIONS.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={region}
            onValueChange={(v) => {
              setRegion(v);
              table.getColumn("region")?.setFilterValue(v);
            }}
          >
            <SelectTrigger className="h-9 w-[170px] rounded-lg text-sm">
              <SelectValue placeholder="All regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All regions</SelectItem>
              {regions.map((r) => (
                <SelectItem key={r} value={r}>
                  {r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table className="min-w-[900px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-border hover:bg-transparent">
                {headerGroup.headers.map((header) => {
                  const canSort = header.column.getCanSort();
                  const sorted = header.column.getIsSorted();
                  const headerDef = header.column.columnDef.header;
                  const label = typeof headerDef === "string" ? headerDef : String(header.column.id);
                  return (
                    <TableHead
                      key={header.id}
                      className="h-11 px-4 text-xs font-medium uppercase tracking-wide text-muted-foreground"
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
                  className="cursor-pointer border-b border-border/60 transition-colors hover:bg-muted/40"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col gap-3 border-t border-border px-4 py-3 text-sm md:flex-row md:items-center md:justify-between md:px-5">
        <div className="flex items-center gap-2 text-muted-foreground">
          <span>Showing</span>
          <Select
            value={String(pageSize)}
            onValueChange={(v) => {
              const n = Number(v);
              setPageSize(n);
              table.setPageSize(n);
            }}
          >
            <SelectTrigger className="h-8 w-[110px] rounded-md text-xs">
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
        className="size-8 rounded-md border border-border bg-background"
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
              "size-8 rounded-md text-sm tabular-nums",
              p - 1 === pageIndex
                ? "bg-primary text-primary-foreground hover:bg-primary/90"
                : "border border-border bg-background"
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
        className="size-8 rounded-md border border-border bg-background"
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
