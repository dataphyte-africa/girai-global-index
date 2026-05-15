# ADR 0007 — Public URL contract and in-site validation

- **Status**: Accepted
- **Date**: 2026-05-15

## Context

GIRAI researchers maintain the source xlsx files. We want to give them
a fast, in-website way to spot-check that what they entered in a row
ends up rendered correctly on the site, without leaving Excel.

The mechanism: stable, formula-friendly URLs the researcher can build
in a spreadsheet cell and click straight through to the corresponding
website surface.

Because these URLs are public and indexable, they become a long-term
contract.

## Decision

### URL routes (stable, public)

| Surface | Pattern |
|---|---|
| Country page | `/countries/{ISO3}` |
| Dimension page | `/dimensions/{dimensionSlug}` |
| Indicator page | `/indicators/{indicatorSlug}` |
| Evidence Explorer (filtered) | `/evidence?{filters}` |
| Specific evidence card | `/evidence/{itemId}` |

`{filters}` query keys: `country` (ISO3, repeatable), `region`,
`dimension` (slug, repeatable), `pillar`, `indicator` (slug,
repeatable), `kind`, `type`, `q` (free-text search). All values are
URL-safe slugs or ISO3 codes; no opaque IDs.

### Item ID grammar

```
{interviewKey}:{kind}:{slot}
```

| Source sheet | Kind | Slot grammar |
|---|---|---|
| `frameworks` | `framework` | `1` or `2` |
| `initiatives` | `initiative` | `b{1\|2}-i{1\|2\|3}` (body, item) |
| `cse_initiatives` | `cso-initiative` | `1`–`6` |
| `gmc_cse` consultations | `gmc-consultation` | `1`–`3` |
| `gmc_cse` provisions | `gmc-provision` | `1`–`4` |
| `gmc_cse` mechanisms | `gmc-mechanism` | `1`–`4` |
| `urai` | `government-misuse` | `1`–`7` |

The grammar is deterministic and computable from any spreadsheet row.
URAI rows have no `interview_key` of their own — for those, the slug
is `urai-{ISO3}` (e.g. `urai-NGA:government-misuse:2`).

### Excel deep-link formulas

The build emits a `link-template.csv` mirror at
`/public/data/2026/csv/link-template.csv` containing the formula
strings researchers paste into their working sheets, e.g.:

```
="https://girai.global/evidence/" & A2 & ":framework:1"
="https://girai.global/evidence/" & A2 & ":cso-initiative:3"
="https://girai.global/countries/" & C2
```

### `/evidence/{itemId}` is the validation surface

This route renders three layers stacked:

1. **Public card** — what end users see.
2. **Validation panel** — the raw source row, the official `link`, the
   Drive mirror `drive`, the build's `generatedAt` and `sourceHash`.
3. **Debug JSON** (only when `?debug=1`) — the full Zod-parsed object.

This way a researcher can paste the deep-link from Excel, immediately
see whether the parser interpreted the row correctly, and click
through to the official source for cross-verification.

### Stability commitment

Once published, the URL patterns and item-ID grammar in this ADR are
stable. Renaming an indicator slug requires a redirect entry; the old
slug must keep working. Deleting an evidence row makes its `itemId`
404 — that's intentional, signalling to the researcher that the row
was removed.

## Consequences

- Researchers gain a tight feedback loop: edit Excel → click link →
  see the parsed result.
- Slug stability becomes a first-class concern — `taxonomy.json`'s
  `aliases[]` field absorbs renames without breaking links.
- The `/evidence/{itemId}` route is statically pre-rendered for every
  item ID emitted at build time; bad IDs hit a friendly 404 explaining
  what the grammar is.
