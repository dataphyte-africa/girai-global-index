/**
 * Cross-edition indicator mapping for the country "Comparing Results Across
 * Editions" section.
 *
 * Only explicit, researcher-validated pairs are listed. 2026 AI Policy
 * indicators with no 2024 thematic-area equivalent are intentionally
 * omitted — the UI shows "—" in the 2024 column for those rows.
 *
 * 2024 thematic areas that do not map to a 2026 AI Policy indicator are
 * documented in UNMAPPED_2024_THEMATIC_AREAS for client reference.
 */

/** 2024 `thematic_area` label → 2026 AI Policy indicator slug. */
export const THEMATIC_AREA_TO_2026_SLUG: Record<string, string> = {
  "Access to Remedy and Redress": "access-redress-remedy",
  "Bias and Unfair Discrimination": "fairness-non-discrimination",
  "Children's Rights": "childrens-rights",
  "Cultural and Linguistic Diversity": "cultural-linguistic-diversity",
  "Gender Equality": "gender-equality",
  "Human Oversight and Determination": "human-oversight-determination",
  "Impact Assessments": "impact-assessments",
  "Labour Protection and Right to Work": "labour-protections",
  "Public Procurement": "public-procurement",
  "Public Sector Skills Development": "public-sector-skills-development",
  "Safety, Accuracy and Reliability": "safety-security",
  "Transparency and Explainability": "transparency-explainability",
};

/**
 * 2026 AI Policy indicators with no 2024 thematic-area mapping.
 * Shown as "—" in the 2024 edition column.
 */
export const UNMAPPED_2026_AI_POLICY_INDICATORS: Array<{
  slug: string;
  name: string;
  reason: string;
}> = [
  {
    slug: "ai-literacy",
    name: "AI Literacy",
    reason: "No equivalent thematic area in the 2024 edition.",
  },
  {
    slug: "reskilling-upskilling-initiatives",
    name: "Reskilling and upskilling initiatives",
    reason: "No equivalent thematic area in the 2024 edition.",
  },
  {
    slug: "environmental-impact",
    name: "Environmental Impact",
    reason: "No equivalent thematic area in the 2024 edition.",
  },
  {
    slug: "ai-facilitated-misinformation-violence",
    name: "AI-facilitated Misinformation and Violence",
    reason: "No equivalent thematic area in the 2024 edition.",
  },
  {
    slug: "public-disclosure-government-algorithmic-systems",
    name: "Public Disclosure of Government Algorithmic Systems",
    reason: "No equivalent thematic area in the 2024 edition.",
  },
];

/**
 * 2024 thematic areas with no mapped 2026 AI Policy indicator.
 * Retained for client documentation; not surfaced as table rows.
 */
export const UNMAPPED_2024_THEMATIC_AREAS: Array<{
  thematicArea: string;
  note: string;
}> = [
  {
    thematicArea: "Competitions Authorities",
    note: "No direct 2026 AI Policy indicator equivalent.",
  },
  {
    thematicArea: "Data Protection and Privacy",
    note: "Mapped to Enabling Conditions in 2026, outside this evidence comparison.",
  },
  {
    thematicArea: "International Cooperation",
    note: "No direct 2026 AI Policy indicator equivalent.",
  },
  {
    thematicArea: "National AI Policy",
    note: "No direct 2026 AI Policy indicator equivalent.",
  },
  {
    thematicArea: "Proportionality and Do No Harm",
    note: "No direct 2026 AI Policy indicator equivalent.",
  },
  {
    thematicArea: "Public Participation and Awareness",
    note: "No direct 2026 AI Policy indicator equivalent.",
  },
  {
    thematicArea: "Responsibility and Accountability",
    note: "No direct 2026 AI Policy indicator equivalent.",
  },
];

/** Reverse lookup: 2026 slug → 2024 thematic area label (if mapped). */
export const SLUG_TO_THEMATIC_AREA: Record<string, string> = Object.fromEntries(
  Object.entries(THEMATIC_AREA_TO_2026_SLUG).map(([area, slug]) => [slug, area])
);
