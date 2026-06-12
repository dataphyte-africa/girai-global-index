/**
 * Canonical 2026 GIRAI taxonomy. Hand-curated. Source of truth for slugs.
 *
 * Every dimension, pillar and indicator that appears in the 2026 dataset
 * MUST be listed here. The build script asserts that every raw string in
 * the xlsx files resolves to exactly one entry via either `name` or
 * `aliases[]`. An unknown name fails the build.
 *
 * If GIRAI renames an indicator in a future edition, ADD the new name to
 * `aliases[]` rather than changing `slug` (slugs are part of the public
 * URL contract per ADR 0007).
 */

export type DimensionSlug =
  | "inclusion-diversity"
  | "ethics-sustainability"
  | "labour-skills"
  | "trust-safety"
  | "ai-use-public-service";

export type PillarSlug = "ai-policy" | "cso-engagement" | "enabling-conditions";

export type IndicatorFamily = "ai-policy" | "cse" | "enabling-conditions";

export interface DimensionDef {
  slug: DimensionSlug;
  name: string;
  aliases: string[];
  /** Order shown in UI (1-based, matching the numbered cards in Figma). */
  order: number;
}

export interface PillarDef {
  slug: PillarSlug;
  name: string;
  aliases: string[];
}

export interface IndicatorDef {
  slug: string;
  name: string;
  aliases: string[];
  dimension: DimensionSlug;
  pillar: PillarSlug;
  family: IndicatorFamily;
  /** True for AI Policy and CSE indicators (rows that have an interview_key). */
  hasEvidence: boolean;
}

export const DIMENSIONS: DimensionDef[] = [
  {
    slug: "inclusion-diversity",
    name: "Inclusion and Diversity",
    aliases: ["Inclusion and Diversity", "Inclusion & Diversity"],
    order: 1,
  },
  {
    slug: "ethics-sustainability",
    name: "Ethics and Sustainability",
    aliases: ["Ethics and Sustainability", "Ethics & Sustainability"],
    order: 2,
  },
  {
    slug: "labour-skills",
    name: "Labour and Skills",
    aliases: ["Labour and Skills", "Labour & Skills"],
    order: 3,
  },
  {
    slug: "trust-safety",
    name: "Trust and Safety",
    aliases: ["Trust and Safety", "Trust & Safety"],
    order: 4,
  },
  {
    slug: "ai-use-public-service",
    name: "AI Use in Public Service",
    aliases: [
      "AI Use in Public Service",
      "AI Use in Public Service Delivery",
      "Use of AI in the Public Sector",
      "Use of AI in Public Sector Delivery",
    ],
    order: 5,
  },
];

export const PILLARS: PillarDef[] = [
  { slug: "ai-policy", name: "AI Policy", aliases: ["AI Policy"] },
  { slug: "cso-engagement", name: "CSO Engagement", aliases: ["CSO Engagement"] },
  {
    slug: "enabling-conditions",
    name: "Enabling Conditions",
    aliases: ["Enabling Conditions"],
  },
];

/**
 * 39 indicators in the 2026 edition.
 *
 * Note on URAI: the source sheet labels its dimension/pillar as `n/a`
 * because URAI is computed as a multiplicative penalty on the overall
 * score rather than as a regular indicator. For taxonomy purposes we
 * place it under (ai-use-public-service, enabling-conditions) — the
 * closest semantic fit, since URAI is about government deployment of
 * unacceptable AI systems. This choice is documented in CONTEXT.md.
 */
