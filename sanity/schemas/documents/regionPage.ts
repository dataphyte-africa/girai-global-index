import { defineField, defineType } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

/**
 * Editorial copy for an individual region page (/regions/[slug]). This is a
 * fixed set keyed by `slug` (see src/lib/regions.ts REGION_COPY); documents are
 * seeded with stable ids and edited in place — creation/deletion is disabled via
 * the singleton machinery. Which regions exist stays code-owned (derived from the
 * dataset); only the copy is editable here.
 */
export const regionPage = defineType({
  name: "regionPage",
  title: "Region Page",
  type: "document",
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Region (display only)",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "slug",
      title: "Slug (internal key — do not change)",
      type: "string",
      readOnly: true,
    }),
    defineField({
      name: "blurb",
      title: "Hero subtitle",
      type: "text",
      rows: 3,
      description:
        "Shown under the region name in the page hero and used as the page meta description.",
    }),
    defineField({
      name: "footerBlurb",
      title: "Footer call-to-action subtitle",
      type: "text",
      rows: 3,
      description: "Closing message shown in the region page footer CTA.",
    }),
    defineField({
      name: "adjective",
      title: "Region adjective",
      type: "string",
      description:
        'Adjective form of the region used in inline copy (e.g. "African", "European").',
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug" },
  },
});
