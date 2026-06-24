import { regionToSlug } from "@/lib/regions";
import type { GiraiSource, GiraiSourceKind } from "./types";

export function countrySource(iso3: string, name: string): GiraiSource {
  return {
    label: `${name} country profile`,
    href: `/countries/${iso3.toUpperCase()}`,
    kind: "country",
  };
}

export function indicatorSource(slug: string, name: string): GiraiSource {
  return {
    label: name,
    href: `/indicators/${slug}`,
    kind: "indicator",
  };
}

export function evidenceSource(id: string, title: string): GiraiSource {
  return {
    label: title.length > 60 ? `${title.slice(0, 57)}…` : title,
    href: `/evidence/${encodeURIComponent(id)}`,
    kind: "evidence",
  };
}

export function regionSource(region: string): GiraiSource {
  return {
    label: `${region} region overview`,
    href: `/regions/${regionToSlug(region)}`,
    kind: "region",
  };
}

export function dimensionSource(slug: string, name: string): GiraiSource {
  return {
    label: name,
    href: `/dimensions/${slug}`,
    kind: "dimension",
  };
}

export function reportSource(label: string, href = "/methodology"): GiraiSource {
  return { label, href, kind: "report" };
}

export function mergeSources(...groups: GiraiSource[][]): GiraiSource[] {
  const seen = new Set<string>();
  const out: GiraiSource[] = [];
  for (const group of groups) {
    for (const source of group) {
      const key = `${source.kind}:${source.href}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(source);
    }
  }
  return out;
}

export type { GiraiSourceKind };
