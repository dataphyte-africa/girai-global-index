/**
 * Editorial copy for the per-indicator "Key Indicators" cards on the
 * dimension detail pages.
 *
 * Keyed by the canonical indicator slug (src/data/2026/taxonomy.ts). Each
 * entry adds a short plain-language `description` and a `whyItMatters`
 * rationale on top of the taxonomy `name`. `icon` is a lucide-react icon
 * name resolved by the consuming component, so this module stays a plain
 * data file that is safe to import on the server.
 *
 * Like `narratives.ts`, this is the hard-coded fallback tier (ADR 0004) —
 * swap to CMS-authored copy without touching consumers once Sanity lands.
 */

import type { PillarSlug } from "@/data/2026/taxonomy";

/** Inline segment — plain text or an underlined external link. */
export type IndicatorTextSegment = { text: string; href?: string };

/** One paragraph composed of inline segments. */
export type IndicatorParagraph = IndicatorTextSegment[];

export interface IndicatorCopy {
  /** Plain-language summary of what the indicator measures. */
  description: string;
  /** One-line "why this matters" rationale. */
  whyItMatters: string;
  /** lucide-react icon name, resolved by the component. */
  icon: string;
  /** Hero paragraph on the indicator detail page. Falls back to `description`. */
  heroLead?: string;
  /** Split-tone intro — primary (dark) clause. Falls back to `description`. */
  introPrimary?: string;
  /** Split-tone intro — secondary (muted) clause. Falls back to `whyItMatters`. */
  introSecondary?: string;
  /** Background column on the indicator detail page. */
  background?: IndicatorParagraph[];
  /** Relevance column on the indicator detail page. */
  relevance?: IndicatorParagraph[];
}

/** Short, human-friendly pillar labels used on the cards. */
export const PILLAR_LABELS: Record<PillarSlug, string> = {
  "ai-policy": "AI Policy",
  "cso-engagement": "CSO Engagement",
  "enabling-conditions": "Country Context",
};

