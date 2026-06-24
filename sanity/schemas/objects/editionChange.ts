import { defineField, defineType } from "sanity";

export const editionChange = defineType({
  name: "editionChange",
  title: "Edition Change",
  type: "object",
  fields: [
    defineField({ name: "dimension", title: "Dimension", type: "string" }),
    defineField({ name: "before", title: "Previous edition", type: "text", rows: 2 }),
    defineField({ name: "now", title: "Current edition", type: "text", rows: 2 }),
  ],
  preview: {
    select: { title: "dimension", subtitle: "now" },
  },
});
