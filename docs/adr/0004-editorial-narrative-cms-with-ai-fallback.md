# ADR 0004 — Editorial narrative: Sanity CMS with AI fallback

- **Status**: Accepted
- **Date**: 2026-05-15

## Context

Several surfaces on the country page (and elsewhere) need editorial copy
that is **not** in the dataset:

- Country hero summary ("Strong performance in labour and skills…")
- Per-(country, dimension) commentary
- "What Drives This Performance" structural-factor cards
- Indicator/dimension category descriptions

The client wants the ability to edit this copy without code changes
(see `docs/SANITY-CMS-INTEGRATION.md`), but commissioning bespoke copy
for ~136 countries × 5 dimensions is a long lead time.

## Decision

Two-tier authoring with a deterministic fallback chain at render time:

1. **Sanity CMS (primary).** Documents keyed by ISO3 and by
   `(ISO3, dimensionSlug)`. When present, the CMS string wins.
2. **AI-generated fallback (secondary).** A build-time generator script
   reads `rankings.json` and produces a `narratives.generated.json`
   artifact with a short summary per country and per
   `(country, dimension)`. The script uses the score numbers, ranks and
   evidence counts as input — no hallucinated facts, only restatement.
   Generated copy is stored alongside the data, regenerated when the
   dataset is regenerated.
3. **Hard-coded default (tertiary).** If both miss, the component
   renders a neutral placeholder and never breaks layout.

The fallback chain is implemented behind a single
`getNarrative(scope, key)` helper so components don't know which tier
won.

## Consequences

- Day-one launch can ship without any human-authored copy — every
  country has at least an AI-generated summary.
- The client can override any AI summary by publishing a Sanity entry
  for that scope; the next page load picks it up.
- The generator script is a build-time dependency on an LLM API; the
  output is checked into the repo so production builds do not call the
  LLM.
- We commit to the AI summaries being **descriptive only** (restate
  what the numbers say, e.g. "Nigeria ranks 25th globally with a score
  of 83.98, driven primarily by …"). They must not invent factual
  claims about frameworks or initiatives.
