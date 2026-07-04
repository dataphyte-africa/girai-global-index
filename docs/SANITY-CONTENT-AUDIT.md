# Sanity CMS Content Audit

_Audit date: 2026-06-30. Scope agreed with stakeholder: **editorial copy only** — headings,
descriptions, labels, CTA text, intro/body paragraphs, modal copy. Layout, ordering, component
structure, and computed data values are explicitly **out of scope** (see "The data boundary" below)._

This document inventories which on-site copy is already editable in Sanity and which is still
hardcoded in the codebase, then proposes a prioritized backlog to close the gaps.

---

## 1. Current state (what's already in Sanity)

The site already follows a solid pattern (ADR 0004): each page fetches a singleton document from
Sanity and falls back to a hardcoded `*.defaults.ts` file if a field is empty. **11 singleton
documents** and **8 reusable object types** exist today.

| Area | Sanity document | Status |
|---|---|---|
| Global SEO / metadata | `siteSettings` | ✅ Editable |
| Header / nav / download CTA | `header` | ✅ Editable |
| Footer (subscribe, link groups, social) | `footer` | ✅ Editable |
| **Home** — hero, why-GIRAI, dimensions heading, report-download, takeaways heading, evidence, indicators heading, limits cards, impact cards, shaping lines | `homePage` | ✅ Editable |
| **About** — all 9 sections | `aboutPage` | ✅ Editable |
| **Methodology** — all 12 sections | `methodologyPage` | ✅ Editable |
| **Takeaways page** — hero, intro, key-insights | `takeawaysPage` | ✅ Editable |
| **Evidence page** — hero, pathway heading | `evidencePage` | ✅ Editable |
| **Indicators page** — hero, SEO | `indicatorsPage` | ✅ Editable |
| **Regions page** — hero, overview, compare headings, SEO | `regionsPage` | ✅ Editable |
| **Countries page** — hero, compare headings, takeaways heading, SEO | `countriesPage` | ✅ Editable |

So most of the long-form marketing copy on the static pages is already CMS-driven. The gaps are
concentrated in **shared section components**, **modals/flows**, and **data-adjacent editorial copy**
that lives in `src/lib/*` and `src/data/*` files.

---

## 2. The data boundary — recommendation

You asked for advice on where Sanity should stop and the data pipeline should own things. Clear
recommendation:

**Keep all computed/numeric data OUT of Sanity.** Country scores, rankings, indicator values,
evidence items, dimension/pillar aggregates, and regional averages flow from Google Sheets →
generated JSON (`src/data/2026/generated/*`, `public/data/2026/*`) → `@/lib/girai`. This pipeline is
regenerated every edition, is large and structured, and is the single source of truth. Editing those
numbers in Sanity would be error-prone, would fight the regeneration step, and gains nothing.

**Three tiers, to make the rule unambiguous:**

| Tier | Examples | Home |
|---|---|---|
| **Pure editorial copy** | Section headings, subtitles, body paragraphs, CTA labels, modal text, card titles/descriptions | **Sanity** |
| **Editorial copy keyed to a data entity** | Per-pillar descriptions, per-indicator "why it matters", per-dimension hero blurbs, takeaway narratives | **Sanity** (keyed documents) — see §4 |
| **Computed values & structured records** | Scores, ranks, counts, evidence rows, chart data points | **Data pipeline** (never Sanity) |

The grey zone is tier 2 — copy that today lives _inside_ data files (`indicator-copy.ts`,
`pillar-copy.ts`, `dimensions-data.ts`, `takeaways-data.ts`). It is genuinely editorial and in scope,
but it is keyed to data entities and some of it is entangled with chart configuration. Recommendation:
migrate the copy fields to keyed Sanity documents while leaving the numeric/chart-config fields in the
data files. Details and effort flags per case in §4.

---

## 3. Gaps — confirmed hardcoded copy NOT in Sanity

Each row below was verified by reading the component. "Appears on" notes where the copy surfaces.

### Priority 1 — explicitly flagged + high visibility

