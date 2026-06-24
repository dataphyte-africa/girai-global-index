/**
 * Hardcoded fallback copy for the About page.
 *
 * This is the single source of truth for the page's default copy: it renders
 * when Sanity has no value for a field (or Sanity is unreachable), AND it is
 * used by `scripts/seed-sanity.ts` to populate the initial Sanity document.
 */

export type SanityImage = { url: string | null; alt: string | null };
export type Card = { title: string; description: string };
export type Cta = { label: string; href: string };
export type Partner = { name: string; logo: SanityImage | null };

export type AboutContent = {
  heroTitleLead: string;
  heroTitleAccent: string;
  heroLead: string;
  heroImage: SanityImage;

  introHeadingLead: string;
  introHeadingMuted: string;
  introBody: string;

  whyHeadingLead: string;
  whyHeadingAccent: string;
  whyHeadingTail: string;
  whySubtitle: string;
  whyCards: Card[];

  gcgBadge: string;
  gcgHeading: string;
  gcgBody: string;
  gcgCta: Cta;
  gcgImage: SanityImage;

  measuresBadge: string;
  measuresHeadingLead: string;
  measuresHeadingAccent: string;
  measuresBody: string;
  measuresImage: SanityImage;

  contributorsHeading: string;
  contributorsSubtitle: string;
  partners: Partner[];

  whoForHeadingLead: string;
  whoForHeadingAccent: string;
  whoForSubtitle: string;
  audiences: Card[];
  whoForImage: SanityImage;
  whoForSummary: string;

  peopleHeadingLead: string;
  peopleHeadingAccent: string;
  peopleHeadingTail: string;
  peopleSubtitle: string;
  people: string[];

  footerHeading: string;
  footerBody: string;
  footerCta: Cta;
  footerImage: SanityImage;
};

