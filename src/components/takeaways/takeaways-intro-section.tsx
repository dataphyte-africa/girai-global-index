import { takeawaysDefaults, type TakeawaysContent } from "@/content/takeaways.defaults";

/**
 * Centered split-tone statement below the Top Takeaways hero.
 *
 * Both clauses are editor-optional: an empty muted clause drops its span, and
 * an empty lead drops the section entirely.
 */
export function TakeawaysIntroSection({
  content = takeawaysDefaults,
}: {
  content?: TakeawaysContent;
}) {
  const { introHeadingLead: lead, introHeadingMuted: muted } = content;
  if (!lead) return null;

  return (
    <section className="w-full bg-background px-4 py-16 md:px-6 md:py-24 lg:py-28">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[1.75rem] font-medium leading-[1.22] tracking-tight md:text-[2.5rem] md:leading-[1.2] lg:text-[2.75rem] lg:leading-[1.18]">
          <span className="text-foreground">{muted ? lead : lead.trimEnd()}</span>
          {muted ? <span className="text-muted-foreground">{muted}</span> : null}
        </p>
      </div>
    </section>
  );
}
