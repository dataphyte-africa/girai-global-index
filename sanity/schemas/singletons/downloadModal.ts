import { defineField, defineType } from "sanity";
import { DownloadIcon } from "@sanity/icons";

export const downloadModal = defineType({
  name: "downloadModal",
  title: "Download Modal",
  type: "document",
  icon: DownloadIcon,
  groups: [
    { name: "intro", title: "Heading" },
    { name: "form", title: "Form labels" },
    { name: "reasons", title: "Reason options" },
    { name: "license", title: "License & footer" },
    { name: "consent", title: "Consent checkbox" },
    { name: "landing", title: "Download landing pages" },
    { name: "success", title: "Dataset success screen" },
  ],
  fields: [
    defineField({ name: "title", title: "Title", type: "string", group: "intro" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 3, group: "intro" }),

    defineField({ name: "editionFirstLabel", title: "First edition label (2024)", type: "string", group: "form" }),
    defineField({ name: "editionSecondLabel", title: "Second edition label (2026)", type: "string", group: "form" }),
    defineField({ name: "formImage", title: "Side image", type: "contentImage", group: "form" }),
    defineField({ name: "fullNameLabel", title: "Full name — label", type: "string", group: "form" }),
    defineField({ name: "fullNamePlaceholder", title: "Full name — placeholder", type: "string", group: "form" }),
    defineField({ name: "emailLabel", title: "Email — label", type: "string", group: "form" }),
    defineField({ name: "emailPlaceholder", title: "Email — placeholder", type: "string", group: "form" }),
    defineField({ name: "organizationLabel", title: "Organization — label", type: "string", group: "form" }),
    defineField({ name: "organizationPlaceholder", title: "Organization — placeholder", type: "string", group: "form" }),
    defineField({ name: "roleLabel", title: "Role — label", type: "string", group: "form" }),
    defineField({ name: "rolePlaceholder", title: "Role — placeholder", type: "string", group: "form" }),
    defineField({ name: "reasonLabel", title: "Reason — label", type: "string", group: "form" }),
    defineField({ name: "reasonPlaceholder", title: "Reason — placeholder", type: "string", group: "form" }),

    defineField({
      name: "reasons",
      title: "Reason options",
      type: "array",
      group: "reasons",
      description:
        "The dropdown choices. You may reword the visible label, but do NOT change the value — it is the internal key the backend stores and recognises.",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "value",
              title: "Value (internal key — do not change)",
              type: "string",
              readOnly: true,
            },
            { name: "label", title: "Label (shown to user)", type: "string" },
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
          },
        },
      ],
    }),

    defineField({ name: "licenseTextBefore", title: "License text (before link)", type: "string", group: "license" }),
    defineField({ name: "licenseLinkLabel", title: "License link label", type: "string", group: "license" }),
    defineField({ name: "licenseLinkHref", title: "License link URL", type: "url", group: "license" }),

    defineField({ name: "consentTextBefore", title: "Consent text (before link)", type: "string", group: "consent" }),
    defineField({ name: "consentLinkLabel", title: "Consent link label", type: "string", group: "consent" }),
    defineField({
      name: "consentLinkHref",
      title: "Consent link URL",
      type: "string",
      description: "Link to the data policy page, e.g. /data-policy.",
      group: "consent",
    }),
    defineField({ name: "consentTextAfter", title: "Consent text (after link)", type: "string", group: "consent" }),
    defineField({ name: "consentErrorText", title: "Consent error message", type: "string", group: "consent" }),

    defineField({ name: "submitLabel", title: "Submit button label", type: "string", group: "license" }),
    defineField({ name: "submittingLabel", title: "Submit button label (while submitting)", type: "string", group: "license" }),
    defineField({ name: "imageAlt", title: "Side image — alt text", type: "string", group: "license" }),

    defineField({
      name: "citationHeadingTemplate",
      title: "Citation page — heading",
      type: "string",
      description: 'Use {asset} where the asset name should appear, e.g. "Download {asset}".',
      group: "landing",
    }),
    defineField({
      name: "citationBody",
      title: "Citation page — body",
      type: "text",
      rows: 3,
      description: "Use {asset} for the asset name.",
      group: "landing",
    }),
    defineField({ name: "methodologyHeading", title: "Methodology page — heading", type: "string", group: "landing" }),
    defineField({ name: "methodologyBody", title: "Methodology page — body", type: "text", rows: 3, group: "landing" }),

    defineField({
      name: "datasetDriveUrl",
      title: "Dataset library — Google Drive URL",
      type: "url",
      description:
        "The Google Drive folder shown on the dataset success screen, where users can view and download all datasets.",
      group: "success",
    }),
    defineField({ name: "datasetDriveName", title: "Dataset library — display name", type: "string", group: "success" }),
    defineField({ name: "successBadge", title: "Success — badge", type: "string", group: "success" }),
    defineField({ name: "successTitle", title: "Success — title", type: "string", group: "success" }),
    defineField({ name: "successBody", title: "Success — body", type: "text", rows: 3, group: "success" }),
    defineField({ name: "successCtaLabel", title: "Success — Drive button label", type: "string", group: "success" }),
    defineField({ name: "successCtaNote", title: "Success — Drive button note", type: "string", group: "success" }),
    defineField({ name: "successDoneLabel", title: "Success — dismiss button label", type: "string", group: "success" }),
  ],
  preview: {
    prepare: () => ({ title: "Download Modal" }),
  },
});
