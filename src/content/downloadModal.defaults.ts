import { DOWNLOAD_REASONS } from "@/lib/data-download/config";
import type { SanityImage } from "./about.defaults";

export type DownloadReasonOption = { value: string; label: string };

export type DownloadModalContent = {
  title: string;
  description: string;

  editionFirstLabel: string;
  editionSecondLabel: string;
  formImage: SanityImage;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  organizationLabel: string;
  organizationPlaceholder: string;
  roleLabel: string;
  rolePlaceholder: string;
  reasonLabel: string;
  reasonPlaceholder: string;

  reasons: DownloadReasonOption[];

  licenseTextBefore: string;
  licenseLinkLabel: string;
  licenseLinkHref: string;
  submitLabel: string;
  submittingLabel: string;
  imageAlt: string;

  /** Download landing pages. `{asset}` is replaced with the resolved asset label. */
  citationHeadingTemplate: string;
  citationBody: string;
  methodologyHeading: string;
  methodologyBody: string;
};

export const downloadModalDefaults: DownloadModalContent = {
  title: "Thank you for your interest in GIRAI",
  description:
    "Please fill out this form so we can better understand how the data is being used and improve its accessibility and impact.",

  editionFirstLabel: "2024 Edition",
  editionSecondLabel: "2026 Edition",
  formImage: {
    url: "/download.png",
    alt: "Hand holding the GIRAI report",
  },
  fullNameLabel: "Full Name",
  fullNamePlaceholder: "Input your name",
  emailLabel: "Email",
  emailPlaceholder: "Enter email",
  organizationLabel: "Organization (Optional)",
  organizationPlaceholder: "Input name",
  roleLabel: "Current role (Optional)",
  rolePlaceholder: "Input role",
  reasonLabel: "Reason for download",
  reasonPlaceholder: "Select reason",

  reasons: DOWNLOAD_REASONS.map((r) => ({ value: r.value, label: r.label })),

  licenseTextBefore: "This work is licensed under a ",
  licenseLinkLabel: "Creative Commons Attribution 4.0 International License.",
  licenseLinkHref: "https://creativecommons.org/licenses/by/4.0/",
  submitLabel: "Submit",
  submittingLabel: "Submitting…",
  imageAlt: "Hand holding the GIRAI report",

  citationHeadingTemplate: "Download {asset}",
  citationBody:
    "Complete the short form to access the GIRAI {asset}. Your download helps us understand how GIRAI data and reports are used.",
  methodologyHeading: "Download Methodology",
  methodologyBody:
    "Complete the short form to access the GIRAI methodology document.",
};
