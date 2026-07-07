import { cache } from "react";
import { sanityFetch } from "../../sanity/lib/fetch";
import {
  indicatorPageBySlugQuery,
  indicatorNameBySlugQuery,
  indicatorNamesQuery,
} from "../../sanity/lib/queries";
import {
  getIndicatorPageCopy,
  getIndicatorBackgroundRelevance,
  type IndicatorParagraph,
} from "@/lib/indicator-copy";
import { img, str } from "./_merge";
import type { SanityImage } from "./about.defaults";
import type { PortableBlock } from "./updates";

export const INDICATOR_PAGE_TAG = "indicatorPage";

/** Resolved copy for one indicator detail page. Background/Relevance are Portable Text. */
export type IndicatorPageContent = {
  name: string;
  heroImage: SanityImage;
  heroLead: string;
  introPrimary: string;
  introSecondary: string;
  background: PortableBlock[];
  relevance: PortableBlock[];
};

type IndicatorPageDoc = {
  title?: string;
  heroImage?: SanityImage | null;
  heroLead?: string;
  introPrimary?: string;
  introSecondary?: string;
  background?: PortableBlock[];
  relevance?: PortableBlock[];
};

const hasBlocks = (value: unknown): value is PortableBlock[] =>
  Array.isArray(value) && value.length > 0;

/**
 * Convert the code-default `IndicatorParagraph[]` (inline text/link segments)
 * into Portable Text blocks, so the page renders a single format regardless of
 * whether the copy comes from Sanity or the fallback. Keys are derived from
 * indices to stay deterministic across renders.
 */
export function segmentsToPortable(
  paragraphs: IndicatorParagraph[]
): PortableBlock[] {
  return paragraphs.map((segments, pIdx) => {
    const markDefs: { _key: string; _type: "link"; href: string }[] = [];
    const children = segments.map((seg, sIdx) => {
      const marks: string[] = [];
      if (seg.href) {
        const linkKey = `l-${pIdx}-${sIdx}`;
        markDefs.push({ _key: linkKey, _type: "link", href: seg.href });
        marks.push(linkKey);
      }
      return {
        _key: `s-${pIdx}-${sIdx}`,
        _type: "span",
        text: seg.text,
        marks,
      };
    });
    return {
      _key: `b-${pIdx}`,
      _type: "block",
      style: "normal",
      markDefs,
      children,
    };
  });
}

/**
 * Editorial copy for `/indicators/[slug]`, overlaid from the `indicatorPage`
 * Sanity collection on top of the code defaults (src/lib/indicator-copy.ts).
 * Falls back per-field when Sanity is unreachable or a field is empty.
 */
export async function getIndicatorPageContent(
  slug: string,
  name: string
): Promise<IndicatorPageContent> {
  const copy = getIndicatorPageCopy(slug);
  const { background, relevance } = getIndicatorBackgroundRelevance(slug, name);
  const fallback: IndicatorPageContent = {
    name,
    heroImage: { url: copy.heroImage, alt: null },
    heroLead: copy.heroLead,
    introPrimary: copy.introPrimary,
    introSecondary: copy.introSecondary,
    background: segmentsToPortable(background),
    relevance: segmentsToPortable(relevance),
  };

  let doc: IndicatorPageDoc | null = null;
  try {
    doc = await sanityFetch<IndicatorPageDoc | null>({
      query: indicatorPageBySlugQuery,
      params: { slug },
      tags: [INDICATOR_PAGE_TAG],
    });
  } catch {
    doc = null;
  }
  if (!doc) return fallback;

  return {
    name: str(doc.title, fallback.name),
    heroImage: img(doc.heroImage, fallback.heroImage),
    heroLead: str(doc.heroLead, fallback.heroLead),
    introPrimary: str(doc.introPrimary, fallback.introPrimary),
    introSecondary: str(doc.introSecondary, fallback.introSecondary),
    background: hasBlocks(doc.background) ? doc.background : fallback.background,
    relevance: hasBlocks(doc.relevance) ? doc.relevance : fallback.relevance,
  };
}

/**
 * Resolve just the indicator's display name (Sanity `title`, falling back to the
 * code-defined name). A lightweight query for `generateMetadata`, so the page
 * title reflects a Studio rename without fetching the full page copy.
 */
export async function getIndicatorName(
  slug: string,
  name: string
): Promise<string> {
  try {
    const title = await sanityFetch<string | null>({
      query: indicatorNameBySlugQuery,
      params: { slug },
      tags: [INDICATOR_PAGE_TAG],
    });
    return str(title, name);
  } catch {
    return name;
  }
}

/**
 * All Studio-edited indicator names as a `{ slug: title }` map, for surfaces
 * that list several indicators at once (e.g. the header Explore menu). Only
 * includes docs with a non-empty `title`; callers fall back to the code name
 * for any slug not present. Returns `{}` when Sanity is unreachable.
 */
export const getIndicatorNames = cache(
  async (): Promise<Record<string, string>> => {
    try {
      const rows = await sanityFetch<
        { slug?: string; title?: string }[] | null
      >({
        query: indicatorNamesQuery,
        tags: [INDICATOR_PAGE_TAG],
      });
      const map: Record<string, string> = {};
      for (const row of rows ?? []) {
        if (row?.slug && typeof row.title === "string" && row.title.trim()) {
          map[row.slug] = row.title.trim();
        }
      }
      return map;
    } catch {
      return {};
    }
  }
);
