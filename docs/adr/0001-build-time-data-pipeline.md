# ADR 0001 — Build-time data pipeline from xlsx to typed JSON

- **Status**: Accepted
- **Date**: 2026-05-15

## Context

The 2026 GIRAI dataset ships as three xlsx workbooks (~3 MB total, ~5k rows
in the largest sheet) covering ranking output, primary qualitative evidence,
and a data dictionary. We have committed to:

- Static hosting (no database, no server runtime beyond Next.js export).
- Raw spreadsheet files as the source of truth — researchers update xlsx,
  the website rebuilds.

Two viable shapes were considered:

- **A — Pre-compute at build time.** A Node script reads the xlsx files and
  emits typed JSON artifacts that the app imports directly (server
  components) or fetches from `/data/2026/...` (client components).
- **B — Ship raw CSVs and parse in the browser** with `papaparse` on every
  page load.

## Decision

Adopt **A**. A `scripts/build-data.ts` step runs before `next build` and
emits derived artifacts under `src/data/2026/generated/` (typed JSON for
imports) and `public/data/2026/` (CSV mirror for downloads).

## Consequences

- Schema drift fails the build, not the user's browser.
- The xlsx files stay out of the client bundle; only the slices we actually
  render get shipped.
- The Evidence Explorer can still offer "download data" by linking to the
  CSV mirror under `/public/data/2026/`.
- Adds one build step and a small dev-time dep on `xlsx` (or `exceljs`).
- Re-running the build is the only way to refresh data — acceptable because
  the dataset publishes annually.
