import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getIndicatorCopy } from "@/lib/indicator-copy";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const BODY_COLOR = "#6B7280";
const NUMBER_DECORATOR = "/methodology/number-decorator.svg";

export interface IndicatorCardProps {
  index: number;
  slug: string;
  name: string;
}

/**
 * Indicator listing card — numbered badge with decorator, summary copy,
 * and a link to the per-indicator detail page.
 */
export function IndicatorCard({ index, slug, name }: IndicatorCardProps) {
  const copy = getIndicatorCopy(slug);

  return (
    <article className="flex h-full flex-col rounded-[20px] border border-[#ECEEF2] bg-white p-6 shadow-[0_2px_28px_rgba(26,26,46,0.06)] md:p-7">
      <div className="relative mb-5 w-fit md:mb-6">
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

      <h3
        className="text-lg font-medium leading-snug tracking-tight md:text-[1.2rem] md:leading-[1.3]"
        style={{ color: HEADING_DARK }}
      >
        {name}
      </h3>

      <p
        className="mt-3 flex-1 text-sm leading-[1.65] md:text-[0.9375rem]"
        style={{ color: BODY_COLOR }}
      >
        {copy.description}
      </p>

      <div className="mt-6 pt-1">
        <Link
          href={`/indicators/${slug}`}
          className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors hover:bg-[#7150F4]/5"
          style={{ borderColor: PURPLE, color: PURPLE }}
        >
          Read more
          <span
            className="inline-flex size-5 items-center justify-center rounded-full"
            style={{ backgroundColor: PURPLE }}
          >
            <ArrowUpRight className="size-3 text-white" aria-hidden />
          </span>
        </Link>
      </div>
    </article>
  );
}
