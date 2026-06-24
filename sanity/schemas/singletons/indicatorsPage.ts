import { defineField, defineType } from "sanity";
import { BlockElementIcon } from "@sanity/icons";

export const indicatorsPage = defineType({
  name: "indicatorsPage",
  title: "Indicators Page",
  type: "document",
  icon: BlockElementIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heroTitleAccent", title: "Title (accent)", type: "string", group: "hero" }),
    defineField({ name: "heroTitleTail", title: "Title (tail)", type: "string", group: "hero" }),
    defineField({ name: "heroLead", title: "Lead paragraph", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "heroImage", title: "Background image", type: "contentImage", group: "hero" }),
    defineField({ name: "seoTitle", title: "Page title", type: "string", group: "seo" }),
    defineField({ name: "seoDescription", title: "Meta description", type: "text", rows: 3, group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Indicators Page" }),
  },
});
