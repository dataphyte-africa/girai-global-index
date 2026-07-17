import React from "react";

/**
 * The Bright Spot callout chrome — the tinted box and its “Bright Spot · Country”
 * label. Shared by the key findings accordion (/takeaways) and the indicator
 * detail pages, so a bright spot reads the same wherever it appears. Body copy
 * is passed as children, since each surface styles its own rich text.
 *
 * Deliberately not a client component: it holds no state, so the server-rendered
 * indicator section can use it without pulling in client JS.
 */
export function BrightSpotCallout({
  country,
  children,
}: {
  country?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-5 rounded-xl bg-primary/5 px-4 py-3 dark:bg-primary/10">
      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
        Bright Spot{country ? ` · ${country}` : ""}
      </p>
      {children}
    </div>
  );
}
