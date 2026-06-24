import { defineArrayMember, defineField, defineType } from "sanity";
import { BulbOutlineIcon } from "@sanity/icons";

export const takeawaysPage = defineType({
  name: "takeawaysPage",
  title: "Takeaways Page",
  type: "document",
  icon: BulbOutlineIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "intro", title: "Intro" },
    { name: "keyInsights", title: "Key Insights" },
  ],
  fields: [
    defineField({ name: "heroTitleLead", title: "Title (lead)", type: "string", group: "hero" }),
    defineField({ name: "heroTitleAccent", title: "Title (accent)", type: "string", group: "hero" }),
    defineField({ name: "heroLead", title: "Lead paragraph", type: "text", rows: 3, group: "hero" }),
    defineField({
      name: "heroStats",
      title: "Stats",
      type: "array",
      group: "hero",
      of: [defineArrayMember({ type: "statItem" })],
    }),
    defineField({ name: "heroImage", title: "Background image", type: "contentImage", group: "hero" }),

    defineField({ name: "introHeadingLead", title: "Heading (dark)", type: "text", rows: 3, group: "intro" }),
    defineField({ name: "introHeadingMuted", title: "Heading (muted)", type: "text", rows: 3, group: "intro" }),

    defineField({ name: "keyInsightsHeadingAccent", title: "Heading (accent)", type: "string", group: "keyInsights" }),
    defineField({ name: "keyInsightsHeadingTail", title: "Heading (tail)", type: "string", group: "keyInsights" }),
    defineField({ name: "keyInsightsSubtitle", title: "Subtitle", type: "text", rows: 2, group: "keyInsights" }),
    defineField({
      name: "insights",
      title: "Insights",
      type: "array",
      group: "keyInsights",
      of: [defineArrayMember({ type: "titledCard" })],
    }),
  ],
  preview: {
    prepare: () => ({ title: "Takeaways Page" }),
  },
});
