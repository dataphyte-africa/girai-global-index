import type { PillarSlug } from "@/data/2026/taxonomy";
import { PILLAR_COPY } from "@/lib/pillar-copy";
import { sanityFetch } from "../../sanity/lib/fetch";
import { pillarsQuery } from "../../sanity/lib/queries";
import { str } from "./_merge";

export const PILLARS_TAG = "pillar";

export type PillarCopyEntry = {
  heading: string;
  body: string;
  driversDescription: string;
  /** Asset path — stays code-owned (not editorial), always taken from defaults. */
  image: string;
};

export type PillarCopyMap = Record<PillarSlug, PillarCopyEntry>;

type PillarDoc = {
  slug?: string;
  heading?: string;
  body?: string;
  driversDescription?: string;
  image?: { url?: string | null; alt?: string | null } | null;
};

/**
 * Editable pillar copy, merged over the code defaults (src/lib/pillar-copy.ts).
 * Falls back to defaults for any field/pillar missing from Sanity.
 */
export async function getPillarCopy(): Promise<PillarCopyMap> {
  let docs: PillarDoc[] | null = null;
  try {
    docs = await sanityFetch<PillarDoc[] | null>({
      query: pillarsQuery,
      tags: [PILLARS_TAG],
    });
  } catch {
    docs = null;
  }

  const bySlug = new Map<string, PillarDoc>(
    (docs ?? [])
      .filter((d): d is PillarDoc & { slug: string } => typeof d?.slug === "string")
      .map((d) => [d.slug, d])
  );

  const slugs = Object.keys(PILLAR_COPY) as PillarSlug[];
  return slugs.reduce((map, slug) => {
    const d = PILLAR_COPY[slug];
    const s = bySlug.get(slug);
    map[slug] = {
      heading: str(s?.heading, d.heading),
      body: str(s?.body, d.body),
      driversDescription: str(s?.driversDescription, d.driversDescription),
      image:
        typeof s?.image?.url === "string" && s.image.url.length > 0
          ? s.image.url
          : d.image,
    };
    return map;
  }, {} as PillarCopyMap);
}
