/**
 * Evidence-derived statistics: binding rates, framework coverage,
 * implementation follow-through, CSO activity and documented AI misuse.
 *
 * These are the figures the published regional briefs are built on, and they
 * are NOT in `rankings.json` — the build step aggregates scores, not the
 * evidence corpus. Without them the assistant could not answer "what share of
 * Africa's frameworks are legally binding?" or "which indicator has the
 * strongest implementation?" and would either refuse or improvise a number.
 *
 * Every definition below was reverse-engineered from the briefs and validated
 * against their published figures (see docs/AI-ASSISTANT-V2-BENCHMARK-REPORT).
 * Exact reproductions include Africa's framework coverage (136/663 = 20.51%),
 * AI Literacy in Africa (35.90% coverage, 85.71% implementation), Southern
 * Africa's binding share (10/31 = 32.26%) and the LATAM misuse roll-up.
 * Where a current figure differs from a brief it is because the evidence
 * corpus has grown since publication, not because the method differs.
 */

import evidenceData from "@/data/2026/generated/evidence.json";
import { getAllCountries, getCountrySubregion } from "./data";
import { findIndicator } from "@/data/2026/taxonomy";
import type { CountryRanking, EvidenceArtifact, EvidenceItem } from "./types";

const evidence = evidenceData as unknown as EvidenceArtifact;

/**
 * A draft is a proposal, not a rule in force. The briefs' "coverage" counts
 * only frameworks that actually exist as instruments ("an active framework
 * exists in only about a fifth of cases"), so drafts are excluded from
 * coverage and implementation while still counting toward binding share.
 */
const DRAFT_TYPE = "Draft framework";
const isActiveFramework = (item: EvidenceItem) => item.type !== DRAFT_TYPE;

let frameworkIndicatorCache: string[] | null = null;

/**
 * The indicators that frameworks are actually assessed against — 17 of the 38.
 * Coverage is measured against this denominator, not the full taxonomy, or
 * every rate would be understated by more than half.
 */
export function getFrameworkIndicators(): string[] {
  if (frameworkIndicatorCache) return frameworkIndicatorCache;
  const slugs = new Set<string>();
  for (const item of evidence.items) {
    if (item.kind === "framework") slugs.add(item.indicatorSlug);
  }
  frameworkIndicatorCache = [...slugs].sort();
  return frameworkIndicatorCache;
}

// ---------------------------------------------------------------------------
// Scope
//
// The briefs group countries differently from the GIRAI regions: their "Asia"
// is the Asia and Oceania region minus Oceania plus the Middle East (38
// countries), and "LATAM" spans two regions (22). Both reproduce the briefs'
// own country counts and Asia's 31.79 average exactly. These groupings are
// exposed only here — `resolveRegion` still means the GIRAI region, so score
// and rank answers are unaffected.

interface ReportGroup {
  label: string;
  note: string;
  match: (c: CountryRanking) => boolean;
}

const REPORT_GROUPS: Record<string, ReportGroup> = {
  asia: {
    label: "Asia (report grouping)",
    note: "The Asia brief covers 38 countries: the Asia and Oceania region excluding Oceania (Australia, New Zealand), plus the Middle East.",
    match: (c) =>
      (c.region === "Asia and Oceania" &&
        getCountrySubregion(c) !== "Oceania (Pacific)") ||
      c.region === "Middle East",
  },
  latam: {
    label: "Latin America and the Caribbean (report grouping)",
    note: "The LATAM brief covers 22 countries: the South and Central America region (14) plus the Caribbean region (8).",
    match: (c) =>
      c.region === "South and Central America" || c.region === "Caribbean",
  },
};

const REPORT_GROUP_ALIASES: Record<string, keyof typeof REPORT_GROUPS> = {
  asia: "asia",
  asian: "asia",
  asiabrief: "asia",
  latam: "latam",
  latinamerica: "latam",
  latinamericaandthecaribbean: "latam",
  lac: "latam",
};

export interface StatScope {
  label: string;
  countries: CountryRanking[];
  /** Set when the grouping differs from a GIRAI region, so answers can say so. */
  note?: string;
}

