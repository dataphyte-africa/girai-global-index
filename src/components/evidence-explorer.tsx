"use client";

/**
 * Evidence Explorer — search & filter UI over the GIRAI evidence corpus.
 *
 * Architecture:
 *   • Slim index `/data/2026/evidence-index.json` (~250 KB gzipped) is
 *     fetched once on mount and held in component state.
 *   • Full `/data/2026/evidence.json` is lazy-fetched the first time a
 *     user expands a row (only place we need `justification` and
 *     `thematicElements`). Cached in a ref for the lifetime of the page.
 *   • Filter state lives in the URL (`?q=&region=&pillar=&country=&indicator=&kind=&dimension=&page=`)
 *     so the view is shareable. Search input is debounced 250ms.
 *   • Multi-select per facet uses OR-within / AND-across (standard
 *     faceted search). Facet option lists are recomputed against the
 *     *other* active filters so dropdowns always show real combinations
 *     (cascading). Each option shows a `(count)`.
 *   • Fuse.js fuzzy search over title / country name / indicator name,
 *     with a `"quoted"` substring-mode escape.
 *   • Sort: country A→Z, then title A→Z (default, not user-adjustable).
 *   • Pagination: 8 rows per page, numbered. Page is in the URL.
 *
 * The companion teaser block lives in `evidence-explorer-section.tsx`;
 * that is the homepage CTA, this is the destination component.
 */

import * as React from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Fuse from "fuse.js";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  ExternalLink,
  Filter,
  Search,
  SearchX,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { iso3ToIso2 } from "@/data/countries";
import { DIMENSIONS, PILLARS, type PillarSlug } from "@/data/2026/taxonomy";
import { PILLAR_BADGES } from "@/lib/pillar-badges";
import type {
  EvidenceIndexArtifact,
  EvidenceIndexRow,
  EvidenceArtifact,
  EvidenceItem,
  EvidenceKind,
} from "@/lib/girai/types";

// ---------------------------------------------------------------------------
// Constants

const INDEX_URL = "/data/2026/evidence-index.json";
const FULL_URL = "/data/2026/evidence.json";
const PAGE_SIZE = 8;
const SEARCH_DEBOUNCE_MS = 250;

const KIND_LABELS: Record<EvidenceKind, string> = {
  framework: "Framework",
  initiative: "Government Initiative",
  "cso-initiative": "CSO Initiative",
  "gmc-consultation": "Gov. Mechanism — Consultation",
  "gmc-provision": "Gov. Mechanism — Provision",
  "gmc-mechanism": "Gov. Mechanism — Body",
  "government-misuse": "Government Misuse",
};

/**
 * Pluralised noun used in dynamic stat-card labels when one kind
 * dominates ≥90% of the filtered result set.
 */
const KIND_NOUN_PLURAL: Record<EvidenceKind, string> = {
  framework: "frameworks",
  initiative: "initiatives",
  "cso-initiative": "CSO actions",
  "gmc-consultation": "consultations",
  "gmc-provision": "provisions",
  "gmc-mechanism": "government mechanisms",
  "government-misuse": "misuse cases",
};

/** Evidence kinds omitted from the nested Pillar dropdown for a given pillar. */
const PILLAR_KINDS_HIDDEN_IN_TREE: Partial<Record<PillarSlug, EvidenceKind[]>> = {
  "enabling-conditions": ["government-misuse"],
};

/** Facets configured by the URL — keep order stable to match the UI row. */
const FACET_KEYS = [
  "region",
  "pillar",
  "country",
  "indicator",
  "dimension",
] as const;
type FacetKey = (typeof FACET_KEYS)[number];
const FILTER_KEYS = [...FACET_KEYS, "type", "kind"] as const;
type FilterKey = (typeof FILTER_KEYS)[number];

interface FilterSpec<TKey extends FilterKey = FilterKey> {
  key: TKey;
  label: string;
  /** Singular noun used in active-filter chips ("Pillar: AI Policy"). */
  chipLabel: string;
  /** Placeholder when no values are selected. */
  placeholder: string;
  /** Pull the value from a row for matching. */
  resolve: (row: EvidenceIndexRow) => string[] | string;
}

type FacetSpec = FilterSpec<FacetKey>;

const FACETS: FacetSpec[] = [
  {
    key: "region",
    label: "REGION",
    chipLabel: "Region",
    placeholder: "All Regions",
    resolve: (r) => r.country.region,
  },
  {
    key: "pillar",
    label: "PILLAR",
    chipLabel: "Pillar",
    placeholder: "All pillars",
    resolve: (r) => r.pillarSlug,
  },
  {
    key: "country",
    label: "COUNTRY",
    chipLabel: "Country",
    placeholder: "All countries",
    resolve: (r) => r.country.iso3,
  },
  {
    key: "indicator",
    label: "INDICATORS",
    chipLabel: "Indicator",
    placeholder: "All Indicators",
    resolve: (r) => r.indicatorSlug,
  },
  {
    key: "dimension",
    label: "DIMENSIONS",
    chipLabel: "Dimension",
    placeholder: "All Dimensions",
    resolve: (r) => r.dimensionSlug,
  },
];

const TYPE_FILTER: FilterSpec<"type"> = {
  key: "type",
  label: "TYPE",
  chipLabel: "Misuse type",
  placeholder: "All types",
  resolve: (r) => r.type ?? "",
};

/**
 * Evidence-kind filter. Has no standalone dropdown of its own — it is
 * driven by the nested Pillar tree (see `NestedPillarKindDropdown`). The
 * spec lives in FILTERS so that `applyFacets`, `ActiveChips`, and the
 * cascading-count logic pick it up transparently.
 */
const KIND_FILTER: FilterSpec<"kind"> = {
  key: "kind",
  label: "TYPE",
  chipLabel: "Type",
  placeholder: "All types",
  resolve: (r) => r.kind,
};

const FILTERS: FilterSpec[] = [...FACETS, TYPE_FILTER, KIND_FILTER];

// ---------------------------------------------------------------------------
// URL state helpers

interface ExplorerState {
  q: string;
  page: number;
  facets: Record<FilterKey, string[]>;
}

function parseStateFromUrl(params: URLSearchParams): ExplorerState {
  const facets = Object.fromEntries(
    FILTER_KEYS.map((k) => {
      const raw = params.get(k);
      return [k, raw ? raw.split(",").filter(Boolean) : []];
    })
  ) as Record<FilterKey, string[]>;
  return {
    q: params.get("q") ?? "",
    page: Math.max(1, Number.parseInt(params.get("page") ?? "1", 10) || 1),
    facets,
  };
}

function serializeStateToUrl(state: ExplorerState): URLSearchParams {
  const out = new URLSearchParams();
  if (state.q.trim()) out.set("q", state.q.trim());
  for (const key of FILTER_KEYS) {
    const vals = state.facets[key];
    if (vals.length) out.set(key, vals.join(","));
  }
  if (state.page > 1) out.set("page", String(state.page));
  return out;
}

/** Apply a default country facet when the URL has no country filter yet. */
function withPresetCountry(
  state: ExplorerState,
  presetCountryIso3: string | undefined
): ExplorerState {
  if (!presetCountryIso3 || state.facets.country.length > 0) return state;
  return {
    ...state,
    facets: {
      ...state.facets,
      country: [presetCountryIso3.toUpperCase()],
    },
  };
}

