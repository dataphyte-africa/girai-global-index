import { defineField, defineType } from "sanity";

export const funderLogo = defineType({
  name: "funderLogo",
  title: "Funder logo",
  type: "object",
  fields: [
    defineField({
      name: "name",
      title: "Organisation name",
      type: "string",
      description: "Used as the logo's alt text and link title.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "contentImage",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "url",
      title: "Link (optional)",
      type: "url",
      description: "Full URL to the organisation's website.",
    }),
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
