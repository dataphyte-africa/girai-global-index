import { sanityFetch } from "../../sanity/lib/fetch";
import { countriesPageQuery } from "../../sanity/lib/queries";
import { countriesDefaults, type CountriesContent } from "./countries.defaults";
import { str, type DeepPartial } from "./_merge";

export const COUNTRIES_TAG = "countriesPage";

export async function getCountriesContent(): Promise<CountriesContent> {
  let data: DeepPartial<CountriesContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<CountriesContent> | null>({
      query: countriesPageQuery,
      tags: [COUNTRIES_TAG],
    });
  } catch {
    data = null;
  }

  const d = countriesDefaults;
  if (!data) return d;

  return {
    heroTitleLine1: str(data.heroTitleLine1, d.heroTitleLine1),
    heroTitleAccent: str(data.heroTitleAccent, d.heroTitleAccent),
    heroSubtitle: str(data.heroSubtitle, d.heroSubtitle),
    compareHeadingLead: str(data.compareHeadingLead, d.compareHeadingLead),
    compareHeadingAccent: str(data.compareHeadingAccent, d.compareHeadingAccent),
    compareSubheading: str(data.compareSubheading, d.compareSubheading),
    takeawaysHeadingAccent: str(data.takeawaysHeadingAccent, d.takeawaysHeadingAccent),
    takeawaysHeadingTail: str(data.takeawaysHeadingTail, d.takeawaysHeadingTail),
    takeawaysSubtitle: str(data.takeawaysSubtitle, d.takeawaysSubtitle),
    seoTitle: str(data.seoTitle, d.seoTitle),
    seoDescription: str(data.seoDescription, d.seoDescription),
  };
}
