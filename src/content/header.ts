import { sanityFetch } from "../../sanity/lib/fetch";
import { headerQuery } from "../../sanity/lib/queries";
import { headerDefaults, type HeaderContent } from "./header.defaults";
import { cta, ctas, type DeepPartial } from "./_merge";

export const HEADER_TAG = "header";

export async function getHeaderContent(): Promise<HeaderContent> {
  let data: DeepPartial<HeaderContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<HeaderContent> | null>({
      query: headerQuery,
      tags: [HEADER_TAG],
    });
  } catch {
    data = null;
  }

  const d = headerDefaults;
  if (!data) return d;

  return {
    primaryNav: ctas(data.primaryNav, d.primaryNav),
    exploreLinks: ctas(data.exploreLinks, d.exploreLinks),
    downloadCta: cta(data.downloadCta, d.downloadCta),
  };
}
