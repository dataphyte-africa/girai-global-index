import { defineField, defineType } from "sanity";

export const ctaLink = defineType({
  name: "ctaLink",
  title: "Button / Link",
  type: "object",
  fields: [
    defineField({
      name: "label",
      title: "Label",
      type: "string",
    }),
    defineField({
      name: "href",
      title: "URL",
      type: "string",
      description: "Internal path (e.g. /about) or full external URL.",
    }),
  ],
  preview: {
    select: { title: "label", subtitle: "href" },
  },
});
