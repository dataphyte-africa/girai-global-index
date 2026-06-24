import { defineArrayMember, defineField, defineType } from "sanity";
import { SearchIcon } from "@sanity/icons";

export const evidencePage = defineType({
  name: "evidencePage",
  title: "Evidence Explorer Page",
  type: "document",
  icon: SearchIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "pathway", title: "Pathway Picker" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heroTitleLead", title: "Title (lead)", type: "string", group: "hero" }),
    defineField({ name: "heroTitleAccent", title: "Title (accent)", type: "string", group: "hero" }),
    defineField({ name: "heroSubtitle", title: "Subtitle", type: "text", rows: 3, group: "hero" }),
    defineField({
      name: "heroStatLabels",
      title: "Stat labels",
      description: "Four labels in order: countries, frameworks, evidence items, indicators.",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "string" })],
      validation: (Rule) => Rule.max(4),
    }),
    defineField({ name: "pathwayHeading", title: "Pathway heading", type: "string", group: "pathway" }),
    defineField({ name: "pathwaySubtitle", title: "Pathway subtitle", type: "text", rows: 2, group: "pathway" }),
    defineField({ name: "seoTitle", title: "Page title", type: "string", group: "seo" }),
    defineField({ name: "seoDescription", title: "Meta description", type: "text", rows: 3, group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Evidence Explorer Page" }),
  },
});