/** Apply a default indicator facet when the URL has no indicator filter yet. */
function withPresetIndicator(
  state: ExplorerState,
  presetIndicatorSlug: string | undefined
): ExplorerState {
  if (!presetIndicatorSlug || state.facets.indicator.length > 0) return state;
  return {
    ...state,
    facets: {
      ...state.facets,
      indicator: [presetIndicatorSlug],
    },
  };
}

/** Apply a default region facet when the URL has no region filter yet. */
function withPresetRegion(
  state: ExplorerState,
  presetRegion: string | undefined
): ExplorerState {
  if (!presetRegion || state.facets.region.length > 0) return state;
  return {
    ...state,
    facets: {
      ...state.facets,
      region: [presetRegion],
    },
  };
}

function withPresets(
  state: ExplorerState,
  presets: {
    presetCountryIso3?: string;
    presetIndicatorSlug?: string;
    presetRegion?: string;
  }
): ExplorerState {
  return withPresetRegion(
    withPresetIndicator(
      withPresetCountry(state, presets.presetCountryIso3),
      presets.presetIndicatorSlug
    ),
    presets.presetRegion
  );
}

// ---------------------------------------------------------------------------
// Filtering, search, sorting

/** Apply every facet *except* `excludeKey` to the rows. Used both for the
 *  final result set (no exclusion) and for cascading facet option counts
 *  (excluding the facet we're computing options for, so that toggling
 *  options inside that facet doesn't make them vanish). */
function applyFacets(
  rows: EvidenceIndexRow[],
  facets: Record<FilterKey, string[]>,
  excludeKey?: FacetKey
): EvidenceIndexRow[] {
  return rows.filter((row) => {
    for (const f of FILTERS) {
      if (f.key === excludeKey) continue;
      const active = facets[f.key];
      if (active.length === 0) continue;
      const v = f.resolve(row);
      const values = Array.isArray(v) ? v : [v];
      const ok = values.some((x) => x && active.includes(x));
      if (!ok) return false;
    }
    return true;
  });
}

function searchRows(rows: EvidenceIndexRow[], q: string, fuse: Fuse<EvidenceIndexRow> | null): EvidenceIndexRow[] {
  const query = q.trim();
  if (!query) return rows;
  // Quoted query → exact substring fallback.
  if (query.startsWith('"') && query.endsWith('"') && query.length > 2) {
    const needle = query.slice(1, -1).toLowerCase();
    return rows.filter(
      (r) =>
        r.title.toLowerCase().includes(needle) ||
        r.country.name.toLowerCase().includes(needle) ||
        r.indicatorName.toLowerCase().includes(needle)
    );
  }
  if (!fuse) return rows;
  // Re-run fuse over only the post-facet rows so search respects filters.
  const slice = new Fuse(rows, FUSE_OPTIONS);
  return slice.search(query).map((r) => r.item);
}

