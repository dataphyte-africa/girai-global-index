# Country page narratives & calculations — guide

How the written text on each country page (`/countries/[iso3]`) is produced, and how the key numbers behind it are calculated. Written for editors, reviewers, and developers.

> **Related docs:** [country-narratives-index.md](./country-narratives-index.md) (auto-generated country list + build metadata) · [country-narratives.md](./country-narratives.md) (workflow reference) · [country-page-narrative-templates.md](./country-page-narrative-templates.md) (retired score-tier templates, historical only).

---

## Contents

1. [The short version](#1-the-short-version)
2. [Which text comes from where](#2-which-text-comes-from-where)
3. [How narratives are generated](#3-how-narratives-are-generated)
4. [Section-by-section breakdown](#4-section-by-section-breakdown)
5. [How the key values are calculated](#5-how-the-key-values-are-calculated)
6. [Regenerating the copy](#6-regenerating-the-copy)
7. [File map](#7-file-map)

---

## 1. The short version

- Every country page is assembled from **pre-computed data and text** — there are **no live AI calls when a visitor loads a page**. Everything is built ahead of time and shipped as JSON.
- The prose you read (hero paragraph, dimension summaries, pillar callouts) is **grounded in each country's own facts** — its ranks, score gaps, top/bottom indicators, and evidence — not generic "score band" boilerplate.
- Text is produced by a build step that runs **once** when the dataset changes. It can either write the copy with an AI model (**gpt-4o-mini**) or with fixed sentence templates ("deterministic"). Both draw from the same fact sheet per country.
- The numbers (scores, ranks, percentages) come from the official GIRAI scoring workbooks; the site only **re-derives ranks, averages, and a few display-only figures** on top of them.

---

## 2. Which text comes from where

Each country page has these sections, top to bottom:

| Section on the page | What the text is | Where it comes from |
|---|---|---|
| **Hero score card** | 2–3 sentence summary under the score & rank | Generated narrative (`hero`) |
| **Five dimensions** ("How *X* performs…") | One paragraph per dimension (×5) | Generated narrative (`dimensions`) |
| **Performance drivers** ("What drives this…") | One callout paragraph per pillar (×3) | Generated narrative (`pillars`) |
| ↳ pillar heading + description | Fixed labels on every pillar card | Static copy (same for all countries) |
| ↳ three bullet points per pillar | Factual checklist ("2 documented frameworks…") | `country-pillar-highlights.json` (evidence counts) |
| ↳ "Contribution to overall score" % | A calculated percentage + bar | Computed from pillar scores (see [§5](#5-how-the-key-values-are-calculated)) |
| **Edition comparison** (2024 → 2026) | Chips/counts of evidence changes | Data only — no prose |
| **Comparison tool** | User-built side-by-side view | Generated live from user selection |
| **Misuse evidence** | List of government-misuse items | Evidence item titles |
| **Evidence explorer** | Searchable evidence list | Evidence item details |

**Generated narrative** means the three-part copy block (`hero`, `dimensions`, `pillars`) written by the build step. Everything else is either a fixed label, a direct data readout, or a calculated number.

---

## 3. How narratives are generated

All narrative copy is created at **build time** and saved to a committed JSON file. At runtime the page just looks the text up. The build follows three stages.

```
Dataset (scores, ranks, evidence)
        │
        ▼
1. Fact bundle          →  one structured fact sheet per country
        │                   (ranks, score gaps, top/bottom indicators, evidence titles)
        ▼
2. Write the copy        →  AI model (gpt-4o-mini)  OR  deterministic templates
        │                   both read only the fact sheet
        ▼
3. Validate & save       →  country-narratives.generated.json  (shipped to the site)
```

### Stage 1 — Fact bundle

For each country the build assembles a **fact sheet** (no AI involved) containing everything a paragraph might mention: global/regional/income ranks, how the score compares to regional and income-group averages, strongest and weakest dimensions, top and bottom indicators per dimension, pillar scores and their contribution mix, and a short list of real evidence titles it is *allowed* to quote.

### Stage 2 — Write the copy

Two interchangeable writers turn that fact sheet into sentences:

| Writer | When it's used | How it works |
|---|---|---|
| **AI model** (`gpt-4o-mini`) | When an `OPENAI_API_KEY` is available | Sent only the fact sheet; must return copy for hero + 5 dimensions + 3 pillars. Temperature 0.25 (near-deterministic). |
| **Deterministic templates** | When no key is set, or as a fallback | Fills fixed sentence patterns with the same facts. No AI, no API cost. |

The AI writer is constrained: **UK English**, rank-based framing (e.g. "11th globally"), **no "tier" labels** ("Advanced", "Developing" are banned), and word limits — hero ≤ 90 words, each dimension ≤ 70, each pillar ≤ 65.

### Stage 3 — Validate & save

Every AI-written paragraph is checked before it's accepted:

- Word counts within limits.
- No banned tier labels.
- Hero must name the country and include its GIRAI score.
- **Any evidence title it quotes must exist in the country's allowed-titles list** — this prevents the model from inventing sources.

If a country fails any check, that country automatically falls back to the deterministic copy. The result is written to `country-narratives.generated.json`.

### At runtime — how a page picks its text

When a page renders, it resolves each narrative in this order and uses the first that exists:

1. **Generated file** (the shipped `country-narratives.generated.json`) — used today.
2. **Deterministic** copy computed on the spot from the same facts — safety net.
3. A neutral placeholder (e.g. *"X does not yet have narrative copy for this edition."*).

*(A future Sanity CMS override would slot in ahead of step 1, letting editors hand-write copy for specific countries.)*

---

## 4. Section-by-section breakdown

### Hero card
2–3 sentences under the score and rank badges. Draws on: score gap vs regional and income-group averages, global rank, whether **implementation** is running ahead of or behind **framework** substance, and the total count of evidence items. Any government-misuse ("URAI") penalty is mentioned here when it applies.

> *Example (Norway):* "Norway's index score lands +21.0 against the Europe average (54.2)… It leads all 135 economies assessed this edition. Its implementation depth ranks 8th globally — ahead of its framework substance (18th)… The profile rests on 45 documented evidence items…"

### Five dimensions
One paragraph per dimension (Inclusion & Diversity, Ethics & Sustainability, Labour & Skills, Trust & Safety, AI Use in Public Service). Each mentions the dimension score, its global/regional rank, how it compares to the regional average, and the country's strongest and weakest indicators within that dimension.

### Performance drivers (pillars)
Each of the three pillars (AI Policy, CSO Engagement, Enabling Conditions) gets a card with four parts:

1. **Fixed heading + description** — identical on every country page.
2. **Callout paragraph** — the generated `pillar` narrative, synthesising the pillar score, how it compares to the global median, its contribution %, and its evidence.
3. **Contribution to overall score %** — a calculated figure (see next section).
4. **Three bullet points** — factual checklist items ("2 documented frameworks", "1 government initiative") read from `country-pillar-highlights.json`. These are **not** written by the AI; they are evidence counts. Mentions of evidence in the prose are turned into clickable links to the evidence explorer.

---

## 5. How the key values are calculated

Most headline numbers — the **GIRAI score, dimension scores, and pillar scores** — are **not calculated by the website**. They are produced by the GIRAI research team in the official scoring workbook and read in as-is. The site computes ranks, averages, and a few display-only figures on top of them.

### GIRAI score (0–100)
Read directly from the scoring workbook. It is a weighted combination of the three pillar scores, then reduced by any **URAI penalty** (a multiplier below 1.0 applied when there is evidence of government misuse of AI). The site stores both the raw score and the penalised final score.

### Dimension & pillar scores (0–100)
Read directly from the scoring workbook — one score per dimension and per pillar, per country.

### Ranks (global, regional, income-group)
Computed by the site. Countries are sorted by a score, highest first; rank 1 is best. Countries with no score are unranked (shown last). Ties share the same rank (standard competition ranking). This is done for the GIRAI score, each dimension, and each pillar — globally, within each **region**, and within each **income group**.

### Regional & income-group averages (the "+21.0 vs Europe" figures)
Computed by the site. For a given region (or income group), average the scores of all countries in it. The **delta** shown in the hero is simply the country's score minus that average.

### Framework vs implementation (display-only)
Two derived figures used to say whether a country's *delivery* is ahead of or behind its *policy on paper*:

- **Framework score** — the average "coverage" rating across a country's documented frameworks (each thematic element counts as Yes = 100, Partial = 50, No = 0).
- **Implementation score** — half from execution signals (plan / budget / monitoring flags, again Yes/Partial/No → 100/50/0) and half from how many AI-Policy indicators actually have at least one initiative behind them.

These are shown for context only; they don't change the official GIRAI score.

### "Contribution to overall score" % (pillar cards)
Computed by the site. Each pillar has an official weight:

| Pillar | Weight |
|---|---|
| AI Policy | 0.6 |
| CSO Engagement | 0.1 |
| Enabling Conditions | 0.3 |

1. For each pillar: **weighted value = pillar score × weight**.
2. Add the three weighted values together.
3. Each pillar's contribution % = its weighted value ÷ that total × 100.

> **Worked example** — scores of AI Policy 60, CSO 30, Enabling 50:
> weighted values = 36, 3, 15 → total 54 → **67%, 6%, 28%**.

If the total is zero (or a pillar has no score), the card shows **—** instead of a percentage.

### Global median (Strengths vs Focus area)
Computed by the site. For each pillar, the median score across all countries is calculated once. A country's pillar is labelled a **Strength** if it sits at or above that median, and a **Focus area** if below.

---

## 6. Regenerating the copy

Run these only when the dataset changes — the outputs are committed to the repo and reviewed as a diff.

```bash
# 1. Rebuild scores, ranks, and evidence first
pnpm build:data

# 2. Rebuild the narratives — choose a mode:
pnpm build:narratives                  # auto: use AI if OPENAI_API_KEY is set, else templates
pnpm build:narratives:llm              # force the AI model (needs OPENAI_API_KEY)
pnpm build:narratives:deterministic    # templates only, no API call, no cost
```

- The key is read from `.env.local` (`OPENAI_API_KEY=sk-…`) — never committed.
- Mode can also be set with `NARRATIVE_SOURCE=llm|deterministic|auto` or the `--llm` / `--deterministic` flags.
- Cost of a full AI regeneration is tiny — one small call per country on the cheap `gpt-4o-mini` model, roughly **under $0.10 for all 135 countries** combined. Production never re-runs this; it serves the committed file.

**Outputs:**

| File | Purpose |
|---|---|
| `src/data/2026/generated/country-narratives.generated.json` | The shipped copy (hero + dimensions + pillars) |
| `src/data/2026/generated/country-narrative-facts.json` | The fact sheets, for review/debugging |
| `docs/country-narratives-index.md` | Auto-generated country list + build metadata |

---

## 7. File map

| Area | Path |
|---|---|
| **Page** | `src/app/countries/[iso3]/page.tsx` |
| Hero card | `src/components/country-story/country-score-hero.tsx` |
| Five dimensions | `src/components/country-story/country-performance-overview.tsx` |
| Pillar drivers | `src/components/country-story/country-performance-drivers.tsx` |
| Evidence links in prose | `src/components/country-story/evidence-linked-text.tsx` |
| **Narrative build** | `scripts/build-narratives.ts` |
| AI writer (gpt-4o-mini) | `scripts/lib/narrative-llm.ts` |
| Fact bundles | `src/lib/country-narratives/facts.ts` |
| Deterministic templates | `src/lib/country-narratives/deterministic.ts` |
| Runtime text resolution | `src/lib/country-narratives/resolve.ts` |
| **Score/rank build** | `scripts/build-data.ts` |
| Pillar weights & medians | `src/lib/girai/pillar-contribution.ts` |
| **Shipped data** | `src/data/2026/generated/rankings.json`, `country-narratives.generated.json` |

---

*GIRAI Global Index 2026.*
