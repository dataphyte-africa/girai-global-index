import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

/**
 * Editable copy for a GIRAI indicator detail page (/indicators/[slug]).
 *
 * Fixed set keyed by `slug` (see src/data/2026/taxonomy.ts). The indicator's
 * canonical name, dimension and score data stay code-owned — only the editorial
 * copy and hero imagery on the page live here. `heroImage` is seeded per
 * indicator (defaulting to the shared banner) and can be overridden per page in
 * the Studio. `background` and `relevance` are rich text that support links.
 */
export const indicatorPage = defineType({
  name: "indicatorPage",
  title: "Indicator Page",
  type: "document",
  icon: DocumentIcon,
  groups: [
    { name: "intro", title: "Hero & Intro", default: true },
    { name: "body", title: "Background & Relevance" },
  ],
  fields: [
    defineField({
      name: "title",
      title: "Indicator",
      type: "string",
      readOnly: true,
      group: "intro",
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
      description: "Dark, leading clause of the split-tone intro section.",
    }),
    defineField({
      name: "introSecondary",
      title: "Intro — secondary clause",
      type: "text",
      rows: 3,
      group: "intro",
      description: "Muted, trailing clause of the split-tone intro section.",
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
  ],
  preview: {
    select: { title: "title", subtitle: "slug" },
  },
});
