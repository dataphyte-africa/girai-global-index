/**
 * Normalizes per-country evidence status across GIRAI editions into the
 * display vocabulary used by the edition-comparison table.
 */

import type {
  EditionDisplayStatus,
  EditionPathwayId,
  FrameworkDisplayStatus,
  YesNoDisplayStatus,
} from "./types";

export type {
  EditionDisplayStatus,
  EditionPathwayId,
  FrameworkDisplayStatus,
  YesNoDisplayStatus,
} from "./types";

export const EDITION_PATHWAYS: Record<
  EditionPathwayId,
  { label: string; statusType: "framework" | "yesNo" }
> = {
  frameworks: { label: "Framework Status", statusType: "framework" },
  initiatives: { label: "Government-led initiative", statusType: "yesNo" },
  cso: { label: "CSO activities", statusType: "yesNo" },
};

export function normalize2026FrameworkStatus(
  frStatus: string,
  enforceability: string
): FrameworkDisplayStatus {
  if (frStatus === "No framework") return "No Framework";
  if (frStatus === "Draft") return "Draft";
  if (frStatus === "Adopted") {
    const e = enforceability.trim().toLowerCase();
    if (e === "binding") return "Binding Framework";
    if (e === "non-binding") return "Non-Binding Framework";
    return "Binding Framework";
  }
  return "No Framework";
}

export function normalize2024FrameworkStatus(row: {
  fr_doc1_existence_text?: string;
  fr_doc1_type_text?: string;
  ga_type_text?: string;
}): FrameworkDisplayStatus {
  const exist = String(row.fr_doc1_existence_text ?? "").trim();
  if (!exist || exist.startsWith("No")) {
    const gaType = String(row.ga_type_text ?? "").trim();
    if (gaType === "Draft frameworks") return "Draft";
    return "No Framework";
  }

  const type = String(row.fr_doc1_type_text ?? "").trim();
  if (type === "Binding frameworks" || type === "Legally-enforceable frameworks") {
    return "Binding Framework";
  }
  if (type === "Non-binding frameworks") return "Non-Binding Framework";

  const gaType = String(row.ga_type_text ?? "").trim();
  if (gaType === "Draft frameworks") return "Draft";

  return "No Framework";
}

export function normalize2024YesNo(value: string | undefined): YesNoDisplayStatus {
  const v = String(value ?? "").trim();
  return v.startsWith("Yes") ? "Yes" : "No";
}

export function normalize2026YesNo(count: number | string | undefined): YesNoDisplayStatus {
  const n = typeof count === "string" ? Number(count) : count;
  return n && n > 0 ? "Yes" : "No";
}

export function statusesDiffer(
  a: EditionDisplayStatus | null,
  b: EditionDisplayStatus | null
): boolean {
  if (a === null || b === null) return false;
  return a !== b;
}
