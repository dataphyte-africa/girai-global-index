import type { SanityImage } from "./about.defaults";

export type IndicatorsContent = {
  heroTitleAccent: string;
  heroTitleTail: string;
  heroLead: string;
  heroImage: SanityImage;
  seoTitle: string;
  seoDescription: string;
};

export const indicatorsDefaults: IndicatorsContent = {
  heroTitleAccent: "Indicators used ",
  heroTitleTail: "for Index measurement",
  heroLead:
    "The full set of structured indicators used to evaluate how countries govern, regulate, and implement responsible artificial intelligence.",
  heroImage: { url: "/indicator/hero-indicator.png", alt: null },
  seoTitle: "Indicators | GIRAI Global Index",
  seoDescription:
    "The full set of structured indicators used to evaluate how countries govern, regulate, and implement responsible artificial intelligence.",
};
