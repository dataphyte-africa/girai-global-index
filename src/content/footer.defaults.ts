import type { Cta, SanityImage } from "./about.defaults";

export type FunderLogo = {
  name: string;
  logo: SanityImage;
  url: string;
};

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
  funderNoteText: string;
  funderLogos: FunderLogo[];
  funderLogo: SanityImage | null;
  funderLink: string;
};

export const footerDefaults: FooterContent = {
  subscribeHeading: "Subscribe",
  subscribeBody:
    "Join our mailing list for insights, commentary and analysis on the work of the Index",
  namePlaceholder: "Full Name",
  emailPlaceholder: "Email",
  submitLabel: "Send",
  resultsLinks: [
    { label: "Results", href: "/#results" },
    { label: "Key Findings", href: "/takeaways" },
    { label: "Countries", href: "/countries" },
    { label: "Evidence Explorer", href: "/evidence" },
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
    {
      label: "African Observatory on Responsible AI",
      href: "https://www.globalcenter.ai/aorai",
    },
    {
      label: "Global Center on AI Governance",
      href: "https://www.globalcenter.ai/",
    },
  ],
  socialLinks: [
    { label: "LinkedIn", href: "https://linkedin.com" },
    { label: "X", href: "https://x.com" },
    { label: "Email", href: "mailto:girai_gcg@globalcenter.ai" },
  ],
  funderNoteText:
    "The Global Index on Responsible AI is an initiative of the Global Center on AI Governance, produced with the support of our funders and partners.",
  funderLogos: [
    {
      name: "Global Center on AI Governance",
      logo: { url: "/funders/gcg.png", alt: "Global Center on AI Governance" },
      url: "https://www.globalcenter.ai/",
    },
    {
      name: "Artificial Intelligence for Development (AI4D)",
      logo: { url: "/funders/ai4d.png", alt: "Artificial Intelligence for Development" },
      url: "https://africa.ai4d.ai/",
    },
    {
      name: "Global Research and Technology Development, funded by UK Government",
      logo: {
        url: "/funders/fcdo.jpg",
        alt: "Global Research and Technology Development, funded by UK Government",
      },
      url: "https://www.gov.uk/government/organisations/foreign-commonwealth-development-office",
    },
    {
      name: "International Development Research Centre (IDRC)",
      logo: { url: "/funders/idrc.png", alt: "International Development Research Centre" },
      url: "https://idrc-crdi.ca/",
    },
  ],
  funderLogo: null,
  funderLink: "",
};
