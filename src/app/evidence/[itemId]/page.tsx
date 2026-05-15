import Link from "next/link";
import { ArrowLeft, ExternalLink, FileText, ShieldAlert } from "lucide-react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { EvidenceDebugJson } from "@/components/evidence-debug-json";
import {
  getAllEvidenceItems,
  getEvidenceById,
  getDatasetProvenance,
} from "@/lib/girai";
import {
  getDimension,
  getPillar,
  findIndicator,
} from "@/data/2026/taxonomy";
import { dimensionColors } from "@/lib/narratives";
import type { EvidenceItem, EvidenceKind } from "@/lib/girai";

interface PageProps {
  params: Promise<{ itemId: string }>;
}

/**
 * Pre-render every evidence ID as a static page (per ADR 0007). Bad IDs
 * fall through to a 404 and the dataset is the source of truth.
 */
export async function generateStaticParams() {
  return getAllEvidenceItems().map((it) => ({ itemId: it.id }));
}

export async function generateMetadata({ params }: PageProps) {
  const { itemId } = await params;
  // Item IDs contain `:` which Next.js URL-decodes for us before passing in.
  const item = getEvidenceById(itemId);
  if (!item) {
    return { title: `Evidence not found · ${itemId} | GIRAI Global Index` };
  }
  return {
    title: `${item.title} | GIRAI Evidence`,
    description: `${KIND_LABELS[item.kind]} for ${item.country.name} — ${item.title}.`,
  };
}

const KIND_LABELS: Record<EvidenceKind, string> = {
  framework: "Framework",
  initiative: "Government Initiative",
  "cso-initiative": "CSO Initiative",
  "gmc-consultation": "Government Mechanism — Consultation",
  "gmc-provision": "Government Mechanism — Provision",
  "gmc-mechanism": "Government Mechanism — Body",
  "government-misuse": "Government Misuse (URAI)",
};

