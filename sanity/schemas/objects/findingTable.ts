import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A simple data table embedded inside a Key Finding body. Column headers plus
 * an ordered list of rows (each a list of cell strings). The first column is
 * left-aligned; the rest are right-aligned numeric-style columns.
 */
export const findingTable = defineType({
  name: "findingTable",
  title: "Data table",
  type: "object",
  fields: [
    defineField({
      name: "columns",
      title: "Column headers",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
      validation: (rule) => rule.min(1),
    }),
    defineField({
      name: "rows",
      title: "Rows",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "row",
          title: "Row",
          fields: [
            defineField({
              name: "cells",
              title: "Cells",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
            }),
          ],
          preview: {
            select: { cells: "cells" },
            prepare({ cells }) {
              return {
                title: Array.isArray(cells) ? cells.join("  ·  ") : "Row",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "caption",
      title: "Caption",
      type: "text",
      rows: 2,
      description: "Optional caption shown beneath the table.",
    }),
    defineField({
      name: "emphasizeLastRow",
      title: "Emphasize last row",
      type: "boolean",
      description: "Bold the final row (e.g. a totals row).",
      initialValue: false,
    }),
  ],
  preview: {
    select: { caption: "caption", columns: "columns" },
    prepare({ caption, columns }) {
      const cols = Array.isArray(columns) ? columns.join(", ") : "";
      return { title: caption || "Data table", subtitle: cols };
    },
  },
});
