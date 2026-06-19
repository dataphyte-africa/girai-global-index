import type { PillarSlug } from "@/data/2026/taxonomy";

/**
 * Shared pillar badge styling — abbreviation + colour token — so the pillar
 * tags rendered in the comparison section and on the dimension pages stay
 * visually consistent. Full pillar names live in the `PILLARS` taxonomy.
 */
export const PILLAR_BADGES: Record<
  PillarSlug,
  { abbr: string; className: string }
> = {
  "ai-policy": {
    abbr: "AP",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
  "cso-engagement": {
    abbr: "CSO",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400",
  },
  "enabling-conditions": {
    abbr: "EC",
    className:
      "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400",
  },
};
