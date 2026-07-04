import { defineField, defineType } from "sanity";
import { FilterIcon } from "@sanity/icons";

/**
 * Editorial copy for an Evidence Explorer pathway. Fixed set keyed by
 * `pathwayId` (see src/components/evidence-hub/pathway-config.ts). Structural
 * config — icons, colours, evidence kinds, indicator family — stays in code.
 */
export const evidencePathway = defineType({
  name: "evidencePathway",
  title: "Evidence Pathway",
  type: "document",
  icon: FilterIcon,
  fields: [
    defineField({
      name: "pathwayId",
      title: "Pathway ID (internal key — do not change)",
      type: "string",
      readOnly: true,
    }),
    defineField({ name: "title", title: "Card title", type: "string" }),
    defineField({
      name: "tableTitle",
      title: "Indicator table title",
      type: "string",
      description: "Heading shown above the indicator table for this pathway.",
    }),
    defineField({ name: "description", title: "Card description", type: "text", rows: 2 }),
    defineField({
      name: "itemNoun",
      title: "Item noun",
      type: "string",
      description: 'Noun in the card meta line, e.g. "frameworks", "actions".',
    }),
  ],
  preview: {
    select: { title: "title", subtitle: "pathwayId" },
  },
});
