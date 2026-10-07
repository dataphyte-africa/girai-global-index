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
 * Africa's binding share (10/31 = 32.26%, drafts included) and the LATAM
 * misuse roll-up. Where a current figure differs from a brief it is usually
 * because the evidence corpus has grown since publication — except binding
 * share, where the briefs themselves disagree on drafts (see bindingShare).
 */

import evidenceData from "@/data/2026/generated/evidence.json";
import nationalAiPolicyData from "@/data/2026/generated/national-ai-policies.json";
import {
  getAllCountries,
  getCountrySubregion,
  getEditionEvidenceStatusArtifact,
  getSubregionDisplayName,
} from "./data";
import { findIndicator } from "@/data/2026/taxonomy";
import type {
  CountryRanking,
  EvidenceArtifact,
  EvidenceItem,
  NationalAiPolicy,
  NationalAiPolicyArtifact,
} from "./types";

const evidence = evidenceData as unknown as EvidenceArtifact;
const nationalAiPolicies = (
  nationalAiPolicyData as unknown as NationalAiPolicyArtifact
).policies;

/**
 * A draft is a proposal, not a rule in force. The briefs' "coverage" counts
 * only frameworks that actually exist as instruments ("an active framework
 * exists in only about a fifth of cases"), so drafts are excluded from
 * coverage, implementation, and the headline binding share.
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

// The report's Global North / Global South is the dataset's developed /
// developing flag: 37 and 98 countries, reproducing its headline averages
// (55.2 vs 27.4) and the 35 / 95 split of countries with 2024 coverage.
const GLOBAL_NORTH = (c: CountryRanking) => c.developing === "Developed";

const REPORT_GROUPS: Record<string, ReportGroup> = {
  globalNorth: {
    label: "Global North",
    note: "Global North = the 37 countries the dataset classes as developed.",
    match: GLOBAL_NORTH,
  },
  globalSouth: {
    label: "Global South",
    note: "Global South = the 98 countries the dataset classes as developing.",
    match: (c) => !GLOBAL_NORTH(c),
  },
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
  globalnorth: "globalNorth",
  developed: "globalNorth",
  developedcountries: "globalNorth",
  globalsouth: "globalSouth",
  developing: "globalSouth",
  developingcountries: "globalSouth",
};

/** Global North and Global South, in that order, restricted to a scope. */
export function splitByDevelopment(scope: StatScope): StatScope[] {
  return (["globalNorth", "globalSouth"] as const).map((key) => ({
    label: REPORT_GROUPS[key].label,
    countries: scope.countries.filter(REPORT_GROUPS[key].match),
  }));
}

export interface StatScope {
  label: string;
  countries: CountryRanking[];
  /** Set when the grouping differs from a GIRAI region, so answers can say so. */
  note?: string;
}

const geoKey = (v: string) => v.toLowerCase().replace(/[^a-z0-9]/g, "");

/**
 * Resolve a scope for statistics: global, a report grouping (Asia, LATAM,
 * Global North, Global South), a GIRAI region, a subregion, a World Bank
 * income group, or a single country. Report groupings win over regions for
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

  // World Bank income groups; "low income" must not also catch "lower middle".
  const incomeGroup = all
    .map((c) => c.incomeGroup)
    .find(
      (g) => geoKey(g) === key || geoKey(g) === `${key}income`
    );
  if (incomeGroup) {
    return {
      label: incomeGroup,
      countries: all.filter((c) => c.incomeGroup === incomeGroup),
    };
  }

  const subregion = all
    .map(getCountrySubregion)
    .find((s) => geoKey(s) === key);
  if (subregion) {
    return {
      label: getSubregionDisplayName(subregion),
      countries: all.filter((c) => getCountrySubregion(c) === subregion),
    };
  }

  const country = all.find(
    (c) => geoKey(c.name) === key || c.iso3 === trimmed.toUpperCase()
  );
  if (country) return { label: country.name, countries: [country] };

  return undefined;
}

export type StatGrouping = "region" | "subregion" | "development";

/**
 * Partition a scope into regions, subregions, or Global North / South. Groups
 * keep the scope's own filter, so "Africa by subregion" never leaks Europe.
 */
