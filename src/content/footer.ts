import { sanityFetch } from "../../sanity/lib/fetch";
import { footerQuery } from "../../sanity/lib/queries";
import {
  footerDefaults,
  type FooterContent,
  type FunderLogo,
} from "./footer.defaults";
import { ctas, str, type DeepPartial } from "./_merge";

export const FOOTER_TAG = "footer";

export async function getFooterContent(): Promise<FooterContent> {
  let data: DeepPartial<FooterContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<FooterContent> | null>({
      query: footerQuery,
      tags: [FOOTER_TAG],
    });
  } catch {
    data = null;
  }

  const d = footerDefaults;
  if (!data) return d;

  return {
    subscribeHeading: str(data.subscribeHeading, d.subscribeHeading),
    subscribeBody: str(data.subscribeBody, d.subscribeBody),
    namePlaceholder: str(data.namePlaceholder, d.namePlaceholder),
    emailPlaceholder: str(data.emailPlaceholder, d.emailPlaceholder),
    submitLabel: str(data.submitLabel, d.submitLabel),
    resultsLinks: ctas(data.resultsLinks, d.resultsLinks),
    regionLinks: ctas(data.regionLinks, d.regionLinks),
    otherProjectsLinks: ctas(data.otherProjectsLinks, d.otherProjectsLinks),
    socialLinks: ctas(data.socialLinks, d.socialLinks),
    funderNoteText: str(data.funderNoteText, d.funderNoteText),
    funderLogos: funderLogos(data.funderLogos, d.funderLogos),
    funderLogo:
      data.funderLogo &&
      typeof data.funderLogo.url === "string" &&
      data.funderLogo.url.length > 0
        ? {
            url: data.funderLogo.url,
            alt:
              typeof data.funderLogo.alt === "string"
                ? data.funderLogo.alt
                : null,
          }
        : d.funderLogo,
    funderLink: str(data.funderLink, d.funderLink),
  };
}

/**
 * Keep only funder entries that carry a usable logo URL; fall back to the
 * hardcoded defaults when Sanity has no valid entries.
 */
function funderLogos(
  value: DeepPartial<FunderLogo[]> | undefined,
  fallback: FunderLogo[]
): FunderLogo[] {
  if (!Array.isArray(value)) return fallback;
  const cleaned = value.flatMap((item): FunderLogo[] => {
    const url = item?.logo?.url;
    if (typeof url !== "string" || url.length === 0) return [];
    const name = typeof item?.name === "string" ? item.name : "";
    return [
      {
        name,
        logo: {
          url,
          alt: typeof item?.logo?.alt === "string" ? item.logo.alt : name || null,
        },
        url: typeof item?.url === "string" ? item.url : "",
      },
    ];
  });
  return cleaned.length > 0 ? cleaned : fallback;
}
