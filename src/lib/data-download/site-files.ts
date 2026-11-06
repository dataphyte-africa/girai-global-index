import "server-only";

import { sanityFetch } from "../../../sanity/lib/fetch";
import { siteFilesQuery } from "../../../sanity/lib/queries";
import {
  getDownloadAsset,
  type DownloadAsset,
  type SiteFileOverrides,
} from "./config";
import type { DownloadAssetType, DownloadEdition, ReportLanguage } from "./types";

export const SITE_FILES_TAG = "siteFiles";

/** Files uploaded to the Sanity `siteFiles` singleton. Never throws: on error, repo/env fallbacks apply. */
export async function getSiteFileOverrides(): Promise<SiteFileOverrides | null> {
  try {
    return await sanityFetch<SiteFileOverrides | null>({
      query: siteFilesQuery,
      tags: [SITE_FILES_TAG],
    });
  } catch (error) {
    console.error("[site-files] Sanity fetch failed, using fallbacks:", error);
    return null;
  }
}

/** Resolves a download: Sanity upload → DOWNLOAD_*_PATH override → public/downloads file. */
export async function resolveDownloadAsset(
  edition: DownloadEdition,
  assetType: DownloadAssetType,
  language?: ReportLanguage
): Promise<DownloadAsset & { url: string }> {
  const overrides = await getSiteFileOverrides();
  const asset = getDownloadAsset(edition, assetType, { language, overrides });
  return { ...asset, url: asset.path };
}
