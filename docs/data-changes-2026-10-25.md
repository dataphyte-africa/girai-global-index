# GIRAI 2026 Data Change Report — 2026-10-25 (Dataset v1.1)

Comparison of **Dataset v1.1** (from Ana Florido, GIRAI / Global Center on AI
Governance, received 22 Oct 2026) against the previous `20260706_` versions.

- **New:** `src/data/2026/{GIRAI_dataset,GIRAI_dataset_data_dictionary}.xlsx`
- **Previous:** `src/data/2026/previous-version/20260706_*.xlsx`

## Summary

This is an **evidence-text cleanup plus one column rename**, confined to
`GIRAI_dataset.xlsx` and its data dictionary. `scoring_output.xlsx` is not
part of v1.1 and is **unchanged**, so official GIRAI scores and rankings are
**unchanged**. All 7 dataset sheets are present with the same row counts and
column sets, except that `thematic_coverage` renamed its value columns.

## 1. File-level diff vs `20260706_`

| File | Content | Notes |
|---|---|---|
| `scoring_output.xlsx` | **Identical** | Not part of v1.1. No score or ranking changes |
| `editions_comparison.xlsx` | **Identical** | Not part of v1.1 |
| `GIRAI_dataset.xlsx` | **Changed** | Column rename + cell fixes (see below) |
| `GIRAI_dataset_data_dictionary.xlsx` | **Changed** | Descriptions rewritten/expanded; `thematic_coverage` entries renamed to `element1..4` |

## 2. Changes in `GIRAI_dataset.xlsx`

### Structural: `thematic_coverage` column rename

`element1_value..element4_value` → **`element1..element4`** (same positions).
`element{i}_text` and `element{i}_justif` are unchanged.

### Cell changes

| Sheet | Change |
|---|---|
| frameworks | `fr1/fr2_defence_and_security_justif` blank → `n/a` (854 cells); 5 encoding fixes in `fr1_defence_and_security_justif`; `fr1_plan` & `fr1_budget` blank → `No` (22 rows) |
| gmc_cse | `gmc_defence_and_security_justif` blank → `n/a` (76); `gmc_plan`/`gmc_budget` blank → `No` (3); 3 encoding fixes |
| thematic_coverage | 228 `element*_justif` text/typo fixes |
| initiatives | Uruguay fix (below) |
| urai | Portugal fix (below) |
| all_evidences | Poland `98-58-49-65` `cse_counts` `2.0` (number) → `"2"` (string) |
| cse_initiatives | unchanged |

`n/a` is already treated as empty by the pipeline, so the 930 `_justif`
blank → `n/a` cells produce no output change.

### Uruguay — initiative title casing

`62-05-28-89` `init1_name1` "Recommendations on algorithmic transparency" →
"Recommendations on Algorithmic Transparency", matching `58-24-83-58`. The two
now dedupe, so the unique-initiative count drops by 1.

### Portugal — URAI evidence replaced

`85-27-93-09` `urai1_*` replaced: "AI Surveillance Cameras Aid Crime Reduction
in Bulgarian Resorts" (Mass biometric surveillance) → "Integrated Risk
Management Platform (PIGR): machine-learning fraud risk scoring of Social
Security numbers" (Social scoring systems), with new link and drive.
`urai_counts` unchanged, so the URAI penalty is unaffected. The Portugal
deterministic narrative no longer names the Bulgarian item.

## 3. Changelog vs file mismatch

The v1.1 changelog says `frameworks` gained `fr{1,2}_element{1-4}_text` /
`_justif` and `gmc_cse` gained `gmc_element{1-3}_text` / `_justif`. **Those
columns are not in the v1.1 file or the v1.1 data dictionary.** Element text
and justification still live only in `thematic_coverage` (`source` =
`fr1`/`fr2`/`gmc`), which the pipeline keeps using. We should confirm with
GIRAI whether the changelog or the file is authoritative.

## 4. Code changes (`scripts/build-data.ts`)

- **Rename support.** Both `thematic_coverage` readers (display-only
  framework-coverage aggregate, and evidence `thematicElements`) read
  `element{i}` with a fallback to `element{i}_value`, so archived workbooks
  still parse. On the archived and v1.1 workbooks the 5,012 element values
  match exactly.
- **Loud failure.** If `thematic_coverage` has neither `element{i}` nor
  `element{i}_value`, the build now throws an error naming the sheet and the
  missing columns. Before this, a missing column silently produced empty
  thematic elements.
- **Optional frameworks fallback.** If a future workbook ships
  `fr{n}_element{i}_text` / `_justif` and `thematic_coverage` has no entry
  for that `interview_key` + `fr{n}`, the build takes elements from those
  columns. This does nothing on v1.1 because the `_text` columns are absent.
  No `gmc_element*` fallback was added: `gmc` thematic rows are not consumed
  by any JSON artifact today.
