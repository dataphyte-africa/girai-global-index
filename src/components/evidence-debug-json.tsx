"use client";

import { useSearchParams } from "next/navigation";
import type { EvidenceItem } from "@/lib/girai";

/**
 * Renders the raw parsed evidence item as JSON when the page is loaded
 * with `?debug=1` (per ADR 0007). Implemented as a client component so
 * the surrounding `/evidence/[itemId]` page can be fully statically
 * pre-rendered — the debug payload is decided in the browser.
 */
export function EvidenceDebugJson({ item }: { item: EvidenceItem }) {
  const params = useSearchParams();
  if (params.get("debug") !== "1") return null;
  return (
    <section className="container mx-auto px-4 pb-12">
      <details
        open
        className="rounded-2xl border border-dashed border-border bg-muted/30 p-4"
      >
        <summary className="cursor-pointer text-sm font-semibold text-muted-foreground">
          Debug JSON
        </summary>
        <pre className="mt-3 max-h-[500px] overflow-auto rounded-md bg-background p-4 text-xs leading-relaxed text-foreground">
          {JSON.stringify(item, null, 2)}
        </pre>
      </details>
    </section>
  );
}
