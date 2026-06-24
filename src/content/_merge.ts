import type { Card, Cta, SanityImage } from "./about.defaults";
import type { Stat } from "./takeaways.defaults";

export type DeepPartial<T> = T extends object
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : T;

export function str(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim().length > 0 ? value : fallback;
}

export function img(
  value: DeepPartial<SanityImage> | null | undefined,
  fallback: SanityImage
): SanityImage {
  if (value && typeof value.url === "string" && value.url.length > 0) {
    return {
      url: value.url,
      alt: typeof value.alt === "string" ? value.alt : fallback.alt,
    };
  }
  return fallback;
}

export function cta(value: DeepPartial<Cta> | null | undefined, fallback: Cta): Cta {
  return {
    label: str(value?.label, fallback.label),
    href: str(value?.href, fallback.href),
  };
}

export function ctas(value: DeepPartial<Cta[]> | undefined, fallback: Cta[]): Cta[] {
  return Array.isArray(value) && value.length > 0
    ? value.map((item, i) => cta(item, fallback[i] ?? { label: "", href: "" }))
    : fallback;
}

export function cards(value: DeepPartial<Card[]> | undefined, fallback: Card[]): Card[] {
  return Array.isArray(value) && value.length > 0
    ? value.map((c, i) => ({
        title: str(c?.title, fallback[i]?.title ?? ""),
        description: str(c?.description, fallback[i]?.description ?? ""),
      }))
    : fallback;
}

export function stats(value: DeepPartial<Stat[]> | undefined, fallback: Stat[]): Stat[] {
  return Array.isArray(value) && value.length > 0
    ? value.map((s, i) => ({
        label: str(s?.label, fallback[i]?.label ?? ""),
        value: str(s?.value, fallback[i]?.value ?? ""),
      }))
    : fallback;
}

export function strings(value: unknown, fallback: string[]): string[] {
  return Array.isArray(value) && value.length > 0
    ? value.filter((n): n is string => typeof n === "string" && n.length > 0)
    : fallback;
}
