import type { UpdatePost } from "@/content/updates";

/** Categories shown as filter pills on /updates, in design order. */
export const FILTER_CATEGORIES = [
  "Research",
  "Press release",
  "Media coverage",
  "Country research",
  "Policy brief",
  "Methodology update",
] as const;

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function ordinal(day: number): string {
  const rem100 = day % 100;
  if (rem100 >= 11 && rem100 <= 13) return `${day}th`;
  switch (day % 10) {
    case 1:
      return `${day}st`;
    case 2:
      return `${day}nd`;
    case 3:
      return `${day}rd`;
    default:
      return `${day}th`;
  }
}

/** Formats an ISO date as e.g. "May 31st, 2024". */
export function formatUpdateDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return `${MONTHS[date.getMonth()]} ${ordinal(date.getDate())}, ${date.getFullYear()}`;
}

export function updateYear(iso: string | null | undefined): number | null {
  if (!iso) return null;
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date.getFullYear();
}

/** Distinct publish years present in the posts, newest first. */
export function availableYears(posts: UpdatePost[]): number[] {
  const years = new Set<number>();
  for (const post of posts) {
    const year = updateYear(post.publishedAt);
    if (year) years.add(year);
  }
  return [...years].sort((a, b) => b - a);
}

export function updateHref(slug: string): string {
  return `/updates/${slug}`;
}
