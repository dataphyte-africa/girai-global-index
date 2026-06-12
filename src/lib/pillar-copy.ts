import type { PillarSlug } from "@/data/2026/taxonomy";

/** Editorial copy for GIRAI pillars (shared across homepage categories and country drivers). */
export const PILLAR_COPY: Record<
  PillarSlug,
  { heading: string; body: string; driversDescription: string; image: string }
> = {
  "ai-policy": {
    heading: "AI Policy",
    body: "Assesses the presence, scope, and implementation of public-sector policies, institutions, and actions guiding responsible AI use.",
    driversDescription:
      "National AI strategies, laws, and oversight mechanisms that establish formal governance structures.",
    image: "/categories/government.png",
  },
  "cso-engagement": {
    heading: "Civil society engagement",
    body: "Captures the extent to which civil society, academia, and non-state actors contribute to shaping and overseeing responsible AI.",
    driversDescription:
      "Participation of academia, advocacy groups, and non-state actors in shaping governance and ensuring accountability.",
    image: "/categories/cso-engagement.png",
  },
  "enabling-conditions": {
    heading: "Enabling conditions",
    body: "Reflects the broader national conditions, capacities, and environments that influence responsible AI development and governance.",
    driversDescription:
      "Institutional capacity, rule of law, digital readiness, and labour protections that enable effective governance.",
    image: "/categories/country-context.png",
  },
};
