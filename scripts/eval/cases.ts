/**
 * Eval cases for the GIRAI assistant — "Rankings and scores" suite.
 *
 * Derived from the manual ChatGPT prompt-testing sheet, with every expected
 * figure re-derived from the committed 2026 dataset rather than the published
 * regional briefs. Where the two disagree the dataset wins, because it is what
 * the site and the assistant both serve (see `notes` on the affected cases).
 *
 * Numeric checks accept the value at 0, 1 or 2 decimal places: the site and the
 * assistant render scores to one decimal, so "45.9" is a correct rendering of
 * 45.93 and must not be graded as a miss.
 */

export type Check =
  | { label: string; kind: "number"; value: number }
  | { label: string; kind: "text"; any: string[] }
  | { label: string; kind: "regex"; pattern: string };

export interface EvalCase {
  id: string;
  prompt: string;
  difficulty: "Easy" | "Medium" | "Hard";
  testType: "Factual" | "Reasoning" | "Consistency";
  expected: string;
  /** All must be present for a Full grade. */
  must: Check[];
  /** Any present is a red flag and fails the case. */
  forbid: Check[];
  notes?: string;
}

const n = (label: string, value: number): Check => ({ label, kind: "number", value });
const t = (label: string, ...any: string[]): Check => ({ label, kind: "text", any });
const re = (label: string, pattern: string): Check => ({ label, kind: "regex", pattern });