export const aboutDefaults: AboutContent = {
  heroTitleLead: "About the Global Index on ",
  heroTitleAccent: "Responsible AI",
  heroLead:
    "A global framework for assessing how countries govern, deploy, and safeguard artificial intelligence in line with human rights, ethics, and democratic values.",
  heroImage: { url: "/about/about-hero.png", alt: null },

  introHeadingLead: "The GIRAI provides an evidence-based assessment ",
  introHeadingMuted: "of national approaches to responsible AI.",
  introBody:
    "By examining policy frameworks, institutional practices, and enabling conditions, GIRAI offers a comparative view of how countries are ensuring AI systems serve society equitably, safely, and transparently.",

  whyHeadingLead: "Why ",
  whyHeadingAccent: "GIRAI",
  whyHeadingTail: " Matters",
  whySubtitle:
    "Understanding how countries govern AI is essential to ensure innovation benefits society while protecting people and institutions.",
  whyCards: [
    {
      title: "AI is shaping real-world decisions",
      description:
        "AI systems increasingly influence public services and access to rights. Measuring governance helps ensure they serve people fairly.",
    },
    {
      title: "Governance gaps create risk and inequity",
      description:
        "Without safeguards, AI can amplify bias, inequality, and misuse of power. GIRAI highlights where protections exist — and where they are missing.",
    },
    {
      title: "Policymakers need evidence, not assumptions",
      description:
        "Responsible AI requires more than good intentions. GIRAI provides structured, comparable evidence to guide better laws and public investment.",
    },
    {
      title: "Accountability builds public trust",
      description:
        "Transparent measurement strengthens oversight and responsible innovation. Accountability supports confidence in AI governance.",
    },
    {
      title: "Global comparison drives better governance",
      description:
        "Countries face similar AI risks but respond in different ways. Comparable measurement helps identify good practices and shared challenges.",
    },
    {
      title: "Civil society needs visibility and leverage",
      description:
        "Effective AI governance depends on public oversight. GIRAI makes government action visible, enabling civil society to engage and influence policy.",
    },
  ],

  gcgBadge: "The Group",
  gcgHeading: "GIRAI is led by the Global Center on AI Governance (GCG)",
  gcgBody:
    "The Global Index on Responsible AI is a flagship initiative of the Global Center on AI Governance (GCG), advancing equitable AI governance through research, evidence, and global knowledge exchange.",
  gcgCta: { label: "Visit GCG", href: "https://globalcenter.ai" },
  gcgImage: { url: "/about/girai-led.png", alt: "Global Center on AI Governance" },

  measuresBadge: "What it measures",
  measuresHeadingLead: "What the Index Measures ",
  measuresHeadingAccent: "Across AI Governance",
  measuresBody:
    "GIRAI evaluates countries across core dimensions of responsible AI, capturing how governments, institutions, and societies address the risks and opportunities of AI. The index goes beyond policy intent to assess implementation, participation, and broader national context.",
  measuresImage: {
    url: "/about/what-index-measures.png",
    alt: "Professionals discussing AI governance against a connected city skyline",
  },

  contributorsHeading: "Contributors and Partners",
  contributorsSubtitle:
    "Recognising the researchers, authors, and organisations whose expertise and support make GIRAI possible.",
  partners: [
    { name: "Google", logo: null },
    { name: "Microsoft", logo: null },
    { name: "Facebook", logo: null },
    { name: "IBM", logo: null },
    { name: "Andela", logo: null },
    { name: "Internet Society Foundation", logo: null },
  ],

  whoForHeadingLead: "Who GIRAI Is For in a ",
  whoForHeadingAccent: "World Shaped by AI",
  whoForSubtitle:
    "Designed for those shaping, studying, and holding power accountable in the age of AI.",
  audiences: [
    {
      title: "Policymakers and public institutions",
      description:
        "Use evidence to design, evaluate, and strengthen AI laws, strategies, and public-sector practice.",
    },
    {
      title: "Researchers and academics",
      description:
        "Access comparable data to support analysis, benchmarking, and cross-country research.",
    },
    {
      title: "Civil society organisations",
      description:
        "Monitor government action, advocate for rights, and strengthen public oversight of AI governance.",
    },
    {
      title: "Journalists and analysts",
      description:
        "Ground reporting and analysis in verified data and documented government practice.",
    },
    {
      title: "International and regional bodies",
      description:
        "Compare progress, identify gaps, and support policy coordination across jurisdictions.",
    },
  ],
  whoForImage: {
    url: "/about/who-girai-is-for.png",
    alt: "Professional reviewing AI governance insights",
  },
  whoForSummary:
    "GIRAI serves a diverse set of actors who rely on credible evidence to understand, compare, and improve how artificial intelligence is governed across countries.",

  peopleHeadingLead: "The ",
  peopleHeadingAccent: "People",
  peopleHeadingTail: " Behind the Research",
  peopleSubtitle:
    "Recognising the researchers, experts, and contributors who supported the development and validation of GIRAI.",
  people: [
    "Amara Okafor",
    "Luca Tiziana",
    "Zacharie Auguste",
    "Ulrike Dora",
    "James Whitmore",
    "Priya Sharma",
    "Henrik Lindqvist",
    "Fatima Al-Hassan",
    "Marco Benedetti",
    "Yuki Tanaka",
    "Elena Vasquez",
    "Samuel Okonkwo",
    "Ingrid Bergstrom",
    "Raj Patel",
    "Chioma Eze",
    "Thomas Müller",
    "Aisha Rahman",
    "Diego Fernández",
    "Nadia Petrov",
    "Kwame Asante",
    "Sofia Andersson",
    "Oliver Chen",
    "Leila Mansouri",
    "Benjamin Clarke",
    "Mei Lin",
    "André Dubois",
    "Hannah O'Brien",
    "Ibrahim Saleh",
    "Clara Novak",
    "Daniel Kim",
    "Rosa Martinez",
    "Emmanuel Ndiaye",
    "Freya Johansson",
    "Michael Torres",
    "Anika Desai",
    "Pierre Laurent",
    "Grace Mbeki",
    "Jonas Eriksson",
    "Zara Haddad",
    "William Fraser",
    "Nkechi Adewale",
    "Mateo Silva",
    "Helena Kowalski",
    "David Osei",
    "Yasmin Farouk",
    "Robert Hughes",
    "Camille Rousseau",
    "Isaac Mensah",
    "Anna Kowalczyk",
    "Omar Hassan",
  ],

  footerHeading: "Discover How AI Is Governed",
  footerBody:
    "Explore country scores, regional insights, and the evidence behind responsible AI governance.",
  footerCta: { label: "Explore Index", href: "/" },
  footerImage: { url: "/about/footer-hero.png", alt: null },
};