export const INDICATORS: IndicatorDef[] = [
  // ===== Inclusion and Diversity =====
  {
    slug: "gender-equality",
    name: "Gender Equality",
    aliases: ["Gender Equality"],
    dimension: "inclusion-diversity",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "childrens-rights",
    name: "Children's Rights",
    aliases: ["Children's Rights", "Childrens Rights"],
    dimension: "inclusion-diversity",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "cultural-linguistic-diversity",
    name: "Cultural and Linguistic Diversity",
    aliases: ["Cultural and Linguistic Diversity"],
    dimension: "inclusion-diversity",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "civil-society-engagement-inclusion-diversity",
    name: "Civil Society Engagement in Inclusion and Diversity",
    aliases: ["Civil Society Engagement in Inclusion and Diversity"],
    dimension: "inclusion-diversity",
    pillar: "cso-engagement",
    family: "cse",
    hasEvidence: true,
  },
  {
    slug: "egalitarian-democracy",
    name: "Egalitarian Democracy",
    aliases: ["Egalitarian Democracy"],
    dimension: "inclusion-diversity",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },
  {
    slug: "socioeconomic-inclusion-connectivity",
    name: "Socioeconomic Inclusion in Connectivity",
    aliases: ["Socioeconomic Inclusion in Connectivity", "Device affordability"],
    dimension: "inclusion-diversity",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },
  {
    slug: "gender-inclusion-connectivity",
    name: "Gender Inclusion in Connectivity",
    aliases: ["Gender Inclusion in Connectivity", "Gender gap in mobile internet"],
    dimension: "inclusion-diversity",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },

  // ===== Ethics and Sustainability =====
  {
    slug: "fairness-non-discrimination",
    name: "Fairness and Non-discrimination",
    aliases: ["Fairness and Non-discrimination", "Fairness and Non-Discrimination"],
    dimension: "ethics-sustainability",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "transparency-explainability",
    name: "Transparency and Explainability",
    aliases: ["Transparency and Explainability"],
    dimension: "ethics-sustainability",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "human-oversight-determination",
    name: "Human Oversight and Determination",
    aliases: ["Human Oversight and Determination"],
    dimension: "ethics-sustainability",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "environmental-impact",
    name: "Environmental Impact",
    aliases: ["Environmental Impact"],
    dimension: "ethics-sustainability",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "civil-society-engagement-ethics-sustainability",
    name: "Civil Society Engagement in Ethics and Sustainability",
    aliases: ["Civil Society Engagement in Ethics and Sustainability"],
    dimension: "ethics-sustainability",
    pillar: "cso-engagement",
    family: "cse",
    hasEvidence: true,
  },
  {
    slug: "environmental-performance",
    name: "Environmental Performance",
    aliases: ["Environmental Performance", "Low-Carbon Energy Share"],
    dimension: "ethics-sustainability",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },

  // ===== Labour and Skills =====
  {
    slug: "labour-protections",
    name: "Labour Protections",
    aliases: ["Labour Protections"],
    dimension: "labour-skills",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "reskilling-upskilling-initiatives",
    name: "Reskilling/Upskilling Initiatives",
    aliases: [
      "Reskilling/Upskilling Initiatives",
      "Reskilling / upskilling initiatives",
      "Reskilling / Upskilling Initiatives",
      "Reskilling and upskilling initiatives",
    ],
    dimension: "labour-skills",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "ai-literacy",
    name: "AI Literacy",
    aliases: ["AI Literacy", "AI literacy"],
    dimension: "labour-skills",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "civil-society-engagement-labour-skills",
    name: "Civil Society Engagement in Labour and Skills",
    aliases: ["Civil Society Engagement in Labour and Skills"],
    dimension: "labour-skills",
    pillar: "cso-engagement",
    family: "cse",
    hasEvidence: true,
  },
  {
    slug: "labour-rights",
    name: "Labour Rights",
    aliases: ["Labour Rights", "Labour Rights Compliance"],
    dimension: "labour-skills",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },
  {
    slug: "population-digital-readiness",
    name: "Population Digital Readiness",
    aliases: ["Population Digital Readiness", "Skills and Literacy"],
    dimension: "labour-skills",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },

  // ===== Trust and Safety =====
  {
    slug: "safety-security",
    name: "Safety and Security",
    aliases: ["Safety and Security"],
    dimension: "trust-safety",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "access-redress-remedy",
    name: "Access to Redress and Remedy",
    aliases: ["Access to Redress and Remedy"],
    dimension: "trust-safety",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "impact-assessments",
    name: "Impact Assessments",
    aliases: ["Impact Assessments"],
    dimension: "trust-safety",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "ai-facilitated-misinformation-violence",
    name: "AI-facilitated Misinformation and Violence",
    aliases: [
      "AI-facilitated Misinformation and Violence",
      "AI-Facilitated Misinformation and Violence",
    ],
    dimension: "trust-safety",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "civil-society-engagement-trust-safety",
    name: "Civil Society Engagement in Trust and Safety",
    aliases: ["Civil Society Engagement in Trust and Safety"],
    dimension: "trust-safety",
    pillar: "cso-engagement",
    family: "cse",
    hasEvidence: true,
  },
  {
    slug: "data-protection-privacy",
    name: "Data Protection and Privacy",
    aliases: ["Data Protection and Privacy"],
    dimension: "trust-safety",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },
  {
    slug: "data-sharing-access",
    name: "Data Sharing and Access",
    aliases: ["Data Sharing and Access"],
    dimension: "trust-safety",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },
  {
    slug: "consumer-protection",
    name: "Consumer Protection",
    aliases: ["Consumer Protection"],
    dimension: "trust-safety",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    aliases: ["Cybersecurity"],
    dimension: "trust-safety",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },
  {
    slug: "rule-of-law",
    name: "Rule of Law",
    aliases: ["Rule of Law"],
    dimension: "trust-safety",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },
  {
    slug: "global-peace",
    name: "Global Peace",
    aliases: ["Global Peace"],
    dimension: "trust-safety",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },

  // ===== AI Use in Public Service =====
  {
    slug: "public-sector-skills-development",
    name: "Public Sector Skills Development",
    aliases: ["Public Sector Skills Development"],
    dimension: "ai-use-public-service",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "public-disclosure-government-algorithmic-systems",
    name: "Public Disclosure of Government Algorithmic Systems",
    aliases: ["Public Disclosure of Government Algorithmic Systems"],
    dimension: "ai-use-public-service",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "public-procurement",
    name: "Public Procurement",
    aliases: ["Public Procurement"],
    dimension: "ai-use-public-service",
    pillar: "ai-policy",
    family: "ai-policy",
    hasEvidence: true,
  },
  {
    slug: "government-mechanisms-cso-inclusion",
    name: "Government Mechanisms for CSO Inclusion in AI Policy and Governance",
    aliases: ["Government Mechanisms for CSO Inclusion in AI Policy and Governance"],
    dimension: "ai-use-public-service",
    pillar: "cso-engagement",
    family: "cse",
    hasEvidence: true,
  },
  {
    slug: "civil-society-oversight",
    name: "Civil Society Oversight",
    aliases: ["Civil Society Oversight", "Civil Society Accountability"],
    dimension: "ai-use-public-service",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },
  {
    slug: "public-service-delivery",
    name: "Public Service Delivery",
    aliases: ["Public Service Delivery"],
    dimension: "ai-use-public-service",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },
  {
    slug: "right-to-information",
    name: "Right to Information",
    aliases: ["Right to Information", "Access to Public Information"],
    dimension: "ai-use-public-service",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: false,
  },
  {
    slug: "unacceptable-risks-ai-systems",
    name: "Unacceptable Risks AI Systems",
    aliases: [
      "Unacceptable Risks AI Systems",
      "Unacceptable Risk AI Systems",
      "URAI Penalty",
    ],
    dimension: "ai-use-public-service",
    pillar: "enabling-conditions",
    family: "enabling-conditions",
    hasEvidence: true, // URAI evidence is collected; surfaced as "Government Misuse"
  },
];

