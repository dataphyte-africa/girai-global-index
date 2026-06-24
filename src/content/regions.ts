import { sanityFetch } from "../../sanity/lib/fetch";
import { regionsPageQuery } from "../../sanity/lib/queries";
import { regionsDefaults, type RegionsContent } from "./regions.defaults";
import { str, type DeepPartial } from "./_merge";

export const REGIONS_TAG = "regionsPage";

export async function getRegionsContent(): Promise<RegionsContent> {
  let data: DeepPartial<RegionsContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<RegionsContent> | null>({
      query: regionsPageQuery,
      tags: [REGIONS_TAG],
    });
  } catch {
    data = null;
  }

  const d = regionsDefaults;
  if (!data) return d;

  return {
    heroTitleLine1: str(data.heroTitleLine1, d.heroTitleLine1),
    heroTitleAccent: str(data.heroTitleAccent, d.heroTitleAccent),
    heroSubtitle: str(data.heroSubtitle, d.heroSubtitle),
    overviewHeading: str(data.overviewHeading, d.overviewHeading),
    overviewSubtitle: str(data.overviewSubtitle, d.overviewSubtitle),
    compareHeadingLead: str(data.compareHeadingLead, d.compareHeadingLead),
    compareHeadingAccent: str(data.compareHeadingAccent, d.compareHeadingAccent),
    compareSubheading: str(data.compareSubheading, d.compareSubheading),
    seoTitle: str(data.seoTitle, d.seoTitle),
    seoDescription: str(data.seoDescription, d.seoDescription),
  };
}
