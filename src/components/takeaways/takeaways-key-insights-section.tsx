import { cn } from "@/lib/utils";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";
const BODY_COLOR = "#6B7280";
const BORDER_COLOR = "#ECEEF2";
const LABEL_COLOR = "#B8BDC6";

const INSIGHTS = [
  {
    title: "Policy Adoption Is Increasing, but Implementation Lags",
    description:
      "More countries have adopted national AI strategies, but fewer have established operational oversight or enforcement mechanisms. The gap between commitment and execution remains a central governance challenge.",
  },
  {
    title: "Oversight and Accountability Systems Remain Underdeveloped",
    description:
      "Independent monitoring bodies and structured audits are still limited in many jurisdictions. Transparency requirements vary, and access to redress for individuals affected by AI systems remains inconsistent.",
  },
  {
    title: "Society Engagement Strengthens Governance Outcomes",
    description:
      "Countries with active civil society participation tend to demonstrate stronger transparency and more inclusive processes. Where engagement is institutionalized, governance frameworks are more balanced and accountable.",
  },
] as const;

function InsightCard({
  index,
  title,
  description,
  className,
}: {
  index: number;
  title: string;
  description: string;
  className?: string;
}) {
  const numberLabel = String(index).padStart(2, "0");

  return (
    <article className={cn("bg-white px-8 py-10 md:px-10 md:py-12 lg:px-12 lg:py-14", className)}>
      <div className="flex flex-col">
        <span
          className="text-[2.5rem] font-medium leading-none tabular-nums md:text-[2.75rem]"
          style={{ color: LABEL_COLOR }}
        >
          {numberLabel}
        </span>
        <span
          className="mt-1.5 text-[0.625rem] font-medium uppercase tracking-[0.22em]"
          style={{ color: LABEL_COLOR }}
        >
          Insight
        </span>
      </div>

      <h3
        className="mt-8 text-lg font-bold leading-snug tracking-tight md:mt-9 md:text-xl md:leading-[1.3]"
        style={{ color: HEADING_DARK }}
      >
        {title}
      </h3>

      <p
        className="mt-4 max-w-[38ch] text-sm leading-[1.68] md:mt-5 md:text-[0.9375rem] md:leading-[1.7]"
        style={{ color: BODY_COLOR }}
      >
        {description}
      </p>
    </article>
  );
}

/**
 * Three-column Key Insights grid below the Top Takeaways intro.
 */
export function TakeawaysKeyInsightsSection() {
  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <header className="mx-auto mb-12 max-w-2xl text-center md:mb-14 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            <span style={{ color: PURPLE }}>Key Insights</span>
            <span style={{ color: HEADING_DARK }}> from the Global Index</span>
          </h2>

          <p
            className="mt-4 text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            What the evidence reveals about global AI governance
          </p>
        </header>

        <div
          className="overflow-hidden border bg-white"
          style={{ borderColor: BORDER_COLOR }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3">
            {INSIGHTS.map((item, index) => (
              <InsightCard
                key={item.title}
                index={index + 1}
                title={item.title}
                description={item.description}
                className={cn(
                  index < INSIGHTS.length - 1 && "border-b md:border-b-0",
                  index % 3 !== 2 && "md:border-r",
                  "border-[#ECEEF2]"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
