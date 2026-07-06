# GIRAI 2026 Data Change Report — 2026-07-06

Comparison of the new July 6 source workbooks against the previous `20260702_`
versions.

- **New:** `src/data/2026/{GIRAI_dataset,scoring_output,GIRAI_dataset_data_dictionary,editions_comparison}.xlsx`
  (dictionary delivered as `dataset_data_dictionary.xlsx`, renamed to the build-config name)
- **Previous:** `src/data/2026/previous-version/20260702_*.xlsx`

## Summary

This is an **evidence-metadata cleanup**, confined to `GIRAI_dataset.xlsx`.
Scores, rankings, and the edition-comparison data are **unchanged**. No rows or
columns were added or removed. The edits blank out placeholder junk in `_drive`
fields, apply copy/encoding fixes to `_justif` text, and correct a set of
source `_link` URLs.

## 1. File-level diff vs `20260702_`

| File | Content | Notes |
|---|---|---|
| `scoring_output.xlsx` | **Identical** | No score or ranking changes |
| `GIRAI_dataset_data_dictionary.xlsx` | **Identical** | (renamed from `dataset_data_dictionary.xlsx`) |
| `editions_comparison.xlsx` | **Identical content** | Both sheets identical; md5 differs on workbook metadata only |
| `GIRAI_dataset.xlsx` | **Changed** | Evidence-text cleanup (see below) |

## 2. Changes in `GIRAI_dataset.xlsx`

No structural changes. Edits are concentrated in `_drive`, `_justif`, and
`_link` fields:

| Sheet | Rows changed | Breakdown |
|---|---|---|
| initiatives | 248 | init1_drive1 (139), init1_justif1 (77), init1_drive2 (24), init1_link1 (13), justif2/3 (19), init2 (7), links (2) |
| frameworks | 142 | fr1_justif (106), fr1_link (22), fr1_drive (16), fr2 justif/drive (5) |
| cse_initiatives | 124 | cse drive (~117 across slots), justif (59), links (8) |
| gmc_cse | 31 | consult / particip-mech drive + justif + links |
| urai | 10 | urai drive / justif / link |
| all_evidences | 0 | unchanged |
| thematic_coverage | 0 | unchanged |

### Nature of the edits (sampled and verified)

- **`_drive` → cleanup.** Placeholder junk blanked out: `-`, `/`, `?/?`, `na`,
  `not a document`, `not document`, `Not applicable`, `No document`,
  `No apply`, `It is a website link`, `The evidence does not consist of a
  document.` → empty (~215 cells across sheets, nearly all placeholder → blank).
- **`_justif` → copy/encoding fixes.** Same underlying meaning, cleaned:
  removing `??` mojibake (`AI ??Summer School` → `AI Summer School`),
  normalizing quotes (`Frente Nacional` → `'Frente Nacional`).
- **`_link` → ~60 source-URL corrections** across the sheets.

**No status/count/score fields changed** — `fr_status`, `*_counts`, and
existence flags are all untouched.

## 3. Rebuild actions taken

1. Renamed `dataset_data_dictionary.xlsx` → `GIRAI_dataset_data_dictionary.xlsx`.
2. Ran `pnpm build:data` + `pnpm build:narratives:deterministic`.

### Outputs regenerated (content changed)

| Artifact | Lines changed |
|---|---|
| `public/data/2026/evidence.json` + `src/data/2026/generated/evidence.json` | 675 |
| `public/data/2026/csv/initiatives.csv` | 248 |
| `public/data/2026/csv/frameworks.csv` | 142 |
| `public/data/2026/csv/cse_initiatives.csv` | 124 |
| `public/data/2026/evidence-index.json` | 58 |
| `public/data/2026/csv/gmc_cse.csv` | 31 |
| `public/data/2026/csv/urai.csv` | 10 |

### Outputs with metadata-only changes (`generatedAt` + `sourceHash`)

`rankings.json`, `country-edition-evidence-status.json`, `countries.json`,
`taxonomy.json`, `country-pillar-highlights.json`, `indicator-adoption.json`,
`country-narratives.generated.json`, `country-narrative-facts.json` — data
values unchanged (verified: the 2-line diff on `rankings.json` and the edition
artifact is only the timestamp/hash).

### Verification

- Rankings/scores confirmed unchanged (diff limited to `generatedAt`/`sourceHash`).
- Edition-comparison artifact unchanged (same, metadata-only).
- Evidence cleanup propagated: `??` mojibake occurrences in `evidence.json`
  dropped from 52 → 23.

## 4. Follow-ups

- `editions_comparison.xlsx` remains untracked in git (unchanged since 2026-07-02) —
  `git add` it so the build works in CI.
- Deterministic narratives were rebuilt (no LLM). If LLM narratives are
  published, run `pnpm build:narratives:llm` (needs `OPENAI_API_KEY`).
