import { defineField, defineType } from "sanity";

export const contentImage = defineType({
  name: "contentImage",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the image for accessibility and SEO.",
    }),
  ],
});
