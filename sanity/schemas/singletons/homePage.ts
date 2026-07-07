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
    { name: "takeaways", title: "Takeaways Carousel" },
    { name: "evidence", title: "Evidence Explorer" },
    { name: "performance", title: "Performance Across Countries" },
    { name: "compare", title: "Compare Section" },
    { name: "indicators", title: "Indicator Categories" },
    { name: "limits", title: "Limits of Measurement" },
    { name: "impact", title: "Our Impact" },
    { name: "usedBy", title: "Used By (Logos)" },
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

    // Takeaways Carousel
    defineField({ name: "takeawaysBadge", title: "Badge", type: "string", group: "takeaways" }),
    defineField({ name: "takeawaysHeadingAccent", title: "Heading (accent)", type: "string", group: "takeaways" }),
    defineField({ name: "takeawaysHeadingTail", title: "Heading (dark)", type: "string", group: "takeaways" }),
    defineField({ name: "takeawaysSubtitle", title: "Subtitle", type: "text", rows: 2, group: "takeaways" }),
    defineField({ name: "takeawaysViewAllLabel", title: "View-all label", type: "string", group: "takeaways" }),
    defineField({
      name: "takeawaysCards",
      title: "Carousel cards",
      type: "array",
      group: "takeaways",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            { name: "category", title: "Category (pill)", type: "string" },
            { name: "title", title: "Title", type: "text", rows: 2 },
            { name: "description", title: "Description", type: "text", rows: 4 },
            { name: "stat", title: "Stat (big number)", type: "string" },
            { name: "statCaption", title: "Stat caption", type: "string" },
          ],
          preview: { select: { title: "title", subtitle: "category" } },
        }),
      ],
    }),

    // Evidence Explorer
    defineField({ name: "evidenceBadge", title: "Badge", type: "string", group: "evidence" }),
    defineField({ name: "evidenceHeading", title: "Heading", type: "string", group: "evidence" }),
    defineField({ name: "evidenceBody", title: "Body", type: "text", rows: 3, group: "evidence" }),
    defineField({ name: "evidenceCtaLabel", title: "CTA label", type: "string", group: "evidence" }),
    defineField({ name: "evidenceNote", title: "Card note", type: "text", rows: 3, group: "evidence" }),
    defineField({
      name: "evidenceStats",
      title: "Stat cards",
      description: "The number + label tiles shown on the dark card (e.g. \"2,900+ Documents reviewed\").",
      type: "array",
      group: "evidence",
      of: [defineArrayMember({ type: "statItem" })],
    }),

    // Performance Across Countries (map/list section)
    defineField({ name: "performanceHeadingLead", title: "Heading (lead)", type: "string", group: "performance" }),
    defineField({ name: "performanceHeadingAccent", title: "Heading (accent)", type: "string", group: "performance" }),
    defineField({ name: "performanceHeadingTail", title: "Heading (tail)", type: "string", group: "performance" }),
    defineField({ name: "performanceSubtitle", title: "Subtitle", type: "text", rows: 2, group: "performance" }),

    // Compare Section
    defineField({ name: "compareHeadingLead", title: "Heading (lead)", type: "string", group: "compare" }),
    defineField({ name: "compareHeadingAccent", title: "Heading (accent)", type: "string", group: "compare" }),
    defineField({ name: "compareSubheading", title: "Subheading", type: "text", rows: 2, group: "compare" }),

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
    defineField({ name: "impactCtaLabel", title: "CTA button label", type: "string", group: "impact" }),
    defineField({
      name: "impactCtaHref",
      title: "CTA button link (GIRAI in Action)",
      type: "url",
      description:
        "Link to the article showcasing high-level citations of the Index. The button is hidden while this is empty.",
      group: "impact",
    }),

    // Used By (logo marquee)
    defineField({ name: "usedByHeading", title: "Heading", type: "string", group: "usedBy" }),
    defineField({ name: "usedBySubtitle", title: "Subtitle", type: "text", rows: 2, group: "usedBy" }),
    defineField({
      name: "usedByPartners",
      title: "Organisations",
      description:
        "Each entry shows its logo in the scrolling strip. If no logo is uploaded, the name is shown as a text placeholder.",
      type: "array",
      group: "usedBy",
      of: [defineArrayMember({ type: "partnerItem" })],
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
