import { DIMENSIONS, type Dimension } from "@/data/dimensions-data";
import { sanityFetch } from "../../sanity/lib/fetch";
import { dimensionsCopyQuery } from "../../sanity/lib/queries";
import { str } from "./_merge";

export const DIMENSIONS_TAG = "dimensionCopy";

type DimensionDoc = {
  slug?: string;
  subtitle?: string;
  description?: string;
  eyebrow?: string;
  heroLead?: string;
  rankingSubtitle?: string;
  image?: { url?: string | null; alt?: string | null } | null;
};

/**
 * The dimension UI list with editable copy (subtitle, description, eyebrow,
 * heroLead, rankingSubtitle) and the card image overlaid from Sanity. The card
 * image doubles as the centre of the radial dimensions chart. Structural fields
 * — name, indicators, hero imagery — remain code-owned. Falls back to defaults
 * per field.
 */
export async function getDimensionsUi(): Promise<Dimension[]> {
  let docs: DimensionDoc[] | null = null;
  try {
    docs = await sanityFetch<DimensionDoc[] | null>({
      query: dimensionsCopyQuery,
      tags: [DIMENSIONS_TAG],
    });
  } catch {
    docs = null;
  }

  const bySlug = new Map<string, DimensionDoc>(
    (docs ?? [])
      .filter((d): d is DimensionDoc & { slug: string } => typeof d?.slug === "string")
      .map((d) => [d.slug, d])
  );

  return DIMENSIONS.map((d) => {
    const s = bySlug.get(d.id);
    if (!s) return d;
    return {
      ...d,
      subtitle: str(s.subtitle, d.subtitle),
      description: str(s.description, d.description),
      eyebrow: str(s.eyebrow, d.eyebrow),
      heroLead: str(s.heroLead, d.heroLead),
      rankingSubtitle: str(s.rankingSubtitle, d.rankingSubtitle),
      image:
        typeof s.image?.url === "string" && s.image.url.length > 0
          ? s.image.url
          : d.image,
    };
  });
}
