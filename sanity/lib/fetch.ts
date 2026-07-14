import "server-only";

import { draftMode } from "next/headers";
import type { QueryParams } from "next-sanity";

import { client } from "./client";

const token = process.env.SANITY_API_READ_TOKEN;

/**
 * Fallback revalidation window (seconds) for published reads.
 *
 * Freshness is normally driven on-demand by the Sanity webhook
 * (src/app/api/revalidate/route.ts), which busts the relevant tags/paths the
 * moment content is published. This time-based window is only a safety net for
 * hosts where that webhook isn't wired.
 */
const PUBLISHED_REVALIDATE_SECONDS = 3600;

/**
 * Draft-Mode-aware Sanity fetch.
 *
 * Draft reads bypass the CDN and all caching so preview always shows the latest
 * edits. Published reads go through the Sanity CDN (the larger, cheaper request
 * pool) and are cached in the Next.js Data Cache, keyed by `tags`; the webhook
 * at src/app/api/revalidate/route.ts invalidates those tags on publish.
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
    ...(isDraftMode
      ? {
          token,
          perspective: "drafts",
          useCdn: false,
        }
      : {
          useCdn: true,
        }),
    next: {
      revalidate: isDraftMode ? 0 : PUBLISHED_REVALIDATE_SECONDS,
      tags,
    },
  });
}