export const INDICATOR_COPY: Record<string, IndicatorCopy> = {
  // ===== Inclusion and Diversity =====
  "gender-equality": {
    description:
      "Policies ensuring gender-responsive AI development, deployment and governance.",
    whyItMatters:
      "Addresses gender gaps in AI teams and data, and helps prevent gender-based discrimination in AI systems.",
    icon: "Users",
    heroLead:
      "Gender equality in AI governance assesses whether countries adopt policies that prevent gender-based bias, close participation gaps, and ensure AI systems serve women and girls equitably.",
    introPrimary:
      "Gender equality requires that AI policies, datasets, and deployment practices do not perpetuate discrimination or widen existing gender gaps.",
    introSecondary:
      "GIRAI evaluates whether governments address gender representation in AI teams, gender-responsive design, and safeguards against gender-based harm in automated systems.",
    background: [
      [
        {
          text: "Gender equality in AI governance draws on international standards that require states to eliminate discrimination and ensure women participate fully in economic, social, and political life.",
        },
      ],
      [
        {
          text: "The ",
        },
        {
          text: "Convention on the Elimination of All Forms of Discrimination against Women (CEDAW)",
          href: "https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-elimination-all-forms-discrimination-against-women",
        },
        {
          text: " establishes binding obligations to address structural gender inequality — principles increasingly applied to automated decision-making and data-driven systems.",
        },
      ],
      [
        {
          text: "GIRAI assesses whether national AI frameworks explicitly address gender bias, representation in AI development, and equitable access to AI-enabled services.",
        },
      ],
    ],
    relevance: [
      [
        {
          text: "AI systems trained on biased data or deployed without gender-responsive safeguards can reinforce discrimination in hiring, credit, healthcare, and public services.",
        },
      ],
      [
        {
          text: "Measuring gender equality in AI policy helps identify whether countries are closing participation gaps and preventing harm to women and girls as AI scales across society.",
        },
      ],
    ],
  },
  "childrens-rights": {
    description:
      "Safeguards specifically designed to protect minors in the design and use of AI systems.",
    whyItMatters:
      "Essential for protecting children's privacy, safety and developmental needs online and offline.",
    icon: "Baby",
    heroLead:
      "Children's rights safeguards assess whether countries protect minors from harm in the design, deployment, and governance of AI systems.",
    introPrimary:
      "Children's rights are the human rights protections that recognize children's need for special care and protection due to their dependence and vulnerability.",
    introSecondary:
      "A child is defined as anyone under 18, unless legal majority is attained earlier under applicable law.",
    background: [
      [
        {
          text: "Children's rights are the human rights protections that recognize children's need for special care and protection due to their dependence and vulnerability.",
        },
      ],
      [
        {
          text: "The ",
        },
        {
          text: "United Nations Convention on the Rights of the Child (UNCRC)",
          href: "https://www.unicef.org/child-rights-convention",
        },
        {
          text: " is the most widely ratified human rights treaty in history. It defines four categories of rights: survival, development, protection, and participation.",
        },
      ],
      [
        {
          text: "The ",
        },
        {
          text: "UNCRC",
          href: "https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-rights-child",
        },
        {
          text: " requires states to act in the best interests of the child and to ensure their rights are respected in all policy domains — including emerging technologies.",
        },
      ],
    ],
    relevance: [
      [
        {
          text: "AI is increasingly shaping children's lives through education platforms, social media, surveillance in public spaces, and automated welfare decisions.",
        },
      ],
      [
        {
          text: "Without explicit safeguards, AI systems can expose children to profiling, inappropriate ",
        },
        { text: "content", href: "https://www.unicef.org/innocenti/reports/ai-children" },
        {
          text: ", and decisions that fail to account for their developmental needs — making children's rights a critical lens for responsible AI governance.",
        },
      ],
    ],
  },
  "cultural-linguistic-diversity": {
    description:
      "Recognition and support for diverse cultural contexts and languages in AI.",
    whyItMatters:
      "Ensures AI systems work across different languages and respect local cultural values rather than flattening them.",
    icon: "Languages",
  },
  "civil-society-engagement-inclusion-diversity": {
    description:
      "Civil-society initiatives advancing inclusion and diversity in national AI debates.",
    whyItMatters:
      "Independent voices keep inclusion on the agenda and hold governments and developers accountable.",
    icon: "HeartHandshake",
  },
  "egalitarian-democracy": {
    description:
      "Country-context measure of how equally political power and rights are distributed.",
    whyItMatters:
      "Egalitarian institutions make it more likely that AI governance serves everyone, not just the powerful.",
    icon: "Scale",
  },
  "socioeconomic-inclusion-connectivity": {
    description:
      "How affordable and accessible connectivity is across income groups.",
    whyItMatters:
      "Without affordable access, the benefits of AI bypass lower-income communities and widen divides.",
    icon: "Wifi",
  },
  "gender-inclusion-connectivity": {
    description:
      "The gender gap in mobile internet and digital access.",
    whyItMatters:
      "If women are offline, AI built on digital data and services excludes them by default.",
    icon: "Smartphone",
  },

  // ===== Ethics and Sustainability =====
  "fairness-non-discrimination": {
    description:
      "Legal and technical measures to prevent algorithmic bias and discriminatory outcomes.",
    whyItMatters:
      "Critical for ensuring AI systems don't perpetuate or amplify existing societal biases.",
    icon: "Scale",
  },
  "transparency-explainability": {
    description:
      "Requirements for AI systems to be understandable and their decisions explainable.",
    whyItMatters:
      "People can only trust, challenge or oversee AI decisions they are able to understand.",
    icon: "Eye",
  },
  "human-oversight-determination": {
    description:
      "Guarantees that humans remain meaningfully in control of consequential AI decisions.",
    whyItMatters:
      "Keeps accountability with people and prevents fully automated decisions on high-stakes matters.",
    icon: "UserCheck",
  },
  "environmental-impact": {
    description:
      "Policies addressing the energy, water and carbon footprint of AI infrastructure.",
    whyItMatters:
      "AI's compute demand has real environmental costs that governance needs to measure and limit.",
    icon: "Leaf",
  },
  "civil-society-engagement-ethics-sustainability": {
    description:
      "Civil-society initiatives advancing ethical and sustainable AI.",
    whyItMatters:
      "External scrutiny pushes ethical principles from paper into observable practice.",
    icon: "HeartHandshake",
  },
  "environmental-performance": {
    description:
      "Country-context measure of low-carbon energy share and environmental performance.",
    whyItMatters:
      "A cleaner energy mix limits the climate cost of the data centres that power AI.",
    icon: "Wind",
  },

  // ===== Labour and Skills =====
  "labour-protections": {
    description:
      "Policy measures protecting workers from AI-driven automation and surveillance.",
    whyItMatters:
      "Protects livelihoods and worker rights as AI reshapes how and where work happens.",
    icon: "ShieldCheck",
  },
  "reskilling-upskilling-initiatives": {
    description:
      "Government and partner programmes that retrain workers for an AI-driven economy.",
    whyItMatters:
      "Ensures the workforce can adapt and that the gains from AI are shared, not concentrated.",
    icon: "GraduationCap",
  },
  "ai-literacy": {
    description:
      "Efforts to build public understanding of AI and its risks and benefits.",
    whyItMatters:
      "An AI-literate population can use AI wisely and demand accountability from those who deploy it.",
    icon: "BookOpen",
  },
  "civil-society-engagement-labour-skills": {
    description:
      "Civil-society initiatives on the future of work and AI's labour impact.",
    whyItMatters:
      "Worker and community voices keep labour impacts central to AI policy decisions.",
    icon: "HeartHandshake",
  },
  "labour-rights": {
    description:
      "Country-context measure of labour-rights protection and compliance.",
    whyItMatters:
      "Strong baseline labour rights determine how well workers are shielded from AI-driven harm.",
    icon: "Handshake",
  },
  "population-digital-readiness": {
    description:
      "Country-context measure of digital skills and literacy across the population.",
    whyItMatters:
      "A digitally ready population is better placed to benefit from, and adapt to, AI.",
    icon: "MonitorSmartphone",
  },

  // ===== Trust and Safety =====
  "safety-security": {
    description:
      "Policies ensuring AI systems are safe, secure and robust before and after deployment.",
    whyItMatters:
      "Reduces the risk of harmful failures and malicious misuse of AI systems.",
    icon: "ShieldCheck",
  },
  "access-redress-remedy": {
    description:
      "Mechanisms for people to contest and seek remedy for harmful AI decisions.",
    whyItMatters:
      "Rights mean little without an accessible route to challenge and correct AI harms.",
    icon: "Gavel",
  },
  "impact-assessments": {
    description:
      "Requirements to assess AI risks and impacts before systems are deployed.",
    whyItMatters:
      "Surfacing harms early is far cheaper and safer than fixing them after deployment.",
    icon: "ClipboardCheck",
  },
  "ai-facilitated-misinformation-violence": {
    description:
      "Measures addressing AI-generated misinformation, deepfakes and incitement to violence.",
    whyItMatters:
      "Protects democratic discourse and public safety from synthetic, AI-amplified content.",
    icon: "AlertTriangle",
  },
  "civil-society-engagement-trust-safety": {
    description:
      "Civil-society initiatives advancing AI trust, safety and accountability.",
    whyItMatters:
      "Independent watchdogs surface safety failures that official channels can miss.",
    icon: "HeartHandshake",
  },
  "data-protection-privacy": {
    description:
      "Country-context measure of data-protection and privacy frameworks.",
    whyItMatters:
      "Privacy law sets the guardrails for how AI systems may collect and use personal data.",
    icon: "Lock",
  },
  "data-sharing-access": {
    description:
      "Country-context measure of responsible data sharing and access regimes.",
    whyItMatters:
      "Balanced data access fuels useful AI while preventing exploitation and lock-in.",
    icon: "Share2",
  },
  "consumer-protection": {
    description:
      "Country-context measure of consumer-protection frameworks.",
    whyItMatters:
      "Consumer law is a frontline defence against unfair or unsafe AI products and services.",
    icon: "ShoppingBag",
  },
  cybersecurity: {
    description:
      "Country-context measure of national cybersecurity capacity.",
    whyItMatters:
      "Secure digital infrastructure is a prerequisite for trustworthy AI deployment.",
    icon: "ShieldAlert",
  },
  "rule-of-law": {
    description:
      "Country-context measure of the strength and independence of the rule of law.",
    whyItMatters:
      "Strong legal institutions are what make AI rules enforceable in practice.",
    icon: "Landmark",
  },
  "global-peace": {
    description:
      "Country-context measure of peacefulness and societal stability.",
    whyItMatters:
      "Stable societies are better able to govern AI responsibly and resist its weaponisation.",
    icon: "Bird",
  },

  // ===== AI Use in Public Service =====
  "public-sector-skills-development": {
    description:
      "Programmes building AI skills and capacity inside government.",
    whyItMatters:
      "Governments need internal expertise to procure, deploy and oversee AI responsibly.",
    icon: "GraduationCap",
  },
  "public-disclosure-government-algorithmic-systems": {
    description:
      "Requirements for governments to disclose the algorithmic systems they use.",
    whyItMatters:
      "Transparency about public-sector AI is the basis for democratic oversight and trust.",
    icon: "FileSearch",
  },
  "public-procurement": {
    description:
      "Rules ensuring AI is procured by government ethically and transparently.",
    whyItMatters:
      "Procurement is where public values are either built into, or left out of, government AI.",
    icon: "FileCheck",
  },
  "government-mechanisms-cso-inclusion": {
    description:
      "Formal mechanisms for including civil society in AI policy and governance.",
    whyItMatters:
      "Democratic participation ensures AI policies reflect diverse societal needs.",
    icon: "Users",
  },
  "civil-society-oversight": {
    description:
      "Country-context measure of civil-society oversight and accountability capacity.",
    whyItMatters:
      "Active oversight keeps government use of AI honest and answerable to the public.",
    icon: "Eye",
  },
  "public-service-delivery": {
    description:
      "Country-context measure of the quality and reach of public-service delivery.",
    whyItMatters:
      "Capable public services are better positioned to deploy AI for genuine public benefit.",
    icon: "Building2",
  },
  "right-to-information": {
    description:
      "Country-context measure of access to public information and FOI rights.",
    whyItMatters:
      "The right to information lets citizens see, and question, how the state uses AI.",
    icon: "Info",
  },
  "unacceptable-risks-ai-systems": {
    description:
      "Documented government deployment of AI systems posing unacceptable risks (URAI).",
    whyItMatters:
      "Tracks state misuse of AI — surveillance and rights violations — that penalises overall scores.",
    icon: "OctagonAlert",
  },
};

