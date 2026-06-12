import { INDICATORS, type IndicatorFamily } from "@/data/2026/taxonomy";
import type { EvidenceKind, EvidencePathwayId } from "@/lib/girai/types";

export type StatusColumnMode = "framework" | "yesNo";

export interface PathwayTheme {
  iconBg: string;
  iconText: string;
  badgeBg: string;
  badgeText: string;
  accentText: string;
}

export interface PathwayConfig {
  id: EvidencePathwayId;
  title: string;
  /** Short label for the indicator table section heading. */
  tableTitle: string;
  description: string;
  kinds: EvidenceKind[];
  /** Value for the `?kind=` URL param (comma-separated kinds). */
  kindParam: string;
  indicatorFamily: IndicatorFamily | "urai";
  statusColumnMode: StatusColumnMode;
  /** Noun in pathway card meta, e.g. "frameworks". */
  itemNoun: string;
  theme: PathwayTheme;
}

export const PATHWAYS: PathwayConfig[] = [
  {
    id: "frameworks",
    title: "Government Frameworks",
    tableTitle: "Government Frameworks",
    description:
      "Laws, strategies, regulations, institutions, and national AI plans guiding governance.",
    kinds: ["framework"],
    kindParam: "framework",
    indicatorFamily: "ai-policy",
    statusColumnMode: "framework",
    itemNoun: "frameworks",
    theme: {
      iconBg: "bg-violet-100 dark:bg-violet-950/50",
      iconText: "text-violet-600 dark:text-violet-400",
      badgeBg: "bg-violet-50 dark:bg-violet-950/40",
      badgeText: "text-violet-700 dark:text-violet-300",
      accentText: "text-violet-600 dark:text-violet-400",
    },
  },
  {
    id: "initiatives",
    title: "Government-led initiatives",
    tableTitle: "Government-led initiatives",
    description:
      "Procurement, audits, operational measures, and accountability mechanisms.",
    kinds: ["initiative"],
    kindParam: "initiative",
    indicatorFamily: "ai-policy",
    statusColumnMode: "yesNo",
    itemNoun: "actions",
    theme: {
      iconBg: "bg-orange-100 dark:bg-orange-950/50",
      iconText: "text-orange-600 dark:text-orange-400",
      badgeBg: "bg-orange-50 dark:bg-orange-950/40",
      badgeText: "text-orange-700 dark:text-orange-300",
      accentText: "text-orange-600 dark:text-orange-400",
    },
  },
  {
    id: "nonGov",
    title: "Non-Government Initiatives",
    tableTitle: "Non-Government Initiative",
    description:
      "Advocacy groups, research institutions, consultations, and participation in governance.",
    kinds: [
      "cso-initiative",
      "gmc-consultation",
      "gmc-provision",
      "gmc-mechanism",
    ],
    kindParam:
      "cso-initiative,gmc-consultation,gmc-provision,gmc-mechanism",
    indicatorFamily: "cse",
    statusColumnMode: "yesNo",
    itemNoun: "engagement",
    theme: {
      iconBg: "bg-sky-100 dark:bg-sky-950/50",
      iconText: "text-sky-600 dark:text-sky-400",
      badgeBg: "bg-sky-50 dark:bg-sky-950/40",
      badgeText: "text-sky-700 dark:text-sky-300",
      accentText: "text-sky-600 dark:text-sky-400",
    },
  },
  {
    id: "misuse",
    title: "Government Misuse Of AI",
    tableTitle: "Countries Misuse Of AI",
    description:
      "Where safeguards are limited and risks of AI misuse have been identified.",
    kinds: ["government-misuse"],
    kindParam: "government-misuse",
    indicatorFamily: "urai",
    statusColumnMode: "yesNo",
    itemNoun: "countries",
    theme: {
      iconBg: "bg-red-100 dark:bg-red-950/50",
      iconText: "text-red-600 dark:text-red-400",
      badgeBg: "bg-red-50 dark:bg-red-950/40",
      badgeText: "text-red-700 dark:text-red-300",
      accentText: "text-red-600 dark:text-red-400",
    },
  },
];

const DEFAULT_PATHWAY = PATHWAYS[0]!;

export function parseKindParam(kindParam: string | null): EvidenceKind[] {
  if (!kindParam?.trim()) return [];
  return kindParam.split(",").filter(Boolean) as EvidenceKind[];
}

function kindsKey(kinds: EvidenceKind[]): string {
  return [...kinds].sort().join(",");
}

/** Resolve the active pathway from the current `?kind=` URL value. */
export function getPathwayFromKindParam(kindParam: string | null): PathwayConfig {
  const kinds = parseKindParam(kindParam);
  if (kinds.length === 0) return DEFAULT_PATHWAY;
  const key = kindsKey(kinds);
  return (
    PATHWAYS.find((p) => kindsKey(p.kinds) === key) ?? DEFAULT_PATHWAY
  );
}

export function getIndicatorsForPathway(pathway: PathwayConfig) {
  if (pathway.indicatorFamily === "urai") {
    return INDICATORS.filter((i) => i.slug === "unacceptable-risks-ai-systems");
  }
  return INDICATORS.filter((i) => i.family === pathway.indicatorFamily);
}

export function itemCountForPathway(
  pathway: PathwayConfig,
  byKind: Partial<Record<EvidenceKind, number>>,
  uniqueItemsByKind?: Partial<Record<EvidenceKind, number>>,
  uniqueTitlesByKind?: Partial<Record<EvidenceKind, number>>
): number {
  return pathway.kinds.reduce((sum, k) => {
    const uniqueCount =
      k === "framework" ? uniqueTitlesByKind?.[k] : uniqueItemsByKind?.[k];
    return sum + (uniqueCount ?? byKind[k] ?? 0);
  }, 0);
}

export const ADOPTION_INDEX_URL = "/data/2026/indicator-adoption.json";
