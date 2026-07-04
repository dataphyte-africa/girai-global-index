import { defineField, defineType } from "sanity";
import { DocumentPdfIcon } from "@sanity/icons";

/**
 * Copy for the reusable "Download the report" section, shared across the
 * Home, Countries, Regions and Takeaways pages.
 */
export const reportDownload = defineType({
  name: "reportDownload",
  title: "Report Download Section",
  type: "document",
  icon: DocumentPdfIcon,
  fields: [
    defineField({ name: "badge", title: "Badge", type: "string" }),
    defineField({ name: "headingLead", title: "Heading (dark)", type: "string" }),
    defineField({ name: "headingAccent", title: "Heading (accent)", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
    defineField({
      name: "coverImage",
      title: "Report cover image",
      type: "contentImage",
    }),
    defineField({ name: "primaryCtaLabel", title: "Primary CTA label", type: "string" }),
    defineField({ name: "secondaryCtaLabel", title: "Secondary CTA label", type: "string" }),
  ],
  preview: {
    prepare: () => ({ title: "Report Download Section" }),
  },
});
