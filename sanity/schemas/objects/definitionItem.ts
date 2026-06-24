import { defineField, defineType } from "sanity";

export const definitionItem = defineType({
  name: "definitionItem",
  title: "Term",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Term", type: "string" }),
    defineField({ name: "definition", title: "Definition", type: "text", rows: 3 }),
  ],
  preview: {
    select: { title: "title", subtitle: "definition" },
  },
});
