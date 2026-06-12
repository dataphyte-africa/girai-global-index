import Image from "next/image";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const BODY_COLOR = "#6B7280";
const SUBTITLE_COLOR = "#6B7280";
const NUMBER_DECORATOR = "/methodology/number-decorator.svg";
const EVIDENCE_IMAGE = "/methodology/evidence-standard.png";
const IMAGE_BORDER = "rgba(113, 80, 244, 0.22)";

const EVIDENCE_RULES = [
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
] as const;

function EvidenceRuleCard({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <article className="flex gap-4 rounded-2xl bg-white p-5 shadow-[0_2px_24px_rgba(26,26,46,0.06)] md:gap-5 md:p-6">
      <div className="relative mt-0.5 shrink-0">
        <Image
          src={NUMBER_DECORATOR}
          alt=""
          aria-hidden
          width={31}
          height={57}
          className="pointer-events-none absolute -left-1.5 -top-3 select-none"
        />
        <span
          className="relative flex size-9 items-center justify-center rounded-full text-sm font-semibold text-white shadow-[0_4px_14px_rgba(113,80,244,0.32)]"
          style={{ backgroundColor: PURPLE }}
        >
          {index}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3
          className="text-base font-bold leading-snug tracking-tight md:text-[1.0625rem]"
          style={{ color: HEADING_DARK }}
        >
          {title}
        </h3>
        <p
          className="mt-1.5 text-sm leading-[1.6] md:text-[0.9375rem] md:leading-[1.65]"
          style={{ color: BODY_COLOR }}
        >
          {description}
        </p>
      </div>
    </article>
  );
}

/**
 * Evidence Standards of GIRAI — numbered rule cards left, illustration right.
 */
export function MethodologyEvidenceStandardsSection() {
  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto mb-12 max-w-2xl text-center md:mb-14 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            <span style={{ color: PURPLE }}>Evidence Standards </span>
            <span style={{ color: HEADING_DARK }}>of GIRAI</span>
          </h2>

          <p
            className="mt-4 text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            To ensure credibility across more than 140 countries, GIRAI applies
            strict evidence rules:
          </p>
        </header>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="flex flex-col gap-4 md:gap-5">
            {EVIDENCE_RULES.map((rule, index) => (
              <EvidenceRuleCard
                key={rule.title}
                index={index + 1}
                title={rule.title}
                description={rule.description}
              />
            ))}
          </div>

          <div
            className="relative w-full max-w-xl justify-self-center overflow-hidden rounded-2xl border bg-white p-1.5 shadow-[0_2px_24px_rgba(113,80,244,0.08)] lg:max-w-none lg:justify-self-end"
            style={{ borderColor: IMAGE_BORDER }}
          >
            <Image
              src={EVIDENCE_IMAGE}
              alt="Digital evidence verification interface with checklists and security indicators"
              width={640}
              height={640}
              className="h-auto w-full rounded-[14px] object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
