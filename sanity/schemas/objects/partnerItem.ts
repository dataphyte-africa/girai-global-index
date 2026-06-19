import { defineField, defineType } from "sanity";

export const partnerItem = defineType({
  name: "partnerItem",
  title: "Partner",
  type: "object",
  fields: [
    defineField({ name: "name", title: "Name", type: "string" }),
    defineField({
      name: "logo",
      title: "Logo (optional)",
      type: "contentImage",
      description: "If empty, the name is shown as a text placeholder.",
    }),
  ],
  preview: {
    select: { title: "name", media: "logo" },
  },
});
