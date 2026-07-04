import "server-only";

import { draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";

import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;

/**
 * Draft-Mode-aware Sanity fetch.
 *
 * Published reads skip both Next.js fetch cache and the Sanity CDN so CMS edits
 * appear on the next request once pages are rendered dynamically (root layout
 * `export const dynamic = 'force-dynamic'`). Tags are kept for hosts where on-demand
 * revalidation works (e.g. Vercel).
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
}): Promise<QueryResponse> {
  const isDraftMode = (await draftMode()).isEnabled;

  if (isDraftMode && !token) {
    throw new Error(
      "The `SANITY_API_READ_TOKEN` environment variable is required to use Draft Mode."
    );
  }

  return client.fetch<QueryResponse>(query, params, {
    ...(isDraftMode && {
      token,
      perspective: "drafts",
      useCdn: false,
    }),
    ...(!isDraftMode && {
      useCdn: false,
    }),
    next: {
      revalidate: 0,
      tags,
    },
  });
}
