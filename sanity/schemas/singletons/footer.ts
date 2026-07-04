import { defineArrayMember, defineField, defineType } from "sanity";
import { ThLargeIcon } from "@sanity/icons";

export const footer = defineType({
  name: "footer",
  title: "Footer",
  type: "document",
  icon: ThLargeIcon,
  groups: [
    { name: "subscribe", title: "Subscribe" },
    { name: "links", title: "Link Groups" },
    { name: "social", title: "Social" },
    { name: "funder", title: "Funder Note" },
  ],
  fields: [
    defineField({ name: "subscribeHeading", title: "Heading", type: "string", group: "subscribe" }),
    defineField({ name: "subscribeBody", title: "Body", type: "text", rows: 2, group: "subscribe" }),
    defineField({ name: "namePlaceholder", title: "Name field placeholder", type: "string", group: "subscribe" }),
    defineField({ name: "emailPlaceholder", title: "Email field placeholder", type: "string", group: "subscribe" }),
    defineField({ name: "submitLabel", title: "Submit button label", type: "string", group: "subscribe" }),

    defineField({
      name: "resultsLinks",
      title: "Results links",
      type: "array",
      group: "links",
      of: [defineArrayMember({ type: "ctaLink" })],
    }),
    defineField({
      name: "regionLinks",
      title: "Explore Regions links",
      type: "array",
      group: "links",
      of: [defineArrayMember({ type: "ctaLink" })],
    }),
    defineField({
      name: "otherProjectsLinks",
      title: "Other Projects links",
      type: "array",
      group: "links",
      of: [defineArrayMember({ type: "ctaLink" })],
    }),

    defineField({
      name: "socialLinks",
      title: "Social links",
      type: "array",
      group: "social",
      of: [defineArrayMember({ type: "ctaLink" })],
      description:
        "Label is the platform name (LinkedIn, X, Email). Use an Email entry with a mailto: link to show a contact icon.",
    }),

    defineField({
      name: "funderNoteText",
      title: "Funder note",
      type: "text",
      rows: 3,
      group: "funder",
      description: "Short funder / attribution note shown site-wide in the footer.",
    }),
    defineField({
      name: "funderLogos",
      title: "Funder & partner logos",
      type: "array",
      group: "funder",
      of: [defineArrayMember({ type: "funderLogo" })],
      description:
        "Logos shown as a row above the funder note. Displayed on white chips, so full-colour logos are fine.",
    }),
    defineField({
      name: "funderLogo",
      title: "Funder logo (legacy, optional)",
      type: "contentImage",
      group: "funder",
      description: "Deprecated single logo. Prefer the Funder & partner logos list above.",
    }),
    defineField({
      name: "funderLink",
      title: "Funder link (legacy, optional)",
      type: "url",
      group: "funder",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Footer" }),
  },
});
