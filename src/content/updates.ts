import { sanityFetch } from "../../sanity/lib/fetch";
import {
  updatesListQuery,
  updateBySlugQuery,
  updateSlugsQuery,
} from "../../sanity/lib/queries";

export const UPDATES_TAG = "updatePost";

/** Portable Text block. Structural type — assignable to @portabletext/react. */
export type PortableBlock = {
  _type: string;
  _key?: string;
  [key: string]: unknown;
};

export type UpdateImage = { url: string | null; alt: string | null } | null;

export type UpdatePost = {
  _id: string;
  title: string;
  slug: string;
  category: string;
  publishedAt: string;
  author: string | null;
  featured: boolean;
  excerpt: string | null;
  coverImage: UpdateImage;
};

export type UpdatePostDetail = UpdatePost & {
  body: PortableBlock[] | null;
};

/** All published updates, newest first. Empty array when Sanity is unreachable. */
export async function getUpdates(): Promise<UpdatePost[]> {
  try {
    const data = await sanityFetch<UpdatePost[] | null>({
      query: updatesListQuery,
      tags: [UPDATES_TAG],
    });
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function getUpdateBySlug(
  slug: string
): Promise<UpdatePostDetail | null> {
  try {
    return await sanityFetch<UpdatePostDetail | null>({
      query: updateBySlugQuery,
      params: { slug },
      tags: [UPDATES_TAG],
    });
  } catch {
    return null;
  }
}

export async function getUpdateSlugs(): Promise<string[]> {
  try {
    const data = await sanityFetch<string[] | null>({
      query: updateSlugsQuery,
      tags: [UPDATES_TAG],
    });
    return Array.isArray(data) ? data.filter(Boolean) : [];
  } catch {
    return [];
  }
}
