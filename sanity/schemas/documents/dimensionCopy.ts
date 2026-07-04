import { defineField, defineType } from "sanity";
import { BarChartIcon } from "@sanity/icons";

/**
 * Presentation copy for a GIRAI dimension. Fixed set keyed by `slug`
 * (see src/data/dimensions-data.ts). The canonical name, indicators and
 * imagery stay in code/taxonomy — only editorial copy lives here.
 */
export const dimensionCopy = defineType({
  name: "dimensionCopy",
  title: "Dimension",
  type: "document",
  icon: BarChartIcon,
  fields: [
    defineField({
      name: "slug",
      title: "Slug (internal key — do not change)",
      type: "string",
      readOnly: true,
    }),
    defineField({ name: "subtitle", title: "Subtitle", type: "string" }),
    defineField({ name: "description", title: "Description", type: "text", rows: 5 }),
    defineField({ name: "eyebrow", title: "Hero eyebrow", type: "string" }),
    defineField({ name: "heroLead", title: "Hero lead", type: "text", rows: 3 }),
    defineField({
      name: "rankingSubtitle",
      title: "Rankings subtitle",
      type: "text",
      rows: 2,
      description: "Sub-headline for the dimension's Global Rankings section.",
    }),
  ],
  preview: {
    select: { title: "subtitle", subtitle: "slug" },
  },
});