const geoKey = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Resolve a scope for statistics: global, a report grouping, a GIRAI region,
 * a subregion, or a single country. Report groupings win over regions for
 * "Asia" and "LATAM" because a user asking for those statistics is asking the
 * brief's question — the returned `note` always states which grouping was used.
 */
export function resolveStatScope(query?: string): StatScope | undefined {
  const all = getAllCountries();
  const trimmed = (query ?? "").trim();
  if (!trimmed || geoKey(trimmed) === "global" || geoKey(trimmed) === "world") {
    return { label: "Global", countries: all };
  }

  const key = geoKey(trimmed);

  const groupKey = REPORT_GROUP_ALIASES[key];
  if (groupKey) {
    const group = REPORT_GROUPS[groupKey];
    return {
      label: group.label,
      countries: all.filter(group.match),
      note: group.note,
    };
  }

  const region = all.find((c) => geoKey(c.region) === key)?.region;
  if (region) {
    return { label: region, countries: all.filter((c) => c.region === region) };
  }

  const subregion = all
    .map(getCountrySubregion)
    .find((s) => geoKey(s) === key);
  if (subregion) {
    return {
      label: subregion,
      countries: all.filter((c) => getCountrySubregion(c) === subregion),
    };
  }

  const country = all.find(
    (c) => geoKey(c.name) === key || c.iso3 === trimmed.toUpperCase()
  );
  if (country) return { label: country.name, countries: [country] };

  return undefined;
}

// ---------------------------------------------------------------------------
// Metrics

const pct = (n: number, d: number) => (d === 0 ? null : (100 * n) / d);

function scopedEvidence(scope: StatScope, kind: EvidenceItem["kind"]) {
  const iso = new Set(scope.countries.map((c) => c.iso3));
  return evidence.items.filter(
    (i) => i.kind === kind && iso.has(i.country.iso3)
  );
}

export interface BindingStat {
  label: string;
  frameworkCases: number;
  binding: number;
  nonBinding: number;
  bindingPct: number | null;
  nonBindingPct: number | null;
}

/**
 * Share of framework cases that are legally binding. Counted per
 * country-indicator case, not per unique document: one framework assessed
 * under five indicators counts five times, which is how the briefs count.
 */
export function bindingShare(scope: StatScope): BindingStat {
  const items = scopedEvidence(scope, "framework");
  const binding = items.filter((i) => i.enforceability === "Binding").length;
  return {
    label: scope.label,
    frameworkCases: items.length,
    binding,
    nonBinding: items.length - binding,
    bindingPct: pct(binding, items.length),
    nonBindingPct: pct(items.length - binding, items.length),
  };
}

export interface CoverageStat {
  label: string;
  /** Countries holding at least one active framework for the indicator. */
  countriesWithFramework: number;
  countryCount: number;
  coveragePct: number | null;
  /** Of the covered countries, those that also show delivery evidence. */
  countriesImplementing: number;
  implementationPct: number | null;
}

/**
 * Coverage and implementation for one indicator within a scope.
 *
 * Coverage — what share of the scope's countries have an active framework.
 * Implementation — of those, how many also have a documented initiative.
 * Implementation is deliberately conditional on coverage: it measures
 * follow-through on existing policy, so a country with no framework is
 * outside the denominator rather than a zero.
 */
export function indicatorCoverage(
  scope: StatScope,
  indicatorSlug: string
): CoverageStat {
  const iso = new Set(scope.countries.map((c) => c.iso3));
  const withFramework = new Set(
    evidence.items
      .filter(
        (i) =>
          i.kind === "framework" &&
          i.indicatorSlug === indicatorSlug &&
          isActiveFramework(i) &&
          iso.has(i.country.iso3)
      )
      .map((i) => i.country.iso3)
  );
  const withInitiative = new Set(
    evidence.items
      .filter(
        (i) =>
          i.kind === "initiative" &&
          i.indicatorSlug === indicatorSlug &&
          iso.has(i.country.iso3)
      )
      .map((i) => i.country.iso3)
  );
  const implementing = [...withFramework].filter((c) =>
    withInitiative.has(c)
  ).length;

  return {
    label: scope.label,
    countriesWithFramework: withFramework.size,
    countryCount: scope.countries.length,
    coveragePct: pct(withFramework.size, scope.countries.length),
    countriesImplementing: implementing,
    implementationPct: pct(implementing, withFramework.size),
  };
}

