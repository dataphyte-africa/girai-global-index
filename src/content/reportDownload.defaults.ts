import type { SanityImage } from "./about.defaults";

export type ReportDownloadContent = {
  badge: string;
  headingLead: string;
  headingAccent: string;
  body: string;
  coverImage: SanityImage;
  primaryCtaLabel: string;
  secondaryCtaLabel: string;
};

export const reportDownloadDefaults: ReportDownloadContent = {
  badge: "SECOND EDITION",
  headingLead: "Global Index on Responsible AI — ",
  headingAccent: "2026 Report",
  body: "Download the latest edition of the Global Index on Responsible AI, offering comparative insights into how countries govern and use artificial intelligence.",
  coverImage: {
    url: "/report-image.jpg",
    alt: "Global Index on Responsible AI 2026 Report cover",
  },
  primaryCtaLabel: "Download Report",
  secondaryCtaLabel: "Download 2025 report",
};
