import { defineField, defineType } from "sanity";
import { CogIcon } from "@sanity/icons";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings & SEO",
  type: "document",
  icon: CogIcon,
  fields: [
    defineField({ name: "defaultTitle", title: "Default title", type: "string" }),
    defineField({
      name: "titleTemplate",
      title: "Title template",
      type: "string",
      description: "Use %s as the page title placeholder, e.g. '%s | GIRAI'.",
    }),
    defineField({ name: "description", title: "Meta description", type: "text", rows: 3 }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    defineField({ name: "ogTitle", title: "Social share title", type: "string" }),
    defineField({ name: "ogDescription", title: "Social share description", type: "text", rows: 3 }),
    defineField({ name: "ogImage", title: "Social share image", type: "contentImage" }),
  ],
  preview: {
    prepare: () => ({ title: "Site Settings & SEO" }),
  },
});
