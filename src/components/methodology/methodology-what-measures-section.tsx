import { NumberedImpactCard } from "@/components/numbered-impact-card";
import { cn } from "@/lib/utils";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";

const DIMENSION_CARDS = [
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
] as const;

/**
 * Five-dimension overview — 3+2 centered card grid reusing NumberedImpactCard.
 */
export function MethodologyWhatMeasuresSection() {
  return (
    <section className="w-full bg-[#F7F8FA] px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto mb-12 max-w-2xl text-center md:mb-14 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            <span style={{ color: HEADING_DARK }}>What </span>
            <span style={{ color: PURPLE }}>GIRAI</span>
            <span style={{ color: HEADING_DARK }}> Measures</span>
          </h2>

          <p
            className="mt-4 text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            GIRAI evaluates national AI ecosystems across five interconnected
            dimensions
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {DIMENSION_CARDS.map((card, index) => (
            <div
              key={card.title}
              className={cn(
                "lg:col-span-2",
                index === 3 && "lg:col-start-2",
                index === 4 && "lg:col-start-4"
              )}
            >
              <NumberedImpactCard
                index={index + 1}
                title={card.title}
                description={card.description}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
