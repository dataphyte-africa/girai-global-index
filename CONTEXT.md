# GIRAI Global Index — Domain Context

This document defines the canonical vocabulary for the GIRAI Global Index app.
Update it inline as terms are clarified during design discussions. Only include
terms that are meaningful to domain experts (researchers, policy analysts,
clients consuming the index). Do not couple this file to implementation details.

## Core terms

### Country
A sovereign state (or comparable jurisdiction) included in the GIRAI study.
Identified globally by its **ISO3** code (e.g. `NOR`, `KEN`). Carries
geographic and economic context: `region`, `subregion`, `developing_developed`,
`WB_income_group`, `GDP_per_capita_PPP`. The 2026 edition covers ~136 countries.

### Dimension
One of the five thematic axes of AI governance assessed by GIRAI:
1. Inclusion and Diversity
2. Ethics and Sustainability
3. Labour and Skills
4. Trust and Safety
5. **AI Use in Public Service** (canonical 2026 name; do not use "Use of AI in
   Public Sector Delivery" — that was the 2024 phrasing).

### Pillar
One of the three lenses applied to every dimension:
- **AI Policy** — the existence, content and implementation of formal
  frameworks (laws, strategies, guidelines).
- **CSO Engagement** — civil society's participation in shaping and
  scrutinising AI policy.
- **Enabling Conditions** — broader contextual indices (rule of law, digital
  readiness, etc.) drawn from third-party data sources.

### Indicator
The smallest scored unit. Each indicator belongs to exactly one
`(dimension, pillar)` cell. Three families:

- **AI Policy indicators** (17 in 2026): primary-evidence indicators where
  GIRAI researchers identify up to two **frameworks** and associated
  **initiatives** for the country.
- **CSO Engagement indicators** (5 in 2026): one per dimension. For
  dimensions 1–4 the indicator is *Civil Society Engagement in <dimension>*;
  for dimension 5 it is *Government Mechanisms for CSO Inclusion in AI Policy
  and Governance* (a country-level rather than per-dimension construct).
- **Enabling Conditions indicators** (~17): externally-sourced indices —
  Egalitarian Democracy, Cybersecurity, Rule of Law, Data Protection and
  Privacy, Global Peace, Population Digital Readiness, Right to Information,
  Unacceptable Risks AI Systems (URAI), etc. These have a score but no
  evidence rows of their own.

### Interview key
A unique identifier for a `(country, indicator)` pair, of the form
`28-02-67-51`. Only present for AI Policy and CSE indicators (the families
where GIRAI collects primary evidence). Used to join scoring rows to
evidence rows.

### Score
Indicators are normalised to `[0, 100]`. Dimension scores aggregate the
indicators within a dimension across all three pillars. Pillar scores
aggregate every indicator in that pillar across all dimensions. The overall
**GIRAI score** is the dimension average **after the URAI penalty** is
applied; `girai_raw` is the same score before the penalty.

### Evidence
The qualitative substrate behind a score. For an AI Policy indicator,
evidence is one or two **frameworks** plus their **initiatives**; for a CSE
indicator it is up to six **CSO initiatives** (or, for dim 5, the National
AI Policy plus its **consultations**, **participation provisions** and
**participation mechanisms**); for the URAI penalty it is up to seven
**URAI evidence items** at country level.

### Framework
A government-issued document (Law, Policy, Strategy, Guideline, etc.) that
addresses an AI Policy indicator. Up to two frameworks can be attributed to
a single `(country, indicator)`. Each framework carries metadata
(`type`, `approval` date, `enforceability`, `reach`, `scope`,
`defence_and_security` exemption flag, `consultation`, `body`, `plan`,
`budget`, `monitoring`) and is rated against up to four **thematic
elements** (`Yes` / `Partially` / `No`).

### Thematic element
Indicator-specific criteria used to assess how thoroughly a framework
covers an indicator's substance. Defined per indicator in the data
dictionary.

### Initiative
Concrete government action implementing a framework (programme, body,
project, regulation). Up to three initiatives per implementation body, and
up to two implementation bodies per (country, AI Policy indicator), so a
maximum of six initiatives.

### CSO initiative
Civil-society-led activity that contributes to one or more indicators in a
dimension. Recorded under a `(country, CSE indicator)` row, with up to six
initiatives, each tagged with the indicators it contributes to.

### URAI penalty
A multiplicative penalty applied to the overall GIRAI score when a country
has documented government deployments of AI systems with unacceptable
risks. Driven by the `urai` evidence sheet and surfaced as a per-country
penalty value.

### URAI placement in the taxonomy
The 2026 source labels URAI's dimension and pillar as `n/a` because the
score is applied as a multiplicative penalty rather than as a regular
indicator. The site places URAI under
`(ai-use-public-service, enabling-conditions)` — the closest semantic
fit, since URAI is about government deployment of unacceptable AI. This
is a pragmatic choice; if GIRAI publishes an official placement in a
later edition, update `taxonomy.ts` accordingly. The comparison tool
surfaces URAI separately from pillar indicators as a post-aggregation
score adjustment.

### Government Misuse (URAI evidence)
The user-facing label for the `urai` evidence sheet — documented cases of
government deployment of AI systems with unacceptable risks (e.g.
AI-driven surveillance, predictive policing, biometric mass identification
without lawful basis). Each case carries a name, source link, type and
justification. Although the URAI **score** lives under the Enabling
Conditions pillar, URAI **evidence** is collected primarily by GIRAI and
is treated as a first-class evidence kind in the Explorer (alongside
Framework, Initiative, CSO Initiative and Government Mechanism).