function normalizeEvidenceText(value: string | null | undefined): string {
  return (value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function normalizeEvidenceUrl(value: string | null | undefined): string {
  return normalizeEvidenceText(value)
    .replace(/^https?:\/\/(www\.)?/, "")
    .replace(/[#?].*$/, "")
    .replace(/\/$/, "");
}

function displayIdentityForRow(row: EvidenceIndexRow): string {
  if (row.kind === "framework") return normalizeEvidenceText(row.title) || row.id;
  return normalizeEvidenceUrl(row.link) || normalizeEvidenceText(row.title) || row.id;
}

function displayCountForRows(rows: EvidenceIndexRow[]): number {
  const byKind = new Map<EvidenceKind, Set<string>>();
  for (const row of rows) {
    const identities = byKind.get(row.kind) ?? new Set<string>();
    identities.add(displayIdentityForRow(row));
    byKind.set(row.kind, identities);
  }
  return Array.from(byKind.values()).reduce((sum, identities) => sum + identities.size, 0);
}

const FUSE_OPTIONS: ConstructorParameters<typeof Fuse<EvidenceIndexRow>>[1] = {
  keys: [
    { name: "title", weight: 1.0 },
    { name: "country.name", weight: 0.8 },
    { name: "indicatorName", weight: 0.6 },
  ],
  threshold: 0.35,
  ignoreLocation: true,
  includeScore: false,
  minMatchCharLength: 2,
};

function sortRows(rows: EvidenceIndexRow[]): EvidenceIndexRow[] {
  // Country A→Z, then title A→Z (default, not user-adjustable).
  return [...rows].sort((a, b) => {
    const c = a.country.name.localeCompare(b.country.name);
    if (c !== 0) return c;
    return a.title.localeCompare(b.title);
  });
}

// ---------------------------------------------------------------------------
// Facet option computation

interface FacetOption {
  value: string;
  label: string;
  count: number;
}

/** A single Pillar row in the nested Pillar/Kind dropdown, with its
 *  cascading evidence-kind children. */
interface PillarTreeOption {
  slug: string;
  label: string;
  count: number;
  kinds: { kind: EvidenceKind; label: string; count: number }[];
}

function buildOptions(
  facet: FacetSpec,
  /** Rows pre-filtered by *every other* facet (cascading). */
  rowsForFacet: EvidenceIndexRow[],
  countryLookup: Map<string, string>
): FacetOption[] {
  const counts = new Map<string, number>();
  for (const row of rowsForFacet) {
    const v = facet.resolve(row);
    const vals = Array.isArray(v) ? v : [v];
    for (const val of vals) counts.set(val, (counts.get(val) ?? 0) + 1);
  }

  const labelFor = (value: string): string => {
    switch (facet.key) {
      case "pillar":
        return PILLARS.find((p) => p.slug === value)?.name ?? value;
      case "dimension":
        return DIMENSIONS.find((d) => d.slug === value)?.name ?? value;
      case "country":
        return countryLookup.get(value) ?? value;
      case "indicator":
        return value; // We render indicator labels with their human name; see option build below.
      default:
        return value;
    }
  };

  const options: FacetOption[] = Array.from(counts.entries()).map(([value, count]) => ({
    value,
    count,
    label: labelFor(value),
  }));
  options.sort((a, b) => a.label.localeCompare(b.label));
  return options;
}

// ---------------------------------------------------------------------------
// Date formatting (en-GB DD/MM/YYYY to match Figma)

function formatApprovalDate(iso: string | null): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

// ---------------------------------------------------------------------------
// Component

export interface EvidenceExplorerProps {
  /** Optional override for the heading copy. */
  heading?: React.ReactNode;
  /** Optional override for the subheading copy. */
  subheading?: string;
  /** Override for the search input placeholder. */
  searchPlaceholder?: string;
  /**
   * When set (e.g. on a country page), preselects this ISO3 in the country
   * facet if the URL has no country filter. Synced into `?country=` on mount.
   */
  presetCountryIso3?: string;
  /**
   * When set (e.g. on an indicator page), preselects this slug in the
   * indicator facet if the URL has no indicator filter. Synced into
   * `?indicator=` on mount.
   */
  presetIndicatorSlug?: string;
  /**
   * When set (e.g. on a region page), preselects this region name in the
   * region facet if the URL has no region filter. Synced into `?region=`
   * on mount.
   */
  presetRegion?: string;
}

export function EvidenceExplorer({
  heading = "Search & Filter Evidence",
  subheading,
  searchPlaceholder = 'Search policies, laws, countries, indicators ("quoted" for exact)',
  presetCountryIso3,
  presetIndicatorSlug,
  presetRegion,
}: EvidenceExplorerProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // --- Slim index fetch -----------------------------------------------------
  const [index, setIndex] = React.useState<EvidenceIndexArtifact | null>(null);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    fetch(INDEX_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<EvidenceIndexArtifact>;
      })
      .then((data) => {
        if (!cancelled) setIndex(data);
      })
      .catch((err: unknown) => {
        if (!cancelled) setLoadError(err instanceof Error ? err.message : String(err));
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // --- URL state ------------------------------------------------------------
  const urlState = React.useMemo(
    () =>
      withPresets(parseStateFromUrl(searchParams), {
        presetCountryIso3,
        presetIndicatorSlug,
        presetRegion,
      }),
    [searchParams, presetCountryIso3, presetIndicatorSlug, presetRegion]
  );

  // Keep shareable URL in sync when a country page preset is applied.
  React.useEffect(() => {
    if (!presetCountryIso3) return;
    const code = presetCountryIso3.toUpperCase();
    const fromUrl = searchParams.get("country")?.split(",").filter(Boolean) ?? [];
    if (fromUrl.includes(code)) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("country", code);
    router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  }, [presetCountryIso3, searchParams, pathname, router]);

  // Keep shareable URL in sync when an indicator page preset is applied.
  React.useEffect(() => {
    if (!presetIndicatorSlug) return;
    const fromUrl =
      searchParams.get("indicator")?.split(",").filter(Boolean) ?? [];
    if (fromUrl.includes(presetIndicatorSlug)) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("indicator", presetIndicatorSlug);
    router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  }, [presetIndicatorSlug, searchParams, pathname, router]);

  // Keep shareable URL in sync when a region page preset is applied.
  React.useEffect(() => {
    if (!presetRegion) return;
    const fromUrl = searchParams.get("region")?.split(",").filter(Boolean) ?? [];
    if (fromUrl.includes(presetRegion)) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("region", presetRegion);
    router.replace(`${pathname}${params.toString() ? `?${params}` : ""}`, {
      scroll: false,
    });
  }, [presetRegion, searchParams, pathname, router]);

  // Local mirror of the search box (debounced into the URL).
  const [searchInput, setSearchInput] = React.useState(urlState.q);
  React.useEffect(() => {
    setSearchInput(urlState.q);
  }, [urlState.q]);

  const writeState = React.useCallback(
    (next: ExplorerState) => {
      const params = serializeStateToUrl(next);
      const qs = params.toString();
      router.replace(`${pathname}${qs ? `?${qs}` : ""}`, { scroll: false });
    },
    [router, pathname]
  );

  // Debounce search input → URL.
  React.useEffect(() => {
    if (searchInput === urlState.q) return;
    const t = setTimeout(() => {
      writeState({ ...urlState, q: searchInput, page: 1 });
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [searchInput, urlState, writeState]);

  // --- Lookups & derived data ----------------------------------------------
  const countryLookup = React.useMemo(() => {
    const map = new Map<string, string>();
    if (index) for (const c of index.facets.countries) map.set(c.iso3, c.name);
    return map;
  }, [index]);

  const allRows = React.useMemo(() => index?.rows ?? [], [index]);

  // Cascading nested options for the Pillar tree. Pre-filters rows by every
  // facet *except* `pillar` and `kind`, then groups by pillarSlug → kind.
  // Ensures toggling either dimension inside the tree doesn't make options
  // vanish out from under the user. Zero-count combinations are omitted.
  const pillarTreeOptions = React.useMemo<PillarTreeOption[]>(() => {
    const rowsForTree = allRows.filter((row) => {
      for (const f of FILTERS) {
        if (f.key === "pillar" || f.key === "kind") continue;
        const active = urlState.facets[f.key];
        if (active.length === 0) continue;
        const v = f.resolve(row);
        const values = Array.isArray(v) ? v : [v];
        if (!values.some((x) => x && active.includes(x))) return false;
      }
      return true;
    });

    const byPillar = new Map<
      string,
      { count: number; kinds: Map<EvidenceKind, number> }
    >();
    for (const row of rowsForTree) {
      const entry =
        byPillar.get(row.pillarSlug) ??
        { count: 0, kinds: new Map<EvidenceKind, number>() };
      entry.count += 1;
      entry.kinds.set(row.kind, (entry.kinds.get(row.kind) ?? 0) + 1);
      byPillar.set(row.pillarSlug, entry);
    }

    // Iterate PILLARS for stable display order (matches taxonomy).
    return PILLARS.map((p) => {
      const entry = byPillar.get(p.slug);
      if (!entry) return null;
      const hiddenKinds = new Set(PILLAR_KINDS_HIDDEN_IN_TREE[p.slug] ?? []);
      const kinds = Array.from(entry.kinds.entries())
        .filter(([kind]) => !hiddenKinds.has(kind))
        .map(([kind, count]) => ({
          kind,
          label: KIND_LABELS[kind],
          count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label));
      return {
        slug: p.slug,
        label: p.name,
        count: entry.count,
        kinds,
      };
    }).filter((x) => x !== null) as PillarTreeOption[];
  }, [allRows, urlState.facets]);

  // Cascading facet option lists (each excludes its own active values).
  const facetOptions = React.useMemo(() => {
    const out = {} as Record<FacetKey, FacetOption[]>;
    for (const f of FACETS) {
      const rowsForFacet = applyFacets(allRows, urlState.facets, f.key);
      // For indicator facet, use indicatorName as the label.
      if (f.key === "indicator") {
        const counts = new Map<string, { count: number; name: string }>();
        for (const row of rowsForFacet) {
          const v = counts.get(row.indicatorSlug);
          if (v) v.count += 1;
          else counts.set(row.indicatorSlug, { count: 1, name: row.indicatorName });
        }
        out[f.key] = Array.from(counts.entries())
          .map(([value, { count, name }]) => ({ value, label: name, count }))
          .sort((a, b) => a.label.localeCompare(b.label));
      } else {
        out[f.key] = buildOptions(f, rowsForFacet, countryLookup);
      }
    }
    return out;
  }, [allRows, urlState.facets, countryLookup]);

  // Fuse instance over the entire index (search is restricted to the
  // post-facet subset inside `searchRows`).
  const fuse = React.useMemo(
    () => (allRows.length ? new Fuse(allRows, FUSE_OPTIONS) : null),
    [allRows]
  );

  // Final filtered + searched + sorted result set.
  const filteredRows = React.useMemo(() => {
    const facetFiltered = applyFacets(allRows, urlState.facets);
    const searched = searchRows(facetFiltered, urlState.q, fuse);
    return sortRows(searched);
  }, [allRows, urlState.facets, urlState.q, fuse]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE));
  const currentPage = Math.min(urlState.page, totalPages);
  const pageRows = React.useMemo(
    () => filteredRows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredRows, currentPage]
  );

  // --- Stat cards (dynamic noun when one kind ≥90%) -------------------------
  const stats = React.useMemo(() => {
    const rowTotal = filteredRows.length;
    const total = displayCountForRows(filteredRows);
    const countries = new Set(filteredRows.map((r) => r.country.iso3)).size;
    if (rowTotal === 0) return { total, countries, noun: "items", capNoun: "Evidence items" };
    const byKind: Record<string, number> = {};
    for (const r of filteredRows) byKind[r.kind] = (byKind[r.kind] ?? 0) + 1;
    const [topKind, topCount] = Object.entries(byKind).sort((a, b) => b[1] - a[1])[0];
    if (topCount / rowTotal >= 0.9) {
      const noun = KIND_NOUN_PLURAL[topKind as EvidenceKind] ?? "items";
      return {
        total,
        countries,
        noun,
        capNoun: noun.charAt(0).toUpperCase() + noun.slice(1),
      };
    }
    return { total, countries, noun: "evidence items", capNoun: "Evidence items" };
  }, [filteredRows]);

  // --- Mutators -------------------------------------------------------------
  const toggleFacet = React.useCallback(
    (key: FacetKey, value: string) => {
      const current = urlState.facets[key];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      writeState({ ...urlState, facets: { ...urlState.facets, [key]: next }, page: 1 });
    },
    [urlState, writeState]
  );

  /**
   * Toggle a single (pillar, kind) leaf in the Pillar tree.
   *
   * Independent semantics: ticking the leaf adds the pillar to `pillar` and
   * the kind to `kind`. The two sets are AND-combined globally, so ticking
   * (AI Policy, Framework) + (CSO Engagement, Initiative) also matches
   * AI-policy initiatives and CSO frameworks. This was an explicit design
   * choice — the alternative (pillar,kind tuples) was rejected.
   *
   * When unticking, we drop the kind globally; if the pillar then has no
   * remaining ticked children among its currently visible kinds, we also
   * drop the pillar so it doesn't silently keep filtering rows.
   */
  const togglePillarKindLeaf = React.useCallback(
    (
      pillarSlug: string,
      kind: EvidenceKind,
      visibleKinds: EvidenceKind[]
    ) => {
      const pillars = urlState.facets.pillar;
      const kinds = urlState.facets.kind;
      const isPillarOn = pillars.includes(pillarSlug);
      const isKindOn = kinds.includes(kind);

      // Symmetrical filter semantics: an empty `pillar` or `kind` set is a
      // vacuous match (every value passes). A leaf is therefore "checked"
      // iff the pillar filter passes its pillar, the kind filter passes its
      // kind, AND at least one of the two is actually narrowing — otherwise
      // *all* leaves would read as checked while showing no active filter.
      const pillarNarrowing = pillars.length > 0;
      const kindNarrowing = kinds.length > 0;
      const noNarrowing = !pillarNarrowing && !kindNarrowing;
      const pillarPasses = !pillarNarrowing || isPillarOn;
      const kindPasses = !kindNarrowing || isKindOn;
      const wasChecked = !noNarrowing && pillarPasses && kindPasses;

      let nextPillars = pillars;
      let nextKinds = kinds;
      if (wasChecked) {
        // Make the leaf fail at least one filter. Prefer narrowing the
        // dimension that's already narrowed; if only the other is narrowed,
        // introduce narrowing in this one too.
        if (kindNarrowing) {
          nextKinds = kinds.filter((k) => k !== kind);
        } else {
          // pillarNarrowing must be true (noNarrowing was excluded). Kind
          // filter is vacuous — we need to add narrowing on kind. Expand to
          // the visible subset minus this kind, unless the pillar only
          // shows one kind, in which case removing the pillar is cleaner.
          if (visibleKinds.length <= 1) {
            nextPillars = pillars.filter((p) => p !== pillarSlug);
          } else {
            nextKinds = visibleKinds.filter((k) => k !== kind);
          }
        }
      } else {
        // User wants to tick this leaf. Add the pillar and kind to their
        // respective sets so the leaf passes both filters. This may convert
        // vacuous narrowing into explicit narrowing on the other dimension,
        // which is intentional — the user just expressed a positive choice.
        if (!isPillarOn) nextPillars = [...pillars, pillarSlug];
        if (!isKindOn) nextKinds = [...kinds, kind];
      }
      writeState({
        ...urlState,
        facets: {
          ...urlState.facets,
          pillar: nextPillars,
          kind: nextKinds,
        },
        page: 1,
      });
    },
    [urlState, writeState]
  );

  /**
   * Toggle a whole Pillar group. Tri-state semantics:
   *   - all visible children checked  → uncheck:   drop the pillar, drop
   *                                                every visible kind
   *   - indeterminate / unchecked      → check:    add the pillar, add
   *                                                every visible kind
   */
  const togglePillarGroup = React.useCallback(
    (pillarSlug: string, visibleKinds: EvidenceKind[]) => {
      const pillars = urlState.facets.pillar;
      const kinds = urlState.facets.kind;
      const isPillarOn = pillars.includes(pillarSlug);
      // Mirror the render-time derivation: with both filter sets vacuous
      // nothing is checked, so an "uncheck" branch is impossible.
      const pillarNarrowing = pillars.length > 0;
      const kindNarrowing = kinds.length > 0;
      const noNarrowing = !pillarNarrowing && !kindNarrowing;
      const pillarPasses = !pillarNarrowing || isPillarOn;
      const allKindsPass =
        !kindNarrowing || visibleKinds.every((k) => kinds.includes(k));
      const allChecked = !noNarrowing && pillarPasses && allKindsPass;

      let nextPillars: string[] = pillars;
      let nextKinds: string[] = kinds;
      if (allChecked) {
        // Strip this pillar from both filters where it has an explicit
        // presence. We only remove kinds when kind narrowing is active —
        // otherwise we'd convert a vacuous kind set into a narrowing one.
        if (isPillarOn) {
          nextPillars = pillars.filter((p) => p !== pillarSlug);
        }
        if (kindNarrowing) {
          nextKinds = kinds.filter(
            (k) => !visibleKinds.includes(k as EvidenceKind)
          );
        }
      } else {
        if (!isPillarOn) nextPillars = [...pillars, pillarSlug];
        // If kind narrowing is active, ensure this pillar's visible kinds
        // are all included so all children render as checked. If it's
        // vacuous we leave it that way — pillar narrowing alone suffices.
        if (kindNarrowing) {
          const kindSet = new Set(kinds);
          for (const k of visibleKinds) kindSet.add(k);
          nextKinds = Array.from(kindSet);
        }
      }
      writeState({
        ...urlState,
        facets: {
          ...urlState.facets,
          pillar: nextPillars,
          kind: nextKinds,
        },
        page: 1,
      });
    },
    [urlState, writeState]
  );

  /** Clear all Pillar + Kind selections in one go (used by the tree's footer). */
  const clearPillarTree = React.useCallback(() => {
    writeState({
      ...urlState,
      facets: { ...urlState.facets, pillar: [], kind: [] },
      page: 1,
    });
  }, [urlState, writeState]);

  const clearFacet = React.useCallback(
    (key: FilterKey, value?: string) => {
      const next = value === undefined ? [] : urlState.facets[key].filter((v) => v !== value);
      writeState({ ...urlState, facets: { ...urlState.facets, [key]: next }, page: 1 });
    },
    [urlState, writeState]
  );

  const clearAll = React.useCallback(() => {
    const facets = Object.fromEntries(
      FILTER_KEYS.map((k) => [k, [] as string[]])
    ) as Record<FilterKey, string[]>;
    if (presetCountryIso3) {
      facets.country = [presetCountryIso3.toUpperCase()];
    }
    if (presetIndicatorSlug) {
      facets.indicator = [presetIndicatorSlug];
    }
    writeState({
      q: "",
      page: 1,
      facets,
    });
    setSearchInput("");
  }, [writeState, presetCountryIso3, presetIndicatorSlug]);

  const goToPage = React.useCallback(
    (page: number) => {
      writeState({ ...urlState, page });
    },
    [urlState, writeState]
  );

  // --- Full evidence lazy loader (for row expansion) ------------------------
  const fullEvidenceRef = React.useRef<Map<string, EvidenceItem> | null>(null);
  const [fullEvidenceLoading, setFullEvidenceLoading] = React.useState(false);

  const ensureFullEvidence = React.useCallback(async (): Promise<Map<string, EvidenceItem>> => {
    if (fullEvidenceRef.current) return fullEvidenceRef.current;
    setFullEvidenceLoading(true);
    try {
      const res = await fetch(FULL_URL);
      const json = (await res.json()) as EvidenceArtifact;
      const map = new Map<string, EvidenceItem>();
      for (const it of json.items) map.set(it.id, it);
      fullEvidenceRef.current = map;
      return map;
    } finally {
      setFullEvidenceLoading(false);
    }
  }, []);

  const isLoadingIndex = !index && !loadError;
  const hasActiveFilters =
    urlState.q.trim() !== "" || FILTER_KEYS.some((k) => urlState.facets[k].length > 0);

  // ----------------------------------------------------------------------------------
  // Render

  return (
    <section
      id="evidence-explorer"
      className="relative mx-auto w-full max-w-7xl scroll-mt-20 px-4 py-12 md:px-6 md:py-16"
    >
      {/* Heading */}
      <div className="mx-auto mb-8 max-w-3xl text-center md:mb-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight text-foreground">
          {heading}
        </h2>
        <p className="mt-3 text-sm text-muted-foreground md:text-base">
          {subheading ??
            (index
              ? `${(index.totals.uniqueItems ?? index.totals.items).toLocaleString()} unique evidence items from laws, strategies, policies, and institutional actions in the ${index.totals.countriesIndexed ?? index.facets.countries.length}-country GIRAI index.`
              : "Loading evidence corpus…")}
        </p>
      </div>

      <div className="sticky top-16 z-40 -mx-4 mb-6 border-b border-border/60 bg-background/95 px-4 pb-4 pt-2 backdrop-blur-md supports-backdrop-filter:bg-background/80 md:-mx-6 md:px-6">
        {/* Search */}
        <div className="relative mb-4">
          <Search
            aria-hidden
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Search evidence"
            className="h-12 w-full rounded-lg border border-input bg-muted/40 pl-11 pr-4 text-sm shadow-sm transition-colors focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filters — desktop inline */}
        <div className="mb-3 hidden grid-cols-2 gap-3 md:grid md:grid-cols-3 lg:grid-cols-5">
          {FACETS.map((facet) =>
            facet.key === "pillar" ? (
              <NestedPillarKindDropdown
                key={facet.key}
                facet={facet}
                tree={pillarTreeOptions}
                selectedPillars={urlState.facets.pillar}
                selectedKinds={urlState.facets.kind as EvidenceKind[]}
                onToggleLeaf={togglePillarKindLeaf}
                onToggleGroup={togglePillarGroup}
                onClear={clearPillarTree}
              />
            ) : (
              <FacetDropdown
                key={facet.key}
                facet={facet}
                selected={urlState.facets[facet.key]}
                options={facetOptions[facet.key]}
                onToggle={(v) => toggleFacet(facet.key, v)}
                onClear={() => clearFacet(facet.key)}
              />
            )
          )}
        </div>

        {/* Filters — mobile sheet trigger */}
        <div className="mb-3 flex items-center justify-between md:hidden">
          <MobileFilterSheet
            facets={FACETS}
            selected={urlState.facets}
            options={facetOptions}
            onToggle={toggleFacet}
            onClear={clearFacet}
            pillarTree={pillarTreeOptions}
            selectedKinds={urlState.facets.kind as EvidenceKind[]}
            onTogglePillarLeaf={togglePillarKindLeaf}
            onTogglePillarGroup={togglePillarGroup}
            onClearPillarTree={clearPillarTree}
            activeCount={FILTER_KEYS.reduce((sum, k) => sum + urlState.facets[k].length, 0)}
          />
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear all
            </Button>
          )}
        </div>

        {/* Active filter chips */}
        <ActiveChips
          state={urlState}
          countryLookup={countryLookup}
          onRemove={(key, value) => clearFacet(key, value)}
          onClearSearch={() => {
            setSearchInput("");
            writeState({ ...urlState, q: "", page: 1 });
          }}
          onClearAll={clearAll}
        />
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard
          loading={isLoadingIndex}
          value={stats.total}
          label={`Number of ${stats.noun}`}
        />
        <StatCard
          loading={isLoadingIndex}
          value={stats.countries}
          label={`Countries with ${stats.noun}`}
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {isLoadingIndex ? (
          Array.from({ length: PAGE_SIZE }).map((_, i) => <RowSkeleton key={i} />)
        ) : loadError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6 text-sm text-destructive">
            Failed to load evidence index: {loadError}
          </div>
        ) : filteredRows.length === 0 ? (
          <EmptyState onClear={clearAll} />
        ) : (
          pageRows.map((row) => (
            <EvidenceRow
              key={row.id}
              row={row}
              ensureFullEvidence={ensureFullEvidence}
              fullEvidenceLoading={fullEvidenceLoading}
            />
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoadingIndex && filteredRows.length > 0 && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          totalItems={filteredRows.length}
          onChange={goToPage}
        />
      )}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Sub-components

function StatCard({
  value,
  label,
  loading,
}: {
  value: number;
  label: string;
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm md:p-6">
      <div className="text-3xl font-medium tracking-tight text-primary md:text-4xl">
        {loading ? <span className="inline-block h-9 w-20 animate-pulse rounded bg-muted" /> : value.toLocaleString()}
      </div>
      <div className="mt-1 text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function ActiveChips({
  state,
  countryLookup,
  onRemove,
  onClearSearch,
  onClearAll,
}: {
  state: ExplorerState;
  countryLookup: Map<string, string>;
  onRemove: (key: FilterKey, value: string) => void;
  onClearSearch: () => void;
  onClearAll: () => void;
}) {
  const chips: { key: string; label: string; onRemove: () => void }[] = [];

  if (state.q.trim()) {
    chips.push({
      key: `q:${state.q}`,
      label: `Search: "${state.q.trim()}"`,
      onRemove: onClearSearch,
    });
  }
  for (const facet of FILTERS) {
    for (const value of state.facets[facet.key]) {
      let display = value;
      switch (facet.key) {
        case "pillar":
          display = PILLARS.find((p) => p.slug === value)?.name ?? value;
          break;
        case "dimension":
          display = DIMENSIONS.find((d) => d.slug === value)?.name ?? value;
          break;
        case "country":
          display = countryLookup.get(value) ?? value;
          break;
        case "kind":
          display = KIND_LABELS[value as EvidenceKind] ?? value;
          break;
      }
      chips.push({
        key: `${facet.key}:${value}`,
        label: `${facet.chipLabel}: ${display}`,
        onRemove: () => onRemove(facet.key, value),
      });
    }
  }

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={chip.onRemove}
          className="group inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20 transition-colors hover:bg-primary/15"
        >
          <span>{chip.label}</span>
          <X className="h-3 w-3 opacity-60 group-hover:opacity-100" aria-hidden />
          <span className="sr-only">Remove filter</span>
        </button>
      ))}
      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

function FacetDropdown({
  facet,
  selected,
  options,
  onToggle,
  onClear,
}: {
  facet: FacetSpec;
  selected: string[];
  options: FacetOption[];
  onToggle: (value: string) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [search, setSearch] = React.useState("");

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const filtered = React.useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = q
      ? options.filter((o) => o.label.toLowerCase().includes(q))
      : options;
    // Pin selected options to the top of the list. Sort is stable, so the
    // remaining options keep their original alphabetical order.
    const selectedSet = new Set(selected);
    return [...base].sort(
      (a, b) =>
        (selectedSet.has(a.value) ? 0 : 1) - (selectedSet.has(b.value) ? 0 : 1)
    );
  }, [options, search, selected]);

  const triggerLabel =
    selected.length === 0
      ? facet.placeholder
      : selected.length === 1
        ? options.find((o) => o.value === selected[0])?.label ?? selected[0]
        : `${selected.length} selected`;

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {facet.label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors",
          "hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary",
          open && "ring-2 ring-primary"
        )}
      >
        <span
          className={cn(
            "truncate",
            selected.length === 0 && "text-muted-foreground"
          )}
        >
          {triggerLabel}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 opacity-60 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute z-40 mt-1 w-[min(20rem,calc(100vw-2rem))] rounded-md border bg-popover shadow-lg"
          >
            {options.length > 8 && (
              <div className="border-b px-2 py-1.5">
                <input
                  type="text"
                  autoFocus
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={`Search ${facet.chipLabel.toLowerCase()}…`}
                  className="w-full bg-transparent px-2 py-1 text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
            )}
            <div className="max-h-72 overflow-y-auto p-1">
              {filtered.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No matches
                </div>
              ) : (
                filtered.map((opt) => {
                  const checked = selected.includes(opt.value);
                  return (
                    <motion.button
                      key={opt.value}
                      layout
                      transition={{
                        layout: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] },
                      }}
                      type="button"
                      onClick={() => onToggle(opt.value)}
                      className={cn(
                        "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
                        "hover:bg-accent",
                        checked && "bg-accent/60"
                      )}
                    >
                      <span
                        className={cn(
                          "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
                          checked
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground/40"
                        )}
                      >
                        {checked && (
                          <svg viewBox="0 0 16 16" className="h-3 w-3" aria-hidden>
                            <path
                              fill="currentColor"
                              d="M6.173 12.414L2.586 8.828l1.414-1.414 2.173 2.172 5.828-5.828 1.414 1.414z"
                            />
                          </svg>
                        )}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{opt.label}</span>
                      <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                        {opt.count}
                      </span>
                    </motion.button>
                  );
                })
              )}
            </div>
            {selected.length > 0 && (
              <div className="flex justify-end border-t p-1.5">
                <button
                  type="button"
                  onClick={() => {
                    onClear();
                  }}
                  className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MobileFilterSheet({
  facets,
  selected,
  options,
  onToggle,
  onClear,
  pillarTree,
  selectedKinds,
  onTogglePillarLeaf,
  onTogglePillarGroup,
  onClearPillarTree,
  activeCount,
}: {
  facets: FacetSpec[];
  selected: Record<FacetKey, string[]>;
  options: Record<FacetKey, FacetOption[]>;
  onToggle: (key: FacetKey, value: string) => void;
  onClear: (key: FacetKey) => void;
  pillarTree: PillarTreeOption[];
  selectedKinds: EvidenceKind[];
  onTogglePillarLeaf: (
    pillarSlug: string,
    kind: EvidenceKind,
    visibleKinds: EvidenceKind[]
  ) => void;
  onTogglePillarGroup: (pillarSlug: string, visibleKinds: EvidenceKind[]) => void;
  onClearPillarTree: () => void;
  activeCount: number;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeCount > 0 && (
            <Badge variant="secondary" className="ml-1">
              {activeCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Filter className="h-4 w-4" /> Filters
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-4 overflow-y-auto p-4 pt-0">
          {facets.map((facet) =>
            facet.key === "pillar" ? (
              <NestedPillarKindDropdown
                key={facet.key}
                facet={facet}
                tree={pillarTree}
                selectedPillars={selected.pillar}
                selectedKinds={selectedKinds}
                onToggleLeaf={onTogglePillarLeaf}
                onToggleGroup={onTogglePillarGroup}
                onClear={onClearPillarTree}
              />
            ) : (
              <FacetDropdown
                key={facet.key}
                facet={facet}
                selected={selected[facet.key]}
                options={options[facet.key]}
                onToggle={(v) => onToggle(facet.key, v)}
                onClear={() => onClear(facet.key)}
              />
            )
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/**
 * Nested Pillar → Evidence-kind dropdown.
 *
 * Visual: same trigger styling as `FacetDropdown`, but the popover body
 * shows each pillar as a parent checkbox row with its evidence-kind
 * children indented below. Parents are tri-state (checked / indeterminate
 * / unchecked) — see `togglePillarGroup` / `togglePillarKindLeaf` for the
 * exact semantics.
 *
 * Selection state is read from two URL params (`pillar` and `kind`) which
 * are AND-combined with the rest of the facets globally. A leaf is
 * rendered as checked iff its pillar and its kind are both currently
 * selected; this means selecting two leaves with the same kind under
 * different pillars implicitly also matches that kind under any other
 * selected pillar (intentional — "independent" semantics).
 */
function NestedPillarKindDropdown({
  facet,
  tree,
  selectedPillars,
  selectedKinds,
  onToggleLeaf,
  onToggleGroup,
  onClear,
}: {
  facet: FacetSpec;
  tree: PillarTreeOption[];
  selectedPillars: string[];
  selectedKinds: EvidenceKind[];
  onToggleLeaf: (
    pillarSlug: string,
    kind: EvidenceKind,
    visibleKinds: EvidenceKind[]
  ) => void;
  onToggleGroup: (pillarSlug: string, visibleKinds: EvidenceKind[]) => void;
  onClear: () => void;
}) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  const totalSelected = selectedPillars.length + selectedKinds.length;
  const triggerLabel = (() => {
    if (totalSelected === 0) return facet.placeholder;
    // Prefer the human pillar name when exactly one pillar (and no kind
    // narrowing) is in effect — most legible case.
    if (selectedPillars.length === 1 && selectedKinds.length === 0) {
      return PILLARS.find((p) => p.slug === selectedPillars[0])?.name ?? selectedPillars[0];
    }
    if (selectedPillars.length === 0 && selectedKinds.length === 1) {
      return KIND_LABELS[selectedKinds[0]];
    }
    return `${totalSelected} selected`;
  })();

  return (
    <div ref={containerRef} className="relative">
      <label className="mb-1 block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {facet.label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-sm transition-colors",
          "hover:bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary",
          open && "ring-2 ring-primary"
        )}
      >
        <span
          className={cn(
            "truncate",
            totalSelected === 0 && "text-muted-foreground"
          )}
        >
          {triggerLabel}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 opacity-60 transition-transform",
            open && "rotate-180"
          )}
          aria-hidden
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.12 }}
            className="absolute z-40 mt-1 w-[min(22rem,calc(100vw-2rem))] rounded-md border bg-popover shadow-lg"
          >
            <div className="max-h-112 overflow-y-auto p-1">
              {tree.length === 0 ? (
                <div className="py-4 text-center text-sm text-muted-foreground">
                  No matches
                </div>
              ) : (
                tree.map((pillar) => {
                  const visibleKinds = pillar.kinds.map((k) => k.kind);
                  const pillarOn = selectedPillars.includes(pillar.slug);
                  // Both filter sets are vacuous when empty — they match
                  // everything. So a leaf is "checked" iff (a) the pillar
                  // filter passes this pillar AND (b) the kind filter passes
                  // its kind AND (c) at least one of the two filters is
                  // actually narrowing. Without (c) every leaf would appear
                  // checked even when no filters are set, which is wrong.
                  const pillarNarrowing = selectedPillars.length > 0;
                  const kindNarrowing = selectedKinds.length > 0;
                  const noNarrowing = !pillarNarrowing && !kindNarrowing;
                  const pillarPasses = !pillarNarrowing || pillarOn;
                  const allKindsPass =
                    !kindNarrowing ||
                    visibleKinds.every((k) => selectedKinds.includes(k));
                  const someKindsPass =
                    !kindNarrowing ||
                    visibleKinds.some((k) => selectedKinds.includes(k));
                  const parentState: "checked" | "indeterminate" | "unchecked" =
                    noNarrowing || !pillarPasses
                      ? "unchecked"
                      : allKindsPass
                        ? "checked"
                        : someKindsPass
                          ? "indeterminate"
                          : "unchecked";

                  return (
                    <div key={pillar.slug} className="py-0.5">
                      <button
                        type="button"
                        onClick={() => onToggleGroup(pillar.slug, visibleKinds)}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm font-semibold transition-colors",
                          "hover:bg-accent",
                          parentState !== "unchecked" && "bg-accent/60"
                        )}
                      >
                        <TriStateBox state={parentState} />
                        <span className="min-w-0 flex-1 truncate text-foreground">
                          {pillar.label}
                        </span>
                        <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                          {pillar.count}
                        </span>
                      </button>
                      {pillar.kinds.length > 0 ? (
                      <div className="ml-3 border-l border-border/60 pl-1">
                        {pillar.kinds.map((k) => {
                          const checked =
                            !noNarrowing &&
                            pillarPasses &&
                            (!kindNarrowing || selectedKinds.includes(k.kind));
                          return (
                            <button
                              key={k.kind}
                              type="button"
                              onClick={() =>
                                onToggleLeaf(pillar.slug, k.kind, visibleKinds)
                              }
                              className={cn(
                                "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm transition-colors",
                                "hover:bg-accent",
                                checked && "bg-accent/60"
                              )}
                            >
                              <TriStateBox state={checked ? "checked" : "unchecked"} />
                              <span className="min-w-0 flex-1 truncate text-foreground/90">
                                {k.label}
                              </span>
                              <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                                {k.count}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      ) : null}
                    </div>
                  );
                })
              )}
            </div>
            {totalSelected > 0 && (
              <div className="flex justify-end border-t p-1.5">
                <button
                  type="button"
                  onClick={onClear}
                  className="rounded px-2 py-1 text-xs text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Clear
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TriStateBox({
  state,
}: {
  state: "checked" | "indeterminate" | "unchecked";
}) {
  return (
    <span
      className={cn(
        "flex h-4 w-4 shrink-0 items-center justify-center rounded border",
        state === "unchecked"
          ? "border-muted-foreground/40"
          : "border-primary bg-primary text-primary-foreground"
      )}
      aria-hidden
    >
      {state === "checked" && (
        <svg viewBox="0 0 16 16" className="h-3 w-3">
          <path
            fill="currentColor"
            d="M6.173 12.414L2.586 8.828l1.414-1.414 2.173 2.172 5.828-5.828 1.414 1.414z"
          />
        </svg>
      )}
      {state === "indeterminate" && (
        <span className="block h-0.5 w-2 rounded-sm bg-current" />
      )}
    </span>
  );
}

function RowSkeleton() {
  return (
    <div className="h-[112px] animate-pulse rounded-xl border bg-card">
      <div className="flex h-full items-center gap-4 px-4">
        <div className="h-6 w-10 rounded bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-1/3 rounded bg-muted" />
          <div className="h-4 w-2/3 rounded bg-muted" />
        </div>
        <div className="h-6 w-24 rounded bg-muted" />
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-xl border border-dashed bg-card px-6 py-16 text-center">
      <SearchX className="h-10 w-10 text-muted-foreground/70" aria-hidden />
      <div>
        <h3 className="text-base font-medium text-foreground">No evidence matches these filters</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Try removing a filter or widening your search.
        </p>
      </div>
      <Button variant="outline" size="sm" onClick={onClear}>
        Clear filters
      </Button>
    </div>
  );
}

function EvidenceRow({
  row,
  ensureFullEvidence,
  fullEvidenceLoading,
}: {
  row: EvidenceIndexRow;
  ensureFullEvidence: () => Promise<Map<string, EvidenceItem>>;
  fullEvidenceLoading: boolean;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const [full, setFull] = React.useState<EvidenceItem | null>(null);
  const [pending, setPending] = React.useState(false);

  const iso2 = iso3ToIso2[row.country.iso3];
  const flagUrl = iso2 ? `https://flagcdn.com/w40/${iso2.toLowerCase()}.png` : null;

  const dimensionName = DIMENSIONS.find((d) => d.slug === row.dimensionSlug)?.name ?? row.dimensionSlug;
  const pillarName = PILLARS.find((p) => p.slug === row.pillarSlug)?.name ?? row.pillarSlug;
  const approval = formatApprovalDate(row.approval);

  // Meta strip per kind.
  const metaBits: string[] = [];
  if (row.kind === "framework") {
    if (row.enforceability) metaBits.push(`Enforceability: ${row.enforceability}`);
    if (row.type) metaBits.push(`Type: ${row.type}`);
    if (approval) metaBits.push(`Adopted ${approval}`);
  } else if (row.kind === "initiative") {
    if (row.type) metaBits.push(`Type: ${row.type}`);
  } else {
    if (row.type) metaBits.push(`Type: ${row.type}`);
  }

  const onToggleExpand = async () => {
    if (expanded) {
      setExpanded(false);
      return;
    }
    if (!full) {
      setPending(true);
      try {
        const map = await ensureFullEvidence();
        setFull(map.get(row.id) ?? null);
      } finally {
        setPending(false);
      }
    }
    setExpanded(true);
  };

  return (
    <div className="group overflow-hidden rounded-xl border bg-card transition-all duration-200 hover:border-primary hover:shadow-md hover:shadow-primary/5">
      <div className="p-4 md:p-5">
       

        {/* Top row: country + meta, with View Evidence on the right */}
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
            <span className="flex shrink-0 items-center gap-2">
              {flagUrl ? (
                <Image
                  src={flagUrl}
                  alt=""
                  width={28}
                  height={20}
                  className="h-5 w-7 rounded object-cover ring-1 ring-black/5"
                  unoptimized
                />
              ) : (
                <span className="h-5 w-7 rounded bg-muted" aria-hidden />
              )}
              <span className="text-sm font-semibold text-foreground">{row.country.name}</span>
            </span>
            {metaBits.map((bit, i) => (
              <span key={i} className="inline-flex items-center gap-2">
                <span className="text-muted-foreground/40">·</span>
                <span>{bit}</span>
              </span>
            ))}
             {/* Pillar pill moved to the top of the card */}
        <div className="flex min-w-0 flex-wrap items-center gap-1.5">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="inline-flex max-w-full">
                  <TaxonomyPill
                    tone="pillar"
                    label={pillarName}
                    pillarSlug={row.pillarSlug as PillarSlug}
                  />
                </span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-balance">
                <span className="font-semibold">Pillar:</span> the high-level
                thematic area this evidence belongs to. Pillars are the top
                level of the GIRAI taxonomy, grouping related indicators and
                dimensions of responsible AI.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
          </div>
          {row.link ? (
            <a
              href={row.link}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <Eye className="h-3.5 w-3.5" aria-hidden /> View Evidence
            </a>
          ) : null}
        </div>

        {/* Title */}
        <div className="mt-2 text-base font-medium leading-snug text-foreground">
          <span className="line-clamp-2">{row.title}</span>
        </div>

        {/* Bottom row: taxonomy pills, with See More on the right */}
        <div className="mt-3 flex items-end justify-between gap-3">
          <div className="flex min-w-0 flex-wrap items-center gap-1.5">
            <TaxonomyPill tone="dimension" label={dimensionName} />
            <TaxonomyPill tone="indicator" label={row.indicatorName} />
          </div>
          <button
            type="button"
            onClick={onToggleExpand}
            disabled={pending || fullEvidenceLoading}
            aria-expanded={expanded}
            className={cn(
              "inline-flex shrink-0 items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium text-foreground transition-colors",
              "hover:border-primary/40 hover:bg-muted disabled:cursor-progress disabled:opacity-60"
            )}
          >
            {pending ? "Loading…" : expanded ? "See Less" : "See More"}
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")}
              aria-hidden
            />
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {expanded && full && (
          <motion.div
            key="expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t bg-muted/20"
          >
            <ExpandedDetails item={full} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * Soft colour-tinted pill used at the foot of each evidence card for the
 * dimension / indicator / pillar taxonomy, mirroring the Figma design.
 */
function TaxonomyPill({
  tone,
  label,
  pillarSlug,
}: {
  tone: "dimension" | "indicator" | "pillar";
  label: string;
  /** When `tone` is "pillar", colours the pill per the shared pillar palette. */
  pillarSlug?: PillarSlug;
}) {
  const toneClass: Record<typeof tone, string> = {
    dimension: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    indicator: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    pillar: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
  };
  const pillClass =
    tone === "pillar" && pillarSlug
      ? PILLAR_BADGES[pillarSlug].className
      : toneClass[tone];
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center truncate rounded-md px-2 py-1 text-xs font-medium",
        pillClass
      )}
      title={label}
    >
      {label}
    </span>
  );
}

function ExpandedDetails({ item }: { item: EvidenceItem }) {
  return (
    <div className="space-y-4 p-4 md:p-5">
      {item.justification && (
        <p className="text-sm leading-relaxed text-foreground">{item.justification}</p>
      )}

      {/* Framework-specific */}
      {item.kind === "framework" && (
        <>
          {item.thematicElements && item.thematicElements.length > 0 && (
            <div>
              <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Thematic coverage
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.thematicElements.map((te, i) => (
                  <ThematicChip key={i} text={te.text} value={te.value} />
                ))}
              </div>
            </div>
          )}
          <DetailGrid>
            {item.reach && <DetailItem label="Reach" value={item.reach} />}
            {item.scope && <DetailItem label="Scope" value={item.scope} />}
            {item.defenceAndSecurity && (
              <DetailItem
                label="Defence & Security"
                value={item.defenceAndSecurity.value}
              />
            )}
            {item.body?.name && <DetailItem label="Body" value={item.body.name} />}
          </DetailGrid>
        </>
      )}

      {/* Initiative-specific */}
      {item.kind === "initiative" && (
        <DetailGrid>
          {item.body?.name && <DetailItem label="Implementing body" value={item.body.name} />}
          {item.plan && <DetailItem label="Plan" value={item.plan} />}
          {item.budget && <DetailItem label="Budget" value={item.budget} />}
          {item.monitoring && <DetailItem label="Monitoring" value={item.monitoring} />}
        </DetailGrid>
      )}

      {/* CSO Initiative-specific */}
      {item.kind === "cso-initiative" && item.contributesTo && item.contributesTo.length > 0 && (
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Contributes to
          </div>
          <div className="flex flex-wrap gap-1.5">
            {item.contributesTo.map((slug) => (
              <span
                key={slug}
                className="inline-flex items-center rounded-full bg-secondary px-2 py-0.5 text-[11px] text-secondary-foreground"
              >
                {slug}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Links */}
      <div className="flex flex-wrap gap-2 pt-1">
        {item.link && (
          <a
            href={item.link}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden /> Open source
          </a>
        )}
        {item.drive && (
          <a
            href={item.drive}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-1.5 rounded-md border bg-background px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
          >
            <ExternalLink className="h-3.5 w-3.5" aria-hidden /> GIRAI mirror
          </a>
        )}
      
      </div>
    </div>
  );
}

function DetailGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">{children}</div>;
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-background/60 p-2.5">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-0.5 text-sm text-foreground">{value}</div>
    </div>
  );
}

function ThematicChip({ text, value }: { text: string; value: string }) {
  const v = value.trim().toLowerCase();
  const tone =
    v === "yes"
      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
      : v === "partially" || v === "partial"
        ? "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300"
        : v === "no"
          ? "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300"
          : "bg-muted text-muted-foreground";
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px]",
        tone
      )}
      title={text}
    >
      <span className="font-medium capitalize">{value}</span>
      <span className="truncate">{text}</span>
    </span>
  );
}

function Pagination({
  page,
  totalPages,
  totalItems,
  onChange,
}: {
  page: number;
  totalPages: number;
  totalItems: number;
  onChange: (page: number) => void;
}) {
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(totalItems, page * PAGE_SIZE);

  const pageNumbers = paginationWindow(page, totalPages);

  return (
    <div className="mt-6 flex flex-col items-center justify-between gap-4 md:flex-row">
      <div className="text-xs text-muted-foreground">
        Showing <span className="font-medium text-foreground">{from.toLocaleString()}</span>–
        <span className="font-medium text-foreground">{to.toLocaleString()}</span> of{" "}
        <span className="font-medium text-foreground">{totalItems.toLocaleString()}</span>
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          className="inline-flex h-8 items-center justify-center rounded-md border px-2 text-sm transition-colors hover:bg-muted disabled:opacity-40"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
        </button>
        {pageNumbers.map((n, i) =>
          n === "…" ? (
            <span key={`gap-${i}`} className="px-2 text-sm text-muted-foreground">
              …
            </span>
          ) : (
            <button
              key={n}
              type="button"
              onClick={() => onChange(n)}
              className={cn(
                "inline-flex h-8 min-w-8 items-center justify-center rounded-md px-2 text-sm transition-colors",
                n === page
                  ? "bg-primary text-primary-foreground"
                  : "border hover:bg-muted"
              )}
              aria-current={n === page ? "page" : undefined}
            >
              {n}
            </button>
          )
        )}
        <button
          type="button"
          onClick={() => onChange(page + 1)}
          disabled={page >= totalPages}
          className="inline-flex h-8 items-center justify-center rounded-md border px-2 text-sm transition-colors hover:bg-muted disabled:opacity-40"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}

/** Standard 1 … (n-1) n (n+1) … N window for pagination. */
function paginationWindow(page: number, total: number): (number | "…")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "…")[] = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(total - 1, page + 1);
  if (start > 2) pages.push("…");
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < total - 1) pages.push("…");
  pages.push(total);
  return pages;
}
