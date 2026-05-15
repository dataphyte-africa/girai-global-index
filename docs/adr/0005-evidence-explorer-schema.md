# ADR 0005 — Evidence Explorer item schema and filter model

- **Status**: Accepted
- **Date**: 2026-05-15

## Context

The Evidence Explorer (`/evidence` page and the embedded variant on the
country page) renders one card per individual evidence item, sourced
from across all five GIRAI evidence sheets. The filter set must work
against a heterogeneous mix of item kinds without leaking shape
differences into the UI.

## Decision

### Item shape

A single discriminated-union record drives every card:

```ts
type EvidenceKind =
  | "framework"
  | "initiative"
  | "cso-initiative"
  | "gmc-consultation"
  | "gmc-provision"
  | "gmc-mechanism"
  | "government-misuse"; // formerly "urai"

type EvidenceItem = {
  id: string;
  kind: EvidenceKind;
  country: { iso3: string; name: string; region: string; subregion: string;
             developing: "Developed" | "Developing"; incomeGroup: string };
  dimensionSlug: string;
  pillarSlug: "ai-policy" | "cso-engagement" | "enabling-conditions";
  indicatorSlug: string;
  contributesTo?: string[]; // CSO initiatives only

  title: string;
  link?: string;
  drive?: string;
  type?: string;            // raw type string from source
  justification: string;

  // framework-only:
  enforceability?: "Binding" | "Non-Binding";
  reach?: string;
  scope?: string;
  approval?: string;        // ISO date if parseable, else raw
  defenceAndSecurity?: { value: "Yes" | "No"; justification: string };
  consultation?: "Yes" | "No";
  body?: { exists: "Yes" | "No"; name?: string };
  plan?: "Yes" | "No";
  budget?: "Yes" | "No";
  monitoring?: "Yes" | "No";
  thematicElements?: {
    text: string; value: "Yes" | "Partially" | "No"; justification: string;
  }[];
};
```

`id` is built deterministically from `interview_key` + kind + slot index
so reruns produce stable IDs.

### Friendly labels for the URAI kind

The Explorer surfaces the `government-misuse` kind under the label
**"Government Misuse"**. The data-dictionary term URAI is reserved for
the score side of the model.

### Filter model

1. **Search** — full-text over `title`, `country.name`, `justification`,
   indicator display name.
2. **Region** — multi-select over `country.region`.
3. **Country** — multi-select over `country.iso3`.
4. **Dimension** — multi-select over `dimensionSlug`.
5. **Pillar** — multi-select over `pillarSlug` (the GIRAI pillar:
   AI Policy / CSO Engagement / Enabling Conditions).
6. **Indicator** — multi-select over `indicatorSlug`.
7. **Evidence kind** — multi-select over `kind`, with friendly labels:
   Framework · Initiative · CSO Initiative · Government Mechanism · Government Misuse.
8. **Evidence type** — multi-select over `type` (Law / Policy / Strategy /
   Guideline / Capacity building / …); the available values depend on the
   selected kind(s).

### Stats counters

The card payload is rich enough that any 4 counters the UI wants can be
derived client-side from the currently filtered set without a second
fetch. The build does not pre-aggregate stats; it just emits items.

Examples of counters the data supports:
- Total items
- Distinct countries / regions / income groups
- Per-kind counts
- Per-pillar / per-dimension counts
- Distinct indicators covered
- For frameworks specifically: % binding, % with implementation plan,
  % with allocated budget, % with monitoring

The exact 4 surfaced in the UI will be picked during UI development,
informed by the active Pillar / kind filter.

## Consequences

- One file (`evidence.json`) drives both the global Explorer and the
  embedded country-page variant; the embedded variant is just the
  global one with `country.iso3` pre-filtered.
- New filter facets can be added without changing the artifact — the
  data is already there.
- Renaming or relabelling kinds is a UI string change, not a data
  migration.
