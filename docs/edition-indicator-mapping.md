# Edition indicator mapping (2024 → 2026)

This document describes how the **Comparing Results Across Editions** section on country pages aligns indicators between the 2024 and 2026 GIRAI datasets.

The canonical crosswalk lives in [`src/data/edition-indicator-mapping.ts`](../src/data/edition-indicator-mapping.ts) and is embedded in the build artifact `country-edition-evidence-status.json`.

## Mapped indicators (12 pairs)

| 2024 thematic area | 2026 AI Policy indicator |
| --- | --- |
| Access to Remedy and Redress | Access to Redress and Remedy |
| Bias and Unfair Discrimination | Fairness and Non-discrimination |
| Children's Rights | Children's Rights |
| Cultural and Linguistic Diversity | Cultural and Linguistic Diversity |
| Gender Equality | Gender Equality |
| Human Oversight and Determination | Human Oversight and Determination |
| Impact Assessments | Impact Assessments |
| Labour Protection and Right to Work | Labour Protections |
| Public Procurement | Public Procurement |
| Public Sector Skills Development | Public Sector Skills Development |
| Safety, Accuracy and Reliability | Safety and Security |
| Transparency and Explainability | Transparency and Explainability |

## 2026 indicators with no 2024 equivalent

These show **—** in the 2024 column:

- AI Literacy
- Reskilling and upskilling initiatives
- Environmental Impact
- AI-facilitated Misinformation and Violence
- Public Disclosure of Government Algorithmic Systems

## 2024 thematic areas not shown in the table

These have no mapped 2026 AI Policy indicator:

- Competitions Authorities
- Data Protection and Privacy (Enabling Conditions in 2026)
- International Cooperation
- National AI Policy
- Proportionality and Do No Harm
- Public Participation and Awareness
- Responsibility and Accountability

## Countries without 2024 coverage

Five countries appear in the 2026 edition but are **not present** in the 2024
workbook (`Data` sheet). For these countries the entire 2024 column is
unavailable (not a build error):

- `AGO` (Angola)
- `BGD` (Bangladesh)
- `COG` (Congo)
- `ISR` (Israel)
- `NOR` (Norway)

The build sets `has2024Coverage: false` on these country entries and the UI
shows an explanatory notice instead of implying missing per-indicator data.

## Status normalization

| Pathway | 2024 source fields | 2026 source fields |
| --- | --- | --- |
| Framework Status | `fr_doc1_existence_text`, `fr_doc1_type_text`, `ga_type_text` | `fr_status`, `fr1_enforceability` |
| Government-led initiatives | `ga_existence_text` | `init_counts` in `all_evidences` |
| CSO activities | `nsa_cs_existence_text` | CSO initiative `contributesTo` links |

## Data sources

- 2024: `src/data/2024/GIRAI_2024_dataset.xlsx` (`Data` sheet)
- 2026: `src/data/2026/GIRAI_dataset.xlsx` (frameworks, initiatives, CSO evidence)

Rebuild after workbook changes: `pnpm build:data`
