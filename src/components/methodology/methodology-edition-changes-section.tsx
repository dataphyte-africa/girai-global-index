import { cn } from "@/lib/utils";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const SUBTITLE_COLOR = "#6B7280";
const LABEL_COLOR = "#9CA3AF";
const DIMENSION_COLOR = "#6B7280";
const BEFORE_TEXT_COLOR = "#9CA3AF";
const NOW_TEXT_COLOR = "#1A1A2E";
const BORDER_COLOR = "#ECEEF2";
const BEFORE_BADGE_BG = "#F3F4F6";
const NOW_BADGE_BG = "#F0EDFF";

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
    <span
      className="inline-flex rounded-md px-2 py-0.5 text-[0.6875rem] font-semibold uppercase tracking-[0.12em]"
      style={{ backgroundColor: BEFORE_BADGE_BG, color: LABEL_COLOR }}
    >
      Before
    </span>
  );
}

function NowBadge() {
  return (
    <span
      className="inline-flex rounded-md px-2 py-0.5 text-[0.6875rem] font-semibold italic"
      style={{ backgroundColor: NOW_BADGE_BG, color: PURPLE }}
    >
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
        "grid grid-cols-1 items-start gap-6 border-t py-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-10 md:py-10 lg:gap-x-14",
        className
      )}
      style={{ borderColor: BORDER_COLOR }}
    >
      <p
        className="text-base font-medium leading-snug md:text-[1.0625rem]"
        style={{ color: DIMENSION_COLOR }}
      >
        {dimension}
      </p>

      <div className="flex flex-col gap-2.5">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF] md:hidden">
          Previous Edition
        </span>
        <BeforeBadge />
        <p
          className="text-sm leading-[1.65] md:text-[0.9375rem] md:leading-[1.68]"
          style={{ color: BEFORE_TEXT_COLOR }}
        >
          {before}
        </p>
      </div>

      <div className="flex flex-col gap-2.5">
        <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF] md:hidden">
          Current Edition
        </span>
        <NowBadge />
        <p
          className="text-sm leading-[1.65] md:text-[0.9375rem] md:leading-[1.68]"
          style={{ color: NOW_TEXT_COLOR }}
        >
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
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-5xl">
        <header className="mx-auto mb-12 max-w-2xl text-center md:mb-14 lg:mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-[2.75rem] lg:leading-[1.12]">
            <span style={{ color: PURPLE }}>What Changed </span>
            <span style={{ color: HEADING_DARK }}>in This Edition</span>
          </h2>

          <p
            className="mt-4 text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            Key differences between the previous and current edition of the GIRAI
            methodology framework.
          </p>
        </header>

        <div>
          <div
            className="hidden border-b pb-4 md:grid md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-x-10 lg:gap-x-14"
            style={{ borderColor: BORDER_COLOR }}
          >
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
              Dimension
            </span>
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
              Previous Edition
            </span>
            <span className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-[#9CA3AF]">
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
