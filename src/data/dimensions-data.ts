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
import type { DimensionDef, IndicatorDef, PillarSlug } from "./2026/taxonomy";

/** A single pillar's indicators within a dimension, for the grouped card view. */
export interface PillarGroup {
  slug: PillarSlug;
  /** Short label shown on the dimension card. */
  label: string;
  indicators: string[];
}

export interface Dimension {
  /** Slug — matches the URL contract (ADR 0007). */
  id: string;
  name: string;
  subtitle: string;
  description: string;
  /** Display names of indicators in this dimension (AI Policy + CSO Engagement only). */
  indicators: string[];
  /** Indicators grouped by pillar (AI Policy, CSO Engagement, Country Context). */
  pillarGroups: PillarGroup[];
  /** Card / illustration image. */
  image?: string;
  /** Wide hero banner used on the dimension detail page. */
  heroImage: string;
  /** Short eyebrow shown above the hero heading. */
  eyebrow: string;
  /** One-line lead used under the hero heading (shorter than `description`). */
  heroLead: string;
  /** Sub-headline for the "Global Rankings" section. */
  rankingSubtitle: string;
}

interface PresentationCopy {
  subtitle: string;
  description: string;
  image: string;
  heroImage: string;
  eyebrow: string;
  heroLead: string;
  rankingSubtitle: string;
}

const PRESENTATION: Record<DimensionDef["slug"], PresentationCopy> = {
  "inclusion-diversity": {
    subtitle: "Representation and Protection in AI Systems",
    description:
      "Evaluates whether AI systems are designed and governed to be inclusive and equitable. This dimension examines how countries address bias and discrimination, gender equality, children's rights, and cultural and linguistic diversity in AI policy and governance.\n\nStrong performance reflects national efforts to ensure AI does not reinforce existing inequalities or exclude marginalised groups.",
    image: "/dimensions/dimension-inclusion-diversity.jpg",
    heroImage: "/new-dimensions/diversity-inclusion.png",
    eyebrow: "Responsible AI Dimension",
    heroLead:
      "This dimension examines how countries address bias, discrimination, and representation in AI systems, ensuring they remain inclusive, equitable, and respectful of marginalised communities.",
    rankingSubtitle:
      "Countries ranked by their performance in ensuring AI systems are inclusive, diverse and non-discriminatory.",
  },
  "ethics-sustainability": {
    subtitle: "Principles and Long-term Impact",
    description:
      "Evaluates whether AI systems are developed and used in alignment with ethical principles and environmental sustainability. Covers fairness and non-discrimination, transparency and explainability, human oversight, and the environmental impact of AI infrastructure.\n\nStrong performance reflects a national commitment to embedding ethical considerations throughout the AI lifecycle.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    heroImage: "/new-dimensions/ethics-sustainability.png",
    eyebrow: "Responsible AI Dimension",
    heroLead:
      "This dimension examines how AI is developed and deployed in alignment with ethical principles and environmental sustainability, ensuring fairness, transparency, and long-term accountability.",
    rankingSubtitle:
      "Countries ranked by how well they embed ethics and sustainability across the AI lifecycle.",
  },
  "labour-skills": {
    subtitle: "Workforce Readiness and Adaptation",
    description:
      "Evaluates how countries prepare workers for an AI-driven economy and protect labour rights in the age of automation. Examines labour protections, reskilling and upskilling initiatives, and AI literacy across the population.\n\nStrong performance reflects efforts to ensure the benefits of AI are shared broadly and that workers are supported through technological change.",
    image: "/dimensions/dimension-labour-skills.jpg",
    heroImage: "/new-dimensions/labour-skills.png",
    eyebrow: "Responsible AI Dimension",
    heroLead:
      "This dimension examines how countries prepare workers for an AI-driven economy and protect labour rights, ensuring the benefits of AI are shared broadly across society.",
    rankingSubtitle:
      "Countries ranked by how well they protect labour and build AI-ready skills.",
  },
  "trust-safety": {
    subtitle: "Security, Accountability, and Redress",
    description:
      "Evaluates the safeguards in place to protect individuals and society from AI-related harms. Covers safety and security, access to redress and remedy, impact assessments, and measures to address AI-facilitated misinformation and violence.\n\nStrong performance reflects a national commitment to building trust in AI systems through robust governance, accountability, and pathways to remedy.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    heroImage: "/new-dimensions/trust-safety.png",
    eyebrow: "Responsible AI Dimension",
    heroLead:
      "This dimension examines the safeguards protecting individuals and society from AI-related harms, ensuring safety, accountability, and accessible routes to remedy.",
    rankingSubtitle:
      "Countries ranked by the strength of their AI safety, accountability and redress safeguards.",
  },
  "ai-use-public-service": {
    subtitle: "Government AI Governance and Transparency",
    description:
      "Evaluates how governments deploy AI in public services and the transparency and oversight mechanisms in place. Covers public sector skills development, public disclosure of government algorithmic systems, ethical public procurement, and the handling of unacceptable-risk AI deployments.\n\nStrong performance reflects efforts to ensure that government use of AI serves the public interest and is subject to appropriate scrutiny.",
    image: "/dimensions/dimension-public-sector.jpg",
    heroImage: "/new-dimensions/ai-use-in-public.png",
    eyebrow: "Responsible AI Dimension",
    heroLead:
      "This dimension examines how governments deploy AI in public services, ensuring its use remains transparent, accountable, and respectful of fundamental rights and democratic values.",
    rankingSubtitle:
      "Countries ranked by how transparently and accountably they use AI in public service.",
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

/** Short pillar labels for the dimension card's grouped view. */
const PILLAR_LABELS: Record<PillarSlug, string> = {
  "ai-policy": "AI Policy",
  "cso-engagement": "CSO Engagement",
  "enabling-conditions": "Country Context",
};

const PILLAR_ORDER: PillarSlug[] = [
  "ai-policy",
  "cso-engagement",
  "enabling-conditions",
];

/**
 * Indicators of a dimension grouped by their pillar, in canonical pillar
 * order. Empty pillars are omitted so the card only renders groups that
 * actually have indicators.
 */
function pillarGroupsForCard(slug: DimensionDef["slug"]): PillarGroup[] {
  return PILLAR_ORDER.map((pillar) => ({
    slug: pillar,
    label: PILLAR_LABELS[pillar],
    indicators: INDICATORS.filter(
      (i: IndicatorDef) => i.dimension === slug && i.pillar === pillar
    ).map((i) => i.name),
  })).filter((group) => group.indicators.length > 0);
}

export const DIMENSIONS: Dimension[] = TAXONOMY_DIMENSIONS.map((d) => ({
  id: d.slug,
  name: d.name,
  subtitle: PRESENTATION[d.slug].subtitle,
  description: PRESENTATION[d.slug].description,
  image: PRESENTATION[d.slug].image,
  heroImage: PRESENTATION[d.slug].heroImage,
  eyebrow: PRESENTATION[d.slug].eyebrow,
  heroLead: PRESENTATION[d.slug].heroLead,
  rankingSubtitle: PRESENTATION[d.slug].rankingSubtitle,
  indicators: indicatorsForCard(d.slug),
  pillarGroups: pillarGroupsForCard(d.slug),
}));
