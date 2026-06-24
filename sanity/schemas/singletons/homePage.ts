import { defineArrayMember, defineField, defineType } from "sanity";
import { HomeIcon } from "@sanity/icons";

export const homePage = defineType({
  name: "homePage",
  title: "Home Page",
  type: "document",
  icon: HomeIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "whyIntro", title: "Why GIRAI Intro" },
    { name: "dimensions", title: "Dimensions" },
    { name: "report", title: "Report Download" },
    { name: "takeaways", title: "Takeaways Carousel" },
    { name: "evidence", title: "Evidence Explorer" },
    { name: "indicators", title: "Indicator Categories" },
    { name: "limits", title: "Limits of Measurement" },
    { name: "impact", title: "Our Impact" },
    { name: "shaping", title: "Shaping Intelligence" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroHeadlineLead", title: "Headline (lead)", type: "string", group: "hero" }),
    defineField({ name: "heroHeadlineAccent", title: "Headline (accent)", type: "string", group: "hero" }),
    defineField({ name: "heroHeadlineTail", title: "Headline (tail)", type: "string", group: "hero" }),
    defineField({ name: "heroSubtext", title: "Subtext", type: "text", rows: 4, group: "hero" }),

    // Why GIRAI Intro
    defineField({ name: "whyHeading", title: "Heading", type: "string", group: "whyIntro" }),
    defineField({ name: "whySubtitle", title: "Subtitle", type: "text", rows: 2, group: "whyIntro" }),
    defineField({ name: "whyCtaLabel", title: "CTA label", type: "string", group: "whyIntro" }),
    defineField({
      name: "whyParagraphs",
      title: "Body paragraphs",
      type: "array",
      group: "whyIntro",
      of: [defineArrayMember({ type: "paragraph" })],
    }),

    // Dimensions
    defineField({ name: "dimensionsHeadingLead", title: "Heading (dark)", type: "string", group: "dimensions" }),
    defineField({ name: "dimensionsHeadingAccent", title: "Heading (accent)", type: "string", group: "dimensions" }),
    defineField({ name: "dimensionsSubtitle", title: "Subtitle", type: "text", rows: 2, group: "dimensions" }),

    // Report Download
    defineField({ name: "reportBadge", title: "Badge", type: "string", group: "report" }),
    defineField({ name: "reportHeadingLead", title: "Heading (dark)", type: "string", group: "report" }),
    defineField({ name: "reportHeadingAccent", title: "Heading (accent)", type: "string", group: "report" }),
    defineField({ name: "reportBody", title: "Body", type: "text", rows: 3, group: "report" }),
    defineField({ name: "reportPrimaryCtaLabel", title: "Primary CTA label", type: "string", group: "report" }),
    defineField({ name: "reportSecondaryCtaLabel", title: "Secondary CTA label", type: "string", group: "report" }),

    // Takeaways Carousel
    defineField({ name: "takeawaysBadge", title: "Badge", type: "string", group: "takeaways" }),
    defineField({ name: "takeawaysHeadingAccent", title: "Heading (accent)", type: "string", group: "takeaways" }),
    defineField({ name: "takeawaysHeadingTail", title: "Heading (dark)", type: "string", group: "takeaways" }),
    defineField({ name: "takeawaysSubtitle", title: "Subtitle", type: "text", rows: 2, group: "takeaways" }),
    defineField({ name: "takeawaysViewAllLabel", title: "View-all label", type: "string", group: "takeaways" }),

    // Evidence Explorer
    defineField({ name: "evidenceBadge", title: "Badge", type: "string", group: "evidence" }),
    defineField({ name: "evidenceHeading", title: "Heading", type: "string", group: "evidence" }),
    defineField({ name: "evidenceBody", title: "Body", type: "text", rows: 3, group: "evidence" }),
    defineField({ name: "evidenceCtaLabel", title: "CTA label", type: "string", group: "evidence" }),
    defineField({ name: "evidenceNote", title: "Card note", type: "text", rows: 3, group: "evidence" }),

    // Indicator Categories
    defineField({ name: "indicatorsHeadingAccent", title: "Heading (accent)", type: "string", group: "indicators" }),
    defineField({ name: "indicatorsHeadingTail", title: "Heading (dark)", type: "string", group: "indicators" }),
    defineField({ name: "indicatorsSubtitle", title: "Subtitle", type: "text", rows: 2, group: "indicators" }),

    // Limits of Measurement
    defineField({ name: "limitsHeadingLead", title: "Heading (dark)", type: "string", group: "limits" }),
    defineField({ name: "limitsHeadingAccent", title: "Heading (accent)", type: "string", group: "limits" }),
    defineField({ name: "limitsSubtitle", title: "Subtitle", type: "text", rows: 2, group: "limits" }),
    defineField({
      name: "limitsCards",
      title: "Cards",
      type: "array",
      group: "limits",
      of: [defineArrayMember({ type: "titledCard" })],
    }),

    // Our Impact
    defineField({ name: "impactHeadingLead", title: "Heading (dark)", type: "string", group: "impact" }),
    defineField({ name: "impactHeadingAccent", title: "Heading (accent)", type: "string", group: "impact" }),
    defineField({ name: "impactSubtitle", title: "Subtitle", type: "text", rows: 2, group: "impact" }),
    defineField({
      name: "impactCards",
      title: "Cards",
      type: "array",
      group: "impact",
      of: [defineArrayMember({ type: "titledCard" })],
    }),

    // Shaping Intelligence
    defineField({
      name: "shapingHeadingLines",
      title: "Heading lines",
      type: "array",
      group: "shaping",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),
  ],
  preview: {
    prepare: () => ({ title: "Home Page" }),
  },
});
