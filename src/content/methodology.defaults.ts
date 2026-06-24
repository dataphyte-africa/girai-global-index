import type { Card, Cta, SanityImage } from "./about.defaults";
import type { Stat } from "./takeaways.defaults";

export type EditionChange = { dimension: string; before: string; now: string };
export type Definition = { title: string; definition: string };

export type MethodologyContent = {
  heroTitleLine1Lead: string;
  heroTitleLine1Accent: string;
  heroTitleLine2Accent: string;
  heroTitleLine2Tail: string;
  heroLead: string;
  heroCtaLabel: string;
  heroImage: SanityImage;

  introHeadingLead: string;
  introHeadingMuted: string;

  principlesBadge: string;
  principlesHeadingLead: string;
  principlesHeadingTail: string;
  principlesIntro: string;
  principlesImage: SanityImage;
  principles: Card[];

  measuresHeadingLead: string;
  measuresHeadingAccent: string;
  measuresHeadingTail: string;
  measuresSubtitle: string;
  dimensions: Card[];

  evolutionBadge: string;
  evolutionHeadingLead: string;
  evolutionHeadingAccent: string;
  evolutionParagraphs: string[];
  evolutionQuoteText: string;
  evolutionQuoteAttribution: string;

  refinedHeadingLead: string;
  refinedHeadingAccent: string;
  refinedSubtitle: string;
  refinements: Card[];

  editionHeadingAccent: string;
  editionHeadingTail: string;
  editionSubtitle: string;
  changes: EditionChange[];

  keyTermsHeadingAccent: string;
  keyTermsHeadingTail: string;
  keyTermsSubtitle: string;
  terms: Definition[];

  evidenceHeadingAccent: string;
  evidenceHeadingTail: string;
  evidenceSubtitle: string;
  evidenceRules: Card[];
  evidenceImage: SanityImage;

  accessBadge: string;
  accessHeadingLead: string;
  accessHeadingTail: string;
  accessBody: string;
  accessCta: Cta;
  accessImage: SanityImage;

  processStats: Stat[];
  processHeadingLead: string;
  processHeadingAccent: string;
  processSubtitle: string;
  processBadge: string;
  processStagesHeadingAccent: string;
  processStagesHeadingTail: string;
  processStagesIntro: string;
  processSteps: Card[];

  footerHeadingLine1: string;
  footerHeadingLine2: string;
  footerBody: string;
  footerCtaLabel: string;
  footerImage: SanityImage;
};

