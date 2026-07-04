import { defineArrayMember, defineField, defineType } from "sanity";
import { SparklesIcon } from "@sanity/icons";

/**
 * The "Key Findings" accordion section (Top 10 takeaways). Reused on the
 * Takeaways and Countries pages. Each finding is an accordion item with rich
 * text, chart images and tables.
 */
export const keyFindings = defineType({
  name: "keyFindings",
  title: "Key Findings (Accordion)",
  type: "document",
  icon: SparklesIcon,
  groups: [
    { name: "header", title: "Header" },
    { name: "findings", title: "Findings" },
  ],
  fields: [
    defineField({
      name: "headingAccent",
      title: "Heading (accent)",
      type: "string",
      group: "header",
      description: 'Coloured part of the heading, e.g. "Key".',
    }),
    defineField({
      name: "headingTail",
      title: "Heading (tail)",
      type: "string",
      group: "header",
      description: 'Plain part of the heading, e.g. "Findings".',
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "text",
      rows: 2,
      group: "header",
    }),
    defineField({
      name: "findings",
      title: "Findings",
      type: "array",
      group: "findings",
      of: [defineArrayMember({ type: "keyFinding" })],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Key Findings (Accordion)" }),
  },
});
