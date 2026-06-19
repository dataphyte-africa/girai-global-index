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
      description: "Label is the platform name (Instagram, LinkedIn, X, Facebook).",
    }),
  ],
  preview: {
    prepare: () => ({ title: "Footer" }),
  },
});
