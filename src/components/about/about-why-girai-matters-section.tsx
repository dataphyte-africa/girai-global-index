import { NumberedImpactCard } from "@/components/numbered-impact-card";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";

const CARDS = [
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
] as const;

function SectionAccent({
  className,
  color,
}: {
  className?: string;
  color: "blue" | "pink";
}) {
  const bg = color === "blue" ? "bg-[#3B82F6]" : "bg-[#EC4899]";
  return (
    <span
      aria-hidden
      className={`block h-0.5 w-10 rounded-full ${bg} ${className ?? ""}`}
    />
  );
}

/**
 * Six-card grid explaining why GIRAI matters — numbered badges, ring
 * accents, and centered section header with decorative line markers.
 */
export function AboutWhyGiraiMattersSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#F7F8FA] px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <span
        aria-hidden
        className="pointer-events-none absolute left-3 top-[58%] hidden h-20 w-px -translate-y-1/2 bg-[#3B82F6] md:left-5 lg:block"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-[58%] hidden h-20 w-px -translate-y-1/2 bg-[#3B82F6] md:right-5 lg:block"
      />

      <div className="relative mx-auto max-w-7xl">
        <header className="mx-auto mb-12 flex max-w-2xl flex-col items-center text-center md:mb-14 lg:mb-16">
          <SectionAccent color="blue" className="mb-5" />

          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            <span style={{ color: HEADING_DARK }}>Why </span>
            <span style={{ color: PURPLE }}>GIRAI</span>
            <span style={{ color: HEADING_DARK }}> Matters</span>
          </h2>

          <p
            className="mt-4 max-w-xl text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            Understanding how countries govern AI is essential to ensure
            innovation benefits society while protecting people and institutions.
          </p>

          <SectionAccent color="pink" className="mt-5" />
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {CARDS.map((card, index) => (
            <NumberedImpactCard
              key={card.title}
              index={index + 1}
              title={card.title}
              description={card.description}
            />
          ))}
        </div>

        <div className="mt-14 flex justify-center md:mt-16">
          <SectionAccent color="blue" />
        </div>
      </div>
    </section>
  );
}