export const CASES: EvalCase[] = [
  {
    id: "nigeria-score",
    prompt: "What is Nigeria's GIRAI score?",
    difficulty: "Easy",
    testType: "Factual",
    expected: "Nigeria scores 45.93.",
    must: [n("score 45.93", 45.93)],
    forbid: [n("first-edition or brief score 45.87", 45.87)],
    notes:
      "Sheet expected 45.87 from the regional brief; the committed dataset says 45.93 (rank 38, not 39).",
  },
  {
    id: "africa-highest",
    prompt: "Which African country has the highest GIRAI score?",
    difficulty: "Easy",
    testType: "Factual",
    expected: "Nigeria, with a score of 45.93 (ranked 38th globally).",
    must: [t("names Nigeria", "nigeria"), n("score 45.93", 45.93)],
    forbid: [t("wrong leader", "south africa is the highest", "egypt has the highest")],
  },
  {
    id: "latam-leader",
    prompt: "Which country leads the LATAM region, and what is its score?",
    difficulty: "Easy",
    testType: "Factual",
    expected: "Brazil leads LATAM with a score of 63.30 (ranked 11th globally).",
    must: [t("names Brazil", "brazil"), n("score 63.30", 63.3)],
    forbid: [t("wrong leader", "chile leads", "mexico leads")],
  },
  {
    id: "japan-asia-rank",
    prompt: "What is Japan's score and where does it rank in Asia?",
    difficulty: "Easy",
    testType: "Factual",
    expected: "Japan scores 55.66, ranking 2nd in Asia and Oceania and 24th globally.",
    must: [
      n("score 55.66", 55.66),
      t("regional or global rank", "2nd", "second", "24th", "rank 2", "rank 24"),
    ],
    forbid: [t("Singapore claimed top", "singapore ranks 1st", "singapore leads asia")],
  },
  {
    id: "middle-east-second",
    prompt: "Which country ranks 2nd in the middle east?",
    difficulty: "Medium",
    testType: "Factual",
    expected: "Jordan, with a score of 40.46 (49th globally).",
    must: [t("names Jordan", "jordan"), n("score 40.46", 40.46)],
    forbid: [t("wrong country", "south korea", "singapore")],
  },
  {
    id: "global-average",
    prompt: "What is the global average GIRAI score?",
    difficulty: "Easy",
    testType: "Factual",
    expected: "The global average is 35.02.",
    must: [n("average 35.02", 35.02)],
    forbid: [n("first-edition average", 19.78), n("invented average", 44.2)],
    notes:
      "Sheet's expected cell said 34.99 but its own pass criteria said 35.02; the dataset gives 35.0154 → 35.02.",
  },
  {
    id: "lowest-region",
    prompt: "Which region has the lowest average score in the Index?",
    difficulty: "Medium",
    testType: "Factual",
    expected: "Africa, with the lowest average at 21.79, just below the Caribbean (22.42).",
    must: [t("names Africa", "africa"), n("average 21.79", 21.79)],
    forbid: [t("Caribbean called lowest", "caribbean has the lowest", "caribbean is the lowest")],
  },
  {
    id: "chile-score-rank",
    prompt: "What is Chile's GIRAI score and global ranking?",
    difficulty: "Easy",
    testType: "Factual",
    expected: "Chile scores 61.91 and ranks 14th globally.",
    must: [n("score 61.91", 61.91), t("rank 14", "14th", "rank 14", "ranks 14")],
    forbid: [],
  },
  {
    id: "dominican-republic",
    prompt:
      "What is the Dominican Republic's score and rank, and what stands out about it?",
    difficulty: "Medium",
    testType: "Factual",
    expected: "It scores 47.92, ranks 36th globally, and is the clear Caribbean leader.",
    must: [
      n("score 47.92", 47.92),
      t("rank 36", "36th", "rank 36", "ranks 36"),
      t("Caribbean leadership", "caribbean"),
    ],
    forbid: [t("another Caribbean leader", "jamaica leads", "barbados leads")],
  },
  {
    id: "asia-lowest",
    prompt: "Which country is the lowest performer in Asia?",
    difficulty: "Medium",
    testType: "Factual",
    expected: "Afghanistan, with a score of 6.02 (ranked 134th globally).",
    must: [t("names Afghanistan", "afghanistan"), n("score 6.02", 6.02)],
    forbid: [t("wrong country", "myanmar is the lowest", "turkmenistan is the lowest")],
  },
  {
    id: "africa-above-average",
    prompt: "How many African countries score above the global average, and which ones?",
    difficulty: "Medium",
    testType: "Reasoning",
    expected:
      "Seven: Nigeria, Egypt, Kenya, Ghana, Benin, Morocco and Cote d'Ivoire.",
    must: [
      re("count of seven", "\\b(seven|7)\\b"),
      t("Nigeria", "nigeria"),
      t("Egypt", "egypt"),
      t("Kenya", "kenya"),
      t("Ghana", "ghana"),
      t("Benin", "benin"),
      t("Morocco", "morocco"),
      t("Cote d'Ivoire", "ivoire", "ivory coast"),
    ],
    forbid: [re("wrong count", "\\b(six|eight)\\b African countries")],
    notes:
      "Sheet said six and omitted Cote d'Ivoire (35.18), which clears the 35.02 average. The correct answer is seven.",
  },
  {
    id: "egypt-score-rank",
    prompt: "What is Egypt's score and rank?",
    difficulty: "Easy",
    testType: "Factual",
    expected: "Egypt scores 41.26 and ranks 48th globally (North Africa).",
    must: [n("score 41.26", 41.26), t("rank 48", "48th", "rank 48", "ranks 48")],
    forbid: [],
  },
  {
    id: "asia-best-subregion",
    prompt: "Which Asian subregion is the best performing, and what is its average?",
    difficulty: "Medium",
    testType: "Factual",
    expected: "East Asia, with an average score of 42.07.",
    must: [t("names East Asia", "east asia"), n("average 42.07", 42.07)],
    forbid: [t("wrong subregion named best", "south east asia is the best", "south asia is the best")],
  },
  {
    id: "latam-above-average",
    prompt: "Which LATAM subregion scores above the global average?",
    difficulty: "Medium",
    testType: "Reasoning",
    expected:
      "Only South America (42.87). Central America (31.62) and the Caribbean (22.42) fall below it.",
    must: [
      t("names South America", "south america"),
      n("South America average 42.87", 42.87),
      t("exclusivity", "only", "sole", "just south america"),
    ],
    forbid: [
      t(
        "wrongly places another above",
        "central america scores above",
        "caribbean scores above",
        "central america is above the global average",
        "caribbean is above the global average"
      ),
    ],
  },
  {
    id: "brazil-direct",
    prompt: "What is Brazil's GIRAI score?",
    difficulty: "Easy",
    testType: "Consistency",
    expected: "Brazil scores 63.30 (ranked 11th, the highest-placed LATAM country).",
    must: [n("score 63.30", 63.3)],
    forbid: [],
  },
  {
    id: "brazil-conversational",
    prompt: "How did Brazil perform in the index overall?",
    difficulty: "Easy",
    testType: "Consistency",
    expected: "Very strong: score 63.30, ranked 11th globally and the top LATAM country.",
    must: [n("score 63.30", 63.3), t("rank 11", "11th", "rank 11", "ranks 11")],
    forbid: [],
  },
];

/** Cases whose extracted GIRAI score must agree with each other. */
export const CONSISTENCY_PAIRS: [string, string][] = [
  ["brazil-direct", "brazil-conversational"],
];
