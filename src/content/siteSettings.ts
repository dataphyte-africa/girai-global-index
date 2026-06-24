import { sanityFetch } from "../../sanity/lib/fetch";
import { siteSettingsQuery } from "../../sanity/lib/queries";
import { siteSettingsDefaults, type SiteSettingsContent } from "./siteSettings.defaults";
import { img, str, strings, type DeepPartial } from "./_merge";

export const SITE_SETTINGS_TAG = "siteSettings";

export async function getSiteSettings(): Promise<SiteSettingsContent> {
  let data: DeepPartial<SiteSettingsContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<SiteSettingsContent> | null>({
      query: siteSettingsQuery,
      tags: [SITE_SETTINGS_TAG],
    });
  } catch {
    data = null;
  }

  const d = siteSettingsDefaults;
  if (!data) return d;

  return {
    defaultTitle: str(data.defaultTitle, d.defaultTitle),
    titleTemplate: str(data.titleTemplate, d.titleTemplate),
    description: str(data.description, d.description),
    keywords: strings(data.keywords, d.keywords),
    ogTitle: str(data.ogTitle, d.ogTitle),
    ogDescription: str(data.ogDescription, d.ogDescription),
    ogImage: img(data.ogImage, d.ogImage),
  };
}
