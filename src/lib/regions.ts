/**
 * Region routing + presentation helpers.
 *
 * Region *names* are the canonical values stored on every country
 * (`CountryRanking.region`) and produced by `getRegions()`. The public
 * URL contract is the slug derived from that name (e.g. "Asia and
 * Oceania" → "asia-and-oceania"). Slugs are stable; do not rename.
 *
 * Per-region copy (adjective + blurbs) lives here so the region pages can
 * read naturally ("African countries", "European countries") without
 * shipping a CMS. Unknown regions fall back to neutral phrasing.
 */

/** Short labels used in navigation and overview cards. */
const REGION_DISPLAY_NAMES: Record<string, string> = {
  "Northern America": "North America",
  "Asia and Oceania": "Asia & Oceania",
  Caribbean: "Caribbean",
};

export function getRegionDisplayName(region: string): string {
  return REGION_DISPLAY_NAMES[region] ?? region;
}

/** Turn a region name into a URL slug. */
export function regionToSlug(region: string): string {
  return region
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export interface RegionCopy {
  /** Adjective form used inline, e.g. "African" → "Explore how African countries…". */
  adjective: string;
  /** Hero subtitle below the title. */
  blurb: string;
  /** Footer CTA hero subtitle. */
  footerBlurb: string;
}

/**
 * Editorial overrides per canonical region. Anything not listed here uses
 * {@link fallbackCopy}, so adding a new region to the dataset never breaks
 * the build — it just reads a little more generically until copy is added.
 */
const REGION_COPY: Record<string, RegionCopy> = {
  Africa: {
    adjective: "African",
    blurb:
      "Explore how African countries are shaping, governing and deploying artificial intelligence, and how their performance compares across the dimensions of responsible AI.",
    footerBlurb:
      "Stronger policies, skills development, and regional cooperation are key to building trustworthy and inclusive AI systems across Africa.",
  },
  "Asia and Oceania": {
    adjective: "Asian and Oceanian",
    blurb:
      "Explore how countries across Asia and Oceania are shaping, governing and deploying artificial intelligence, and how their performance compares across the dimensions of responsible AI.",
    footerBlurb:
      "Stronger policies, skills development, and regional cooperation are key to building trustworthy and inclusive AI systems across Asia and Oceania.",
  },
  Caribbean: {
    adjective: "Caribbean",
    blurb:
      "Explore how Caribbean countries are shaping, governing and deploying artificial intelligence, and how their performance compares across the dimensions of responsible AI.",
    footerBlurb:
      "Stronger policies, skills development, and regional cooperation are key to building trustworthy and inclusive AI systems across the Caribbean.",
  },
  Europe: {
    adjective: "European",
    blurb:
      "Explore how European countries are shaping, governing and deploying artificial intelligence, and how their performance compares across the dimensions of responsible AI.",
    footerBlurb:
      "Stronger policies, skills development, and regional cooperation are key to building trustworthy and inclusive AI systems across Europe.",
  },
  "Middle East": {
    adjective: "Middle Eastern",
    blurb:
      "Explore how Middle Eastern countries are shaping, governing and deploying artificial intelligence, and how their performance compares across the dimensions of responsible AI.",
    footerBlurb:
      "Stronger policies, skills development, and regional cooperation are key to building trustworthy and inclusive AI systems across the Middle East.",
  },
  "Northern America": {
    adjective: "North American",
    blurb:
      "Explore how North American countries are shaping, governing and deploying artificial intelligence, and how their performance compares across the dimensions of responsible AI.",
    footerBlurb:
      "Stronger policies, skills development, and regional cooperation are key to building trustworthy and inclusive AI systems across North America.",
  },
  "South and Central America": {
    adjective: "South and Central American",
    blurb:
      "Explore how South and Central American countries are shaping, governing and deploying artificial intelligence, and how their performance compares across the dimensions of responsible AI.",
    footerBlurb:
      "Stronger policies, skills development, and regional cooperation are key to building trustworthy and inclusive AI systems across South and Central America.",
  },
};

function fallbackCopy(region: string): RegionCopy {
  return {
    adjective: region,
    blurb: `Explore how countries in ${region} are shaping, governing and deploying artificial intelligence, and how their performance compares across the dimensions of responsible AI.`,
    footerBlurb: `Stronger policies, skills development, and regional cooperation are key to building trustworthy and inclusive AI systems across ${region}.`,
  };
}

export function getRegionCopy(region: string): RegionCopy {
  return REGION_COPY[region] ?? fallbackCopy(region);
}
