import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const countriesPage = defineType({
  name: "countriesPage",
  title: "Countries Page",
  type: "document",
  icon: UsersIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "compare", title: "Compare Section" },
    { name: "takeaways", title: "Takeaways Section" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heroTitleLine1", title: "Title line 1", type: "string", group: "hero" }),
    defineField({ name: "heroTitleAccent", title: "Title line 2 (accent)", type: "string", group: "hero" }),
    defineField({ name: "heroSubtitle", title: "Subtitle", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "compareHeadingLead", title: "Compare heading (lead)", type: "string", group: "compare" }),
    defineField({ name: "compareHeadingAccent", title: "Compare heading (accent)", type: "string", group: "compare" }),
    defineField({ name: "compareSubheading", title: "Compare subheading", type: "text", rows: 2, group: "compare" }),
    defineField({ name: "takeawaysHeadingAccent", title: "Takeaways heading (accent)", type: "string", group: "takeaways" }),
    defineField({ name: "takeawaysHeadingTail", title: "Takeaways heading (tail)", type: "string", group: "takeaways" }),
    defineField({ name: "takeawaysSubtitle", title: "Takeaways subtitle", type: "text", rows: 2, group: "takeaways" }),
    defineField({ name: "seoTitle", title: "Page title", type: "string", group: "seo" }),
    defineField({ name: "seoDescription", title: "Meta description", type: "text", rows: 3, group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Countries Page" }),
  },
});