/**
 * Overall framework coverage: distinct country-indicator pairs holding an
 * active framework, over every pair that could exist. Reproduces the briefs'
 * headline coverage rate (Africa: 136 of 663 = 20.51%).
 */
export function overallCoverage(scope: StatScope) {
  const indicators = getFrameworkIndicators();
  const iso = new Set(scope.countries.map((c) => c.iso3));
  const pairs = new Set(
    evidence.items
      .filter(
        (i) =>
          i.kind === "framework" &&
          isActiveFramework(i) &&
          iso.has(i.country.iso3)
      )
      .map((i) => `${i.country.iso3}|${i.indicatorSlug}`)
  );
  const possible = scope.countries.length * indicators.length;
  return {
    label: scope.label,
    pairsWithFramework: pairs.size,
    possiblePairs: possible,
    countryCount: scope.countries.length,
    frameworkIndicatorCount: indicators.length,
    coveragePct: pct(pairs.size, possible),
  };
}

export function csoActivity(scope: StatScope) {
  const items = scopedEvidence(scope, "cso-initiative");
  const countries = new Set(items.map((i) => i.country.iso3));
  return {
    label: scope.label,
    activities: items.length,
    countryCount: scope.countries.length,
    countriesWithActivity: countries.size,
    perCountry: scope.countries.length
      ? items.length / scope.countries.length
      : null,
  };
}

export function governmentMisuse(scope: StatScope) {
  const items = scopedEvidence(scope, "government-misuse");
  const countries = new Map<string, string>();
  const types = new Map<string, number>();
  for (const i of items) {
    countries.set(i.country.iso3, i.country.name);
    const t = i.type ?? "Unspecified";
    types.set(t, (types.get(t) ?? 0) + 1);
  }
  return {
    label: scope.label,
    cases: items.length,
    countriesAffected: countries.size,
    countries: [...countries.entries()]
      .map(([iso3, name]) => ({ iso3, name }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    byType: [...types.entries()]
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count),
  };
}

// ---------------------------------------------------------------------------
// Group-by helpers — "which indicator/country/subregion leads on X"

export function bindingByCountry(scope: StatScope) {
  const items = scopedEvidence(scope, "framework");
  const tally = new Map<string, { name: string; binding: number; total: number }>();
  for (const i of items) {
    const row = tally.get(i.country.iso3) ?? {
      name: i.country.name,
      binding: 0,
      total: 0,
    };
    row.total += 1;
    if (i.enforceability === "Binding") row.binding += 1;
    tally.set(i.country.iso3, row);
  }
  const totalBinding = items.filter(
    (i) => i.enforceability === "Binding"
  ).length;
  return {
    totalBindingCases: totalBinding,
    countries: [...tally.entries()]
      .map(([iso3, r]) => ({
        iso3,
        name: r.name,
        binding: r.binding,
        frameworkCases: r.total,
        shareOfScopeBindingPct: pct(r.binding, totalBinding),
      }))
      .sort((a, b) => b.binding - a.binding),
  };
}

export function bindingBySubregion(scope: StatScope) {
  const byName = new Map<string, CountryRanking[]>();
  for (const c of scope.countries) {
    const s = getCountrySubregion(c);
    byName.set(s, [...(byName.get(s) ?? []), c]);
  }
  return [...byName.entries()]
    .map(([subregion, countries]) => ({
      subregion,
      ...bindingShare({ label: subregion, countries }),
    }))
    .sort((a, b) => (b.bindingPct ?? -1) - (a.bindingPct ?? -1));
}

export function coverageByIndicator(scope: StatScope) {
  return getFrameworkIndicators()
    .map((slug) => {
      const def = findIndicator(slug);
      return {
        indicatorSlug: slug,
        indicatorName: def?.name ?? slug,
        ...indicatorCoverage(scope, slug),
      };
    })
    .sort((a, b) => (b.coveragePct ?? -1) - (a.coveragePct ?? -1));
}
