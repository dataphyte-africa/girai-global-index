import "server-only";

import { draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";

import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;

/**
 * Draft-Mode-aware Sanity fetch.
 *
 * - Published mode: served from the CDN and tagged for on-demand revalidation.
 * - Draft mode (Presentation tool): reads drafts with the viewer token.
 *
 * Pass `tags` so the `/api/revalidate` webhook can invalidate exactly the
 * affected documents when the client publishes.
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
    next: {
      revalidate: isDraftMode ? 0 : false,
      tags,
    },
  });
}
