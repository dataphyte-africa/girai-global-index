import { sanityFetch } from "../../sanity/lib/fetch";
import { keyFindingsQuery } from "../../sanity/lib/queries";

export const KEY_FINDINGS_TAG = "keyFindings";

/** Portable Text block. Structural type — assignable to @portabletext/react. */
export type PortableBlock = {
  _type: string;
  _key?: string;
  [key: string]: unknown;
};

export type KeyFinding = {
  title: string;
  summary: PortableBlock[] | null;
  body: PortableBlock[] | null;
  brightSpotCountry: string | null;
  brightSpotBody: PortableBlock[] | null;
};

export type KeyFindingsContent = {
  headingAccent: string | null;
  headingTail: string | null;
  subtitle: string | null;
  findings: KeyFinding[];
};

/**
 * Fetches the Key Findings accordion content from Sanity. Returns `null` when
 * Sanity is unreachable or the document has no findings, so callers can fall
 * back to the built-in static takeaways.
 */
export async function getKeyFindings(): Promise<KeyFindingsContent | null> {
  try {
    const data = await sanityFetch<KeyFindingsContent | null>({
      query: keyFindingsQuery,
      tags: [KEY_FINDINGS_TAG],
    });
    if (!data || !Array.isArray(data.findings) || data.findings.length === 0) {
      return null;
    }
    return data;
  } catch {
    return null;
  }
}
