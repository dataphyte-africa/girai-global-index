import type { DownloadAssetType, DownloadEdition } from "./types";

export const DOWNLOAD_REASONS = [
  { value: "academic-research", label: "Academic research" },
  { value: "journalism-media", label: "Journalism / media" },
  { value: "policy-development", label: "Policy development" },
  { value: "civil-society", label: "Civil society advocacy" },
  { value: "private-sector", label: "Private sector / business" },
  { value: "government", label: "Government" },
  { value: "personal-interest", label: "Personal interest" },
  { value: "other", label: "Other" },
] as const;

export const DATASET_2026_FILENAME = "GIRAI_2026_dataset.xlsx";
export const DATASET_2026_PUBLIC_PATH = `/downloads/${DATASET_2026_FILENAME}`;

/**
 * Env overrides that are intentionally ignored. The 2026 dataset is served from
 * the repo copy (kept in sync with src/data/2026/GIRAI_dataset.xlsx by
 * `pnpm sync:downloads`), so DOWNLOAD_SECOND_DATA_PATH (old GCS URL) is not read.
 */
const ENV_DISABLED = new Set<string>(["DOWNLOAD_SECOND_DATA_PATH"]);

export type DownloadAsset = {
  filename: string;
  /** Server-side path relative to project root, or public URL path */
  path: string;
  mimeType: string;
  /** Where the path came from: Sanity upload, hosting env override, or repo file. */
  source: "sanity" | "env" | "repo";
};

/** Sanity `siteFiles` field name for each edition + asset type. */
export type SiteFileSlot =
  | "report2026"
  | "report2024"
  | "methodology2026"
  | "methodology2024"
  | "dataset2026"
  | "dataset2024";

/** A file uploaded to the Sanity `siteFiles` singleton (already resolved to a URL). */
export type SiteFileOverride = { url: string; filename?: string | null };
export type SiteFileOverrides = Partial<Record<SiteFileSlot, SiteFileOverride | null>>;

const PDF = "application/pdf";
const XLSX = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

type AssetDefinition = {
  slot: SiteFileSlot;
  envVar: string;
  repoPath: string;
  filename: string;
  mimeType: string;
};

const ASSETS: Record<DownloadAssetType, Record<DownloadEdition, AssetDefinition>> = {
  report: {
    first: { slot: "report2024", envVar: "DOWNLOAD_FIRST_REPORT_PATH", repoPath: "/downloads/GIRAI-2024-report.pdf", filename: "GIRAI-2024-report.pdf", mimeType: PDF },
    second: { slot: "report2026", envVar: "DOWNLOAD_SECOND_REPORT_PATH", repoPath: "/downloads/Global-Index-on-Responsible-AI-2026.pdf", filename: "Global-Index-on-Responsible-AI-2026.pdf", mimeType: PDF },
  },
  data: {
    first: { slot: "dataset2024", envVar: "DOWNLOAD_FIRST_DATA_PATH", repoPath: "/downloads/GIRAI_2024_dataset.xlsx", filename: "GIRAI_2024_dataset.xlsx", mimeType: XLSX },
    second: { slot: "dataset2026", envVar: "DOWNLOAD_SECOND_DATA_PATH", repoPath: DATASET_2026_PUBLIC_PATH, filename: DATASET_2026_FILENAME, mimeType: XLSX },
  },
  methodology: {
    first: { slot: "methodology2024", envVar: "DOWNLOAD_FIRST_METHODOLOGY_PATH", repoPath: "/downloads/GIRAI-2024-methodology.pdf", filename: "GIRAI-2024-methodology.pdf", mimeType: PDF },
    second: { slot: "methodology2026", envVar: "DOWNLOAD_SECOND_METHODOLOGY_PATH", repoPath: "/downloads/GIRAI-2026-methodology.pdf", filename: "GIRAI-2026-methodology.pdf", mimeType: PDF },
  },
};

export function getSiteFileSlot(
  edition: DownloadEdition,
  assetType: DownloadAssetType
): SiteFileSlot {
  return ASSETS[assetType][edition].slot;
}

/** Adds Sanity's `dl` param so the CDN serves the file as an attachment with our filename. */
function withDownloadName(url: string, filename: string): string {
  const u = new URL(url);
  u.searchParams.set("dl", filename);
  return u.toString();
}

/**
 * Maps edition + asset type to a downloadable file. Resolution order:
 *   1. a file uploaded to the Sanity `siteFiles` singleton (pass `overrides`),
 *   2. the DOWNLOAD_*_PATH hosting env override,
 *   3. the committed file in public/downloads.
 */
export function getDownloadAsset(
  edition: DownloadEdition,
  assetType: DownloadAssetType,
  overrides?: SiteFileOverrides | null
): DownloadAsset {
  const def = ASSETS[assetType][edition];
  const uploaded = overrides?.[def.slot];
  if (uploaded?.url) {
    const filename = uploaded.filename?.trim() || def.filename;
    return {
      path: withDownloadName(uploaded.url, filename),
      filename,
      mimeType: def.mimeType,
      source: "sanity",
    };
  }
  const envPath = ENV_DISABLED.has(def.envVar) ? undefined : process.env[def.envVar];
  if (envPath) {
    return { path: envPath, filename: def.filename, mimeType: def.mimeType, source: "env" };
  }
  return { path: def.repoPath, filename: def.filename, mimeType: def.mimeType, source: "repo" };
}

export function getPublicDownloadUrl(
  edition: DownloadEdition,
  assetType: DownloadAssetType,
  overrides?: SiteFileOverrides | null
): string {
  const asset = getDownloadAsset(edition, assetType, overrides);
  if (asset.path.startsWith("http://") || asset.path.startsWith("https://")) {
    return asset.path;
  }
  if (asset.path.startsWith("/")) {
    return asset.path;
  }
  return `/api/data-download/file?edition=${edition}&type=${assetType}`;
}
