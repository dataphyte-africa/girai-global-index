import { defineArrayMember, defineField, defineType } from "sanity";
import { DocumentsIcon } from "@sanity/icons";

export const methodologyPage = defineType({
  name: "methodologyPage",
  title: "Methodology Page",
  type: "document",
  icon: DocumentsIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "intro", title: "Intro" },
    { name: "principles", title: "Principles" },
    { name: "measures", title: "What it Measures" },
    { name: "evolution", title: "Framework Evolution" },
    { name: "refined", title: "Framework Refined" },
    { name: "changes", title: "Edition Changes" },
    { name: "keyTerms", title: "Key Terms" },
    { name: "evidence", title: "Evidence Standards" },
    { name: "access", title: "Access Data" },
    { name: "process", title: "Research Process" },
    { name: "footerCta", title: "Footer CTA" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroTitleLine1Lead", title: "Title line 1 (dark)", type: "string", group: "hero" }),
    defineField({ name: "heroTitleLine1Accent", title: "Title line 1 (accent)", type: "string", group: "hero" }),
    defineField({ name: "heroTitleLine2Accent", title: "Title line 2 (accent)", type: "string", group: "hero" }),
    defineField({ name: "heroTitleLine2Tail", title: "Title line 2 (dark)", type: "string", group: "hero" }),
    defineField({ name: "heroLead", title: "Lead paragraph", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "heroCtaLabel", title: "CTA label", type: "string", group: "hero" }),
    defineField({ name: "heroImage", title: "Background image", type: "contentImage", group: "hero" }),

    // Intro
    defineField({ name: "introHeadingLead", title: "Heading (dark)", type: "text", rows: 2, group: "intro" }),
    defineField({ name: "introHeadingMuted", title: "Heading (muted)", type: "text", rows: 2, group: "intro" }),

    // Principles
    defineField({ name: "principlesBadge", title: "Badge", type: "string", group: "principles" }),
    defineField({ name: "principlesHeadingLead", title: "Heading (accent)", type: "string", group: "principles" }),
    defineField({ name: "principlesHeadingTail", title: "Heading (dark)", type: "string", group: "principles" }),
    defineField({ name: "principlesIntro", title: "Intro line", type: "text", rows: 2, group: "principles" }),
    defineField({ name: "principlesImage", title: "Image", type: "contentImage", group: "principles" }),
    defineField({
      name: "principles",
      title: "Principles",
      type: "array",
      group: "principles",
      of: [defineArrayMember({ type: "titledCard" })],
    }),

    // What it Measures
    defineField({ name: "measuresHeadingLead", title: "Heading (dark)", type: "string", group: "measures" }),
    defineField({ name: "measuresHeadingAccent", title: "Heading (accent)", type: "string", group: "measures" }),
    defineField({ name: "measuresHeadingTail", title: "Heading (dark, tail)", type: "string", group: "measures" }),
    defineField({ name: "measuresSubtitle", title: "Subtitle", type: "text", rows: 2, group: "measures" }),
    defineField({
      name: "dimensions",
      title: "Dimensions",
      type: "array",
      group: "measures",
      of: [defineArrayMember({ type: "titledCard" })],
    }),

    // Framework Evolution
    defineField({ name: "evolutionBadge", title: "Badge", type: "string", group: "evolution" }),
    defineField({ name: "evolutionHeadingLead", title: "Heading (dark)", type: "string", group: "evolution" }),
    defineField({ name: "evolutionHeadingAccent", title: "Heading (accent)", type: "string", group: "evolution" }),
    defineField({
      name: "evolutionParagraphs",
      title: "Paragraphs",
      type: "array",
      group: "evolution",
      of: [defineArrayMember({ type: "paragraph" })],
    }),
    defineField({ name: "evolutionQuoteText", title: "Quote text", type: "text", rows: 3, group: "evolution" }),
    defineField({ name: "evolutionQuoteAttribution", title: "Quote attribution", type: "string", group: "evolution" }),

    // Framework Refined
    defineField({ name: "refinedHeadingLead", title: "Heading (dark)", type: "string", group: "refined" }),
    defineField({ name: "refinedHeadingAccent", title: "Heading (accent)", type: "string", group: "refined" }),
    defineField({ name: "refinedSubtitle", title: "Subtitle", type: "text", rows: 2, group: "refined" }),
    defineField({
      name: "refinements",
      title: "Refinements",
      type: "array",
      group: "refined",
      of: [defineArrayMember({ type: "titledCard" })],
    }),

    // Edition Changes
    defineField({ name: "editionHeadingAccent", title: "Heading (accent)", type: "string", group: "changes" }),
    defineField({ name: "editionHeadingTail", title: "Heading (dark)", type: "string", group: "changes" }),
    defineField({ name: "editionSubtitle", title: "Subtitle", type: "text", rows: 2, group: "changes" }),
    defineField({
      name: "changes",
      title: "Changes",
      type: "array",
      group: "changes",
      of: [defineArrayMember({ type: "editionChange" })],
    }),

    // Key Terms
    defineField({ name: "keyTermsHeadingAccent", title: "Heading (accent)", type: "string", group: "keyTerms" }),
    defineField({ name: "keyTermsHeadingTail", title: "Heading (dark)", type: "string", group: "keyTerms" }),
    defineField({ name: "keyTermsSubtitle", title: "Subtitle", type: "text", rows: 2, group: "keyTerms" }),
    defineField({
      name: "terms",
      title: "Terms",
      type: "array",
      group: "keyTerms",
      of: [defineArrayMember({ type: "definitionItem" })],
    }),

    // Evidence Standards
    defineField({ name: "evidenceHeadingAccent", title: "Heading (accent)", type: "string", group: "evidence" }),
    defineField({ name: "evidenceHeadingTail", title: "Heading (dark)", type: "string", group: "evidence" }),
    defineField({ name: "evidenceSubtitle", title: "Subtitle", type: "text", rows: 2, group: "evidence" }),
    defineField({
      name: "evidenceRules",
      title: "Evidence rules",
      type: "array",
      group: "evidence",
      of: [defineArrayMember({ type: "titledCard" })],
    }),
    defineField({ name: "evidenceImage", title: "Image", type: "contentImage", group: "evidence" }),

    // Access Data
    defineField({ name: "accessBadge", title: "Badge", type: "string", group: "access" }),
    defineField({ name: "accessHeadingLead", title: "Heading (accent)", type: "string", group: "access" }),
    defineField({ name: "accessHeadingTail", title: "Heading (dark)", type: "string", group: "access" }),
    defineField({ name: "accessBody", title: "Body", type: "text", rows: 3, group: "access" }),
    defineField({ name: "accessCta", title: "Button", type: "ctaLink", group: "access" }),
    defineField({ name: "accessImage", title: "Image", type: "contentImage", group: "access" }),

    // Research Process
    defineField({
      name: "processStats",
      title: "Stats",
      type: "array",
      group: "process",
      of: [defineArrayMember({ type: "statItem" })],
    }),
    defineField({ name: "processHeadingLead", title: "Heading (dark)", type: "string", group: "process" }),
    defineField({ name: "processHeadingAccent", title: "Heading (accent)", type: "string", group: "process" }),
    defineField({ name: "processSubtitle", title: "Subtitle", type: "text", rows: 2, group: "process" }),
    defineField({ name: "processBadge", title: "Steps badge", type: "string", group: "process" }),
    defineField({ name: "processStagesHeadingAccent", title: "Steps heading (accent)", type: "string", group: "process" }),
    defineField({ name: "processStagesHeadingTail", title: "Steps heading (dark)", type: "string", group: "process" }),
    defineField({ name: "processStagesIntro", title: "Steps intro", type: "text", rows: 3, group: "process" }),
    defineField({
      name: "processSteps",
      title: "Steps",
      type: "array",
      group: "process",
      of: [defineArrayMember({ type: "titledCard" })],
    }),

    // Footer CTA
    defineField({ name: "footerHeadingLine1", title: "Heading line 1 (dark)", type: "string", group: "footerCta" }),
    defineField({ name: "footerHeadingLine2", title: "Heading line 2 (accent)", type: "string", group: "footerCta" }),
    defineField({ name: "footerBody", title: "Body", type: "text", rows: 3, group: "footerCta" }),
    defineField({ name: "footerCtaLabel", title: "CTA label", type: "string", group: "footerCta" }),
    defineField({ name: "footerImage", title: "Background image", type: "contentImage", group: "footerCta" }),
  ],
  preview: {
    prepare: () => ({ title: "Methodology Page" }),
  },
});
