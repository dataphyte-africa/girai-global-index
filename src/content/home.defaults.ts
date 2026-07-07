import type { Card, Partner } from "./about.defaults";
import type { Stat } from "./takeaways.defaults";

export type HomeTakeawayCard = {
  category: string;
  title: string;
  description: string;
  stat: string;
  statCaption: string;
};

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

  takeawaysBadge: string;
  takeawaysHeadingAccent: string;
  takeawaysHeadingTail: string;
  takeawaysSubtitle: string;
  takeawaysViewAllLabel: string;
  takeawaysCards: HomeTakeawayCard[];

  evidenceBadge: string;
  evidenceHeading: string;
  evidenceBody: string;
  evidenceCtaLabel: string;
  evidenceNote: string;
  evidenceStats: Stat[];

  performanceHeadingLead: string;
  performanceHeadingAccent: string;
  performanceHeadingTail: string;
  performanceSubtitle: string;

  compareHeadingLead: string;
  compareHeadingAccent: string;
  compareSubheading: string;

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
  impactCtaLabel: string;
  impactCtaHref: string;

  usedByHeading: string;
  usedBySubtitle: string;
  usedByPartners: Partner[];

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

  takeawaysBadge: "Takeaway",
  takeawaysHeadingAccent: "Key",
  takeawaysHeadingTail: "Findings",
  takeawaysSubtitle:
    "What the data from 135 countries and jurisdictions reveals about the state of AI governance worldwide.",
  takeawaysViewAllLabel: "View All Takeaways",
  takeawaysCards: [
    {
      category: "Governance",
      title:
        "AI is accelerating faster than governments can govern it in the public interest",
      description:
        "Diffusion of AI is expanding, with 53% of the global population having used generative AI tools. Yet average GIRAI scores remain low, at roughly 35 out of 100, and evidence of implementation exists in only 55% of cases where frameworks are active, falling to 45% in Global South countries.",
      stat: "53%",
      statCaption: "of the global population has used generative AI tools",
    },
    {
      category: "Global South",
      title:
        "Responsible AI governance is expanding but binding protections remain weak",
      description:
        "Global South countries substantially broadened responsible AI content in their national frameworks — topics covered rose from 2.5 to 4.7, an 88% increase. Yet 78% of responsible AI framework cases in these countries are non-binding, compared with 42% in Global North countries.",
      stat: "88%",
      statCaption:
        "increase in responsible AI topics covered by Global South frameworks",
    },
    {
      category: "Safety",
      title:
        "AI safety is governed as a technical problem while human harms remain under-addressed",
      description:
        "AI safety and security is one of the fastest-growing areas, but much of it focuses on technical safeguards. The Index found credible evidence of government misuse of AI in 35 of 135 countries, and only 36% of countries have frameworks addressing AI-facilitated misinformation and violence.",
      stat: "35",
      statCaption: "countries with credible evidence of government AI misuse",
    },
    {
      category: "Transparency",
      title:
        "Governments are regulating AI transparency but not disclosing their own use of AI",
      description:
        "Transparency and Explainability is the strongest-performing indicator, with 58% of countries having some form of framework. Yet Public Disclosure of Government Algorithmic Systems is the weakest-performing indicator.",
      stat: "18%",
      statCaption: "of countries require disclosure of government AI systems",
    },
    {
      category: "Gender",
      title:
        "Gender is increasingly recognised but protection from gendered harms remains weak",
      description:
        "Gender equality is gaining visibility, with 29 new countries addressing gender and AI since the 1st Edition, but only 24 of 55 countries with gender-related frameworks show evidence of implementation.",
      stat: "29",
      statCaption:
        "new countries addressing gender and AI since the 1st Edition",
    },
    {
      category: "Education",
      title:
        "Future generations are prepared for the AI economy but not protected from harms",
      description:
        "AI Literacy is one of the strongest-performing indicators, with 71 countries (53%) having a framework in place. By contrast, only 55 countries (41%) have frameworks addressing Children's Rights in AI, and only 27 show evidence of implementation.",
      stat: "53%",
      statCaption: "of countries have an AI literacy framework in place",
    },
    {
      category: "Environment",
      title:
        "AI's environmental footprint remains a blind spot in responsible AI governance",
      description:
        "Only 27% of countries have frameworks addressing AI's environmental effects, and 83% of those frameworks are non-binding. Very few governments require disclosure of AI's energy use, water use, or environmental impact.",
      stat: "27%",
      statCaption:
        "of countries have frameworks on AI's environmental effects",
    },
    {
      category: "Inclusion",
      title:
        "Governments recognise the need for local-language AI but do not require developers to deliver it",
      description:
        "Governments are investing in local-language technologies, with 52 countries (39%) showing government-led initiatives. Only 47 countries (35%) have frameworks addressing Cultural and Linguistic Diversity, and few require developers to use diverse datasets.",
      stat: "35%",
      statCaption:
        "of countries have a cultural and linguistic diversity framework",
    },
    {
      category: "Labour",
      title: "Governments are investing in AI skills but neglecting workers' rights",
      description:
        "Labour protection frameworks exist in only 39 countries (29%), compared with 72 countries (53%) with frameworks on reskilling and upskilling. Few countries address workers' rights to organise and collectively bargain.",
      stat: "29%",
      statCaption: "of countries have a labour protection framework",
    },
    {
      category: "Equity",
      title:
        "Global AI governance is fragmenting before a shared floor of protection is established",
      description:
        "Average GIRAI scores range from 55 in Global North to 27 in Global South countries. Only 73 of 135 countries (54%) have adopted a national AI policy, and just 36 countries (27%) have operational mechanisms for civil society participation.",
      stat: "54%",
      statCaption:
        "of countries have adopted a national AI policy or equivalent",
    },
  ],

  evidenceBadge: "Evidence Explorer",
  evidenceHeading: "Explore the Evidence Behind the Index",
  evidenceBody:
    "Access the laws, policies, strategies, institutional actions, and public documents that inform GIRAI scores across countries and regions.",
  evidenceCtaLabel: "Explore Evidence Explorer",
  evidenceNote:
    "Every score in GIRAI is grounded in publicly verifiable evidence, reviewed through a structured research and validation process.",
  evidenceStats: [
    { value: "2,900+", label: "Documents reviewed" },
    { value: "135", label: "Countries assessed" },
    { value: "38", label: "Indicators covered" },
    { value: "7", label: "Global regions" },
  ],

  performanceHeadingLead: "Responsible ",
  performanceHeadingAccent: "AI Performance",
  performanceHeadingTail: " Across Countries",
  performanceSubtitle:
    "Switch between an interactive map and a full list to explore dimension and pillar scores for every country in the 2026 GIRAI edition.",

  compareHeadingLead: "Compare responsible AI ",
  compareHeadingAccent: "performance",
  compareSubheading:
    "Explore how countries and regions perform across GIRAI's governance dimensions, scores, and structural indicators.",

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
  impactCtaLabel: "GIRAI in Action",
  impactCtaHref: "",

  usedByHeading: "Trusted by organisations worldwide",
  usedBySubtitle:
    "Governments, researchers, and institutions that rely on GIRAI data and reports.",
  usedByPartners: [
    { name: "UNESCO", logo: { url: "/partners/unesco.webp", alt: "UNESCO" } },
    { name: "OECD", logo: { url: "/partners/oecd.png", alt: "OECD" } },
    {
      name: "United Nations Development Programme (UNDP)",
      logo: { url: "/partners/undp.png", alt: "United Nations Development Programme" },
    },
    {
      name: "International Telecommunication Union (ITU)",
      logo: { url: "/partners/itu.png", alt: "International Telecommunication Union" },
    },
    {
      name: "Inter-American Development Bank",
      logo: { url: "/partners/idb.png", alt: "Inter-American Development Bank" },
    },
    {
      name: "Global Partnership on AI (GPAI)",
      logo: { url: "/partners/gpai.webp", alt: "Global Partnership on AI" },
    },
    {
      name: "The Asia Foundation",
      logo: { url: "/partners/asia-foundation.png", alt: "The Asia Foundation" },
    },
    { name: "ILDA", logo: { url: "/partners/ilda.png", alt: "ILDA" } },
    {
      name: "Digital Futures Lab",
      logo: { url: "/partners/digital-futures-lab.jpg", alt: "Digital Futures Lab" },
    },
    {
      name: "IDFI",
      logo: { url: "/partners/idfi.png", alt: "Institute for Development of Freedom of Information" },
    },
    { name: "ACED", logo: { url: "/partners/aced.png", alt: "ACED" } },
    { name: "KG Labs", logo: { url: "/partners/kg-labs.png", alt: "KG Labs" } },
  ],

  shapingHeadingLines: ["Shaping", "Responsible", "Intelligence"],
};