| # | Copy | File | Notes |
|---|---|---|---|
| 1 | **"Responsible AI Performance Across Countries"** heading + subtitle ("Switch between an interactive map and a full list…") | [country-performance-tabs.tsx:83](src/components/country-performance-tabs.tsx:83) | `ChoroplethMapSection` is rendered with **no content props** on both Home and Countries pages. Fully hardcoded. Appears on `/` and `/countries`. |
| 2 | **Data download modal** — title "Thank you for your interest in GIRAI", description, all field labels (Full Name, Email, Organization, Current role, Reason for download), placeholders, license sentence, Submit button, "First/Second Edition" toggle labels | [data-download-modal.tsx:135](src/components/data-download/data-download-modal.tsx:135) | Fully hardcoded. Modal opens from every Report-download CTA across the site. |
| 3 | **Download reason options** (the dropdown choices) | [config.ts](src/lib/data-download/config.ts) (`DOWNLOAD_REASONS`) | Hardcoded list. Editorial — candidate for Sanity array. |
| 4 | **Home comparison section** heading/subheading ("Compare responsible AI performance" / "Explore how countries and regions perform…") | [comparison-section.tsx](src/components/comparison-section.tsx) | On `/countries` and `/regions` this IS Sanity-driven (compare* fields). On **Home** the component gets no copy props → hardcoded fallback. Gap is Home only. |

### Priority 2 — data-adjacent editorial copy (tier 2)

| # | Copy | File | Notes |
|---|---|---|---|
| 5 | **Top 10 Takeaways** — title, summary, narrative bullets, "bright spot" callouts for all 10 | [takeaways-data.ts](src/components/takeaways/takeaways-data.ts) | Copy is hardcoded and **entangled with chart/visual config** in the same objects. Reused on Home carousel + `/takeaways`. Migrating copy means splitting copy fields from visual config. Higher effort. |
| 6 | **Pillar copy** — AI Policy / Civil Society Engagement / Enabling Conditions: heading, body, drivers description | [pillar-copy.ts](src/lib/pillar-copy.ts) | 3 entries. Reused on Home indicator section, About, and country-story pages. Clean to migrate (pure copy keyed by pillar). |
| 7 | **Per-indicator copy** — description, "why it matters", hero lead, intro paragraphs, background, relevance | [indicator-copy.ts](src/lib/indicator-copy.ts) | Keyed by indicator slug, ~many entries, some with linked paragraphs. Pure editorial but **high volume** — the biggest single migration. |
| 8 | **Per-dimension presentation copy** — name override, subtitle, description, hero lead, eyebrow, ranking subtitle | [dimensions-data.ts](src/data/dimensions-data.ts) | 5 dimensions. Copy mixed with radial-chart config; split copy out, keep chart config in the file. |
| 9 | **Evidence pathway cards** — 4 titles + descriptions (Government Frameworks, Government-led initiatives, CSO Engagement, Government Misuse of AI) | [pathway-config.ts](src/components/evidence-hub/pathway-config.ts) | Pure copy keyed by pathway. Clean to migrate. |

### Priority 3 — micro-copy / lower traffic

| # | Copy | File | Notes |
|---|---|---|---|
| 10 | **Report-download section** copy on `/countries` (and any page that calls `<ReportDownloadSection />` with no props) | [countries/page.tsx:68](src/app/countries/page.tsx:68) | Home passes Sanity content; Countries does not, so it shows hardcoded defaults. Inconsistent — worth aligning. |
| 11 | **Download flow pages** copy (`/download/[assetType]/[year]`, `/download/methodology`) and the download-citation launcher | `src/app/download/*`, [download-citation-launcher.tsx](src/components/data-download/download-citation-launcher.tsx) | Not yet audited in depth — flagged for review. |
| 12 | **Evidence explorer** UI labels, **geo/performance filter bar** labels, **ranking/heatmap table** column headers | `evidence-explorer.tsx`, `geo-filter-bar.tsx`, `ranking-data-table.tsx`, `country-heatmap-table.tsx` | Functional micro-copy. Usually fine to leave in code; migrate only if editors specifically ask. |

---

## 4. Proposed backlog (copy-only, respecting the data boundary)

Suggested order — quick wins and the explicitly-requested items first:

