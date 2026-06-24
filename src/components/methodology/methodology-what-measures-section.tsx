import { NumberedImpactCard } from "@/components/numbered-impact-card";
import { cn } from "@/lib/utils";
import { methodologyDefaults, type MethodologyContent } from "@/content/methodology.defaults";

/**
 * Five-dimension overview — 3+2 centered card grid reusing NumberedImpactCard.
 */
export function MethodologyWhatMeasuresSection({
  content = methodologyDefaults,
}: {
  content?: MethodologyContent;
}) {
  return (
    <section className="w-full bg-muted/50 px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto mb-12 max-w-2xl text-center md:mb-14 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight lg:leading-[1.12]">
            <span className="text-foreground">{content.measuresHeadingLead}</span>
            <span className="text-primary">{content.measuresHeadingAccent}</span>
            <span className="text-foreground">{content.measuresHeadingTail}</span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base md:leading-[1.65]">
            {content.measuresSubtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-6 lg:gap-6">
          {content.dimensions.map((card, index) => (
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
