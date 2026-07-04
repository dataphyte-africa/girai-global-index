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
  heroTitleLead: "Key ",
  heroTitleAccent: "Findings",
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

  keyInsightsHeadingAccent: "10 Priorities",
  keyInsightsHeadingTail: " for the Next Phase of Responsible AI",
  keyInsightsSubtitle:
    "The next phase of responsible AI governance must move from commitments to protections.",
  insights: [
    {
      title: "Hold public-sector AI to a higher standard",
      description:
        "Governments should disclose when and how AI is used in public services and rights-bearing domains. Public algorithmic registers, procurement transparency, disclosure of AI-mediated decisions, and accessible routes for challenge should become baseline requirements.",
    },
    {
      title: "Build institutions as well as frameworks",
      description:
        "Only 28 countries have established independent oversight bodies. Responsible AI requires resourced oversight, monitoring and evaluation, audit capacity, enforcement, and public reporting. Frameworks without institutions will not protect people.",
    },
    {
      title: "Establish binding floors in high-risk areas",
      description:
        "Voluntary commitments have limits. Binding obligations are needed where harms are foreseeable and serious, including public-sector AI, children's rights, gendered harms, misinformation, labour, environment, transparency, and redress.",
    },
    {
      title: "Make redress central to responsible AI",
      description:
        "Responsible AI should be judged by whether people can challenge AI-related decisions and obtain remedy when harm occurs. Redress should not be an afterthought; it is the point at which responsibility becomes meaningful to those affected.",
    },
    {
      title: "Bring labour and environmental harms into AI governance",
      description:
        "Governments should treat labour conditions, data and platform work, algorithmic management, energy use, water demand, e-waste, data-centre infrastructure, and community impact as core responsible AI issues.",
    },
    {
      title: "Fund independent public-interest capacity",
      description:
        "AI governance capacity should not depend primarily on the companies whose systems are being governed. Universities, regulators, public institutions, CSOs, labour groups, digital rights organisations, and independent researchers should be resourced.",
    },
    {
      title: "Make participation meaningful",
      description:
        "Affected communities should have influence over AI governance rather than only occasional consultation. Workers, children's and women's rights advocates, disability groups, linguistic minorities, and digital rights groups need formal pathways to shape decisions.",
    },
    {
      title: "Build global convergence around rights, not only systems",
      description:
        "Global AI governance needs a shared rights-based foundation to ensure that data, models, standards, and services do not move across borders faster than the protections meant to accompany them.",
    },
    {
      title: "Treat monitoring and evidence as governance infrastructure",
      description:
        "Only 25 countries have monitoring and evaluation reports or platforms. Public registers, incident reporting, environmental reporting, implementation reviews, and independent observatories are core governance infrastructure, not secondary research tools.",
    },
    {
      title: "Advance South-South cooperation on AI governance",
      description:
        "Global South countries should treat interoperability as something to negotiate, not import. South-South coordination on shared positions for global negotiations is underdeveloped and would materially shift the imbalance of influence.",
    },
  ],
};
