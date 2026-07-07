export type CountdownModalContent = {
  enabled: boolean;
  heading: string;
  headingAccent: string;
  description: string;
  /** ISO datetime string. */
  targetDate: string;
};

export const countdownModalDefaults: CountdownModalContent = {
  enabled: true,
  heading: "The Next Global Benchmark for",
  headingAccent: "Responsible AI Is Almost Here",
  description:
    "Explore how 135 countries are governing artificial intelligence through the world's most comprehensive evidence-based Responsible AI Index.",
  // Tomorrow at 4:30 PM UTC+2 (= 14:30 UTC). Editable in Sanity Studio.
  targetDate: "2026-07-08T14:30:00.000Z",
};
