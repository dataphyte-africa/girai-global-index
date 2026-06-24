import Image from "next/image";
import { aboutDefaults, type AboutContent } from "@/content/about.defaults";

const PURPLE = "#7150F4";
const HEADING_DARK = "#1A1A2E";
const BODY_COLOR = "#6B7280";
const SUBTITLE_COLOR = "#6B7280";

function AudienceCard({
  index,
  title,
  description,
}: {
  index: number;
  title: string;
  description: string;
}) {
  return (
    <article className="flex gap-4 rounded-[18px] bg-white p-5 shadow-[0_2px_24px_rgba(26,26,46,0.06)] md:gap-5 md:p-6">
      <div className="relative mt-0.5 shrink-0">
        <div
          aria-hidden
          className="absolute -inset-2 rounded-full bg-[#7150F4]/14 blur-md"
        />
        <span
          className="relative flex size-8 items-center justify-center rounded-full text-sm font-semibold text-white"
          style={{ backgroundColor: PURPLE }}
        >
          {index}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <h3
          className="text-base font-medium leading-snug tracking-tight md:text-[1.0625rem]"
          style={{ color: HEADING_DARK }}
        >
          {title}
        </h3>
        <p
          className="mt-1.5 text-sm leading-[1.6] md:text-[0.9375rem]"
          style={{ color: BODY_COLOR }}
        >
          {description}
        </p>
      </div>
    </article>
  );
}

/**
 * Who GIRAI is for — audience cards on the left, portrait and summary on the right.
 */
export function AboutWhoGiraiIsForSection({
  content = aboutDefaults,
}: {
  content?: AboutContent;
}) {
  const image = content.whoForImage.url ?? aboutDefaults.whoForImage.url!;
  return (
    <section className="w-full bg-white px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <header className="mx-auto mb-12 max-w-3xl text-center md:mb-14 lg:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium leading-[1.18] tracking-tight md:leading-[1.15]">
            <span style={{ color: HEADING_DARK }}>{content.whoForHeadingLead}</span>
            <span style={{ color: PURPLE }}>{content.whoForHeadingAccent}</span>
          </h2>

          <p
            className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed md:text-base md:leading-[1.65]"
            style={{ color: SUBTITLE_COLOR }}
          >
            {content.whoForSubtitle}
          </p>
        </header>

        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-14 xl:gap-16">
          <div className="flex flex-col gap-4 md:gap-5">
            {content.audiences.map((audience, index) => (
              <AudienceCard
                key={audience.title}
                index={index + 1}
                title={audience.title}
                description={audience.description}
              />
            ))}
          </div>

          <div className="lg:sticky lg:top-24">
            <Image
              src={image}
              alt={content.whoForImage.alt ?? "Professional reviewing AI governance insights"}
              width={598}
              height={399}
              className="h-auto w-full rounded-[20px] object-cover shadow-[0_20px_48px_rgba(26,26,46,0.1)]"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />

            <p
              className="mt-6 max-w-lg text-base leading-[1.65] md:mt-7 md:text-[1.0625rem]"
              style={{ color: BODY_COLOR }}
            >
              {content.whoForSummary}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
