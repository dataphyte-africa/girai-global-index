import { defineField, defineType } from "sanity";
import { ClockIcon } from "@sanity/icons";

export const countdownModal = defineType({
  name: "countdownModal",
  title: "Countdown Modal",
  type: "document",
  icon: ClockIcon,
  fields: [
    defineField({
      name: "enabled",
      title: "Enabled",
      type: "boolean",
      description:
        "When on, a full-screen countdown covers the whole site until the target date passes. Turn off to make the site accessible immediately, regardless of the date.",
      initialValue: true,
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      description: "First part of the headline (shown in white).",
    }),
    defineField({
      name: "headingAccent",
      title: "Heading — accent",
      type: "string",
      description: "Second part of the headline (shown in teal).",
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "targetDate",
      title: "Countdown target date & time",
      type: "datetime",
      description:
        "When the countdown reaches this moment it disappears and the site becomes accessible. Stored in UTC; the Studio editor shows your local time.",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    prepare: () => ({ title: "Countdown Modal" }),
  },
});
