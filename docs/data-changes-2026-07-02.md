# GIRAI 2026 Data Change Report — 2026-07-02

Comparison of the new July 2 source workbooks against the previous `20260701_`
versions, plus integration of the new `editions_comparison.xlsx`.

- **New:** `src/data/2026/{GIRAI_dataset,scoring_output,GIRAI_dataset_data_dictionary}.xlsx`
  (delivered as `… (1).xlsx` / `dataset_data_dictionary (1).xlsx`, renamed to build-config names)
- **New:** `src/data/2026/editions_comparison.xlsx`
- **Previous:** `src/data/2026/previous-version/20260701_*.xlsx`

## Summary

The three core workbooks are **data-identical** to `20260701_` — no scores,
rankings, evidence, or type labels changed. The md5 differences on the dataset
and scoring files are workbook metadata/formatting only. The one substantive
change is the addition of **`editions_comparison.xlsx`**, a purpose-built
2024-vs-2026 comparison table that now powers the "Comparing Results Across
Editions" section on `countries/[iso3]`.

## 1. Core workbook diff vs `20260701_`

| File | md5 | Data values |
|---|---|---|
| `GIRAI_dataset.xlsx` | differs | **0 cells changed** (all 7 sheets identical) |
| `scoring_output.xlsx` | differs | **0 cells changed** (all 7 sheets identical) |
| `GIRAI_dataset_data_dictionary.xlsx` | identical | identical |

A full value-level diff (keyed per sheet) reported zero added, removed, or
changed rows across every sheet. No rebuild of scores/evidence was strictly
required, but the pipeline was re-run for provenance consistency.

## 2. New file: `editions_comparison.xlsx`

- **`DB_for_web` sheet — 1,820 rows = 130 countries × 14 shared indicators**,
  across all 5 dimensions, keyed by `country_indicator` (ISO3 + indicator name).
- For each of frameworks / government initiatives / CSO engagement it provides
  **both editions' status plus title + link**:
  - `fr_status_2024/2026` (`Binding` / `Non-Binding` / `Draft` / `No framework`) + `fr_title` + `fr_link`
  - `init_existence_2024/2026` (`Yes` / `No` / `n/a`) + titles + links
  - `cso_existence_2024/2026` (`Yes` / `No` / `n/a`) + titles + links
- Multi-item columns (`init_title2_2026`…`6`, `cso_title2`…`6`) exist in the
  schema but are **all empty** — at most one item per cell in the data.
- A `data_dictionary` sheet documents the columns.

### Divergence from the app's previous edition logic

The old section was built by reconstructing 2024 status from
`src/data/2024/GIRAI_2024_dataset.xlsx` via the hand-built crosswalk in
`src/data/edition-indicator-mapping.ts`, rendering **17 AI-policy indicators**
(5 marked "no 2024 equivalent"). The official file uses a different, authoritative
set of **14 shared indicators across all 5 dimensions**:

- **Adds:** Government Mechanisms for CSO Inclusion, Reskilling/Upskilling
  Initiatives (now with real 2024 data).
- **Drops:** Environmental Impact, AI Literacy, AI-facilitated Misinformation
  and Violence, Public Disclosure of Government Algorithmic Systems (not in the
  official comparison).

## 3. Value distributions (editions_comparison.xlsx)

| Field | 2024 | 2026 |
|---|---|---|
| framework status | No framework 1232 · Non-Binding 370 · Binding 156 · Draft 62 | No framework 860 · Non-Binding 503 · Binding 326 · Draft 131 |
| initiative existence | No 1444 · Yes 376 | No 1137 · Yes 553 · n/a 130 |
| CSO existence | No 1409 · Yes 411 | No 964 · Yes 466 · n/a 390 |

`n/a` is not applicable for that indicator/pathway (e.g. initiatives for the
GMC indicator) and renders as `—` in the table.

## 4. Rebuild actions taken

1. Renamed the three new workbooks to their build-config names.
2. Rewrote `scripts/build-edition-comparison.ts` to source
   `country-edition-evidence-status.json` from `editions_comparison.xlsx`
   (`DB_for_web`), normalizing framework vocabulary to the display vocabulary
   (`Binding` → `Binding Framework`, etc.) and mapping `n/a`/blank → `—`.
   - The 130 countries in the file get authoritative 2024 + 2026 status.
   - The 5 countries absent from the 2024 edition (NOR, ISR, BGD, AGO, COG)
     still render a 2026-only column, reconstructed from the 2026 workbook.
3. Minimal edits to
   `src/components/country-story/country-edition-comparison-section.tsx` —
   removed the obsolete "unmapped indicator" blanking and corrected the footnote.
   UI/layout unchanged (data-only integration scope).
4. Ran `pnpm build:data` + `pnpm build:narratives:deterministic`.
   `tsc --noEmit` passes.

### Verification

- Generated artifact: 135 countries (130 from file + 5 fallback), 14 indicators.
- Spot-checked USA, India, and Norway (fallback) against the source workbook —
  statuses match, `n/a` maps to `—`, and `has2024Coverage=false` for the 5
  non-2024 countries.

## 5. Follow-ups

- **`editions_comparison.xlsx` is untracked** — `git add` it so the build works in CI.
- Per the chosen data-only scope, the **titles and links** in the file are
  parsed-through but not yet displayed. Enriching the table cells into clickable
  source links is a future component change.