export default async function EvidenceItemPage({ params }: PageProps) {
  const { itemId } = await params;

  const item = getEvidenceById(itemId);
  if (!item) {
    return <NotFoundView itemId={itemId} />;
  }

  const dim = getDimension(item.dimensionSlug);
  const pillar = getPillar(item.pillarSlug);
  const indicator = findIndicator(item.indicatorSlug);
  const provenance = getDatasetProvenance();
  const color = dimensionColors[item.dimensionSlug];

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <Header />

      <section
        className="relative overflow-hidden border-b border-border"
        style={{ background: `linear-gradient(180deg, ${color}10 0%, transparent 100%)` }}
      >
        <div className="container mx-auto px-4 py-10">
          <Link href={`/countries/${item.country.iso3}`}>
            <Button variant="ghost" size="sm" className="mb-6 gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to {item.country.name}
            </Button>
          </Link>

          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {item.kind === "government-misuse" ? (
              <ShieldAlert className="size-4 text-red-500" />
            ) : (
              <FileText className="size-4" />
            )}
            <span>{KIND_LABELS[item.kind]}</span>
            <span className="text-border">•</span>
            <span>{item.country.name}</span>
          </div>
          <h1 className="mt-3 max-w-4xl text-3xl font-bold tracking-tight md:text-4xl">
            {item.title}
          </h1>

          <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
            <Link
              href={`/dimensions/${item.dimensionSlug}`}
              className="rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: color }}
            >
              {dim.name}
            </Link>
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              {pillar.name}
            </span>
            {indicator ? (
              <Link
                href={`/indicators/${indicator.slug}`}
                className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-muted/70"
              >
                {indicator.name}
              </Link>
            ) : (
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {item.indicatorSlug}
              </span>
            )}
          </div>

          {item.contributesTo && item.contributesTo.length > 0 ? (
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-muted-foreground">Also contributes to:</span>
              {item.contributesTo.map((slug) => (
                <Link
                  key={slug}
                  href={`/indicators/${slug}`}
                  className="rounded-full bg-muted px-2.5 py-0.5 text-muted-foreground hover:bg-muted/70"
                >
                  {findIndicator(slug)?.name ?? slug}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
      </section>

      <main className="container mx-auto grid grid-cols-1 gap-10 px-4 py-12 lg:grid-cols-3 lg:gap-12">
        {/* Layer 1 — Public card */}
        <section className="lg:col-span-2 space-y-8">
          <PublicCard item={item} />
          {item.thematicElements && item.thematicElements.length > 0 ? (
            <ThematicCoverageCard elements={item.thematicElements} />
          ) : null}
        </section>

        {/* Layer 2 — Validation panel */}
        <aside className="space-y-4">
          <ValidationPanel
            item={item}
            generatedAt={provenance.generatedAt}
            sourceHash={provenance.sourceHash}
          />
        </aside>
      </main>

      {/* Layer 3 — Debug JSON (only when ?debug=1) */}
      <EvidenceDebugJson item={item} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents

function PublicCard({ item }: { item: EvidenceItem }) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      {item.type ? (
        <div className="mb-3">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            {item.type}
          </span>
        </div>
      ) : null}

      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Justification
      </h2>
      <p className="whitespace-pre-line text-sm leading-relaxed text-foreground">
        {item.justification}
      </p>

      {/* Framework-specific attributes */}
      <FieldGrid>
        <Field label="Enforceability" value={item.enforceability} />
        <Field label="Reach" value={item.reach} />
        <Field label="Scope" value={item.scope} />
        <Field label="Approval date" value={item.approval} />
        <Field
          label="Defence and security"
          value={item.defenceAndSecurity ? item.defenceAndSecurity.value : null}
        />
        <Field label="Consultation" value={item.consultation} />
        <Field label="Plan" value={item.plan} />
        <Field label="Budget" value={item.budget} />
        <Field label="Monitoring" value={item.monitoring} />
        <Field
          label="Implementing body"
          value={
            item.body
              ? `${item.body.exists}${item.body.name ? ` — ${item.body.name}` : ""}`
              : null
          }
        />
      </FieldGrid>

      {item.defenceAndSecurity?.justification ? (
        <p className="mt-4 rounded-md bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">
            Defence and security note:{" "}
          </span>
          {item.defenceAndSecurity.justification}
        </p>
      ) : null}
    </article>
  );
}

function ThematicCoverageCard({
  elements,
}: {
  elements: NonNullable<EvidenceItem["thematicElements"]>;
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Thematic coverage
      </h2>
      <ul className="space-y-3">
        {elements.map((el, i) => (
          <li key={i} className="rounded-md border border-border bg-background p-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-foreground">{el.text}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                  el.value === "Yes"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {el.value}
              </span>
            </div>
            {el.justification ? (
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {el.justification}
              </p>
            ) : null}
          </li>
        ))}
      </ul>
    </article>
  );
}

function ValidationPanel({
  item,
  generatedAt,
  sourceHash,
}: {
  item: EvidenceItem;
  generatedAt: string;
  sourceHash: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Validation
        </h2>
      </div>
      <dl className="divide-y divide-border/60">
        <DefRow label="Item ID" value={<code className="break-all text-xs">{item.id}</code>} />
        <DefRow
          label="Country"
          value={
            <Link
              href={`/countries/${item.country.iso3}`}
              className="inline-flex items-center gap-1 text-foreground hover:underline"
            >
              {item.country.name} ({item.country.iso3})
            </Link>
          }
        />
        <DefRow label="Region" value={item.country.region} />
        <DefRow label="Income group" value={item.country.incomeGroup} />
        <DefRow
          label="Official link"
          value={
            item.link ? (
              <a
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 break-all text-primary hover:underline"
              >
                {shortenUrl(item.link)}
                <ExternalLink className="size-3" />
              </a>
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          }
        />
        <DefRow
          label="Drive mirror"
          value={
            item.drive ? (
              <a
                href={item.drive}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 break-all text-primary hover:underline"
              >
                {shortenUrl(item.drive)}
                <ExternalLink className="size-3" />
              </a>
            ) : (
              <span className="text-muted-foreground">—</span>
            )
          }
        />
        <DefRow label="Built at" value={new Date(generatedAt).toISOString().slice(0, 19) + "Z"} />
        <DefRow
          label="Source hash"
          value={<code className="break-all text-xs text-muted-foreground">{sourceHash}</code>}
        />
        <DefRow
          label="Debug"
          value={
            <Link href={`?debug=1`} className="text-primary hover:underline">
              View raw JSON
            </Link>
          }
        />
      </dl>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Layout helpers

function FieldGrid({ children }: { children: React.ReactNode }) {
  // Filter out null/empty Field children to avoid empty grid cells.
  const visible = (Array.isArray(children) ? children : [children]).filter(Boolean);
  if (visible.length === 0) return null;
  return (
    <dl className="mt-6 grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
      {visible}
    </dl>
  );
}

function Field({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="rounded-md border border-border/60 bg-background/50 px-3 py-2">
      <dt className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-0.5 text-sm text-foreground">{value}</dd>
    </div>
  );
}

function DefRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-3 gap-3 px-4 py-2.5 text-sm">
      <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="col-span-2 break-words text-foreground">{value}</dd>
    </div>
  );
}

function shortenUrl(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname}${u.pathname.length > 30 ? u.pathname.slice(0, 30) + "…" : u.pathname}`;
  } catch {
    return url;
  }
}

function NotFoundView({ itemId }: { itemId: string }) {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans dark:bg-black">
      <Header />
      <main className="container mx-auto max-w-2xl flex-1 px-4 py-20">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-6 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Index
          </Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Evidence not found</h1>
        <p className="mt-3 text-muted-foreground">
          We couldn&apos;t find the evidence row{" "}
          <code className="break-all rounded bg-muted px-1.5 py-0.5 text-sm">
            {itemId}
          </code>{" "}
          in the current build of the dataset.
        </p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
          IDs follow the grammar{" "}
          <code className="rounded bg-muted px-1 py-0.5">
            {`{interviewKey}:{kind}:{slot}`}
          </code>
          . If you copied this link from a working spreadsheet, the row may
          have been deleted or moved since the last build. Re-running{" "}
          <code className="rounded bg-muted px-1 py-0.5">pnpm build:data</code>{" "}
          will pick up the latest source data.
        </p>
        <p className="mt-6 text-sm">
          <Link href="/" className="text-primary hover:underline">
            ← Back to the GIRAI Index
          </Link>
        </p>
      </main>
    </div>
  );
}
