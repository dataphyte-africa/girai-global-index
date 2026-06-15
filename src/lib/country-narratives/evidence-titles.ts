/** Prefer quoting evidence by name when short; fall back to generic phrasing. */
export const MAX_SPECIFIC_TITLE_LENGTH = 72;

export function dedupeTitles(titles: string[]): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const raw of titles) {
    const t = raw?.trim();
    if (!t) continue;
    const key = t.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(t);
  }
  return out;
}

function quote(title: string): string {
  return `"${title}"`;
}

/**
 * Format evidence references for narrative copy.
 * - One short unique title → quoted name
 * - One long title → generic label
 * - Repeated / many titles → count-based generic phrasing
 */
export function formatEvidenceReference(
  titles: string[],
  genericLabel: string
): string {
  const unique = dedupeTitles(titles);
  if (unique.length === 0) return "";

  const short = unique.filter((t) => t.length <= MAX_SPECIFIC_TITLE_LENGTH);
  const longOnly = short.length === 0;

  if (unique.length === 1) {
    const t = unique[0]!;
    return t.length <= MAX_SPECIFIC_TITLE_LENGTH ? quote(t) : genericLabel;
  }

  if (short.length === 1 && !longOnly) {
    return quote(short[0]!);
  }

  if (short.length >= 2) {
    return `${quote(short[0]!)} and ${short.length - 1} other documented items`;
  }

  if (unique.every((t) => t.toLowerCase() === unique[0]!.toLowerCase())) {
    return genericLabel;
  }

  return `${unique.length} documented items (${genericLabel})`;
}

/** Clause-ready phrase, e.g. "including \"Foo Act\"" or empty. */
export function evidenceIncludingClause(
  titles: string[],
  genericLabel: string
): string {
  const ref = formatEvidenceReference(titles, genericLabel);
  if (!ref) return "";
  if (ref.startsWith('"') || ref.includes("documented")) {
    return `, including ${ref}`;
  }
  return `, including ${ref}`;
}
