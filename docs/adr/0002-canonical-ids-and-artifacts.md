# ADR 0002 — Canonical slugs and generated artifact layout

- **Status**: Accepted
- **Date**: 2026-05-15

## Context

The 2026 spreadsheets use long human-readable strings as the join keys for
dimensions, pillars and indicators ("Civil Society Engagement in Trust and
Safety", "AI-facilitated Misinformation and Violence"). These strings have
already drifted between editions and are sloppy in casing and punctuation.
We need stable, URL-safe identifiers and a single generated catalogue we
can rely on across pages.

We also need to decide the shape of the build artifacts that the app
consumes — both for performance (don't ship evidence to pages that don't
use it) and for ergonomics (typed imports for "front of house" data, lazy
fetch for the Explorer).

## Decision

### Canonical slugs

Kebab-case, derived from the 2026 names but committed by hand once.

- 5 dimension slugs: `inclusion-diversity`, `ethics-sustainability`,
  `labour-skills`, `trust-safety`, `ai-use-public-service`.
- 3 pillar slugs: `ai-policy`, `cso-engagement`, `enabling-conditions`.
- ~39 indicator slugs, e.g. `ai-literacy`, `gender-equality`,
  `fairness-non-discrimination`,
  `civil-society-engagement-trust-safety`,
  `government-mechanisms-cso-inclusion`,
  `unacceptable-risks-ai-systems`.

### Taxonomy file

`src/data/2026/generated/taxonomy.json` — produced by the build, containing
every dimension, pillar and indicator with its canonical name, family
(`ai-policy` | `cse` | `enabling-conditions`), `hasEvidence` flag, and an
`aliases` array of every raw string we have observed in the xlsx. The
build script asserts that each indicator string in the source resolves to
exactly one slug; an unknown name is a build failure.

### Generated artifact layout

Front-of-house (imported directly, ships with every page):

- `src/data/2026/generated/taxonomy.json`
- `src/data/2026/generated/countries.json` (one row per country)
- `src/data/2026/generated/rankings.json` (one row per country, **denormalised**:
  rank, `girai`, `girai_raw`, `urai_penalty`, 5 dim scores, 3 pillar scores,
  15-cell dim×pillar matrix, all per-indicator scores keyed by slug)

Lazy-loaded (under `/public/data/2026/` so the Explorer can `fetch()` them):

- `evidence.json` — **one row per individual evidence item**, regardless
  of kind. Discriminated union on `kind`:
  `framework` | `initiative` | `cso-initiative` | `gmc-consultation` |
  `gmc-provision` | `gmc-mechanism` | `urai`. Common fields on every item:
  `id, kind, country (ISO3 + name), dimensionSlug, pillarSlug, indicatorSlug,
  title, link, drive, type, justification`. Kind-specific fields layered on
  top (e.g. `enforceability`, `approval`, `reach`, `scope`,
  `defenceAndSecurity`, `consultation`, `body`, `plan`, `budget`,
  `monitoring`, `thematicElements[]` for frameworks).
- CSV mirrors of the source sheets under `/public/data/2026/csv/` so the
  Explorer's "download" affordance has something to point at.

### Why denormalise rankings

Every front-of-house surface (map, table, comparison, dimension cards)
reads from the same data. One file = one fetch, zero joins on the client.
136 rows × ~50 numeric fields is ~50 KB gzipped — cheap.

### Why one combined `evidence.json` instead of one file per kind

The Explorer's filters cross every evidence kind (search, country, region,
indicator) and the stats counters ("3,560 evidence items from … across
98 countries") sum across kinds. A single union document with a
discriminator keeps the filter pipeline trivial. Estimated size: ~5–10k
items × small payloads ≈ 1–3 MB ungzipped, fetched once on Explorer mount.

## Consequences

- Renaming an indicator in a future edition is a one-line `aliases`
  addition, not a code change.
- Adding a new evidence kind only requires a new branch of the
  discriminated union plus one extractor in the build script — Explorer
  filters keep working for the kinds that don't have the new field.
- The Explorer pays a one-time fetch cost (~1–3 MB) on first visit; we
  cache via the static `Cache-Control` header set by the host.
