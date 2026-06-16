export const EVIDENCE_HUB_SECTIONS = {
  hero: "evidence-hero",
  pathwayPicker: "pathway-picker",
  indicatorTable: "pathway-indicator-table",
  explorer: "evidence-explorer",
} as const;

export const EVIDENCE_HUB_VIEWED_KEY = "evidence-hub-explorer-viewed";

export function hasViewedEvidenceHubExplorer(): boolean {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(EVIDENCE_HUB_VIEWED_KEY) === "1";
}

export function markEvidenceHubExplorerViewed(): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(EVIDENCE_HUB_VIEWED_KEY, "1");
}

export function scrollToEvidenceHubSection(
  sectionId: (typeof EVIDENCE_HUB_SECTIONS)[keyof typeof EVIDENCE_HUB_SECTIONS]
): void {
  requestAnimationFrame(() => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}
