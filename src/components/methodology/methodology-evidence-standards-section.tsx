import Image from "next/image";
import { methodologyDefaults, type MethodologyContent } from "@/content/methodology.defaults";

const NUMBER_DECORATOR = "/methodology/number-decorator.svg";

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
    <article className="flex gap-4 rounded-2xl bg-card p-5 shadow-[0_2px_24px_rgba(26,26,46,0.06)] dark:shadow-[0_2px_24px_rgba(0,0,0,0.25)] md:gap-5 md:p-6">
      <div className="relative mt-0.5 shrink-0">
        <Image
          src={NUMBER_DECORATOR}
          alt=""
          aria-hidden
          width={31}
          height={57}
          className="pointer-events-none absolute -left-1.5 -top-3 select-none"
        />
        <span className="relative flex size-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_4px_14px_color-mix(in_oklab,var(--primary)_32%,transparent)]">
          {index}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="text-base font-medium leading-snug tracking-tight text-foreground md:text-[1.0625rem]">
          {title}
        </h3>
        <p className="mt-1.5 text-sm leading-[1.6] text-muted-foreground md:text-[0.9375rem] md:leading-[1.65]">
          {description}
        </p>
      </div>
    </article>
  );
}

/**
 * Evidence Standards of GIRAI — numbered rule cards left, illustration right.
 */
export function MethodologyEvidenceStandardsSection({
  content = methodologyDefaults,
}: {
  content?: MethodologyContent;
}) {
  const evidenceImage = content.evidenceImage.url ?? methodologyDefaults.evidenceImage.url!;
  return (
    <section className="w-full bg-card px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto mb-12 max-w-2xl text-center md:mb-14 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight lg:leading-[1.12]">
            <span className="text-primary">{content.evidenceHeadingAccent}</span>
            <span className="text-foreground">{content.evidenceHeadingTail}</span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base md:leading-[1.65]">
            {content.evidenceSubtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="flex flex-col gap-4 md:gap-5">
            {content.evidenceRules.map((rule, index) => (
              <EvidenceRuleCard
                key={rule.title}
                index={index + 1}
                title={rule.title}
                description={rule.description}
              />
            ))}
          </div>

          <div className="relative w-full max-w-xl justify-self-center overflow-hidden rounded-2xl border border-primary/20 bg-card p-1.5 shadow-[0_2px_24px_color-mix(in_oklab,var(--primary)_8%,transparent)] lg:max-w-none lg:justify-self-end">
            <Image
              src={evidenceImage}
              alt={
                content.evidenceImage.alt ??
                "Digital evidence verification interface with checklists and security indicators"
              }
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
