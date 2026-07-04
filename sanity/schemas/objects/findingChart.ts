import { defineField, defineType } from "sanity";

/**
 * A chart/figure image embedded inside a Key Finding body. Rendered as a
 * captioned figure in the accordion panel. Use for exported report charts,
 * diagrams, or any illustrative image.
 */
export const findingChart = defineType({
  name: "findingChart",
  title: "Chart image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      type: "string",
      description: "Describe the chart for accessibility and SEO.",
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 2,
      description: "Optional caption shown beneath the image.",
    }),
  ],
  preview: {
    select: { media: "asset", caption: "caption", alt: "alt" },
    prepare({ media, caption, alt }) {
      return { title: caption || alt || "Chart image", media };
    },
  },
});