export function groupScope(scope: StatScope, by: StatGrouping): StatScope[] {
  if (by === "development") {
    return splitByDevelopment(scope).filter((g) => g.countries.length > 0);
  }
  const groups = new Map<string, CountryRanking[]>();
  for (const c of scope.countries) {
    const key = by === "region" ? c.region : getCountrySubregion(c);
    groups.set(key, [...(groups.get(key) ?? []), c]);
  }
  return [...groups.entries()].map(([key, countries]) => ({
    label: by === "subregion" ? getSubregionDisplayName(key) : key,
    countries,
  }));
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
  /** Adopted framework cases — the headline figures exclude drafts. */
  frameworkCases: number;
  binding: number;
  nonBinding: number;
  bindingPct: number | null;
  nonBindingPct: number | null;
  /** Set when the headline rests on so few cases that a share misleads. */
  smallBaseNote?: string;
  /** Draft cases left out of the headline, and how many are coded Binding. */
  draftCases: number;
  draftsCodedBinding: number;
  /** The same share with drafts counted, as the Africa brief computed it. */
  includingDrafts: {
    frameworkCases: number;
    binding: number;
    bindingPct: number | null;
    nonBindingPct: number | null;
  };
}

const isBinding = (i: EvidenceItem) => i.enforceability === "Binding";
const SMALL_BASE = 10;

/**
 * Share of framework cases that are legally binding. Counted per
 * country-indicator case, not per unique document: one framework assessed
 * under five indicators counts five times, which is how the briefs count.
 *
 * The headline counts adopted frameworks only. A draft bill coded "Binding"
 * would bind if passed, but is not law — counted in, Panama's draft AI bill
 * alone made it LATAM's joint binding leader. The briefs split on this: the
 * LATAM brief excludes drafts (68% non-binding; Peru + El Salvador = 21 of 38
 * binding cases, 55% — both exact) and Asia's ~84% non-binding matches too,
 * while the Africa brief included them (37/170; Southern Africa's 10/31 is
 * exact only with drafts). `includingDrafts` keeps that second reading.
 */
export function bindingShare(scope: StatScope): BindingStat {
  const all = scopedEvidence(scope, "framework");
  const adopted = all.filter(isActiveFramework);
  const binding = adopted.filter(isBinding).length;
  const bindingWithDrafts = all.filter(isBinding).length;
  return {
    label: scope.label,
    frameworkCases: adopted.length,
    binding,
    nonBinding: adopted.length - binding,
    bindingPct: pct(binding, adopted.length),
    nonBindingPct: pct(adopted.length - binding, adopted.length),
    // Excluding drafts can leave a handful of cases (Southern Africa: 6 of
    // 31), and a percentage alone then reads as a firm lead. The flag is in
    // the data because a prompt rule to caveat it was not followed reliably.
    ...(adopted.length > 0 && adopted.length < SMALL_BASE
      ? {
          smallBaseNote: `Only ${adopted.length} adopted framework cases — say the share rests on few frameworks.`,
        }
      : {}),
    draftCases: all.length - adopted.length,
    draftsCodedBinding: bindingWithDrafts - binding,
    includingDrafts: {
      frameworkCases: all.length,
      binding: bindingWithDrafts,
      bindingPct: pct(bindingWithDrafts, all.length),
      nonBindingPct: pct(all.length - bindingWithDrafts, all.length),
    },
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
  const tally = new Map<
    string,
    { name: string; binding: number; total: number; draftBinding: number }
  >();
  for (const i of items) {
    const row = tally.get(i.country.iso3) ?? {
      name: i.country.name,
      binding: 0,
      total: 0,
      draftBinding: 0,
    };
    // Headline counts adopted frameworks only, as in bindingShare; binding
    // drafts are reported beside them so a pending bill stays visible.
    if (isActiveFramework(i)) {
      row.total += 1;
      if (isBinding(i)) row.binding += 1;
    } else if (isBinding(i)) {
      row.draftBinding += 1;
    }
    tally.set(i.country.iso3, row);
  }
  const totalBinding = items.filter(
    (i) => isActiveFramework(i) && isBinding(i)
  ).length;
  return {
    totalBindingCases: totalBinding,
    countries: [...tally.entries()]
      .filter(([, r]) => r.total > 0 || r.draftBinding > 0)
      .map(([iso3, r]) => ({
        iso3,
        name: r.name,
        binding: r.binding,
        frameworkCases: r.total,
        shareOfScopeBindingPct: pct(r.binding, totalBinding),
        draftsCodedBinding: r.draftBinding,
      }))
      .sort(
        (a, b) =>
          b.binding - a.binding || b.draftsCodedBinding - a.draftsCodedBinding
      ),
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
      subregion: getSubregionDisplayName(subregion),
      ...bindingShare({ label: subregion, countries }),
    }))
    .sort((a, b) => (b.bindingPct ?? -1) - (a.bindingPct ?? -1));
}

