import { sanityFetch } from "../../sanity/lib/fetch";
import { indicatorsPageQuery } from "../../sanity/lib/queries";
import { indicatorsDefaults, type IndicatorsContent } from "./indicators.defaults";
import { img, str, type DeepPartial } from "./_merge";

export const INDICATORS_TAG = "indicatorsPage";

export async function getIndicatorsContent(): Promise<IndicatorsContent> {
  let data: DeepPartial<IndicatorsContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<IndicatorsContent> | null>({
      query: indicatorsPageQuery,
      tags: [INDICATORS_TAG],
    });
  } catch {
    data = null;
  }

  const d = indicatorsDefaults;
  if (!data) return d;

  return {
    heroTitleAccent: str(data.heroTitleAccent, d.heroTitleAccent),
    heroTitleTail: str(data.heroTitleTail, d.heroTitleTail),
    heroLead: str(data.heroLead, d.heroLead),
    heroImage: img(data.heroImage, d.heroImage),
    seoTitle: str(data.seoTitle, d.seoTitle),
    seoDescription: str(data.seoDescription, d.seoDescription),
  };
}
