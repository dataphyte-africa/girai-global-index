import { aboutDefaults, type AboutContent } from "@/content/about.defaults";

/**
 * Two-column intro below the About hero — large split-tone heading with
 * supporting body copy on the right.
 */
export function AboutIntroSection({ content = aboutDefaults }: { content?: AboutContent }) {
  return (
    <section className="w-full bg-white px-4 py-16 dark:bg-background md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] lg:items-center lg:gap-20">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.14] tracking-tight lg:leading-[1.12]">
            <span className="text-foreground">{content.introHeadingLead}</span>
            <span className="text-heading-muted">{content.introHeadingMuted}</span>
          </h2>

          <p className="max-w-md text-base leading-[1.65] text-muted-foreground md:text-[1.0625rem] lg:pt-2">
            {content.introBody}
          </p>
        </div>
      </div>
    </section>
  );
}
