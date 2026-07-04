import {
  getRegionCopy as getBaseRegionCopy,
  regionToSlug,
  type RegionCopy,
} from "@/lib/regions";
import { sanityFetch } from "../../sanity/lib/fetch";
import { regionPagesQuery } from "../../sanity/lib/queries";
import { str } from "./_merge";

export const REGION_COPY_TAG = "regionPage";

type RegionDoc = {
  slug?: string;
  adjective?: string;
  blurb?: string;
  footerBlurb?: string;
};

async function fetchOverrides(): Promise<Map<string, RegionDoc>> {
  let docs: RegionDoc[] | null = null;
  try {
    docs = await sanityFetch<RegionDoc[] | null>({
      query: regionPagesQuery,
      tags: [REGION_COPY_TAG],
    });
  } catch {
    docs = null;
  }

  return new Map(
    (docs ?? [])
      .filter((d): d is RegionDoc & { slug: string } => typeof d?.slug === "string")
      .map((d) => [d.slug, d])
  );
}

/**
 * Editorial copy for a region page, with Sanity overrides merged over the code
 * defaults (src/lib/regions.ts REGION_COPY). Falls back to defaults for any
 * region/field missing from Sanity, so an unseeded or unknown region still
 * renders sensible copy.
 */
export async function getRegionCopy(regionName: string): Promise<RegionCopy> {
  const base = getBaseRegionCopy(regionName);
  const o = (await fetchOverrides()).get(regionToSlug(regionName));
  if (!o) return base;

  return {
    adjective: str(o.adjective, base.adjective),
    blurb: str(o.blurb, base.blurb),
    footerBlurb: str(o.footerBlurb, base.footerBlurb),
  };
}
