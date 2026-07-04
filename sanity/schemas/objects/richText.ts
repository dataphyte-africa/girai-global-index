import { defineType, defineArrayMember } from "sanity";

/**
 * Lean rich-text body for editorial columns (e.g. an indicator's Background /
 * Relevance). Paragraphs with bold, italic, links and simple lists — no
 * headings or inline images, so it stays safe inside narrow two-column layouts.
 */
export const richText = defineType({
  name: "richText",
  title: "Rich text",
  type: "array",
  of: [
    defineArrayMember({
      type: "block",
      styles: [{ title: "Normal", value: "normal" }],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      marks: {
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
        ],
        annotations: [
          {
            name: "link",
            title: "Link",
            type: "object",
            fields: [
              {
                name: "href",
                title: "URL",
                type: "url",
                validation: (rule) =>
                  rule
                    .uri({ scheme: ["http", "https", "mailto", "tel"] })
                    .required(),
              },
            ],
          },
        ],
      },
    }),
  ],
});
