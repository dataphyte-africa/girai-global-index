import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

export const regionsPage = defineType({
  name: "regionsPage",
  title: "Regions Page",
  type: "document",
  icon: EarthGlobeIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "overview", title: "Performance Overview" },
    { name: "compare", title: "Compare Section" },
    { name: "seo", title: "SEO" },
  ],
  fields: [
    defineField({ name: "heroTitleLine1", title: "Title line 1", type: "string", group: "hero" }),
    defineField({ name: "heroTitleAccent", title: "Title line 2 (accent)", type: "string", group: "hero" }),
    defineField({ name: "heroSubtitle", title: "Subtitle", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "overviewHeading", title: "Heading", type: "string", group: "overview" }),
    defineField({ name: "overviewSubtitle", title: "Subtitle", type: "text", rows: 2, group: "overview" }),
    defineField({ name: "compareHeadingLead", title: "Compare heading (lead)", type: "string", group: "compare" }),
    defineField({ name: "compareHeadingAccent", title: "Compare heading (accent)", type: "string", group: "compare" }),
    defineField({ name: "compareSubheading", title: "Compare subheading", type: "text", rows: 2, group: "compare" }),
    defineField({ name: "seoTitle", title: "Page title", type: "string", group: "seo" }),
    defineField({ name: "seoDescription", title: "Meta description", type: "text", rows: 3, group: "seo" }),
  ],
  preview: {
    prepare: () => ({ title: "Regions Page" }),
  },
});