1. **Choropleth/performance section** (#1) — add `performanceHeadingLead`, `performanceHeadingAccent`,
   `performanceHeadingTail`, `performanceSubtitle` to `homePage` and `countriesPage`; thread through
   `ChoroplethMapSection` → `CountryPerformanceTabs`. _Small._
2. **Download modal + reasons** (#2, #3) — new `downloadModal` singleton (title, description, field
   labels, placeholders, license text, submit label, edition labels, reasons array). Thread into the
   modal. _Small–medium._
3. **Home comparison heading** (#4) + **align report-download on Countries** (#10) — pass existing
   Sanity fields through; add comparison fields to `homePage`. _Small._
4. **Pillar copy** (#6) and **evidence pathways** (#9) — new keyed object arrays / documents. _Medium, clean._
5. **Dimension copy** (#8) — split copy out of `dimensions-data.ts` into a keyed document. _Medium._
6. **Top 10 takeaways** (#5) — split copy from visual config; keyed `takeaway` document with an
   ordered array. _Larger._
7. **Per-indicator copy** (#7) — keyed `indicatorContent` documents. _Largest; do last or on demand._

Leave tier-3 micro-copy (#11 partial, #12) in code unless editors request it.

---

## 5. Build-phase decisions (resolved 2026-06-30)

1. **Skip the heavy lifts for now.** Top 10 takeaways (#5) and per-indicator copy (#7) are **deferred** —
   not part of this pass.
2. **One Sanity document per entity** for per-entity copy (pillars, dimensions, evidence pathways).
3. **Download flow pages (#11) are in scope.**

### In-scope work, ordered

- **P1 — ✅ DONE:** #1 choropleth/performance section heading, #2 download modal, #3 download reasons, #4 Home comparison heading
- **P2 — ✅ DONE:** #6 pillars, #8 dimensions, #9 evidence pathways — each as one document per entity
- **P3 — ✅ DONE:** #10 report-download copy (now shared across pages), #11 download flow pages

**Deferred:** #5 Top 10 takeaways, #7 per-indicator copy. **Left in code:** tier-3 micro-copy (#12).

### P1 implementation notes (2026-06-30)

- **New singleton `downloadModal`** ([schema](../sanity/schemas/singletons/downloadModal.ts),
  [defaults](../src/content/downloadModal.defaults.ts), [fetch](../src/content/downloadModal.ts)).
  Fetched in the root layout and passed `DataDownloadProvider → DataDownloadModal`. Covers title,
  description, every field label/placeholder, edition toggle labels, license text + link, submit
  labels, image alt, and the reason options. **Reason `value`s are locked** (read-only in Studio,
  never overridden at merge time) because the backend recognises only the fixed keys — editors edit
  the visible label only.
- **Performance section** (#1): new `performance*` fields on `homePage` + `countriesPage`; threaded
  `ChoroplethMapSection → CountryPerformanceTabs` via an optional `content` prop that defaults to the
  prior hardcoded copy.
- **Home compare heading** (#4): new `compare*` fields on `homePage`, passed into `ComparisonSection`
  (Countries/Regions already had this wired).
- Wired Sanity webhook revalidation (`downloadModal → ALL_PAGE_PATHS`) and the seed script
  (`buildDownloadModalDoc` + new page fields). Run `pnpm seed:sanity` to populate the new
  document/fields in the dataset.
- Verified: `tsc --noEmit` clean; changed files lint clean (one pre-existing
  `set-state-in-effect` warning in the modal is unrelated to this change).

### P2 implementation notes (2026-07-01)

**New pattern — fixed collections (one document per entity).** Three new document
types, each a *known* set seeded with stable ids and edited in place. They're added to
`singletonTypes` so Studio disables create/delete and hides them from the global "new
document" menu; a new **"Content Library"** group in the desk lists each member by fixed id.
Structural/derived data stays code-owned — only editorial text moved.

- **Pillars** (`pillar`) — [schema](../sanity/schemas/documents/pillar.ts),
  [fetch](../src/content/pillars.ts). Fields: heading, body, driversDescription (image path
  stays in code). Threaded via a `pillarCopy` prop into `IndicatorCategorySection` (Home +
  About) and `CountryPerformanceDrivers` (country story). Ids: `pillar-<slug>`.
- **Dimensions** (`dimensionCopy`) — [schema](../sanity/schemas/documents/dimensionCopy.ts),
  [fetch](../src/content/dimensions.ts). Fields: subtitle, description, eyebrow, heroLead,
  rankingSubtitle (name/indicators/imagery stay in code). `getDimensionsUi()` overlays copy
  onto the code `DIMENSIONS` array; threaded into `DimensionsSection` (Home) and the
  `/dimensions/[slug]` detail page. Dimension-page `generateMetadata` still uses code
  defaults (SEO copy was out of scope). Ids: `dimension-<slug>`.
- **Evidence pathways** (`evidencePathway`) —
  [schema](../sanity/schemas/documents/evidencePathway.ts), [fetch](../src/content/pathways.ts).
  Fields: title, tableTitle, description, itemNoun (kinds/family/theme stay in code). Threaded
  via `pathwayCopy` into `PathwayPicker` and `PathwayIndicatorTable` from the Evidence page.
  Ids: `pathway-<id>`.

- Each fetch merges Sanity over the existing code constant per-field, so any empty/missing
  field or document falls back safely. All three consumers are client components, so copy is
  fetched in the server parent and passed down as a prop (default = the code constant).
- Wired revalidation (`pillar`, `dimensionCopy`, `evidencePathway`) and the seed script
  (`buildPillarDocs` / `buildDimensionDocs` / `buildPathwayDocs`, stable ids matching the
  desk). Run `pnpm seed:sanity` to populate.
- **Not migrated (adjacent):** `EDITION_PATHWAYS` labels on the country-story edition toggle
  are a separate constant, left in code.
- Verified: `tsc --noEmit` clean; seed script compiles and its import graph loads under `tsx`;
  changed files add no new lint findings (3 pre-existing issues in `pathway-indicator-table.tsx`
  are unrelated).

### P3 implementation notes (2026-07-01)

- **Report-download section is now a shared singleton** (`reportDownload` —
  [schema](../sanity/schemas/singletons/reportDownload.ts),
  [fetch](../src/content/reportDownload.ts)). The section is reused on Home, Countries, Regions
  and Takeaways; previously only Home passed copy and the rest showed hardcoded defaults. Rather
  than duplicate the same fields across four page documents, the copy now lives in **one**
  document that all four pages fetch and pass in — edit once, applies everywhere.
  - The old `report*` fields were **removed from `homePage`** (schema, type, defaults, query,
    merge, seed) to avoid two sources of truth. `ReportDownloadSection` now takes a dedicated
    `ReportDownloadContent` type instead of `HomeContent`. (Re-seeding rewrites `homePage`
    without the stale fields.)
  - Not touched: `IndicatorReportDownloadSection` on `/indicators/[slug]` is a separate
    component — left as-is (tier-3, out of scope).
- **Download landing pages** (`/download/[assetType]/[year]`, `/download/methodology`) — their
  copy was folded into the existing **`downloadModal`** document under a "Download landing pages"
  group (all download copy in one place). The citation page heading/body use a `{asset}` token
  that the page substitutes with the resolved asset label; the methodology page uses plain
  heading/body fields.
- Wired revalidation (`reportDownload` → the four reuse pages; landing-page copy rides the
  existing `downloadModal` mapping) and seed builders (`buildReportDownloadDoc`, plus the new
  modal landing fields). Run `pnpm seed:sanity` to populate.
- Verified: `tsc --noEmit` clean; changed files lint clean; seed import graph loads under `tsx`.

---

## 6. Seeding

All P1–P3 copy has code defaults, so the site renders correctly **before** seeding (everything
falls back). To make the copy editable in Studio, run:

```
pnpm seed:sanity
```

This `createOrReplace`s every singleton and the fixed-collection documents (pillars, dimensions,
pathways) with the code defaults, then you edit and publish in `/studio`. Seeding is idempotent
and safe to re-run, but note it **overwrites** Studio edits with code defaults — seed once to
initialise, then edit in Studio (don't re-seed a document you've since edited by hand).
