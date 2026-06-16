import { SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

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
        "methodology-refined-card group relative bg-card p-8 transition-[background-color,box-shadow] duration-300 ease-out md:p-10 lg:p-12",
        className
      )}
    >
      <span className="text-sm font-medium tabular-nums text-muted-foreground/70 transition-colors duration-300 group-hover:text-white/55">
        {numberLabel}
      </span>

      <div
        className={cn(
          "mt-5 mb-6 flex size-10 items-center justify-center rounded-[10px] border border-border text-primary transition-colors duration-300",
          "group-hover:border-white/35 group-hover:text-white"
        )}
      >
        <SlidersHorizontal className="size-[18px] stroke-[1.75]" aria-hidden />
      </div>

      <h3 className="text-lg font-medium leading-snug tracking-tight text-foreground transition-colors duration-300 md:text-xl md:leading-[1.3] group-hover:text-white">
        {title}
      </h3>

      <p className="mt-3 max-w-[36ch] text-sm leading-[1.65] text-muted-foreground transition-colors duration-300 md:mt-4 md:text-[0.9375rem] md:leading-[1.68] group-hover:text-white/88">
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
    <section className="w-full bg-muted/50 px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto mb-12 max-w-2xl text-center md:mb-14 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight lg:leading-[1.12]">
            <span className="text-foreground">How the Framework </span>
            <span className="text-primary">Was Refined</span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base md:leading-[1.65]">
            Strengthening Clarity, Comparability, and Implementation Focus
          </p>
        </header>

        <div className="overflow-hidden rounded-sm border border-border bg-card">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {REFINEMENTS.map((item, index) => (
              <RefinedCard
                key={item.title}
                index={index + 1}
                title={item.title}
                description={item.description}
                className={cn(
                  index % 2 === 0 && "md:border-r md:border-border",
                  index < 2 && "border-b border-border"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