- **Thematic coverage guard.** Once framework evidence is assembled, the
  build logs how many evidence items carry `thematicElements`, how many
  `thematic_coverage` rows have any element value, and how many of those rows
  match an emitted framework item (`interview_key` + `fr1`/`fr2`). The build
  throws if the sheet has element values but zero evidence items got
  `thematicElements`, or fewer than 50% of the matched keys did. On v1.1:
  `1167 framework evidence items with thematicElements (1253 sheet rows with
  element values, 1167 matched to frameworks)`. The 86 unmatched rows are
  all `gmc`-source rows (fr1 1133 + fr2 34 = 1167), which no JSON artifact
  consumes.
- **String numerics.** `num()` already parses string numerics through
  `parseFloat`, so Poland's `"2"` reads as `2`. No Zod schema covers
  `all_evidences`.

Justification carry-through: `fr{1,2}_defence_and_security_justif` reaches
`evidence.json` as `defenceAndSecurity.justification`, and thematic
text/value/justification reach `thematicElements`. `gmc_defence_and_security`
/ `_justif` (like the other gmc framework-level fields) appear only in the
`gmc_cse.csv` mirror. GMC evidence items are per consultation, provision and
mechanism, so there is no framework-level JSON record to hold them.

## 5. Rebuild actions taken

Ran `pnpm build:data` + `pnpm build:narratives:deterministic`.

```
[build-data] wrote taxonomy.json (38 indicators)
[build-data] wrote countries.json (135 countries)
[build-data] thematic coverage: 1167 framework evidence items with thematicElements (1253 sheet rows with element values, 1167 matched to frameworks)
[build-data] wrote country-pillar-highlights.json (135 countries)
[build-data] wrote indicator-adoption.json (17 indicators, 135 countries)
[build-data] wrote evidence.json (2977 items, 133 countries)
[build-data] wrote evidence-index.json (2977 rows, 133 countries, 7 regions)
[build-data] wrote 9 CSV mirrors
[build-data] wrote country-edition-evidence-status.json (135 countries, 14 indicators, source: editions_comparison.xlsx)
[build:narratives] Wrote 135 countries (deterministic)
```

### Outputs regenerated (content changed)

| Artifact | Lines changed |
|---|---|
| `public/data/2026/csv/frameworks.csv` | 835 |
| `public/data/2026/evidence.json` + `src/data/2026/generated/evidence.json` | 282 |
| `src/data/2026/generated/country-narrative-facts.json` | 478 |
| `src/data/2026/generated/rankings.json` | 108 |
| `public/data/2026/csv/gmc_cse.csv` | 79 |
| `public/data/2026/evidence-index.json` | 8 |
| `country-narratives.generated.json`, `docs/country-narratives-index.md` | 6 each (Portugal) |
| `public/data/2026/csv/{initiatives,urai}.csv` | 1 each |

`evidence.json` changes: `_justif` text fixes, 22 framework items with
`plan`/`budget` null → `"No"`, the Uruguay title, the Portugal URAI item, and
two GMC titles with mojibake removed (NOR consultation, VNM mechanism). `??` mojibake occurrences
in `evidence.json` dropped from 55 → 11.

### Display-only implementation aggregate moved

The `fr1_plan`/`fr1_budget` blank → `No` fills feed the site's display-only
**implementation score** (plan/budget/monitoring mean; not part of the GIRAI
methodology). It changed for 8 countries, including GRC 70.6 → 52.1, MDA
61.8 → 31.8, EGY 72.6 → 66.5, JPN, USA, UKR, IND and NPL. As a knock-on,
`implementationRankGlobal` shifted for 67 countries, along with some
regional ranks. **No other ranking field changed** (verified field by field
against HEAD).

`country-narrative-facts.json` also picks up the current taxonomy indicator
labels (e.g. "Gender Gap in Mobile Internet", "Civil Society
Accountability"). The committed file predated an earlier relabel.

### Metadata-only (`generatedAt` + `sourceHash`)

`countries.json`, `taxonomy.json`, `country-pillar-highlights.json`,
`indicator-adoption.json`, `country-edition-evidence-status.json`.

## 6. Public dataset download

`public/downloads/GIRAI_2026_dataset.xlsx` has been replaced with the v1.1
website-format file, and the app now serves it directly at
`/downloads/GIRAI_2026_dataset.xlsx`. It is synced at build time from
`src/data/2026/GIRAI_dataset.xlsx` by `pnpm sync:downloads` (first step of
`prebuild`), so the download always matches the data the site is built from;
`pnpm check:downloads` fails if the committed copy has drifted.

- `DOWNLOAD_SECOND_DATA_PATH` is no longer read; it can be removed from
  `apphosting.yaml` / Vercel later.
- The GCS object
  (`storage.googleapis.com/girai-global-index-downloads/GIRAI_2026_dataset.xlsx`)
  is no longer referenced for the 2026 dataset and does not need replacing.
- The download modal's success screen (link to the Google Drive library) is
  unchanged.

## 7. Follow-ups

- Confirm with GIRAI the changelog/file mismatch on `fr*/gmc_element*_text/_justif`.
- Deterministic narratives were rebuilt (no LLM). If LLM narratives are
  published, run `pnpm build:narratives:llm` (needs `OPENAI_API_KEY`).
