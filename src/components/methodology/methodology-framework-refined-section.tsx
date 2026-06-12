import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";
const BORDER_COLOR = "#ECEEF2";

const REFINEMENTS = [
  {
    title: "Clearer Dimension Structure",
    description:
      "Dimensions were refined to better distinguish between governance commitments, implementation activity, and enabling conditions — improving conceptual clarity and analytical balance.",
  },
  {
    title: "Stronger Indicator Definitions",
    description:
      "Indicator wording and evidence requirements were tightened to reduce ambiguity and improve consistency across countries, enhancing cross-country comparability.",
  },
  {
    title: "Greater Emphasis on Implementation",
    description:
      "The updated framework places stronger focus on operational oversight, enforcement, and real-world action — not just the existence of policies on paper.",
  },
  {
    title: "Enhanced Review and Validation",
    description:
      "Quality assurance processes were strengthened, including clearer coding guidance and more structured cross-country validation procedures.",
  },
] as const;

function RefinedCard({
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
    <article
      className={cn(
        "group relative bg-white p-8 transition-[background-color,box-shadow] duration-300 ease-out md:p-10 lg:p-12",
        "hover:bg-gradient-to-br hover:from-[#4F3AAF] hover:via-[#35267A] hover:to-[#1A1038]",
        className
      )}
    >
      <span className="text-sm font-medium tabular-nums text-[#B8BDC6] transition-colors duration-300 group-hover:text-white/55">
        {numberLabel}
      </span>

      <div
        className={cn(
          "mt-5 mb-6 flex size-10 items-center justify-center rounded-[10px] border transition-colors duration-300",
          "border-[#E5E7EB] text-[#7150F4]",
          "group-hover:border-white/35 group-hover:text-white"
        )}
      >
        <SlidersHorizontal className="size-[18px] stroke-[1.75]" aria-hidden />
      </div>

      <h3 className="text-lg font-bold leading-snug tracking-tight text-[#1A1A2E] transition-colors duration-300 md:text-xl md:leading-[1.3] group-hover:text-white">
        {title}
      </h3>

      <p className="mt-3 max-w-[36ch] text-sm leading-[1.65] text-[#6B7280] transition-colors duration-300 md:mt-4 md:text-[0.9375rem] md:leading-[1.68] group-hover:text-white/88">
        {description}
      </p>
    </article>
  );
}

/**
 * How the Framework Was Refined — 2×2 bordered grid with purple hover cards.
 */
export function MethodologyFrameworkRefinedSection() {
  return (
    <section className="w-full bg-[#F7F8FA] px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto mb-12 max-w-2xl text-center md:mb-14 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            <span style={{ color: HEADING_DARK }}>How the Framework </span>
            <span style={{ color: PURPLE }}>Was Refined</span>
          </h2>

          <p
            className="mt-4 text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            Strengthening Clarity, Comparability, and Implementation Focus
          </p>
        </header>

        <div
          className="overflow-hidden rounded-sm border bg-white"
          style={{ borderColor: BORDER_COLOR }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            {REFINEMENTS.map((item, index) => (
              <RefinedCard
                key={item.title}
                index={index + 1}
                title={item.title}
                description={item.description}
                className={cn(
                  index % 2 === 0 && "md:border-r",
                  index < 2 && "border-b",
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
