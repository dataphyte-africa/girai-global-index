import type { Card, SanityImage } from "./about.defaults";

export type Stat = { label: string; value: string };

export type TakeawaysContent = {
  heroTitleLead: string;
  heroTitleAccent: string;
  heroLead: string;
  heroStats: Stat[];
  heroImage: SanityImage;

  introHeadingLead: string;
  introHeadingMuted: string;

  keyInsightsHeadingAccent: string;
  keyInsightsHeadingTail: string;
  keyInsightsSubtitle: string;
  insights: Card[];
};

export const takeawaysDefaults: TakeawaysContent = {
  heroTitleLead: "Top 10 ",
  heroTitleAccent: "Takeaways",
  heroLead:
    "The most important insights shaping how countries govern artificial intelligence responsibly across regions and contexts.",
  heroStats: [
    { label: "Edition", value: "2026" },
    { label: "Countries Assessed", value: "135" },
  ],
  heroImage: { url: "/takeaways/hero-takeaways.png", alt: null },

  introHeadingLead:
    "Across regions and income levels, countries are taking distinct approaches to governing artificial intelligence. ",
  introHeadingMuted:
    "The findings below highlight the most significant global patterns emerging from this edition of GIRAI",

  keyInsightsHeadingAccent: "Key Insights",
  keyInsightsHeadingTail: " from the Global Index",
  keyInsightsSubtitle: "What the evidence reveals about global AI governance",
  insights: [
    {
      title: "Policy Adoption Is Increasing, but Implementation Lags",
      description:
        "More countries have adopted national AI strategies, but fewer have established operational oversight or enforcement mechanisms. The gap between commitment and execution remains a central governance challenge.",
    },
    {
      title: "Oversight and Accountability Systems Remain Underdeveloped",
      description:
        "Independent monitoring bodies and structured audits are still limited in many jurisdictions. Transparency requirements vary, and access to redress for individuals affected by AI systems remains inconsistent.",
    },
    {
      title: "Society Engagement Strengthens Governance Outcomes",
      description:
        "Countries with active civil society participation tend to demonstrate stronger transparency and more inclusive processes. Where engagement is institutionalized, governance frameworks are more balanced and accountable.",
    },
  ],
};
