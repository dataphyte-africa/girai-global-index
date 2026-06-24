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

type DownloadAsset = {
  filename: string;
  /** Server-side path relative to project root, or public URL path */
  path: string;
  mimeType: string;
};

const PUBLIC_DOWNLOADS = {
  firstReport: process.env.DOWNLOAD_FIRST_REPORT_PATH ?? "/downloads/GIRAI-2024-report.pdf",
  secondReport: process.env.DOWNLOAD_SECOND_REPORT_PATH ?? "/downloads/GIRAI-2026-report.pdf",
  firstData: process.env.DOWNLOAD_FIRST_DATA_PATH ?? "/downloads/GIRAI_2024_dataset.xlsx",
  secondData: process.env.DOWNLOAD_SECOND_DATA_PATH ?? "/downloads/GIRAI_2026_dataset.xlsx",
  methodology:
    process.env.DOWNLOAD_METHODOLOGY_PATH ?? "/downloads/GIRAI-methodology.pdf",
};

/** Maps edition + asset type to downloadable files. Paths can be swapped via env vars. */
export function getDownloadAsset(
  edition: DownloadEdition,
  assetType: DownloadAssetType
): DownloadAsset {
  if (assetType === "methodology") {
    return {
      path: PUBLIC_DOWNLOADS.methodology,
      filename: "GIRAI-methodology.pdf",
      mimeType: "application/pdf",
    };
  }

  if (assetType === "data") {
    return edition === "first"
      ? {
          path: PUBLIC_DOWNLOADS.firstData,
          filename: "GIRAI_2024_dataset.xlsx",
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        }
      : {
          path: PUBLIC_DOWNLOADS.secondData,
          filename: "GIRAI_2026_dataset.xlsx",
          mimeType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        };
  }

  return edition === "first"
    ? {
        path: PUBLIC_DOWNLOADS.firstReport,
        filename: "GIRAI-2024-report.pdf",
        mimeType: "application/pdf",
      }
    : {
        path: PUBLIC_DOWNLOADS.secondReport,
        filename: "GIRAI-2026-report.pdf",
        mimeType: "application/pdf",
      };
}

export function getPublicDownloadUrl(
  edition: DownloadEdition,
  assetType: DownloadAssetType
): string {
  const asset = getDownloadAsset(edition, assetType);
  if (asset.path.startsWith("/")) {
    return asset.path;
  }
  return `/api/data-download/file?edition=${edition}&type=${assetType}`;
}