/** Lookup with a safe fallback so unknown slugs never crash the UI. */
export function getIndicatorCopy(slug: string): IndicatorCopy {
  return (
    INDICATOR_COPY[slug] ?? {
      description: "An indicator tracked within this dimension of the 2026 GIRAI Index.",
      whyItMatters:
        "Contributes to the dimension score and the overall picture of responsible AI.",
      icon: "CircleDot",
    }
  );
}

/** Resolved hero and intro copy for the indicator detail page. */
export function getIndicatorPageCopy(slug: string) {
  const copy = getIndicatorCopy(slug);
  return {
    heroLead: copy.heroLead ?? copy.description,
    introPrimary: copy.introPrimary ?? copy.description,
    introSecondary: copy.introSecondary ?? copy.whyItMatters,
  };
}

function defaultBackground(copy: IndicatorCopy): IndicatorParagraph[] {
  return [
    [{ text: copy.description }],
    [
      {
        text: "GIRAI evaluates this indicator using public evidence and, where applicable, verified data from external indices aligned with the 2026 methodology.",
      },
    ],
  ];
}

function defaultRelevance(copy: IndicatorCopy, name: string): IndicatorParagraph[] {
  return [
    [{ text: copy.whyItMatters }],
    [
      {
        text: `Tracking ${name} helps compare how countries translate responsible AI principles into measurable governance outcomes within the GIRAI framework.`,
      },
    ],
  ];
}

/** Background and relevance columns for the indicator detail page. */
export function getIndicatorBackgroundRelevance(slug: string, name: string) {
  const copy = getIndicatorCopy(slug);
  return {
    background: copy.background ?? defaultBackground(copy),
    relevance: copy.relevance ?? defaultRelevance(copy, name),
  };
}
