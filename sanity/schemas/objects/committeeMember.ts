import { defineField, defineType } from "sanity";

export const committeeMember = defineType({
  name: "committeeMember",
  title: "Committee Member",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({
      name: "affiliation",
      title: "Organization / Affiliation",
      type: "text",
      rows: 2,
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "affiliation" },
  },
});
