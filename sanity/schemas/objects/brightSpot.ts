import { defineField, defineType } from "sanity";

/**
 * A single Bright Spot: a short, country-anchored example of good practice.
 *
 * Used as an array member on `indicatorPage` (max 2 per indicator). Mirrors the
 * `brightSpotCountry`/`brightSpotBody` pair on `keyFinding` so both surfaces
 * render through the same callout. `country` is free text — countries are
 * code-owned (src/data/countries.ts) and have no Sanity document to reference.
 *
 * Authored only in the Studio: the seed script carries existing values forward
 * rather than writing them (see scripts/seed-sanity.ts).
 */
export const brightSpot = defineType({
  name: "brightSpot",
  title: "Bright spot",
  type: "object",
  fields: [
    defineField({
      name: "country",
      title: "Country",
      type: "string",
      description:
        "Country named in the callout heading, e.g. “Rwanda”. Leave empty to show the callout without a country.",
    }),
    defineField({
      name: "body",
      title: "Text",
      type: "richText",
      description: "The example itself. Rich text — supports links.",
    }),
  ],
  preview: {
    select: { title: "country" },
    prepare({ title }) {
      return { title: title || "Bright spot" };
    },
  },
});
