import { defineField, defineType } from "sanity";
import { DocumentIcon } from "@sanity/icons";

/**
 * Editable copy for a GIRAI indicator detail page (/indicators/[slug]).
 *
 * Fixed set keyed by `slug` (see src/data/2026/taxonomy.ts). The indicator's
 * canonical name, dimension, imagery and score data stay code-owned — only the
 * editorial copy on the page lives here. `background` and `relevance` are rich
 * text that support inline links.
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