export function bindingByGroup(scope: StatScope, by: StatGrouping) {
  return groupScope(scope, by)
    .map(({ label, countries }) => ({
      group: label,
      ...bindingShare({ label, countries }),
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

// ---------------------------------------------------------------------------
// National AI Policy
//
// The dataset records one National AI Policy (or equivalent framework) status
// per country — Adopted, Draft or No framework. This is the only correct basis
// for "how many countries have a national AI policy": the framework evidence
// above counts every document assessed under any AI Policy indicator (data
// protection acts, the EU AI Act, sector guidelines), once per indicator.

const NAP_ADOPTED = "Adopted";
const NAP_DRAFT = "Draft";
const yes = (v: string | null) => v === "Yes";

function scopedPolicies(scope: StatScope): NationalAiPolicy[] {
  const iso = new Set(scope.countries.map((c) => c.iso3));
  return nationalAiPolicies.filter((p) => iso.has(p.country.iso3));
}

export function getNationalAiPolicy(iso3: string): NationalAiPolicy | undefined {
  return nationalAiPolicies.find((p) => p.country.iso3 === iso3);
}

function tallyBy<T>(items: T[], key: (item: T) => string) {
  const counts = new Map<string, number>();
  for (const item of items) {
    const k = key(item);
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}

const napYear = (p: NationalAiPolicy) => p.approval?.slice(0, 4) ?? "Unknown";

/** Compact per-country row — title, type, date and enforcement, no prose. */
export function napSummaryRow(p: NationalAiPolicy) {
  return {
    iso3: p.country.iso3,
    name: p.country.name,
    status: p.status,
    title: p.title,
    type: p.type,
    approval: p.approval,
    enforceability: p.enforceability,
    link: p.link,
  };
}

/**
 * Adoption counts for a scope, plus what the adopted policies contain.
 * Shares are over the scope's countries. The quality breakdown (plan, budget,
 * monitoring, body, consultation) is over adopted policies only, because the
 * dataset codes drafts as n/a on those fields.
 */
export function nationalAiPolicyStats(scope: StatScope) {
  const policies = scopedPolicies(scope);
  const adopted = policies.filter((p) => p.status === NAP_ADOPTED);
  const draft = policies.filter((p) => p.status === NAP_DRAFT);
  const none = policies.filter(
    (p) => p.status !== NAP_ADOPTED && p.status !== NAP_DRAFT
  );
  const n = scope.countries.length;
  // Participation provisions are recorded as gmc-provision evidence, one row
  // per provision, against the country's national AI policy.
  const withProvision = new Set(
    evidence.items
      .filter((i) => i.kind === "gmc-provision")
      .map((i) => i.country.iso3)
  );
  const names = (ps: NationalAiPolicy[]) =>
    ps.map((p) => p.country.name).sort((a, b) => a.localeCompare(b));

  return {
    label: scope.label,
    countryCount: n,
    adopted: adopted.length,
    adoptedPct: pct(adopted.length, n),
    draft: draft.length,
    draftPct: pct(draft.length, n),
    noPolicy: none.length,
    noPolicyPct: pct(none.length, n),
    adoptedByType: tallyBy(adopted, (p) => p.type ?? "Unspecified"),
    adoptedBinding: adopted.filter((p) => p.enforceability === "Binding").length,
    adoptedNonBinding: adopted.filter((p) => p.enforceability !== "Binding").length,
    // Binding is not the same as "is a law": a binding policy can be a decree.
    adoptedBindingByType: tallyBy(
      adopted.filter((p) => p.enforceability === "Binding"),
      (p) => p.type ?? "Unspecified"
    ),
    adoptedByYear: tallyBy(adopted, napYear).sort((a, b) =>
      a.value.localeCompare(b.value)
    ),
    adoptedContents: {
      withImplementationBody: adopted.filter((p) => yes(p.body?.exists ?? null)).length,
      withImplementationPlan: adopted.filter((p) => yes(p.plan)).length,
      withBudget: adopted.filter((p) => yes(p.budget)).length,
      withMonitoring: adopted.filter((p) => yes(p.monitoring)).length,
      withPlanBudgetAndMonitoring: adopted.filter(
        (p) => yes(p.plan) && yes(p.budget) && yes(p.monitoring)
      ).length,
      withStakeholderConsultation: adopted.filter((p) => yes(p.csoConsultation)).length,
      withCsoParticipationProvision: adopted.filter((p) =>
        withProvision.has(p.country.iso3)
      ).length,
      withDefenceSecurityExemption: adopted.filter(
        (p) => p.defenceAndSecurity?.value?.startsWith("Yes") ?? false
      ).length,
    },
    // Complete name lists — never a capped sample, so a "which countries"
    // answer can be read straight off them.
    adoptedCountries: names(adopted),
    draftPolicies: draft
      .map(napSummaryRow)
      .sort((a, b) => a.name.localeCompare(b.name)),
    countriesWithoutPolicy: names(none),
  };
}

/** Adoption rate per region, subregion, or Global North / South, highest first. */
export function nationalAiPolicyByGroup(scope: StatScope, by: StatGrouping) {
  return groupScope(scope, by)
    .map(({ label, countries }) => {
      const s = nationalAiPolicyStats({ label, countries });
      return {
        group: label,
        countryCount: s.countryCount,
        adopted: s.adopted,
        adoptedPct: s.adoptedPct,
        draft: s.draft,
        noPolicy: s.noPolicy,
        adoptedBinding: s.adoptedBinding,
      };
    })
    .sort(
      (a, b) =>
        (b.adoptedPct ?? -1) - (a.adoptedPct ?? -1) || b.adopted - a.adopted
    );
}

/** Every policy in scope, most recently adopted first. */
export function nationalAiPolicyList(scope: StatScope) {
  return scopedPolicies(scope)
    .filter((p) => p.status === NAP_ADOPTED || p.status === NAP_DRAFT)
    .map(napSummaryRow)
    .sort((a, b) => (b.approval ?? "").localeCompare(a.approval ?? ""));
}

// ---------------------------------------------------------------------------
// Edition change (2024 → 2026)
//
// Evidence status per country × indicator in both editions, over the 14
// indicators the two editions share. Scores are not comparable across editions
// (the methodology changed); evidence status is. Only countries assessed in
// both editions count — 130 of 135 — so every result says who was left out.
// Reproduces the report's edition findings: Global North 8.2 → 11.1 and Global
// South 2.5 → 4.7 indicators with an active framework; 76 non-binding →
// binding upgrades (North 67, South 9); Safety & Security 37 had + 30 new.

const BINDING = "Binding Framework";
const NON_BINDING = "Non-Binding Framework";
const isActive = (v: string | null | undefined) =>
  v === BINDING || v === NON_BINDING;
const isYes = (v: string | null | undefined) => v === "Yes";

function editionPanel(scope: StatScope) {
  const artifact = getEditionEvidenceStatusArtifact();
  const compared = scope.countries.filter(
    (c) => artifact.countries[c.iso3]?.has2024Coverage
  );
  return {
    artifact,
    compared,
    excluded: scope.countries
      .filter((c) => !artifact.countries[c.iso3]?.has2024Coverage)
      .map((c) => c.name),
  };
}

const round = (v: number | null, dp = 2) =>
  v === null ? null : Math.round(v * 10 ** dp) / 10 ** dp;
const growthPct = (from: number, to: number) =>
  from === 0 ? null : round((100 * (to - from)) / from, 1);

/**
 * Country × indicator transitions between editions for one scope, optionally
 * narrowed to one indicator.
 */
function editionTallies(countries: CountryRanking[], indicatorSlug?: string) {
  const artifact = getEditionEvidenceStatusArtifact();
  const slugs = indicatorSlug
    ? [indicatorSlug]
    : artifact.indicators.map((i) => i.slug);
  const t = {
    active2024: 0,
    active2026: 0,
    binding2024: 0,
    binding2026: 0,
    newFrameworks: 0,
    lostFrameworks: 0,
    upgradedToBinding: 0,
    newBinding: 0,
    initiatives2024: 0,
    initiatives2026: 0,
    cso2024: 0,
    cso2026: 0,
  };
  for (const c of countries) {
    const entry = artifact.countries[c.iso3];
    if (!entry?.has2024Coverage) continue;
    for (const slug of slugs) {
      const f24 = entry["2024"].frameworks[slug];
      const f26 = entry["2026"].frameworks[slug];
      if (isActive(f24)) t.active2024 += 1;
      if (isActive(f26)) t.active2026 += 1;
      if (f24 === BINDING) t.binding2024 += 1;
      if (f26 === BINDING) t.binding2026 += 1;
      if (!isActive(f24) && isActive(f26)) t.newFrameworks += 1;
      if (isActive(f24) && !isActive(f26)) t.lostFrameworks += 1;
      // "Enforceability gains" in the report: an existing soft-law case
      // hardening into binding law, not a binding law appearing from nothing.
      if (f24 === NON_BINDING && f26 === BINDING) t.upgradedToBinding += 1;
      if (!isActive(f24) && f26 === BINDING) t.newBinding += 1;
      if (isYes(entry["2024"].initiatives[slug])) t.initiatives2024 += 1;
      if (isYes(entry["2026"].initiatives[slug])) t.initiatives2026 += 1;
      if (isYes(entry["2024"].cso[slug])) t.cso2024 += 1;
      if (isYes(entry["2026"].cso[slug])) t.cso2026 += 1;
    }
  }
  return t;
}

function editionBase(scope: StatScope) {
  const { artifact, compared, excluded } = editionPanel(scope);
  return {
    compared,
    base: {
      label: scope.label,
      comparedCountries: compared.length,
      excludedNo2024Coverage: excluded,
      comparableIndicatorCount: artifact.indicators.length,
    },
  };
}

/**
 * Edition change for one indicator: how many countries had a framework in
 * 2024, gained one by 2026, or still have none.
 */
export function editionChangeForIndicator(
  scope: StatScope,
  indicatorSlug: string
) {
  const { compared, base } = editionBase(scope);
  const n = compared.length;
  const t = editionTallies(compared, indicatorSlug);
  const ind = getEditionEvidenceStatusArtifact().indicators.find(
    (i) => i.slug === indicatorSlug
  );
  return {
      ...base,
      indicatorSlug,
      indicatorName: ind?.name ?? indicatorSlug,
      // One case per country here, so case counts are country counts.
      countriesWithFramework2024: t.active2024,
      countriesWithFramework2026: t.active2026,
      countriesNewSince2024: t.newFrameworks,
      countriesLostSince2024: t.lostFrameworks,
      countriesStillWithout: n - t.active2026,
      frameworkGrowthPct: growthPct(t.active2024, t.active2026),
      countriesBinding2024: t.binding2024,
      countriesBinding2026: t.binding2026,
      countriesUpgradedToBinding: t.upgradedToBinding,
      countriesWithInitiative2024: t.initiatives2024,
      countriesWithInitiative2026: t.initiatives2026,
      countriesWithCsoActivity2024: t.cso2024,
      countriesWithCsoActivity2026: t.cso2026,
  };
}

/**
 * Edition change across all 14 comparable indicators: the average number with
 * an active (adopted) framework per country, plus case-level binding and
 * pathway counts.
 */
export function editionChange(scope: StatScope) {
  const { compared, base } = editionBase(scope);
  const n = compared.length;
  const t = editionTallies(compared);
  const nonBindingShare = (active: number, binding: number) =>
    round(pct(active - binding, active), 1);
  const avg = (v: number) => (n ? round(v / n) : null);
  return {
    ...base,
    avgIndicatorsWithFramework2024: avg(t.active2024),
    avgIndicatorsWithFramework2026: avg(t.active2026),
    avgIndicatorsGrowthPct: growthPct(t.active2024, t.active2026),
    avgBindingIndicators2024: avg(t.binding2024),
    avgBindingIndicators2026: avg(t.binding2026),
    frameworkCases2024: t.active2024,
    frameworkCases2026: t.active2026,
    newFrameworkCases: t.newFrameworks,
    lostFrameworkCases: t.lostFrameworks,
    nonBindingSharePct2024: nonBindingShare(t.active2024, t.binding2024),
    nonBindingSharePct2026: nonBindingShare(t.active2026, t.binding2026),
    upgradedToBindingCases: t.upgradedToBinding,
    newBindingCases: t.newBinding,
    initiativeCases2024: t.initiatives2024,
    initiativeCases2026: t.initiatives2026,
    csoActivityCases2024: t.cso2024,
    csoActivityCases2026: t.cso2026,
  };
}

/** Edition change per comparable indicator, largest framework gain first. */
export function editionChangeByIndicator(scope: StatScope) {
  return getEditionEvidenceStatusArtifact()
    .indicators.map((ind) => {
      const r = editionChangeForIndicator(scope, ind.slug);
      return {
        indicatorSlug: ind.slug,
        indicatorName: ind.name,
        countriesWithFramework2024: r.countriesWithFramework2024,
        countriesWithFramework2026: r.countriesWithFramework2026,
        countriesNewSince2024: r.countriesNewSince2024,
        frameworkGrowthPct: r.frameworkGrowthPct,
        countriesUpgradedToBinding: r.countriesUpgradedToBinding,
      };
    })
    .sort(
      (a, b) =>
        (b.countriesNewSince2024 ?? 0) - (a.countriesNewSince2024 ?? 0)
    );
}

/** Edition change per region, subregion, or Global North / South. */
export function editionChangeByGroup(
  scope: StatScope,
  by: StatGrouping,
  indicatorSlug?: string
) {
  return groupScope(scope, by).map((g) =>
    indicatorSlug
      ? editionChangeForIndicator(g, indicatorSlug)
      : editionChange(g)
  );
}

/** Countries with the largest gain in indicators covered by a framework. */
export function editionChangeByCountry(scope: StatScope) {
  const { artifact, compared } = editionPanel(scope);
  return compared
    .map((c) => {
      const entry = artifact.countries[c.iso3];
      const count = (edition: "2024" | "2026") =>
        Object.values(entry[edition].frameworks).filter(isActive).length;
      const bindingCount = (edition: "2024" | "2026") =>
        Object.values(entry[edition].frameworks).filter((v) => v === BINDING)
          .length;
      return {
        iso3: c.iso3,
        name: c.name,
        indicatorsWithFramework2024: count("2024"),
        indicatorsWithFramework2026: count("2026"),
        gain: count("2026") - count("2024"),
        bindingIndicators2024: bindingCount("2024"),
        bindingIndicators2026: bindingCount("2026"),
      };
    })
    .sort((a, b) => b.gain - a.gain || a.name.localeCompare(b.name));
}
