import type { Card } from "./about.defaults";

export type HomeContent = {
  heroHeadlineLead: string;
  heroHeadlineAccent: string;
  heroHeadlineTail: string;
  heroSubtext: string;

  whyHeading: string;
  whySubtitle: string;
  whyCtaLabel: string;
  whyParagraphs: string[];

  dimensionsHeadingLead: string;
  dimensionsHeadingAccent: string;
  dimensionsSubtitle: string;

  reportBadge: string;
  reportHeadingLead: string;
  reportHeadingAccent: string;
  reportBody: string;
  reportPrimaryCtaLabel: string;
  reportSecondaryCtaLabel: string;

  takeawaysBadge: string;
  takeawaysHeadingAccent: string;
  takeawaysHeadingTail: string;
  takeawaysSubtitle: string;
  takeawaysViewAllLabel: string;

  evidenceBadge: string;
  evidenceHeading: string;
  evidenceBody: string;
  evidenceCtaLabel: string;
  evidenceNote: string;

  indicatorsHeadingAccent: string;
  indicatorsHeadingTail: string;
  indicatorsSubtitle: string;

  limitsHeadingLead: string;
  limitsHeadingAccent: string;
  limitsSubtitle: string;
  limitsCards: Card[];

  impactHeadingLead: string;
  impactHeadingAccent: string;
  impactSubtitle: string;
  impactCards: Card[];

  shapingHeadingLines: string[];
};

export const homeDefaults: HomeContent = {
  heroHeadlineLead: "Igniting global action on ",
  heroHeadlineAccent: "responsible AI",
  heroHeadlineTail: ", with local evidence.",
  heroSubtext:
    "Unlike indexes that assess AI through adoption and application, GIRAI examines responsible AI through a human rights lens — measuring not just whether countries are building AI, but whether they are building it in ways that protect people's rights, dignity, and freedoms.",

  whyHeading: "Why GIRAI Matters",
  whySubtitle:
    "Turning AI ethics into measurable action for governments, society, and public trust.",
  whyCtaLabel: "Learn more",
  whyParagraphs: [
    "Without measurement, the promise of responsible AI remains abstract. GIRAI exists to close the gap between principles and practice — tracking what countries are actually doing to govern AI responsibly.",
    "Today, there is a scarcity of globally representative data on what steps countries are taking to prepare for the challenges and possibilities presented by AI — particularly with regard to the enjoyment and realization of human rights. Commitments are made, frameworks are drafted, but without consistent, comparable evidence, there is no way to know whether progress is real or rhetorical. The Global Index on Responsible AI is the first tool of its kind — a comprehensive, human rights–based measurement initiative designed for policymakers, researchers, and journalists. With a comparative set of benchmarks, it measures government commitments and country capacities through a social, technical, and political lens.",
    "What sets GIRAI apart is how the evidence is gathered. Rather than relying solely on publicly available datasets, the Index generates primary, locally sourced data — representing the breadth and depth of experiences across different regions and filling critical gaps that global datasets typically miss.",
    "This approach is built on four commitments: it is collaborative — bringing together diverse voices and perspectives from every region. It is rigorous — drawing on firsthand, in-country evidence from people who know the local landscape. It is independent — led by independent organisations worldwide. And it is actionable — designed not just to describe the state of AI governance, but to drive local and global action on responsible AI.",
  ],

  dimensionsHeadingLead: "The Five Dimensions of ",
  dimensionsHeadingAccent: "Responsible AI",
  dimensionsSubtitle:
    "Explore the framework used to assess national AI governance across countries",

  reportBadge: "REPORT 2024",
  reportHeadingLead: "Global Index on Responsible AI — ",
  reportHeadingAccent: "2026 Report",
  reportBody:
    "Download the 2024 edition of the Global Index on Responsible AI, offering comparative insights into how countries govern and use artificial intelligence.",
  reportPrimaryCtaLabel: "Download Report",
  reportSecondaryCtaLabel: "Download 2025 report",

  takeawaysBadge: "Takeaway",
  takeawaysHeadingAccent: "Top 10",
  takeawaysHeadingTail: "take away",
  takeawaysSubtitle:
    "What the data from 135 countries and jurisdictions reveals about the state of AI governance worldwide.",
  takeawaysViewAllLabel: "View All Takeaways",

  evidenceBadge: "Evidence Explorer",
  evidenceHeading: "Explore the Evidence Behind the Index",
  evidenceBody:
    "Access the laws, policies, strategies, institutional actions, and public documents that inform GIRAI scores across countries and regions.",
  evidenceCtaLabel: "Explore Evidence Explorer",
  evidenceNote:
    "Every score in GIRAI is grounded in publicly verifiable evidence, reviewed through a structured research and validation process.",

  indicatorsHeadingAccent: "Three Categories",
  indicatorsHeadingTail: " of Responsible AI Indicators",
  indicatorsSubtitle:
    "To provide a comprehensive picture, the indicators for the Global Index of Responsible AI are grouped into three categories",

  limitsHeadingLead: "Understanding the ",
  limitsHeadingAccent: "Limits of Measurement",
  limitsSubtitle: "What this Index can — and cannot — capture.",
  limitsCards: [
    {
      title: "What The Index Can Do",
      description:
        "The index enables systematic comparison across organizations, tracks progress over time, and identifies governance gaps. It provides a framework for understanding maturity of responsible AI practices and creates accountability through transparency.",
    },
    {
      title: "What The Index Cannot Do",
      description:
        "Responsible AI is contextual, political, and contested. Scores cannot capture the lived realities of those affected by AI systems, the nuances of implementation, or the complex social and ethical trade-offs that arise in practice.",
    },
    {
      title: "How GIRAI Responds",
      description:
        "GIRAI complements quantitative scores with qualitative insights, transparent methodology, and contextual interpretation. We recognise that measurement is a tool — useful for comparison, but never a substitute for critical judgment.",
    },
  ],

  impactHeadingLead: "Our Impact on ",
  impactHeadingAccent: "Responsible AI Governance",
  impactSubtitle:
    "How GIRAI is helping governments, researchers, civil society, and institutions understand and strengthen responsible AI governance worldwide.",
  impactCards: [
    {
      title: "International Organisation",
      description:
        "GIRAI provides clear benchmarks and comparative insights that help policymakers identify gaps, track progress, and design stronger governance frameworks for artificial intelligence.",
    },
    {
      title: "Global Policy makers",
      description:
        "By making scores traceable to public evidence, GIRAI promotes greater openness in how AI governance is measured and encourages accountable decision-making across institutions.",
    },
    {
      title: "Media Institutions",
      description:
        "Researchers, advocates, and civil society organisations use GIRAI data to inform public debate, support advocacy efforts, and advance more inclusive approaches to responsible AI.",
    },
  ],

  shapingHeadingLines: ["Shaping", "Responsible", "Intelligence"],
};
