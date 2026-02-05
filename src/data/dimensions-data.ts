export interface Dimension {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  indicators: string[];
  image?: string;
}

export const DIMENSIONS: Dimension[] = [
  {
    id: "inclusion-diversity",
    name: "Inclusion and Diversity",
    image: "/dimensions/dimension-inclusion-diversity.jpg",
    subtitle: "Representation and Protection in AI Systems",
    description:
      "Evaluates whether AI systems are designed and governed to be inclusive and equitable. This dimension examines the extent to which artificial intelligence systems are designed, governed, and deployed in ways that are inclusive, equitable, and protective of diverse populations. It assesses how countries address issues such as bias and discrimination, gender equality, children's rights, cultural and linguistic diversity, and public participation in AI-related decision-making.\n\nStrong performance in this dimension reflects national efforts to ensure that AI systems do not reinforce existing inequalities, exclude marginalized groups, or undermine fundamental rights. By focusing on who is represented, protected, and heard in AI ecosystems, the Inclusion and Diversity dimension highlights whether technological progress benefits society as a whole.",
    indicators: [
      "Gender Equality",
      "Children's Rights",
      "Rights of Persons with Disabilities",
      "Cultural and Linguistic Diversity",
    ],
  },
  {
    id: "ethics-sustainability",
    name: "Ethics and Sustainability",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&q=80",
    subtitle: "Principles and Long-term Impact",
    description:
      "Evaluates whether AI systems are developed and used in alignment with ethical principles and environmental sustainability. This dimension examines how countries address fairness and non-discrimination in AI outcomes, transparency and explainability of algorithmic decisions, human oversight and determination in automated systems, and the environmental impact of AI infrastructure and deployment.\n\nStrong performance in this dimension reflects national commitment to embedding ethical considerations throughout the AI lifecycle and ensuring that technological advancement does not come at the expense of environmental or social well-being.",
    indicators: [
      "Fairness and Non-Discrimination",
      "Transparency and Explainability",
      "Human Oversight and Determination",
      "Environmental Impact",
    ],
  },
  {
    id: "labour-skills",
    name: "Labour and Skills",
    image: "/dimensions/dimension-labour-skills.jpg",
    subtitle: "Workforce Readiness and Adaptation",
    description:
      "Evaluates how countries prepare workers for an AI-driven economy and protect labour rights in the age of automation. This dimension examines labour protections for workers affected by AI adoption, reskilling and upskilling initiatives to support workforce transition, and AI literacy programs to ensure citizens can participate meaningfully in an AI-enabled society.\n\nStrong performance in this dimension reflects national efforts to ensure that the benefits of AI are shared broadly and that workers are supported through technological disruption.",
    indicators: [
      "Labour Protections",
      "Reskilling/Upskilling Initiatives",
      "AI Literacy",
    ],
  },
  {
    id: "trust-safety",
    name: "Trust and Safety",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80",
    subtitle: "Security, Accountability, and Redress",
    description:
      "Evaluates the safeguards in place to protect individuals and society from AI-related harms. This dimension examines data protection and privacy frameworks, data sharing and access arrangements, safety and security measures, consumer protection, access to redress and remedy, impact assessments, and measures to address AI-facilitated misinformation and violence.\n\nStrong performance in this dimension reflects national commitment to building trust in AI systems through robust governance, accountability mechanisms, and pathways for those affected by AI to seek remedy.",
    indicators: [
      "Data Protection and Privacy",
      "Data Sharing and Access",
      "Safety and Security",
      "Consumer Protection",
      "Access to Redress and Remedy",
      "Impact Assessments",
      "AI-Facilitated Misinformation and Violence",
    ],
  },
  {
    id: "public-sector",
    name: "Use of AI in Public Sector Delivery",
    image: "/dimensions/dimension-public-sector.jpg",
    subtitle: "Government AI Governance and Transparency",
    description:
      "Evaluates how governments deploy AI in public services and the transparency and oversight mechanisms in place. This dimension examines public sector skills development for AI adoption, public disclosure of government algorithmic systems, ethical public procurement practices, model audits, and the handling of AI systems with unacceptable risks.\n\nStrong performance in this dimension reflects national efforts to ensure that government use of AI serves the public interest and is subject to appropriate scrutiny and accountability.",
    indicators: [
      "Public Sector Skills Development",
      "Public Disclosure of Government Algorithmic Systems",
      "Public Procurement",
      "Model Audits",
      "Deployment of AI Systems with Unacceptable Risks",
    ],
  },
];
