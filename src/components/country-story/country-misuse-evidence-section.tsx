import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EvidenceItem } from "@/lib/girai";
import { getMisuseTypeDisplay, sortMisuseEvidence } from "@/lib/girai/misuse-types";
import { cn } from "@/lib/utils";

const CONTACT_EMAIL = "girai@globalcenter.ai";

export interface CountryMisuseEvidenceSectionProps {
  items: EvidenceItem[];
}

export function CountryMisuseEvidenceSection({
  items,
}: CountryMisuseEvidenceSectionProps) {
  if (items.length === 0) return null;

  const sorted = sortMisuseEvidence(items);

  return (
    <section
      aria-labelledby="country-misuse-evidence-heading"
      className="border-t border-border/60 bg-[#F8F9FF] py-16 md:py-24 dark:bg-[#0c0718] dark:bg-gradient-to-b dark:from-[#130d24]/40 dark:to-background"
    >
      <div className="container mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Sticky intro column — mirrors CountryPerformanceOverview */}
          <div className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              Misuse Of AI
            </span>

            <div className="space-y-3">
              <h2
                id="country-misuse-evidence-heading"
                className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#1e1b4b] dark:text-foreground"
              >
                Unacceptable Risk AI Systems
              </h2>
              <p className="max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                Evidence related to government use of AI systems associated with
                unacceptable-risk categories.
              </p>
            </div>

            <Button
              asChild
              size="lg"
              className="w-fit bg-primary px-6 text-primary-foreground shadow-md shadow-primary/20 hover:bg-primary/90"
            >
              <a href={`mailto:${CONTACT_EMAIL}`}>Contact GIRAI</a>
            </Button>

            <aside
              className="border-l-4 border-primary/60 bg-primary/5 px-4 py-3 text-sm leading-relaxed text-muted-foreground"
              aria-label="Feedback"
            >
              We welcome feedback on the insights and evidence provided for this
              country. Please contact{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-medium text-primary underline underline-offset-2 hover:text-primary/80"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </aside>
          </div>

          {/* Scrolling evidence cards */}
          <ul className="flex flex-col gap-6 lg:gap-8" role="list">
            {sorted.map((item) => (
              <MisuseEvidenceCard key={item.id} item={item} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function MisuseEvidenceCard({ item }: { item: EvidenceItem }) {
  const typeDisplay = getMisuseTypeDisplay(item.type ?? "");
  const detailHref = `/evidence/${encodeURIComponent(item.id)}`;

  return (
    <li>
      <article className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm md:p-6">
        {item.type ? (
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide",
              typeDisplay.badgeClassName
            )}
          >
            {typeDisplay.shortLabel}
          </span>
        ) : null}

        <h3 className="mt-3 text-lg font-bold leading-snug text-[#1e1b4b] dark:text-foreground md:text-xl">
          <Link href={detailHref} className="hover:text-primary hover:underline">
            {item.title}
          </Link>
        </h3>

        {item.justification ? (
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
            {item.justification}
          </p>
        ) : null}

        {item.link ? (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary/80"
          >
            View Trusted Source
            <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        ) : null}
      </article>
    </li>
  );
}
