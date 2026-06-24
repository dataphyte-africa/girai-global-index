import type { Cta } from "./about.defaults";

export type HeaderContent = {
  primaryNav: Cta[];
  exploreLinks: Cta[];
  downloadCta: Cta;
};

export const headerDefaults: HeaderContent = {
  primaryNav: [
    { label: "Countries", href: "/countries" },
    { label: "Methodology", href: "/methodology" },
    { label: "Updates", href: "/updates" },
    { label: "About", href: "/about" },
  ],
  exploreLinks: [
    { label: "Indicators", href: "/indicators" },
    { label: "Evidence Explorer", href: "/evidence" },
    { label: "Top Takeaway", href: "/takeaways" },
    { label: "Regions", href: "/regions" },
    { label: "2025 results", href: "/#results" },
    { label: "2024 results", href: "/#results" },
  ],
  downloadCta: { label: "Download Data", href: "/data" },
};
