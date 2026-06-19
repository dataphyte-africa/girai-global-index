import { defineArrayMember, defineField, defineType } from "sanity";
import { InfoOutlineIcon } from "@sanity/icons";

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  icon: InfoOutlineIcon,
  groups: [
    { name: "hero", title: "Hero" },
    { name: "intro", title: "Intro" },
    { name: "whyMatters", title: "Why GIRAI Matters" },
    { name: "gcg", title: "Led by GCG" },
    { name: "measures", title: "What it Measures" },
    { name: "contributors", title: "Contributors" },
    { name: "whoFor", title: "Who It's For" },
    { name: "people", title: "People" },
    { name: "footerCta", title: "Footer CTA" },
  ],
  fields: [
    // Hero
    defineField({ name: "heroTitleLead", title: "Title (lead)", type: "string", group: "hero" }),
    defineField({ name: "heroTitleAccent", title: "Title (accent)", type: "string", group: "hero" }),
    defineField({ name: "heroLead", title: "Lead paragraph", type: "text", rows: 3, group: "hero" }),
    defineField({ name: "heroImage", title: "Background image", type: "contentImage", group: "hero" }),

    // Intro
    defineField({ name: "introHeadingLead", title: "Heading (dark)", type: "string", group: "intro" }),
    defineField({ name: "introHeadingMuted", title: "Heading (muted)", type: "string", group: "intro" }),
    defineField({ name: "introBody", title: "Body", type: "text", rows: 4, group: "intro" }),

    // Why GIRAI Matters
    defineField({ name: "whyHeadingLead", title: "Heading (lead)", type: "string", group: "whyMatters" }),
    defineField({ name: "whyHeadingAccent", title: "Heading (accent)", type: "string", group: "whyMatters" }),
    defineField({ name: "whyHeadingTail", title: "Heading (tail)", type: "string", group: "whyMatters" }),
    defineField({ name: "whySubtitle", title: "Subtitle", type: "text", rows: 2, group: "whyMatters" }),
    defineField({
      name: "whyCards",
      title: "Cards",
      type: "array",
      group: "whyMatters",
      of: [defineArrayMember({ type: "titledCard" })],
    }),

    // Led by GCG
    defineField({ name: "gcgBadge", title: "Badge label", type: "string", group: "gcg" }),
    defineField({ name: "gcgHeading", title: "Heading", type: "string", group: "gcg" }),
    defineField({ name: "gcgBody", title: "Body", type: "text", rows: 4, group: "gcg" }),
    defineField({ name: "gcgCta", title: "Button", type: "ctaLink", group: "gcg" }),
    defineField({ name: "gcgImage", title: "Image", type: "contentImage", group: "gcg" }),

    // What it Measures
    defineField({ name: "measuresBadge", title: "Badge label", type: "string", group: "measures" }),
    defineField({ name: "measuresHeadingLead", title: "Heading (dark)", type: "string", group: "measures" }),
    defineField({ name: "measuresHeadingAccent", title: "Heading (accent)", type: "string", group: "measures" }),
    defineField({ name: "measuresBody", title: "Body", type: "text", rows: 4, group: "measures" }),
    defineField({ name: "measuresImage", title: "Image", type: "contentImage", group: "measures" }),

    // Contributors
    defineField({ name: "contributorsHeading", title: "Heading", type: "string", group: "contributors" }),
    defineField({ name: "contributorsSubtitle", title: "Subtitle", type: "text", rows: 2, group: "contributors" }),
    defineField({
      name: "partners",
      title: "Partners",
      type: "array",
      group: "contributors",
      of: [defineArrayMember({ type: "partnerItem" })],
    }),

    // Who It's For
    defineField({ name: "whoForHeadingLead", title: "Heading (dark)", type: "string", group: "whoFor" }),
    defineField({ name: "whoForHeadingAccent", title: "Heading (accent)", type: "string", group: "whoFor" }),
    defineField({ name: "whoForSubtitle", title: "Subtitle", type: "text", rows: 2, group: "whoFor" }),
    defineField({
      name: "audiences",
      title: "Audiences",
      type: "array",
      group: "whoFor",
      of: [defineArrayMember({ type: "titledCard" })],
    }),
    defineField({ name: "whoForImage", title: "Image", type: "contentImage", group: "whoFor" }),
    defineField({ name: "whoForSummary", title: "Summary paragraph", type: "text", rows: 3, group: "whoFor" }),

    // People
    defineField({ name: "peopleHeadingLead", title: "Heading (lead)", type: "string", group: "people" }),
    defineField({ name: "peopleHeadingAccent", title: "Heading (accent)", type: "string", group: "people" }),
    defineField({ name: "peopleHeadingTail", title: "Heading (tail)", type: "string", group: "people" }),
    defineField({ name: "peopleSubtitle", title: "Subtitle", type: "text", rows: 2, group: "people" }),
    defineField({
      name: "people",
      title: "Contributor names",
      type: "array",
      group: "people",
      of: [defineArrayMember({ type: "string" })],
      options: { layout: "tags" },
    }),

    // Footer CTA
    defineField({ name: "footerHeading", title: "Heading", type: "string", group: "footerCta" }),
    defineField({ name: "footerBody", title: "Body", type: "text", rows: 3, group: "footerCta" }),
    defineField({ name: "footerCta", title: "Button", type: "ctaLink", group: "footerCta" }),
    defineField({ name: "footerImage", title: "Background image", type: "contentImage", group: "footerCta" }),
  ],
  preview: {
    prepare: () => ({ title: "About Page" }),
  },
});
