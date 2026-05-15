/**
 * UI metadata for the five 2026 GIRAI dimensions.
 *
 * The canonical name, slug and indicator list come from
 * `src/data/2026/taxonomy.ts`. This file only adds presentation-only
 * fields (subtitle, description, image) and exposes the shape the
 * dimensions UI components already consume.
 *
 * The descriptions here are placeholders pending Sanity CMS authoring
 * (see ADR 0004); replace them by wiring `getNarrative('dimension', slug)`
 * once the CMS schema lands.
 */

import { DIMENSIONS as TAXONOMY_DIMENSIONS, INDICATORS } from "./2026/taxonomy";
import type { DimensionDef, IndicatorDef } from "./2026/taxonomy";

export interface Dimension {
  /** Slug — matches the URL contract (ADR 0007). */
  id: string;
  name: string;
  subtitle: string;
  description: string;
  /** Display names of indicators in this dimension (AI Policy + CSO Engagement only). */
  indicators: string[];
  image?: string;
}

interface PresentationCopy {
  subtitle: string;
  description: string;
  image: string;
}

const PRESENTATION: Record<DimensionDef["slug"], PresentationCopy> = {
  "inclusion-diversity": {
    subtitle: "Representation and Protection in AI Systems",
    description:
      "Evaluates whether AI systems are designed and governed to be inclusive and equitable. This dimension examines how countries address bias and discrimination, gender equality, children's rights, and cultural and linguistic diversity in AI policy and governance.\n\nStrong performance reflects national efforts to ensure AI does not reinforce existing inequalities or exclude marginalised groups.",
    image: "/dimensions/dimension-inclusion-diversity.jpg",
  },
  "ethics-sustainability": {
    subtitle: "Principles and Long-term Impact",
    description:
      "Evaluates whether AI systems are developed and used in alignment with ethical principles and environmental sustainability. Covers fairness and non-discrimination, transparency and explainability, human oversight, and the environmental impact of AI infrastructure.\n\nStrong performance reflects a national commitment to embedding ethical considerations throughout the AI lifecycle.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
  },
  "labour-skills": {
    subtitle: "Workforce Readiness and Adaptation",
    description:
      "Evaluates how countries prepare workers for an AI-driven economy and protect labour rights in the age of automation. Examines labour protections, reskilling and upskilling initiatives, and AI literacy across the population.\n\nStrong performance reflects efforts to ensure the benefits of AI are shared broadly and that workers are supported through technological change.",
    image: "/dimensions/dimension-labour-skills.jpg",
  },
  "trust-safety": {
    subtitle: "Security, Accountability, and Redress",
    description:
      "Evaluates the safeguards in place to protect individuals and society from AI-related harms. Covers safety and security, access to redress and remedy, impact assessments, and measures to address AI-facilitated misinformation and violence.\n\nStrong performance reflects a national commitment to building trust in AI systems through robust governance, accountability, and pathways to remedy.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
  },
  "ai-use-public-service": {
    subtitle: "Government AI Governance and Transparency",
    description:
      "Evaluates how governments deploy AI in public services and the transparency and oversight mechanisms in place. Covers public sector skills development, public disclosure of government algorithmic systems, ethical public procurement, and the handling of unacceptable-risk AI deployments.\n\nStrong performance reflects efforts to ensure that government use of AI serves the public interest and is subject to appropriate scrutiny.",
    image: "/dimensions/dimension-public-sector.jpg",
  },
};

/**
 * Indicators shown on the public-facing dimension cards. We hide
 * Enabling Conditions indicators here because they're externally-sourced
 * indices (Rule of Law, Cybersecurity, Population Digital Readiness, …)
 * rather than GIRAI-collected primary evidence — the dimension landing
 * surface focuses on the latter. The full catalogue is still available
 * via the taxonomy module.
 */
function indicatorsForCard(slug: DimensionDef["slug"]): string[] {
  return INDICATORS.filter(
    (i: IndicatorDef) => i.dimension === slug && i.family !== "enabling-conditions"
  ).map((i) => i.name);
}

export const DIMENSIONS: Dimension[] = TAXONOMY_DIMENSIONS.map((d) => ({
  id: d.slug,
  name: d.name,
  subtitle: PRESENTATION[d.slug].subtitle,
  description: PRESENTATION[d.slug].description,
  image: PRESENTATION[d.slug].image,
  indicators: indicatorsForCard(d.slug),
}));
