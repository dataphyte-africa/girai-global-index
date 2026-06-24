import type { SanityImage } from "./about.defaults";

export type SiteSettingsContent = {
  defaultTitle: string;
  titleTemplate: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImage: SanityImage;
};

export const siteSettingsDefaults: SiteSettingsContent = {
  defaultTitle: "Global Index on Responsible AI (GIRAI)",
  titleTemplate: "%s | GIRAI",
  description:
    "The Global Index on Responsible AI (GIRAI) measures and compares how countries around the world are developing, deploying, and governing artificial intelligence responsibly.",
  keywords: [
    "Responsible AI",
    "AI governance",
    "Global Index",
    "GIRAI",
    "AI policy",
    "AI rankings",
    "artificial intelligence",
  ],
  ogTitle: "Global Index on Responsible AI (GIRAI)",
  ogDescription:
    "Measuring and comparing responsible AI development, deployment, and governance across countries worldwide.",
  ogImage: { url: "/report-image.png", alt: "Global Index on Responsible AI 2026 Report cover" },
};
