# 2026 GIRAI Dataset Refresh

_Last updated: 2026-05-28_

This note documents the structural changes that came with the refreshed
2026 GIRAI workbooks (`src/data/2026/GIRAI_dataset.xlsx`,
`scoring_output.xlsx`, `GIRAI_dataset_data_dictionary.xlsx`) and the code
changes required to build clean static assets from them. The previous
edition is preserved under `src/data/2026/previous-version/` for diffing.

## Build output (post-refresh)

```
38 indicators · 135 countries · 2,977 evidence items · 133 countries with evidence · 7 regions
```

Run `pnpm build:data` to regenerate.

## Code changes

### `scripts/build-data.ts`

- Pointed the pipeline at the new filenames:
  - `GIRAI_dataset.xlsx` (was `20260505_girai_dataset.xlsx`)
  - `scoring_output.xlsx` (was `20260505_GIRAI_scoring_output.xlsx`)
  - `GIRAI_dataset_data_dictionary.xlsx`
    (was `girai_dataset_data_dictionary(working_version_2).xlsx`)
- Renamed the GDP column from `"GDP per capita PPP"` →
  `"GDP_per_capita_PPP"` across the Zod schema and the country builder.
  A fallback read keeps older sheets parseable.

### `src/data/2026/taxonomy.ts`

Added new aliases for renamed indicators (slugs preserved per
[ADR 0007](./adr)):

| Slug                                       | Old name                                  | New name (added as alias)         |
| ------------------------------------------ | ----------------------------------------- | --------------------------------- |
| `socioeconomic-inclusion-connectivity`     | Socioeconomic Inclusion in Connectivity   | Device affordability              |
| `gender-inclusion-connectivity`            | Gender Inclusion in Connectivity          | Gender gap in mobile internet     |
| `environmental-performance`                | Environmental Performance                 | Low-Carbon Energy Share           |
| `population-digital-readiness`             | Population Digital Readiness              | Skills and Literacy               |
| `labour-rights`                            | Labour Rights                             | Labour Rights Compliance          |
| `civil-society-oversight`                  | Civil Society Oversight                   | Civil Society Accountability      |
| `right-to-information`                     | Right to Information                      | Access to Public Information      |
| `unacceptable-risks-ai-systems`            | Unacceptable Risks AI Systems             | URAI Penalty                      |

**Indicator removed**: `institutional-integrity` ("Institutional
Integrity"). Dropped entirely in the new dataset, no replacement column.
Indicator count: **39 → 38**. Saved bookmarks pointing at
`/indicators/institutional-integrity` will 404.

## Source-data changes (informational)

### Region taxonomy overhaul

- "Latin America and the Caribbean" was split into
  **`South and Central America`** and **`Caribbean`**.
- **`Middle East`** is now its own top-level region (was inside
  "Asia and Oceania").
- Georgia (GEO) moved from Asia to Europe.

New top-level regions (7): `Africa`, `Asia and Oceania`, `Caribbean`,
`Europe`, `Middle East`, `Northern America`, `South and Central America`.

### Subregion vocabulary

Subregion labels were rewritten wholesale (`Northern Europe` → `North
Europe`, `Eastern Asia` → `East Asia`, `Western Africa` → `West Africa`,
`Southern Africa` → `South Africa`, `Middle Africa` → `Central Africa`,
`Western Asia` → `NorthWest Asia`, etc.).

> ⚠️ **Data issue to flag upstream**: 20 countries now have an empty
> subregion in the source workbook — looks like the cells were wiped
> when their previous "subregion" became a top-level region:
>
> CAN, USA, DOM, ISR, JOR, QAT, ARE, OMN, SAU, BHR, TTO, JAM, KWT,
> PSE, BRB, BLZ, ATG, LCA, LBN, HTI.

### Workbook schema changes

| Sheet                          | Change                                                                                          |
| ------------------------------ | ----------------------------------------------------------------------------------------------- |
| `all_evidences`                | Rogue backtick column header replaced by `interview_key`. Sanitization shim in the build is now a no-op but kept defensively. |
| `gmc_cse`                      | Removed `gmc_existence`. Not used by the pipeline.                                              |
| `frameworks`                   | Added `implementation` column. Thematic elements also inlined as `frN_element1..4` per slot. The pipeline keeps using the dedicated `thematic_coverage` sheet (richer text/value/justif tuples). |
| `urai`                         | Slot count reduced from 7 to 4 (`urai1`..`urai4`). Loop iterates 1..7 defensively; empty slots are skipped. |
| `scoring_output.xlsx`          | New informational `db_dictionary` sheet (not consumed).                                         |
| `all_indicators` / `all_indicators_long` | All indicator-name renames listed above. Long-format rows: 5,266 → 5,131 (consistent with one indicator dropped). |
| `ai_policy_indicators`         | `fr1_reach`/`fr2_reach` collapsed to a single `fr_reach`; `imp{1,2}_counts` renamed to `init{1,2}_counts`. |
| `cse_indicators`               | Several internal aggregate columns removed/renamed (`cse_average_*`, `cse_initiative_multiplier`, `contributionN`, `contributionN_count`, `gmc_*` sub-columns). The pipeline does not consume this sheet directly. |

### Score movements worth sanity-checking with the GIRAI team

- Norway: 73.40 → **74.66**, still #1.
- Italy jumped to **#2** at 72.71.
- UK fell to **#7** (67.39) with `urai_penalty = 0.93`.
- France, Netherlands, Germany now carry `urai_penalty < 1`.
- Afghanistan: 7.82 → 6.02.
- Liberia and Afghanistan are the only countries with **zero evidence
  items**. AFG was previously similar; LBR appears newly empty — worth
  confirming.

## Verification

`pnpm tsc --noEmit` passes. No source code references the removed
`institutional-integrity` slug or the old region/subregion strings —
the only remaining mentions are inside `src/data/2026/generated/*.json`,
which are overwritten by every build.
