import { defineArrayMember, defineField, defineType } from "sanity";
import { MenuIcon } from "@sanity/icons";

export const header = defineType({
  name: "header",
  title: "Header / Navigation",
  type: "document",
  icon: MenuIcon,
  fields: [
    defineField({
      name: "primaryNav",
      title: "Primary nav items",
      type: "array",
      of: [defineArrayMember({ type: "ctaLink" })],
    }),
    defineField({
      name: "exploreLinks",
      title: "'Explore' menu links",
      type: "array",
      of: [defineArrayMember({ type: "ctaLink" })],
    }),
    defineField({ name: "downloadCta", title: "Download Data button", type: "ctaLink" }),
  ],
  preview: {
    prepare: () => ({ title: "Header / Navigation" }),
  },
});
