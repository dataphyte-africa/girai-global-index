import { sanityFetch } from "../../sanity/lib/fetch";
import { takeawaysPageQuery } from "../../sanity/lib/queries";
import { takeawaysDefaults, type TakeawaysContent } from "./takeaways.defaults";
import { cards, img, stats, str, type DeepPartial } from "./_merge";

export const TAKEAWAYS_TAG = "takeawaysPage";

export async function getTakeawaysContent(): Promise<TakeawaysContent> {
  let data: DeepPartial<TakeawaysContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<TakeawaysContent> | null>({
      query: takeawaysPageQuery,
      tags: [TAKEAWAYS_TAG],
    });
  } catch {
    data = null;
  }

  const d = takeawaysDefaults;
  if (!data) return d;

  return {
    heroTitleLead: str(data.heroTitleLead, d.heroTitleLead),
    heroTitleAccent: str(data.heroTitleAccent, d.heroTitleAccent),
    heroLead: str(data.heroLead, d.heroLead),
    heroStats: stats(data.heroStats, d.heroStats),
    heroImage: img(data.heroImage, d.heroImage),

    introHeadingLead: str(data.introHeadingLead, d.introHeadingLead),
    introHeadingMuted: str(data.introHeadingMuted, d.introHeadingMuted),

    keyInsightsHeadingAccent: str(data.keyInsightsHeadingAccent, d.keyInsightsHeadingAccent),
    keyInsightsHeadingTail: str(data.keyInsightsHeadingTail, d.keyInsightsHeadingTail),
    keyInsightsSubtitle: str(data.keyInsightsSubtitle, d.keyInsightsSubtitle),
    insights: cards(data.insights, d.insights),
  };
}
