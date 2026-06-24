export type EvidenceContent = {
  heroTitleLead: string;
  heroTitleAccent: string;
  heroSubtitle: string;
  heroStatLabels: string[];
  pathwayHeading: string;
  pathwaySubtitle: string;
  seoTitle: string;
  seoDescription: string;
};

export const evidenceDefaults: EvidenceContent = {
  heroTitleLead: "Responsible AI ",
  heroTitleAccent: "Evidence Hub",
  heroSubtitle:
    "Explore the public evidence, frameworks, and institutional actions that inform GIRAI scores across countries and regions.",
  heroStatLabels: ["Countries Indexed", "Frameworks", "Evidence Items", "Indicators"],
  pathwayHeading: "What would you like to explore?",
  pathwaySubtitle: "Choose an evidence pathway to begin exploring the data behind GIRAI scores.",
  seoTitle: "Evidence Explorer | GIRAI Global Index",
  seoDescription:
    "Search and filter every law, policy, strategy and institutional action behind the GIRAI scores.",
};
