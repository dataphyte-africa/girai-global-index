"use client";

import * as React from "react";
import { useSearchParams } from "next/navigation";
import {
  EVIDENCE_HUB_SECTIONS,
  hasViewedEvidenceHubExplorer,
  markEvidenceHubExplorerViewed,
  scrollToEvidenceHubSection,
} from "./scroll";

/**
 * On first visit (before the evidence explorer has been viewed), gently
 * advances the user to the next hub section based on URL state. Stops
 * auto-scrolling once the explorer enters the viewport.
 */
export function EvidenceHubScrollGuide() {
  const searchParams = useSearchParams();
  const hasAutoScrolled = React.useRef(false);

  React.useEffect(() => {
    if (hasViewedEvidenceHubExplorer() || hasAutoScrolled.current) return;

    const kind = searchParams.get("kind");
    if (!kind) return;

    hasAutoScrolled.current = true;

    const indicator = searchParams.get("indicator");
    const misuseType = searchParams.get("type");
    const target =
      indicator || misuseType
        ? EVIDENCE_HUB_SECTIONS.explorer
        : EVIDENCE_HUB_SECTIONS.pathwayPicker;

    const timer = window.setTimeout(() => {
      scrollToEvidenceHubSection(target);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [searchParams]);

  React.useEffect(() => {
    const el = document.getElementById(EVIDENCE_HUB_SECTIONS.explorer);
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && entry.intersectionRatio >= 0.2) {
          markEvidenceHubExplorerViewed();
          observer.disconnect();
        }
      },
      { threshold: [0.2] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return null;
}
