/**
 * Seed content for the Updates (blog) collection. Sourced and adapted from the
 * Global Center on AI Governance newsroom. These are seeded once via
 * `pnpm seed:sanity`; thereafter editors create/edit/delete posts in Studio.
 */
export type UpdateSeed = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string; // ISO 8601
  author?: string;
  featured?: boolean;
  excerpt: string;
  image: { url: string; alt: string };
  body: string[];
};

export const updatesSeed: UpdateSeed[] = [
  {
    slug: "girai-2026-launches-in-geneva",
    title:
      "The Global Index on Responsible AI 2026 Launches in Geneva This July",
    category: "Project update",
    publishedAt: "2026-06-26T09:00:00.000Z",
    featured: true,
    excerpt:
      "The second edition of the Global Index on Responsible AI will be unveiled in Geneva this July, mapping how governments worldwide are turning AI principles into practice.",
    image: {
      url: "/takeaways/hero-takeaways.png",
      alt: "GIRAI 2026 launch in Geneva",
    },
    body: [
      "The Global Center on AI Governance is proud to announce that the second edition of the Global Index on Responsible AI (GIRAI) will be launched in Geneva this July. The 2026 edition expands the Index's coverage and deepens its evidence base, tracking how countries are moving from high-level AI principles to concrete governance action.",
      "Built on thousands of pieces of independently collected evidence and a network of regional researchers, the new edition assesses national performance across the Index's dimensions of human rights, technical safety, and responsible governance. The launch event brings together policymakers, researchers, and civil society to examine where progress is being made — and where critical gaps remain.",
      "Join us in Geneva to explore the findings, meet the researchers behind the data, and discuss what responsible AI governance looks like in practice across every region of the world.",
    ],
  },
  {
    slug: "publicly-accessible-data-and-ai-analysis",
    title: "Publicly Accessible Data and AI Analysis",
    category: "Research",
    publishedAt: "2026-05-25T09:00:00.000Z",
    excerpt:
      "Every indicator, score, and piece of evidence behind the Index is now openly available for researchers, journalists, and policymakers to explore and reuse.",
    image: { url: "/methodology/access-data.png", alt: "Open data and analysis" },
    body: [
      "Transparency is a founding principle of the Global Index on Responsible AI. To that end, the full dataset behind the Index — every indicator, country score, and underlying piece of evidence — is now publicly accessible for download and independent analysis.",
      "Researchers can interrogate the methodology, replicate our scoring, and build their own analyses on top of the data. By opening the evidence base, we invite scrutiny and collaboration, and we make it easier for national stakeholders to understand exactly how their country's assessment was reached.",
    ],
  },
  {
    slug: "report-launch-tech-justice-in-africa",
    title: "Report Launch | Tech Justice in Africa",
    category: "Event",
    publishedAt: "2026-03-09T09:00:00.000Z",
    excerpt:
      "A new report examines how emerging technologies intersect with justice, rights, and accountability across the African continent.",
    image: {
      url: "/dimensions/inclusion-diversity.png",
      alt: "Tech Justice in Africa report launch",
    },
    body: [
      "We are pleased to launch Tech Justice in Africa, a report exploring how AI and emerging technologies are reshaping questions of justice, equity, and accountability across the continent.",
      "Drawing on regional expertise, the report highlights both the risks of unaccountable technology deployment and the opportunities for African-led governance frameworks that centre human rights and inclusion.",
    ],
  },
  {
    slug: "girai-featured-in-global-media-roundup",
    title:
      "GIRAI Featured in Nature and the Financial Times: Global Media Roundup",
    category: "Media coverage",
    publishedAt: "2026-03-01T09:00:00.000Z",
    excerpt:
      "From Nature to the Financial Times, the Global Index on Responsible AI continues to shape international coverage of AI governance.",
    image: { url: "/regions/hero.png", alt: "Global media coverage" },
    body: [
      "The Global Index on Responsible AI has been cited across leading international outlets over the past quarter, from peer-reviewed research in Nature to policy commentary in the Financial Times.",
      "This roundup collects recent coverage referencing the Index's findings — evidence that a rigorous, Global-South-led assessment of AI governance is increasingly central to the international conversation.",
    ],
  },
  {
    slug: "generative-ai-in-lmics-published-in-nature",
    title:
      "Our Landmark Study on Generative AI in LMICs Has Been Published in Nature",
    category: "Research",
    publishedAt: "2026-02-24T09:00:00.000Z",
    excerpt:
      "A first-of-its-kind study on generative AI in low- and middle-income countries has been published in Nature, foregrounding voices too often left out of global AI research.",
    image: {
      url: "/about/what-index-measures.png",
      alt: "Generative AI in LMICs study",
    },
    body: [
      "We are thrilled to share that our landmark study on the use and governance of generative AI in low- and middle-income countries (LMICs) has been published in Nature.",
      "The research documents how generative AI is being adopted, regulated, and experienced outside the wealthy economies that dominate AI discourse. Its publication in Nature marks a significant milestone for Global-South-led scholarship on responsible AI.",
    ],
  },
  {
    slug: "south-south-cooperation-india-ai-impact-summit-2026",
    title:
      "Advancing South–South Cooperation in AI Policymaking at the India AI Impact Summit 2026",
    category: "Country research",
    publishedAt: "2026-02-04T09:00:00.000Z",
    excerpt:
      "At the India AI Impact Summit 2026, we made the case for stronger South–South cooperation on AI policy grounded in shared evidence and priorities.",
    image: {
      url: "/new-dimensions/ai-use-in-public.png",
      alt: "India AI Impact Summit 2026",
    },
    body: [
      "At the India AI Impact Summit 2026, our team joined policymakers and researchers from across the Global South to advance a shared agenda for responsible AI governance.",
      "We argued that South–South cooperation — anchored in common evidence, comparable indicators, and shared policy priorities — is essential to ensuring that global AI norms reflect the realities of the majority of the world's population.",
    ],
  },
  {
    slug: "why-africa-needs-data-embassies",
    title: "Why Africa Needs Data Embassies",
    category: "Country research",
    publishedAt: "2026-01-22T09:00:00.000Z",
    excerpt:
      "Data embassies could give African states greater sovereignty and resilience over the data that increasingly powers public life.",
    image: {
      url: "/dimensions/ai-use-public-service.png",
      alt: "Data embassies in Africa",
    },
    body: [
      "As AI systems become embedded in public services, the question of who controls the underlying data becomes a question of sovereignty. Data embassies — jurisdictionally protected data infrastructure hosted with trusted partners — offer one path to greater resilience.",
      "This analysis explores how African states might use data embassies to safeguard critical data, retain control during crises, and negotiate the terms on which their data supports AI development.",
    ],
  },
  {
    slug: "global-ai-policy-training-programme-launched",
    title:
      "Global AI Policy Training Programme Launched to Strengthen International Cooperation",
    category: "News",
    publishedAt: "2025-12-08T09:00:00.000Z",
    excerpt:
      "A new training programme equips policymakers with the tools to design and implement responsible AI governance frameworks.",
    image: {
      url: "/new-dimensions/labour-skills.png",
      alt: "Global AI policy training programme",
    },
    body: [
      "We are launching a Global AI Policy Training Programme designed to build the capacity of public officials to govern AI responsibly.",
      "The programme combines practical policy tools, comparative case studies, and the evidence base of the Global Index to help participants translate principles into enforceable, context-appropriate governance.",
    ],
  },
  {
    slug: "un-secretary-general-governing-ai-for-humanity",
    title:
      "GIRAI Index Cited in UN Secretary-General's Governing AI for Humanity Report",
    category: "Media coverage",
    publishedAt: "2025-11-20T09:00:00.000Z",
    excerpt:
      "The Global Index on Responsible AI features in the UN Secretary-General's landmark report on international AI governance.",
    image: { url: "/regions/hero.png", alt: "UN Governing AI for Humanity" },
    body: [
      "The Global Index on Responsible AI has been cited in the United Nations Secretary-General's report, Governing AI for Humanity, as a key resource for understanding the state of national AI governance worldwide.",
      "The recognition underscores the value of independent, evidence-based measurement in informing the emerging architecture of international AI cooperation.",
    ],
  },
  {
    slug: "revised-indicator-framework-2026-edition",
    title:
      "Revised Indicator Framework for the 2026 Edition — What Changed and Why",
    category: "Methodology update",
    publishedAt: "2025-10-15T09:00:00.000Z",
    excerpt:
      "The 2026 edition introduces a refined indicator framework with a stronger focus on operational oversight and real-world enforcement.",
    image: {
      url: "/methodology/evidence-standard.png",
      alt: "Revised indicator framework",
    },
    body: [
      "Ahead of the 2026 edition, we have revised the Index's indicator framework to better capture what responsible AI governance looks like in practice.",
      "The updated framework places stronger emphasis on operational oversight, enforcement, and real-world action — not just the existence of policies on paper. This note explains what changed, and the reasoning behind each revision.",
    ],
  },
  {
    slug: "accountability-gaps-in-national-ai-strategies",
    title:
      "Accountability Gaps in National AI Strategies: A Comparative Analysis",
    category: "Policy brief",
    publishedAt: "2025-09-30T09:00:00.000Z",
    excerpt:
      "Many national AI strategies articulate strong principles but lack the accountability mechanisms needed to make them real.",
    image: {
      url: "/new-dimensions/trust-safety.png",
      alt: "Accountability gaps analysis",
    },
    body: [
      "This policy brief compares national AI strategies across regions, focusing on a persistent gap: the distance between stated principles and the mechanisms required to enforce them.",
      "We find that while commitments to fairness, transparency, and human oversight are widespread, concrete accountability structures — audits, redress mechanisms, and oversight bodies — remain the exception rather than the rule.",
    ],
  },
  {
    slug: "algorithmic-auditing-eu-ai-act",
    title:
      "Algorithmic Auditing Requirements in the EU AI Act: Implications for the Global Index",
    category: "Policy brief",
    publishedAt: "2025-08-18T09:00:00.000Z",
    excerpt:
      "As the EU AI Act's auditing requirements take shape, we examine what they mean for how the Index measures technical accountability.",
    image: {
      url: "/new-dimensions/ethics-sustainability.png",
      alt: "EU AI Act algorithmic auditing",
    },
    body: [
      "The EU AI Act introduces some of the most detailed algorithmic auditing requirements in the world. This brief unpacks those provisions and considers how they map onto the Index's indicators for technical accountability.",
      "We explore how binding audit obligations could serve as a reference point for other jurisdictions, and how the Index can capture the difference between paper compliance and meaningful assurance.",
    ],
  },
  {
    slug: "announcing-second-edition-2026",
    title:
      "Announcing the Second Edition of the Global Index on Responsible AI",
    category: "Press release",
    publishedAt: "2025-05-06T09:00:00.000Z",
    excerpt:
      "The Global Center on AI Governance announces the second edition of the Index, to be released in 2026 with expanded coverage.",
    image: { url: "/about/girai-led.png", alt: "Second edition announcement" },
    body: [
      "The Global Center on AI Governance is pleased to announce the second edition of the Global Index on Responsible AI, to be released in 2026.",
      "Building on the first edition's global assessment, the second edition expands country coverage, refines the indicator framework, and strengthens the evidence base underpinning every score.",
    ],
  },
  {
    slug: "african-observatory-receives-major-grant",
    title:
      "African Observatory on Responsible AI Receives Major Grant to Advance Inclusive AI Futures",
    category: "Press release",
    publishedAt: "2024-07-15T09:00:00.000Z",
    excerpt:
      "A major new grant will support the African Observatory's work to build inclusive, rights-respecting AI futures across the continent.",
    image: {
      url: "/new-dimensions/diversity-inclusion.png",
      alt: "African Observatory grant",
    },
    body: [
      "The African Observatory on Responsible AI has received a major grant to advance its mission of building inclusive AI futures grounded in African priorities and expertise.",
      "The funding will support research, capacity building, and the continued development of the evidence base that informs the Global Index on Responsible AI.",
    ],
  },
  {
    slug: "ai-governance-fails-to-deliver",
    title:
      "AI Governance Fails to Deliver: Global Index on Responsible AI Reveals Critical Gaps",
    category: "Press release",
    publishedAt: "2024-06-19T09:00:00.000Z",
    excerpt:
      "The first edition of the Index reveals that most governments are far from translating AI principles into meaningful protections.",
    image: {
      url: "/about/what-index-measures.png",
      alt: "AI governance critical gaps",
    },
    body: [
      "The inaugural Global Index on Responsible AI reveals critical gaps between the promises governments make about AI and the protections they deliver in practice.",
      "Across the majority of countries assessed, foundational safeguards — from impact assessments to independent oversight — are absent or inconsistently applied, leaving people exposed to the harms of unaccountable AI.",
    ],
  },
  {
    slug: "inclusive-ai-policies-to-empower-women-in-africa",
    title: "Deliberate, Inclusive AI Policies to Empower Women in Africa",
    category: "Country research",
    publishedAt: "2024-03-08T09:00:00.000Z",
    excerpt:
      "Marking International Women's Day, we examine how intentional AI policy can close — rather than widen — gender gaps.",
    image: {
      url: "/dimensions/inclusion-diversity.png",
      alt: "Inclusive AI policies for women in Africa",
    },
    body: [
      "On International Women's Day, we reflect on how AI policy can be designed to empower women rather than entrench existing inequalities.",
      "Deliberate, inclusive policy measures — from bias assessments across the AI lifecycle to representation in AI research and industry — are essential to ensuring that automation narrows gender gaps instead of widening them.",
    ],
  },
];
