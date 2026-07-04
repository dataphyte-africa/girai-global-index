import { defineField, defineType } from "sanity";
import { ComponentIcon } from "@sanity/icons";

/**
 * Editorial copy for a GIRAI pillar. This is a fixed set keyed by `slug`
 * (see src/lib/pillar-copy.ts); documents are seeded with stable ids and
 * edited in place — creation/deletion is disabled via the singleton machinery.
 * Structural data (image, indicators) stays in code.
 */
export const pillar = defineType({
  name: "pillar",
  title: "Pillar",
  type: "document",
  icon: ComponentIcon,
  fields: [
    defineField({
      name: "slug",
      title: "Slug (internal key — do not change)",
      type: "string",
      readOnly: true,
    }),
    defineField({ name: "heading", title: "Heading", type: "string" }),
    defineField({ name: "body", title: "Body", type: "text", rows: 3 }),
    defineField({
      name: "image",
      title: "Card image",
      type: "contentImage",
      description: "Shown on the homepage pillar cards. Falls back to the bundled image if empty.",
    }),
    defineField({
      name: "driversDescription",
      title: "Drivers description",
      type: "text",
      rows: 3,
      description: "Shown on the country-story 'What drives this performance?' cards.",
    }),
  ],
  preview: {
    select: { title: "heading", subtitle: "slug" },
  },
});
