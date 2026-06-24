import type { Cta } from "./about.defaults";

export type FooterContent = {
  subscribeHeading: string;
  subscribeBody: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  submitLabel: string;
  resultsLinks: Cta[];
  regionLinks: Cta[];
  otherProjectsLinks: Cta[];
  socialLinks: Cta[];
};

export const footerDefaults: FooterContent = {
  subscribeHeading: "Subscribe",
  subscribeBody:
    "Join our mailing list for insights, commentary and analysis on the work of the Index",
  namePlaceholder: "Input Name",
  emailPlaceholder: "Input Email",
  submitLabel: "Send",
  resultsLinks: [
    { label: "Results", href: "/" },
    { label: "Top takeaways", href: "/takeaways" },
    { label: "Countries", href: "/countries" },
    { label: "Dimensions", href: "/" },
  ],
  regionLinks: [
    { label: "Africa", href: "/regions/africa" },
    { label: "Asia and Oceania", href: "/regions/asia-and-oceania" },
    { label: "The Caribbean", href: "/regions/caribbean" },
    { label: "Europe", href: "/regions/europe" },
    { label: "Middle East", href: "/regions/middle-east" },
    { label: "North America", href: "/regions/northern-america" },
    {
      label: "South and Central America",
      href: "/regions/south-and-central-america",
    },
  ],
  otherProjectsLinks: [
    { label: "African Observatory on Responsible AI", href: "/" },
    { label: "Global Center on AI Governance", href: "/" },
  ],
  socialLinks: [
    { label: "Instagram", href: "https://instagram.com" },
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X", href: "https://x.com" },
    { label: "Facebook", href: "https://facebook.com" },
  ],
};
