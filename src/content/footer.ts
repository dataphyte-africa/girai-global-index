import { sanityFetch } from "../../sanity/lib/fetch";
import { footerQuery } from "../../sanity/lib/queries";
import { footerDefaults, type FooterContent } from "./footer.defaults";
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
  };
}
