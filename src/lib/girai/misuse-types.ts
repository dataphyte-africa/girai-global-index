import type { EvidenceItem } from "./types";

/** Canonical `type` values on `government-misuse` evidence items (2026 dataset). */
export const MISUSE_EVIDENCE_TYPES = [
  "Mass biometric surveillance (e.g. facial recognition in public spaces)",
  "Criminal justice & law enforcement misuse",
  "Discriminatory public service systems",
  "Social scoring systems",
  "AI weapons or the use of AI in armed conflicts",
  "AI-driven cyberattacks disinformation or influence operations",
] as const;

export type MisuseEvidenceType = (typeof MISUSE_EVIDENCE_TYPES)[number];

export interface MisuseTypeDisplay {
  shortLabel: string;
  badgeClassName: string;
}

export const MISUSE_TYPE_DISPLAY: Record<MisuseEvidenceType, MisuseTypeDisplay> = {
  "Mass biometric surveillance (e.g. facial recognition in public spaces)": {
    shortLabel: "Mass Biometric Surveillance",
    badgeClassName:
      "bg-violet-100 text-violet-800 dark:bg-violet-500/15 dark:text-violet-200",
  },
  "Criminal justice & law enforcement misuse": {
    shortLabel: "Criminal Justice & Law Enforcement",
    badgeClassName:
      "bg-amber-100 text-amber-900 dark:bg-amber-500/15 dark:text-amber-200",
  },
  "Discriminatory public service systems": {
    shortLabel: "Discriminatory Public Service Systems",
    badgeClassName: "bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-200",
  },
  "Social scoring systems": {
    shortLabel: "Social Scoring",
    badgeClassName:
      "bg-slate-100 text-slate-800 dark:bg-slate-500/15 dark:text-slate-200",
  },
  "AI weapons or the use of AI in armed conflicts": {
    shortLabel: "AI in Armed Conflict",
    badgeClassName: "bg-red-100 text-red-800 dark:bg-red-500/15 dark:text-red-200",
  },
  "AI-driven cyberattacks disinformation or influence operations": {
    shortLabel: "Cyberattacks & Influence Operations",
    badgeClassName:
      "bg-orange-100 text-orange-900 dark:bg-orange-500/15 dark:text-orange-200",
  },
};

/** Display order for country-page misuse cards (fixed category priority). */
export const MISUSE_TYPE_ORDER: MisuseEvidenceType[] = [
  "Mass biometric surveillance (e.g. facial recognition in public spaces)",
  "Criminal justice & law enforcement misuse",
  "Discriminatory public service systems",
  "Social scoring systems",
  "AI weapons or the use of AI in armed conflicts",
  "AI-driven cyberattacks disinformation or influence operations",
];

const TYPE_ORDER_INDEX = new Map(
  MISUSE_TYPE_ORDER.map((type, index) => [type, index])
);

export function getMisuseTypeDisplay(type: string): MisuseTypeDisplay {
  const known = MISUSE_TYPE_DISPLAY[type as MisuseEvidenceType];
  if (known) return known;
  return {
    shortLabel: type,
    badgeClassName: "bg-muted text-muted-foreground",
  };
}

export function sortMisuseEvidence(items: EvidenceItem[]): EvidenceItem[] {
  return [...items].sort((a, b) => {
    const typeA = a.type ?? "";
    const typeB = b.type ?? "";
    const orderA = TYPE_ORDER_INDEX.get(typeA as MisuseEvidenceType) ?? 999;
    const orderB = TYPE_ORDER_INDEX.get(typeB as MisuseEvidenceType) ?? 999;
    if (orderA !== orderB) return orderA - orderB;
    return a.title.localeCompare(b.title, undefined, { sensitivity: "base" });
  });
}
