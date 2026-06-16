import { cn } from "@/lib/utils";

const CHANGES = [
  {
    dimension: "Governance Emphasis",
    before:
      "Greater emphasis on the existence of frameworks",
    now: "Clear separation between government frameworks, implementation actions, and contextual indicators",
  },
  {
    dimension: "Policy vs. Implementation",
    before: "Less distinction between policy intent and implementation",
    now: "Stronger focus on operational oversight and enforcement mechanisms",
  },
  {
    dimension: "Indicator Structure",
    before: "Broader grouping of indicator types",
    now: "Refined indicator definitions and clearer evidence standards",
  },
  {
    dimension: "Governance Context",
    before: "Early-stage global governance landscape",
    now: "Expanded validation and review procedures reflecting a maturing governance environment",
  },
] as const;

function BeforeBadge() {
  return (
    <span className="inline-flex rounded-md bg-muted px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
      Before
    </span>
  );
}

function NowBadge() {
  return (
    <span className="inline-flex rounded-md bg-primary/10 px-2 py-0.5 text-[0.6875rem] font-semibold italic text-primary">
      Now
    </span>
  );
}

function EditionChangeRow({
  dimension,
  before,
  now,
  className,
}: {
  dimension: string;
  before: string;
  now: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 items-start gap-6 border-t border-border py-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-10 md:py-10 lg:gap-x-14",
        className
      )}
    >
      <p className="text-base font-medium leading-snug text-muted-foreground md:text-[1.0625rem]">
        {dimension}
      </p>

      <div className="flex flex-col gap-2.5">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground md:hidden">
          Previous Edition
        </span>
        <BeforeBadge />
        <p className="text-sm leading-[1.65] text-muted-foreground/80 md:text-[0.9375rem] md:leading-[1.68]">
          {before}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground md:hidden">
          Current Edition
        </span>
        <NowBadge />
        <p className="text-sm leading-[1.65] text-foreground md:text-[0.9375rem] md:leading-[1.68]">
          {now}
        </p>
      </div>
    </div>
  );
}

/**
 * What Changed in This Edition — three-column before/now comparison table.
 */
export function MethodologyEditionChangesSection() {
  return (
    <section className="w-full bg-card px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto mb-12 max-w-2xl text-center md:mb-14 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium tracking-tight lg:leading-[1.12]">
            <span className="text-primary">What Changed </span>
            <span className="text-foreground">in This Edition</span>
          </h2>

          <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base md:leading-[1.65]">
            Key differences between the previous and current edition of the GIRAI
            methodology framework.
          </p>
        </header>

        <div>
          <div className="hidden border-b border-border pb-4 md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-10 lg:gap-x-14">
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Dimension
            </span>
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Previous Edition
            </span>
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Current Edition
            </span>
          </div>

          {CHANGES.map((change) => (
            <EditionChangeRow
              key={change.dimension}
              dimension={change.dimension}
              before={change.before}
              now={change.now}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