export const methodologyDefaults: MethodologyContent = {
  heroTitleLine1Lead: "How GIRAI ",
  heroTitleLine1Accent: "Measures",
  heroTitleLine2Accent: "Responsible ",
  heroTitleLine2Tail: "Artificial Intelligence",
  heroLead:
    "GIRAI's methodology turns global principles for responsible AI into clear, comparable evidence—assessing how countries govern and use AI in the public interest, not how advanced their technology is.",
  heroCtaLabel: "Download Methodology",
  heroImage: { url: "/methodology/hero.png", alt: null },

  introHeadingLead: "Designed for transparency and rigor, the methodology enables ",
  introHeadingMuted:
    "meaningful comparison across diverse legal, institutional, and development contexts.",

  principlesBadge: "Methodological Principles",
  principlesHeadingLead: "Built for Trust",
  principlesHeadingTail: ", Rigor, and Fair Comparison",
  principlesIntro: "GIRAI's methodology is grounded in five core principles:",
  principlesImage: {
    url: "/methodology/methodology-principle.png",
    alt: "Wooden blocks stacked in balance, representing methodological rigor",
  },
  principles: [
    {
      title: "Responsibility over capability",
      description:
        "GIRAI does not rank countries by AI sophistication. It evaluates the quality of governance, safeguards, and oversight shaping AI use.",
    },
    {
      title: "Evidence-based by design",
      description:
        "All assessments rely on public, verifiable evidence, documented and reviewed through standardized processes.",
    },
    {
      title: "Human-centred and rights-based",
      description:
        "Indicators are aligned with international human rights norms, ensuring AI is assessed through its impact on people and society.",
    },
    {
      title: "Globally comparable, locally grounded",
      description:
        "The same indicators apply worldwide, while research guidance allows for context-sensitive interpretation.",
    },
    {
      title: "Transparent and reviewable",
      description:
        "Methodological choices, indicators, and evidence rules are clearly defined so results can be understood, scrutinized, and improved.",
    },
  ],

  measuresHeadingLead: "What ",
  measuresHeadingAccent: "GIRAI",
  measuresHeadingTail: " Measures",
  measuresSubtitle:
    "GIRAI evaluates national AI ecosystems across five interconnected dimensions",
  dimensions: [
    {
      title: "Inclusion and Diversity",
      description:
        "Whether AI policies and practices promote equity, protect marginalized groups, and enable inclusive participation.",
    },
    {
      title: "Ethics and Sustainability",
      description:
        "Safeguards against discrimination and harm, transparency and explainability requirements, human oversight, and environmental responsibility.",
    },
    {
      title: "Labour and Skills",
      description:
        "How countries protect workers, invest in reskilling, and build AI literacy for an evolving economy.",
    },
    {
      title: "Trust and Safety",
      description:
        "Data protection and privacy, safety and security frameworks, access to redress, impact assessments, and responses to AI-enabled misinformation or violence.",
    },
    {
      title: "Use of AI in Public Sector Delivery",
      description:
        "How governments deploy AI in public services, including transparency, procurement standards, audits, civil society oversight, and unacceptable-risk uses.",
    },
  ],

  evolutionBadge: "Framework Evolution",
  evolutionHeadingLead: "Why the Framework ",
  evolutionHeadingAccent: "Evolved",
  evolutionParagraphs: [
    "Since the first edition of GIRAI, the global AI governance environment has evolved significantly. Governments have moved from high-level strategy development toward implementation and regulatory experimentation. Oversight mechanisms have matured, public debate has deepened, and expectations around responsible AI have become more precise.",
    "To remain analytically relevant, the GIRAI framework was refined to better capture these developments. The evolution reflects lessons learned from the previous cycle, feedback from researchers and stakeholders, and the need to distinguish more clearly between policy intent, operational action, and structural capacity.",
  ],
  evolutionQuoteText:
    "The core principles of GIRAI remain unchanged. What has evolved is the precision with which those principles are measured.",
  evolutionQuoteAttribution: "GIRAI Methodology — Second Edition",

  refinedHeadingLead: "How the Framework ",
  refinedHeadingAccent: "Was Refined",
  refinedSubtitle: "Strengthening Clarity, Comparability, and Implementation Focus",
  refinements: [
    {
      title: "Clearer Dimension Structure",
      description:
        "Dimensions were refined to better distinguish between governance commitments, implementation activity, and enabling conditions — improving conceptual clarity and analytical balance.",
    },
    {
      title: "Stronger Indicator Definitions",
      description:
        "Indicator wording and evidence requirements were tightened to reduce ambiguity and improve consistency across countries, enhancing cross-country comparability.",
    },
    {
      title: "Greater Emphasis on Implementation",
      description:
        "The updated framework places stronger focus on operational oversight, enforcement, and real-world action — not just the existence of policies on paper.",
    },
    {
      title: "Enhanced Review and Validation",
      description:
        "Quality assurance processes were strengthened, including clearer coding guidance and more structured cross-country validation procedures.",
    },
  ],

  editionHeadingAccent: "What Changed ",
  editionHeadingTail: "in This Edition",
  editionSubtitle:
    "Key differences between the previous and current edition of the GIRAI methodology framework.",
  changes: [
    {
      dimension: "Governance Emphasis",
      before: "Greater emphasis on the existence of frameworks",
      now: "Clear separation between government frameworks, implementation actions, and contextual indicators",
    },
    {
      dimension: "Policy vs. Implementation",
      before: "Less distinction between policy intent and implementation",
      now: "Stronger focus on operational oversight and enforcement mechanisms",
    },
    {
      dimension: "Indicator Structure",
      before: "Broader grouping of indicator types",
      now: "Refined indicator definitions and clearer evidence standards",
    },
    {
      dimension: "Governance Context",
      before: "Early-stage global governance landscape",
      now: "Expanded validation and review procedures reflecting a maturing governance environment",
    },
  ],

  keyTermsHeadingAccent: "Key Terms ",
  keyTermsHeadingTail: "and Definitions",
  keyTermsSubtitle:
    "The core concepts that shape GIRAI's methodology, clearly defined for transparency and consistency.",
  terms: [
    {
      title: "Thematic area",
      definition:
        "Composite indicator measuring the performance of the responsible AI ecosystem in relation to a sub-component of responsible AI",
    },
    {
      title: "Dimension",
      definition:
        "One of five interconnected areas that structure GIRAI's assessment of national responsible AI — spanning inclusion, ethics, labour, trust, and public-sector use.",
    },
    {
      title: "Pillar",
      definition:
        "A structural layer assessed within each thematic area, distinguishing government frameworks, government actions, and non-state actor contributions to responsible AI.",
    },
    {
      title: "Government frameworks",
      definition:
        "The laws, policies, strategies, and institutional arrangements through which governments commit to governing AI responsibly.",
    },
    {
      title: "Government actions",
      definition:
        "Operational measures taken by government to implement responsible AI — including enforcement, oversight, procurement, and deployment in public services.",
    },
    {
      title: "Non-state actors",
      definition:
        "Initiatives and contributions from civil society, academia, industry, and other non-government actors that shape, scrutinise, and advance responsible AI.",
    },
  ],

  evidenceHeadingAccent: "Evidence Standards ",
  evidenceHeadingTail: "of GIRAI",
  evidenceSubtitle:
    "To ensure credibility across more than 140 countries, GIRAI applies strict evidence rules:",
  evidenceRules: [
    {
      title: "Publicly available and verifiable",
      description: "All evidence must be accessible for independent review",
    },
    {
      title: "Written documentation only",
      description: "Ensures consistency and permanence of evidence",
    },
    {
      title: "Archived online sources",
      description: "Web sources are permanently archived",
    },
    {
      title: "Within study timeframe",
      description: "All evidence must directly relate to AI systems",
    },
    {
      title: "AI-related explicitly",
      description:
        "Compare progress, identify gaps, and support policy coordination across jurisdictions.",
    },
    {
      title: "No standalone interviews",
      description: "Interviews inform but don't constitute evidence",
    },
  ],
  evidenceImage: {
    url: "/methodology/evidence-standard.png",
    alt: "Digital evidence verification interface with checklists and security indicators",
  },

  accessBadge: "OPEN DATA",
  accessHeadingLead: "Access the Data",
  accessHeadingTail: "Behind the Index",
  accessBody:
    "Download the full dataset and explore the structured evidence, indicators, and documentation that underpin GIRAI scores across countries.",
  accessCta: { label: "Download data", href: "/data" },
  accessImage: { url: "/methodology/access-data.png", alt: "Hand holding the GIRAI report" },

  processStats: [
    { value: "150+", label: "Researchers engaged globally" },
    { value: "3-Tier", label: "Independent review structure" },
    { value: "25", label: "Indicators assessed" },
    { value: "100%", label: "Public evidence verified" },
  ],
  processHeadingLead: "Research and ",
  processHeadingAccent: "Review Process",
  processSubtitle:
    "How multi-layered review ensures consistency, independence, and methodological rigor.",
  processBadge: "Research Process",
  processStagesHeadingAccent: "Five Stages",
  processStagesHeadingTail: " of Evidence Review",
  processStagesIntro:
    "From in-country fieldwork to global validation, each submission advances through structured, independent checkpoints.",
  processSteps: [
    {
      title: "Expert-Led Research",
      description:
        "In-country researchers collect and document evidence using standardized questionnaires and methodological guidance.",
    },
    {
      title: "Researcher Submission",
      description:
        "Completed questionnaires and supporting evidence are formally submitted through the survey system for review.",
    },
    {
      title: "Country Coordinator Review",
      description:
        "Country coordinators review submissions, verify evidence quality, and ensure alignment with methodological requirements.",
    },
    {
      title: "Regional Supervision",
      description:
        "Regional supervisors conduct oversight, spot-check submissions, and address inconsistencies across countries.",
    },
    {
      title: "Global Review",
      description:
        "Final global review and validation to ensure consistency, accuracy, and cross-country comparability.",
    },
  ],

  footerHeadingLine1: "Download GIRAI Research",
  footerHeadingLine2: "Methodology Handbook",
  footerBody: "Access the full technical documentation behind the GIRAI methodology.",
  footerCtaLabel: "Download book",
  footerImage: { url: "/methodology/footer-hero.png", alt: null },
};
