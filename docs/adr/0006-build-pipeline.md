# ADR 0006 — Build pipeline mechanics

- **Status**: Accepted
- **Date**: 2026-05-15

## Context

Per ADR 0001 the dataset is pre-computed at build time from xlsx into
typed JSON. We need to commit to specific tooling and developer workflow
so the contract is clear.

## Decision

### Cadence: pre-built and committed

- A `pnpm build:data` script reads `src/data/2026/*.xlsx`, runs
  validation, and writes:
  - `src/data/2026/generated/*.json` (typed front-of-house artifacts)
  - `public/data/2026/evidence.json` (Explorer payload)
  - `public/data/2026/csv/*.csv` (sanitized source mirrors + a
    `link-template.csv` with deep-link formulas — see ADR 0007)
- Wired into `prebuild` so `pnpm build` runs it automatically.
- Generated files **are committed to the repo**. `next dev` reads them
  directly with no extra step.
- CI re-runs `pnpm build:data` and fails the build if the working tree
  is dirty afterwards — this guarantees committed artifacts match the
  xlsx sources.

### Parser: SheetJS (`xlsx`)

Smaller and simpler than `exceljs` for read-only at this volume.

### Validation: Zod

Every parsed row is validated against a Zod schema. Unknown indicator
names, missing required columns, or out-of-enum values fail the build
with a row-level error pointing at sheet + cell. The 39 indicators are
expressed as a closed `z.enum` derived from `taxonomy.json`, so a
silently introduced new indicator can never reach production.

### Provenance fields

Every generated JSON file embeds:

- `generatedAt` — ISO 8601 timestamp.
- `sourceHash` — sha256 of the concatenated source xlsx files.

These are surfaced on the validation panel (ADR 0007) so researchers
know which dataset version they're inspecting.

### Narrative generator (separate)

`pnpm build:narratives` is a **separate, on-demand** script. It reads
`rankings.json` and asks an LLM to produce descriptive summaries
(per ADR 0004 — restate numbers, do not invent facts). Output is
committed as `narratives.generated.json`. It is **not** wired into
`prebuild` — narrative regeneration is an explicit, reviewable change.

### CSV mirror

Each source sheet is also written as a sanitized CSV under
`/public/data/2026/csv/` with cleaned headers (fixing the rogue
backtick column in `all_evidences`, etc.). These power the Explorer's
"download data" affordance and serve external researchers directly.

## Consequences

- New developer setup: `pnpm install && pnpm dev` — no extra steps.
- Data refresh: drop new xlsx, run `pnpm build:data`, review the JSON
  diff, commit.
- The repo carries an extra ~3–5 MB of generated JSON; acceptable.
- The CI guard catches "I edited the JSON by hand" mistakes.
