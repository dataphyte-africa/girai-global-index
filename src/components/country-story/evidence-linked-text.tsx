"use client";

import { Fragment, type ReactNode } from "react";

/**
 * Renders a narrative string, turning evidence mentions (counts and generic
 * evidence labels emitted by `@/lib/country-narratives`) into in-page links
 * that smooth-scroll to the country Evidence Explorer section.
 *
 * Patterns are ordered longest/most-specific first so the regex engine prefers
 * the fuller phrase at each position.
 */
const EVIDENCE_PATTERN = new RegExp(
  [
    // Narrative copy (hero / dimension / pillar callouts)
    "\\d{1,4} government-misuse evidence items?",
    "\\d{1,4} documented evidence items",
    "\\d{1,4} evidence items on file",
    "\\d{1,4} other documented items",
    "documented frameworks and initiatives",
    "documented policy items",
    "documented misuse cases",
    "Anchoring items",
    // "What Drives This Performance?" card bullets (evidence counts)
    "\\d{1,4} AI policy frameworks? documented",
    "\\d{1,4} government initiatives? documented",
    "\\d{1,4} civil society initiatives? on file",
    "\\d{1,4} multi-stakeholder governance items? documented",
    "\\d{1,4} of \\d{1,4} civil society indicators with documented engagement",
    "Dedicated implementing body on \\d{1,4} frameworks?",
  ].join("|"),
  "g"
);

const DEFAULT_TARGET_ID = "country-evidence";

function scrollToEvidence(targetId: string) {
  if (typeof document === "undefined") return;
  const el = document.getElementById(targetId);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  if (typeof history !== "undefined") {
    history.replaceState(null, "", `#${targetId}`);
  }
}

interface EvidenceLinkedTextProps {
  text: string;
  targetId?: string;
}

export function EvidenceLinkedText({
  text,
  targetId = DEFAULT_TARGET_ID,
}: EvidenceLinkedTextProps) {
  if (!text) return null;

  const segments: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;

  for (const match of text.matchAll(EVIDENCE_PATTERN)) {
    const start = match.index ?? 0;
    const matched = match[0];

    if (start > lastIndex) {
      segments.push(
        <Fragment key={key++}>{text.slice(lastIndex, start)}</Fragment>
      );
    }

    segments.push(
      <a
        key={key++}
        href={`#${targetId}`}
        onClick={(e) => {
          e.preventDefault();
          scrollToEvidence(targetId);
        }}
        className="font-medium text-[#6c5cff] underline decoration-[#6c5cff]/40 underline-offset-2 transition-colors hover:text-[#5b4ce0] hover:decoration-[#6c5cff]"
      >
        {matched}
      </a>
    );

    lastIndex = start + matched.length;
  }

  if (lastIndex < text.length) {
    segments.push(<Fragment key={key++}>{text.slice(lastIndex)}</Fragment>);
  }

  return <>{segments}</>;
}
