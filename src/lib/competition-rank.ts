/**
 * Competition ("1224") ranking shared by the ranking tables and maps.
 *
 * Rank 1 is always the highest score. Tied scores share a rank and the next
 * rank skips accordingly (1, 2, 2, 4) — the same convention the build step
 * uses for `rankGlobal` / `rankRegional`. Items without a score are unranked
 * (absent from the returned map).
 */
export function buildCompetitionRankMap<T>(
  items: readonly T[],
  getKey: (item: T) => string,
  getScore: (item: T) => number | null | undefined
): Map<string, number> {
  const scored = items
    .map((item) => ({ key: getKey(item), score: getScore(item) }))
    .filter(
      (row): row is { key: string; score: number } =>
        row.score != null && !Number.isNaN(row.score)
    )
    .sort((a, b) => b.score - a.score);

  const map = new Map<string, number>();
  scored.forEach((row, index) => {
    const prev = scored[index - 1];
    const rank =
      prev && prev.score === row.score ? map.get(prev.key)! : index + 1;
    map.set(row.key, rank);
  });
  return map;
}

/** Competition ranking computed independently within each group. */
export function buildGroupedCompetitionRankMap<T>(
  items: readonly T[],
  getKey: (item: T) => string,
  getGroup: (item: T) => string | null | undefined,
  getScore: (item: T) => number | null | undefined
): Map<string, number> {
  const byGroup = new Map<string, T[]>();
  for (const item of items) {
    const group = getGroup(item);
    if (!group) continue;
    const list = byGroup.get(group) ?? [];
    list.push(item);
    byGroup.set(group, list);
  }

  const map = new Map<string, number>();
  for (const list of byGroup.values()) {
    for (const [key, rank] of buildCompetitionRankMap(list, getKey, getScore)) {
      map.set(key, rank);
    }
  }
  return map;
}

/**
 * TanStack `sortingFn` helper: compares two scores ascending, but keeps rows
 * without a score at the bottom in both directions. TanStack negates the
 * result for descending sorts, so `desc` pre-compensates for missing values.
 */
export function compareScoresMissingLast(
  a: number | null | undefined,
  b: number | null | undefined,
  desc: boolean
): number {
  const aMissing = a == null || Number.isNaN(a);
  const bMissing = b == null || Number.isNaN(b);
  if (aMissing && bMissing) return 0;
  if (aMissing) return desc ? -1 : 1;
  if (bMissing) return desc ? 1 : -1;
  return a - b;
}
