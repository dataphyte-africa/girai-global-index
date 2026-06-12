import Image from "next/image";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const BODY_COLOR = "#6B7280";

export interface NumberedImpactCardProps {
  index: number;
  title: string;
  description: string;
}

/**
 * Numbered card with purple badge and corner ring accent — used on About
 * ("Why GIRAI Matters") and Methodology ("What GIRAI Measures") sections.
 */
export function NumberedImpactCard({
  index,
  title,
  description,
}: NumberedImpactCardProps) {
  return (
    <article className="relative overflow-hidden rounded-[20px] bg-white p-6 shadow-[0_2px_28px_rgba(26,26,46,0.07)] md:min-h-[220px] md:p-7">
      <Image
        src="/impact/circular-rings.svg"
        alt=""
        aria-hidden
        width={398}
        height={479}
        className="pointer-events-none absolute -right-4 -top-6 w-[min(52%,11rem)] max-w-[176px] rotate-180 select-none"
      />

      <div className="relative z-10">
        <span
          className="inline-flex size-7 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: PURPLE }}
        >
          {index}
        </span>

        <h3
          className="mt-5 text-lg font-bold leading-snug tracking-tight md:text-[1.2rem] md:leading-[1.3]"
          style={{ color: HEADING_DARK }}
        >
          {title}
        </h3>

        <p
          className="mt-3 max-w-[34ch] text-sm leading-[1.65] md:text-[0.9375rem]"
          style={{ color: BODY_COLOR }}
        >
          {description}
        </p>
      </div>
    </article>
  );
}
