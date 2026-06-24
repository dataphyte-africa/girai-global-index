import { sanityFetch } from "../../sanity/lib/fetch";
import { homePageQuery } from "../../sanity/lib/queries";
import { homeDefaults, type HomeContent } from "./home.defaults";
import { cards, str, strings, type DeepPartial } from "./_merge";

export const HOME_TAG = "homePage";

export async function getHomeContent(): Promise<HomeContent> {
  let data: DeepPartial<HomeContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<HomeContent> | null>({
      query: homePageQuery,
      tags: [HOME_TAG],
    });
  } catch {
    data = null;
  }

  const d = homeDefaults;
  if (!data) return d;

  return {
    heroHeadlineLead: str(data.heroHeadlineLead, d.heroHeadlineLead),
    heroHeadlineAccent: str(data.heroHeadlineAccent, d.heroHeadlineAccent),
    heroHeadlineTail: str(data.heroHeadlineTail, d.heroHeadlineTail),
    heroSubtext: str(data.heroSubtext, d.heroSubtext),

    whyHeading: str(data.whyHeading, d.whyHeading),
    whySubtitle: str(data.whySubtitle, d.whySubtitle),
    whyCtaLabel: str(data.whyCtaLabel, d.whyCtaLabel),
    whyParagraphs: strings(data.whyParagraphs, d.whyParagraphs),

    dimensionsHeadingLead: str(data.dimensionsHeadingLead, d.dimensionsHeadingLead),
    dimensionsHeadingAccent: str(data.dimensionsHeadingAccent, d.dimensionsHeadingAccent),
    dimensionsSubtitle: str(data.dimensionsSubtitle, d.dimensionsSubtitle),

    reportBadge: str(data.reportBadge, d.reportBadge),
    reportHeadingLead: str(data.reportHeadingLead, d.reportHeadingLead),
    reportHeadingAccent: str(data.reportHeadingAccent, d.reportHeadingAccent),
    reportBody: str(data.reportBody, d.reportBody),
    reportPrimaryCtaLabel: str(data.reportPrimaryCtaLabel, d.reportPrimaryCtaLabel),
    reportSecondaryCtaLabel: str(data.reportSecondaryCtaLabel, d.reportSecondaryCtaLabel),

    takeawaysBadge: str(data.takeawaysBadge, d.takeawaysBadge),
    takeawaysHeadingAccent: str(data.takeawaysHeadingAccent, d.takeawaysHeadingAccent),
    takeawaysHeadingTail: str(data.takeawaysHeadingTail, d.takeawaysHeadingTail),
    takeawaysSubtitle: str(data.takeawaysSubtitle, d.takeawaysSubtitle),
    takeawaysViewAllLabel: str(data.takeawaysViewAllLabel, d.takeawaysViewAllLabel),

    evidenceBadge: str(data.evidenceBadge, d.evidenceBadge),
    evidenceHeading: str(data.evidenceHeading, d.evidenceHeading),
    evidenceBody: str(data.evidenceBody, d.evidenceBody),
    evidenceCtaLabel: str(data.evidenceCtaLabel, d.evidenceCtaLabel),
    evidenceNote: str(data.evidenceNote, d.evidenceNote),

    indicatorsHeadingAccent: str(data.indicatorsHeadingAccent, d.indicatorsHeadingAccent),
    indicatorsHeadingTail: str(data.indicatorsHeadingTail, d.indicatorsHeadingTail),
    indicatorsSubtitle: str(data.indicatorsSubtitle, d.indicatorsSubtitle),

    limitsHeadingLead: str(data.limitsHeadingLead, d.limitsHeadingLead),
    limitsHeadingAccent: str(data.limitsHeadingAccent, d.limitsHeadingAccent),
    limitsSubtitle: str(data.limitsSubtitle, d.limitsSubtitle),
    limitsCards: cards(data.limitsCards, d.limitsCards),

    impactHeadingLead: str(data.impactHeadingLead, d.impactHeadingLead),
    impactHeadingAccent: str(data.impactHeadingAccent, d.impactHeadingAccent),
    impactSubtitle: str(data.impactSubtitle, d.impactSubtitle),
    impactCards: cards(data.impactCards, d.impactCards),

    shapingHeadingLines: strings(data.shapingHeadingLines, d.shapingHeadingLines),
  };
}
