import { sanityFetch } from "../../sanity/lib/fetch";
import { aboutPageQuery } from "../../sanity/lib/queries";
import { aboutDefaults, type AboutContent, type SanityImage } from "./about.defaults";

export const ABOUT_TAG = "aboutPage";

type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T;

function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

function image(value: DeepPartial<SanityImage> | null | undefined, fallback: SanityImage): SanityImage {
  if (value && typeof value.url === "string" && value.url.length > 0) {
    return { url: value.url, alt: typeof value.alt === "string" ? value.alt : fallback.alt };
  }
  return fallback;
}

function cta(value: DeepPartial<AboutContent["gcgCta"]> | null | undefined, fallback: AboutContent["gcgCta"]) {
  return {
    label: str(value?.label, fallback.label),
    href: str(value?.href, fallback.href),
  };
}

/** Returns Sanity content where present, falling back to hardcoded defaults. */
export async function getAboutContent(): Promise<AboutContent> {
  let data: DeepPartial<AboutContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<AboutContent> | null>({
      query: aboutPageQuery,
      tags: [ABOUT_TAG],
    });
  } catch {
    data = null;
  }

  const d = aboutDefaults;
  if (!data) return d;

  const cards = (value: DeepPartial<AboutContent["whyCards"]> | undefined, fallback: AboutContent["whyCards"]) =>
    Array.isArray(value) && value.length > 0
      ? value.map((c, i) => ({
          title: str(c?.title, fallback[i]?.title ?? ""),
          description: str(c?.description, fallback[i]?.description ?? ""),
        }))
      : fallback;

  return {
    heroTitleLead: str(data.heroTitleLead, d.heroTitleLead),
    heroTitleAccent: str(data.heroTitleAccent, d.heroTitleAccent),
    heroLead: str(data.heroLead, d.heroLead),
    heroImage: image(data.heroImage, d.heroImage),

    introHeadingLead: str(data.introHeadingLead, d.introHeadingLead),
    introHeadingMuted: str(data.introHeadingMuted, d.introHeadingMuted),
    introBody: str(data.introBody, d.introBody),

    whyHeadingLead: str(data.whyHeadingLead, d.whyHeadingLead),
    whyHeadingAccent: str(data.whyHeadingAccent, d.whyHeadingAccent),
    whyHeadingTail: str(data.whyHeadingTail, d.whyHeadingTail),
    whySubtitle: str(data.whySubtitle, d.whySubtitle),
    whyCards: cards(data.whyCards, d.whyCards),

    gcgBadge: str(data.gcgBadge, d.gcgBadge),
    gcgHeading: str(data.gcgHeading, d.gcgHeading),
    gcgBody: str(data.gcgBody, d.gcgBody),
    gcgCta: cta(data.gcgCta, d.gcgCta),
    gcgImage: image(data.gcgImage, d.gcgImage),

    measuresBadge: str(data.measuresBadge, d.measuresBadge),
    measuresHeadingLead: str(data.measuresHeadingLead, d.measuresHeadingLead),
    measuresHeadingAccent: str(data.measuresHeadingAccent, d.measuresHeadingAccent),
    measuresBody: str(data.measuresBody, d.measuresBody),
    measuresImage: image(data.measuresImage, d.measuresImage),

    contributorsHeading: str(data.contributorsHeading, d.contributorsHeading),
    contributorsSubtitle: str(data.contributorsSubtitle, d.contributorsSubtitle),
    partners:
      Array.isArray(data.partners) && data.partners.length > 0
        ? data.partners.map((p, i) => ({
            name: str(p?.name, d.partners[i]?.name ?? ""),
            logo: p?.logo && typeof p.logo.url === "string" && p.logo.url.length > 0
              ? { url: p.logo.url, alt: typeof p.logo.alt === "string" ? p.logo.alt : null }
              : null,
          }))
        : d.partners,

    whoForHeadingLead: str(data.whoForHeadingLead, d.whoForHeadingLead),
    whoForHeadingAccent: str(data.whoForHeadingAccent, d.whoForHeadingAccent),
    whoForSubtitle: str(data.whoForSubtitle, d.whoForSubtitle),
    audiences: cards(data.audiences, d.audiences),
    whoForImage: image(data.whoForImage, d.whoForImage),
    whoForSummary: str(data.whoForSummary, d.whoForSummary),

    peopleHeadingLead: str(data.peopleHeadingLead, d.peopleHeadingLead),
    peopleHeadingAccent: str(data.peopleHeadingAccent, d.peopleHeadingAccent),
    peopleHeadingTail: str(data.peopleHeadingTail, d.peopleHeadingTail),
    peopleSubtitle: str(data.peopleSubtitle, d.peopleSubtitle),
    people:
      Array.isArray(data.people) && data.people.length > 0
        ? data.people.filter((n): n is string => typeof n === "string" && n.length > 0)
        : d.people,

    footerHeading: str(data.footerHeading, d.footerHeading),
    footerBody: str(data.footerBody, d.footerBody),
    footerCta: cta(data.footerCta, d.footerCta),
    footerImage: image(data.footerImage, d.footerImage),
  };
}
