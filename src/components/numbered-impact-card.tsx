import Image from "next/image";

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
    <article className="relative overflow-hidden rounded-[20px] bg-card p-6 shadow-[0_2px_28px_rgba(26,26,46,0.07)] dark:shadow-[0_2px_28px_rgba(0,0,0,0.25)] md:min-h-[220px] md:p-7">
      <Image
        src="/impact/circular-rings.svg"
        alt=""
        aria-hidden
        width={398}
        height={479}
        className="pointer-events-none absolute -right-4 -top-6 w-[min(52%,11rem)] max-w-[176px] rotate-180 select-none opacity-80 dark:opacity-30"
      />

      <div className="relative z-10">
        <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
          {index}
        </span>

        <h3 className="mt-5 text-lg font-medium leading-snug tracking-tight text-foreground md:text-[1.2rem] md:leading-[1.3]">
          {title}
        </h3>

        <p className="mt-3 max-w-[34ch] text-sm leading-[1.65] text-muted-foreground md:text-[0.9375rem]">
          {description}
        </p>
      </div>
    </article>
  );
}
