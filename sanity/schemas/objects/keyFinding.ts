import { defineField, defineType } from "sanity";

/**
 * A single Key Finding (accordion item). Title is the accordion trigger;
 * summary is the styled one-liner; body carries the rich Key Evidence content
 * (text, charts, tables); the optional Bright Spot is the country callout.
 */
export const keyFinding = defineType({
  name: "keyFinding",
  title: "Key finding",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "text",
      rows: 2,
      description: "The full finding headline (accordion trigger).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "richText",
      description:
        "Condensed executive-summary line shown at the top of the panel.",
    }),
    defineField({
      name: "body",
      title: "Key evidence",
      type: "findingBody",
      description:
        "Rich text with formatting. Use the + menu to add chart images and data tables.",
    }),
    defineField({
      name: "brightSpotCountry",
      title: "Bright spot — country",
      type: "string",
      description: "Leave empty to hide the Bright Spot callout.",
    }),
    defineField({
      name: "brightSpotBody",
      title: "Bright spot — text",
      type: "richText",
    }),
  ],
  preview: {
    select: { title: "title" },
    prepare({ title }) {
      return { title: title || "Key finding" };
    },
  },
});
