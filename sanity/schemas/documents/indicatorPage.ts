import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

/**
 * Editable copy for a GIRAI indicator detail page (/indicators/[slug]).
 *
 * Fixed set keyed by `slug` (see src/data/2026/taxonomy.ts). The indicator's
 * dimension and score data stay code-owned; the display `title`, editorial copy
 * and hero imagery on the page live here. The `title` is seeded from the
 * code-defined name but is editable in the Studio and overrides it on the page.
 * `heroImage` is seeded per
 * indicator (defaulting to the shared banner) and can be overridden per page in
 * the Studio. `background` and `relevance` are rich text that support links.
 * `brightSpots` (max 2) has no code default — it is authored only here, and the
 * seed carries existing values forward rather than writing them.
 */
export const indicatorPage = defineType({
  name: "indicatorPage",
  title: "Indicator Page",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "intro", title: "Hero & Intro", default: true },
    { name: "body", title: "Background & Relevance" },
    { name: "brightSpots", title: "Bright Spots" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Indicator name",
      type: "string",
      group: "intro",
      description:
        "Display name for this indicator — shown as the page title/H1 and inside the section headings. Editable here; leave blank to fall back to the code-defined name.",
    }),
    defineField({
      name: "slug",
      title: "Slug (internal key — do not change)",
      type: "string",
      readOnly: true,
      group: "intro",
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "contentImage",
      group: "intro",
      description:
        "Banner image behind the indicator title. Defaults to the shared indicator banner; upload a distinct image here to override it for this indicator.",
    }),
    defineField({
      name: "heroLead",
      title: "Hero lead",
      type: "text",
      rows: 3,
      group: "intro",
      description: "Intro sentence shown under the indicator title in the hero.",
    }),
    defineField({
      name: "introPrimary",
      title: "Intro — primary clause",
      type: "text",
      rows: 3,
      group: "intro",
      description:
        "Dark, leading clause of the split-tone intro section. Clear this to hide the whole intro section on this indicator.",
    }),
    defineField({
      name: "introSecondary",
      title: "Intro — secondary clause",
      type: "text",
      rows: 3,
      group: "intro",
      description:
        "Muted, trailing clause of the split-tone intro section. Optional — clear this to show the primary clause alone.",
    }),
    defineField({
      name: "background",
      title: "Background",
      type: "richText",
      group: "body",
      description: "The “Background of …” column. Rich text — supports links.",
    }),
    defineField({
      name: "relevance",
      title: "Relevance",
      type: "richText",
      group: "body",
      description: "The “Relevance of …” column. Rich text — supports links.",
    }),
    defineField({
      name: "brightSpots",
      title: "Bright spots",
      type: "array",
      group: "brightSpots",
      of: [defineArrayMember({ type: "brightSpot" })],
      validation: (rule) => rule.max(2),
      description:
        "Up to two country examples, shown below Background & Relevance. Leave empty to hide the section.",
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "slug" },
  },
});
