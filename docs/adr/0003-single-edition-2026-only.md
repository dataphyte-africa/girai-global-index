# ADR 0003 — Single edition (2026 only) + report downloads

- **Status**: Accepted
- **Date**: 2026-05-15

## Context

The Figma country page included a "Comparing Results Across Editions"
section comparing 2024 and 2026 scores per indicator. The 2024 dataset is
not available to this project and there is no commitment to acquire it.

## Decision

The site supports a single edition (2026) for **scores and rankings**.
The country page additionally surfaces **evidence-status comparison**
between the 2024 and 2026 editions (framework / government-led / CSO
pathways). See `docs/edition-indicator-mapping.md` and
`country-edition-evidence-status.json`.

Score-level edition comparison remains out of scope. In place of full
historical score data we surface **report download links** so visitors can
fetch the underlying GIRAI publications directly.

The build pipeline therefore does not model `editions[]`; `rankings.json`
is keyed by ISO3 with no historical axis. Prior-edition fields are not
nullable placeholders — they simply do not exist in the schema.

If a future edition (e.g. 2028) is published, this ADR is superseded by
adding an explicit edition dimension to the artifacts and routing.

## Consequences

- One less section on the country page; one less data file to ship.
- The country page gains a small "Reports & data" panel with links to
  the official publication PDFs and (per ADR 0001) the CSV mirror.
- Removes a class of bugs around mis-aligned indicator slugs across
  editions.
