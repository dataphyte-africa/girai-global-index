# GIRAI 2026 Data Change Report — 2026-07-01

Comparison of the new July 1 source workbooks against the previous `20260528_` versions.

- **New:** `src/data/2026/{GIRAI_dataset,scoring_output,GIRAI_dataset_data_dictionary}.xlsx`
- **Previous:** `src/data/2026/previous-version/20260528_*.xlsx`

## Summary

This is a **data refresh, not a restructure**. Same 135 countries, same 3,105 interview
keys, same indicators, same columns everywhere. **No rows or countries were added or
removed.** The changes are: (1) a controlled-vocabulary relabel of framework types,
(2) source link/title cleanup, and (3) recalculated scores and rankings.

## 1. Structural changes

- **`scoring_output.xlsx`**: the `db_dictionary` metadata sheet (8 rows describing each
  tab) was **removed**. All 7 data sheets remain identical in shape.
- All other sheet names, column headers, and column counts are unchanged.

## 2. Controlled-vocabulary relabel (largest source of cell changes, ~770 cells)

The framework-type taxonomy was renamed:

| Old value | New value | Rows (frameworks.fr1_type) |
|---|---|---|
| `International Law` | `International Law and regulation` | 206 |
| `Law` | `Law and regulation` | 167 |
| (genuine reclassifications, e.g. `Guideline`→`Policy`) | — | ~11 |

- Same relabel applied in `thematic_coverage.fr_type` (396 rows) and `gmc_cse.gmc_type`.
- The **data dictionary** was updated to match (frameworks, thematic_coverage, gmc_cse sheets).

> ⚠️ This changes the **displayed** evidence "type" labels across the site (e.g. anywhere
> showing "Law"). No code branches on these strings, so it does not break logic — it only
> relabels.

## 3. Evidence source cleanup — `GIRAI_dataset.xlsx`

| Sheet | Rows changed | Main fields |
|---|---|---|
| frameworks | 629 | fr1_type (relabel), fr1_link (229), fr1_title (43), fr1_consultation (43) |
| thematic_coverage | 397 | fr_type (relabel, 396) |
| initiatives | 137 | init1_link1 (97), init1_name1 (29) |
| cse_initiatives | 70 | mostly link corrections |
| gmc_cse | 37 | mostly link corrections |
| all_evidences | 5 | gmc_consult_counts |
| urai | 0 | no change |

## 4. Recalculated scores & rankings — `scoring_output.xlsx`

**44 countries changed ranking or score; 35 had GIRAI score changes.** Notable movers:

| Country | Rank (old → new) | GIRAI (old → new) |
|---|---|---|
| Switzerland | 22 → 19 | 56.75 → 59.63 |
| Israel | 43 → 41 | 42.2 → 43.75 |
| India | 48 → 46 | 41.1 → 41.77 |
| Norway (still #1) | 1 → 1 | 74.66 → 75.26 |
| Latvia | 10 → 9 | 64.82 → 65.18 |
| Egypt | 46 → 48 | 41.99 → 41.26 |
| Hungary | 28 → 29 | 52.66 → 52.07 |

Indicator-level recalculations: `all_indicators_long` (76 rows),
`ai_policy_indicators` (73 rows), `cse_indicators` (5 rows). URAI penalties unchanged.

### Full list of countries with ranking/score changes

Norway, Netherlands, United Kingdom, Latvia, Estonia, Belgium, Poland, Switzerland,
Austria, Lithuania, Uruguay, Japan, Canada, United States, Costa Rica, Hungary, Serbia,
Nigeria, New Zealand, Singapore, Israel, China, Hong Kong, India, Viet Nam, Egypt,
Malaysia, United Arab Emirates, North Macedonia, Benin, Thailand, El Salvador, Oman,
Morocco, Côte d'Ivoire, Sri Lanka, Ethiopia, Senegal, Bahrain, Azerbaijan, Libya,
Jamaica, Malawi, Tajikistan.

## Rebuild notes

- `scripts/build-data.ts` expects `GIRAI_dataset_data_dictionary.xlsx`. The new file was
  originally delivered as `dataset_data_dictionary.xlsx` and has been renamed to match.
- Pipeline: `pnpm build:data` (also builds evidence index + edition comparison), then
  `pnpm build:narratives:deterministic`.