/**
 * Lookup tables built once. Keys include the canonical slug, the
 * canonical name, and every declared alias — all lower-cased and
 * trimmed. So `findDimension("inclusion-diversity")`,
 * `findDimension("Inclusion and Diversity")`, and any alias all resolve
 * to the same definition.
 */
const indicatorByAlias = new Map<string, IndicatorDef>();
for (const ind of INDICATORS) {
  for (const key of [ind.slug, ind.name, ...ind.aliases]) {
    indicatorByAlias.set(key.toLowerCase().trim(), ind);
  }
}
const dimensionByAlias = new Map<string, DimensionDef>();
for (const d of DIMENSIONS) {
  for (const key of [d.slug, d.name, ...d.aliases]) {
    dimensionByAlias.set(key.toLowerCase().trim(), d);
  }
}
const pillarByAlias = new Map<string, PillarDef>();
for (const p of PILLARS) {
  for (const key of [p.slug, p.name, ...p.aliases]) {
    pillarByAlias.set(key.toLowerCase().trim(), p);
  }
}

export function findIndicator(name: string | null | undefined): IndicatorDef | undefined {
  if (!name) return undefined;
  return indicatorByAlias.get(name.toLowerCase().trim());
}
export function findDimension(name: string | null | undefined): DimensionDef | undefined {
  if (!name) return undefined;
  return dimensionByAlias.get(name.toLowerCase().trim());
}
export function findPillar(name: string | null | undefined): PillarDef | undefined {
  if (!name) return undefined;
  return pillarByAlias.get(name.toLowerCase().trim());
}

export function getIndicator(name: string): IndicatorDef {
  const found = findIndicator(name);
  if (!found) throw new Error(`Unknown indicator name: ${JSON.stringify(name)}`);
  return found;
}
export function getDimension(name: string): DimensionDef {
  const found = findDimension(name);
  if (!found) throw new Error(`Unknown dimension name: ${JSON.stringify(name)}`);
  return found;
}
export function getPillar(name: string): PillarDef {
  const found = findPillar(name);
  if (!found) throw new Error(`Unknown pillar name: ${JSON.stringify(name)}`);
  return found;
}
