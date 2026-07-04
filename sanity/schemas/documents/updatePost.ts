import { defineType, defineField } from "sanity";
import { ComposeIcon } from "@sanity/icons";

/**
 * Editorial "Update" (blog post). Unlike the rest of the site content this is a
 * true collection: editors can freely create, edit, publish and delete posts in
 * Studio. Surfaced on /updates and /updates/[slug].
 */
export const UPDATE_CATEGORIES = [
  "Project update",
  "Research",
  "Press release",
  "Media coverage",
  "Country research",
  "Policy brief",
  "Methodology update",
  "Event",
  "News",
] as const;

export const updatePost = defineType({
  name: "updatePost",
  title: "Update",
  type: "document",
  icon: ComposeIcon,
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: UPDATE_CATEGORIES.map((value) => ({ title: value, value })),
        layout: "dropdown",
      },
      initialValue: "News",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "string",
      description: "Optional byline shown on the post.",
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description:
        "Show this post as the large highlighted card at the top of /updates. Only the most recent featured post is used.",
      initialValue: false,
    }),
    defineField({
      name: "coverImage",
      title: "Cover image",
      type: "contentImage",
      description: "Used as the card thumbnail and the post hero.",
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary shown on cards and the featured post.",
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "blockContent",
    }),
  ],
  orderings: [
    {
      title: "Published date, newest",
      name: "publishedDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "title", subtitle: "category", media: "coverImage" },
  },
});
