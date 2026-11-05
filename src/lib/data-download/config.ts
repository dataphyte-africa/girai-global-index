import type {
  DownloadAssetType,
  DownloadEdition,
  ReportLanguage,
} from "./types";

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
  secondReport: process.env.DOWNLOAD_SECOND_REPORT_PATH ?? "/downloads/Global-Index-on-Responsible-AI-2026.pdf",
  firstData: process.env.DOWNLOAD_FIRST_DATA_PATH ?? "/downloads/GIRAI_2024_dataset.xlsx",
  secondData: process.env.DOWNLOAD_SECOND_DATA_PATH ?? "/downloads/GIRAI_2026_dataset.xlsx",
  firstMethodology:
    process.env.DOWNLOAD_FIRST_METHODOLOGY_PATH ?? "/downloads/GIRAI-2024-methodology.pdf",
  secondMethodology:
    process.env.DOWNLOAD_SECOND_METHODOLOGY_PATH ?? "/downloads/GIRAI-2026-methodology.pdf",
};

/**
 * Translated editions of the 2026 report, keyed by language. Files live in
 * public/downloads. English can still be overridden via
 * DOWNLOAD_SECOND_REPORT_PATH; ES/FR are always served from the repo.
 *
 * NOTE: the ES/FR filenames are pending confirmation from the GIRAI team —
 * update them here (and rename the files in public/downloads) if they change.
 */
export const REPORT_2026_LANGUAGE_FILES: Record<
  ReportLanguage,
  { label: string; filename: string }
> = {
  en: { label: "English", filename: "Global-Index-on-Responsible-AI-2026.pdf" },
  es: { label: "Español", filename: "Indice-Global-de-IA-Responsable-2026.pdf" },
  fr: { label: "Français", filename: "Indice-mondial-de-l-IA-responsable-2026.pdf" },
};

export const REPORT_LANGUAGES = Object.keys(
  REPORT_2026_LANGUAGE_FILES
) as ReportLanguage[];

export function isReportLanguage(value: unknown): value is ReportLanguage {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(REPORT_2026_LANGUAGE_FILES, value)
  );
}

/** Only the 2026 report is available in more than one language. */
export function hasLanguageChoice(
  edition: DownloadEdition | undefined,
  assetType: DownloadAssetType
): boolean {
  return assetType === "report" && edition === "second";
}

/** Maps edition + asset type (+ report language) to downloadable files. Paths can be swapped via env vars. */
export function getDownloadAsset(
  edition: DownloadEdition,
  assetType: DownloadAssetType,
  language?: ReportLanguage
): DownloadAsset {
  if (assetType === "methodology") {
    return edition === "first"
      ? {
          path: PUBLIC_DOWNLOADS.firstMethodology,
          filename: "GIRAI-2024-methodology.pdf",
          mimeType: "application/pdf",
        }
      : {
          path: PUBLIC_DOWNLOADS.secondMethodology,
          filename: "GIRAI-2026-methodology.pdf",
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

  if (edition === "first") {
    return {
      path: PUBLIC_DOWNLOADS.firstReport,
      filename: "GIRAI-2024-report.pdf",
      mimeType: "application/pdf",
    };
  }

  if (language && language !== "en") {
    const { filename } = REPORT_2026_LANGUAGE_FILES[language];
    return {
      path: `/downloads/${filename}`,
      filename,
      mimeType: "application/pdf",
    };
  }

  return {
    path: PUBLIC_DOWNLOADS.secondReport,
    filename: REPORT_2026_LANGUAGE_FILES.en.filename,
    mimeType: "application/pdf",
  };
}

export function getPublicDownloadUrl(
  edition: DownloadEdition,
  assetType: DownloadAssetType,
  language?: ReportLanguage
): string {
  const asset = getDownloadAsset(edition, assetType, language);
  if (asset.path.startsWith("http://") || asset.path.startsWith("https://")) {
    return asset.path;
  }
  if (asset.path.startsWith("/")) {
    return asset.path;
  }
  return `/api/data-download/file?edition=${edition}&type=${assetType}${
    language ? `&lang=${language}` : ""
  }`;
}
