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

/** Sanity `siteFiles` field name for each downloadable file. */
export type SiteFileSlot =
  | "report2026"
  | "report2026Es"
  | "report2026Fr"
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
  /** Hosting env override (DOWNLOAD_*_PATH); omitted for files that have none. */
  envVar?: string;
  repoPath: string;
  filename: string;
  mimeType: string;
};

/**
 * Translated editions of the 2026 report, keyed by language. Files live in
 * public/downloads and can each be replaced via the Sanity `siteFiles`
 * document. English can also be overridden via DOWNLOAD_SECOND_REPORT_PATH.
 *
 * NOTE: the ES/FR filenames are pending confirmation from the GIRAI team —
 * update them here (and rename the files in public/downloads) if they change.
 */
export const REPORT_2026_LANGUAGE_FILES: Record<
  ReportLanguage,
  { label: string; filename: string; slot: SiteFileSlot }
> = {
  en: { label: "English", filename: "Global-Index-on-Responsible-AI-2026.pdf", slot: "report2026" },
  es: { label: "Español", filename: "Indice-Global-de-IA-Responsable-2026.pdf", slot: "report2026Es" },
  fr: { label: "Français", filename: "Indice-mondial-de-l-IA-responsable-2026.pdf", slot: "report2026Fr" },
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

const ASSETS: Record<DownloadAssetType, Record<DownloadEdition, AssetDefinition>> = {
  report: {
    first: { slot: "report2024", envVar: "DOWNLOAD_FIRST_REPORT_PATH", repoPath: "/downloads/GIRAI-2024-report.pdf", filename: "GIRAI-2024-report.pdf", mimeType: PDF },
    second: { slot: "report2026", envVar: "DOWNLOAD_SECOND_REPORT_PATH", repoPath: `/downloads/${REPORT_2026_LANGUAGE_FILES.en.filename}`, filename: REPORT_2026_LANGUAGE_FILES.en.filename, mimeType: PDF },
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

/** Picks the asset definition, swapping in the translated 2026 report when a non-English language is chosen. */
function getAssetDefinition(
  edition: DownloadEdition,
  assetType: DownloadAssetType,
  language?: ReportLanguage
): AssetDefinition {
  if (language && language !== "en" && hasLanguageChoice(edition, assetType)) {
    const { filename, slot } = REPORT_2026_LANGUAGE_FILES[language];
    return { slot, repoPath: `/downloads/${filename}`, filename, mimeType: PDF };
  }
  return ASSETS[assetType][edition];
}

export function getSiteFileSlot(
  edition: DownloadEdition,
  assetType: DownloadAssetType,
  language?: ReportLanguage
): SiteFileSlot {
  return getAssetDefinition(edition, assetType, language).slot;
}

export type DownloadAssetOptions = {
  /** Report language (2026 report only; ignored elsewhere). */
  language?: ReportLanguage;
  /** Files uploaded to the Sanity `siteFiles` singleton. */
  overrides?: SiteFileOverrides | null;
};

/** Adds Sanity's `dl` param so the CDN serves the file as an attachment with our filename. */
function withDownloadName(url: string, filename: string): string {
  const u = new URL(url);
  u.searchParams.set("dl", filename);
  return u.toString();
}

/**
 * Maps edition + asset type (+ report language) to a downloadable file. Resolution order:
 *   1. a file uploaded to the Sanity `siteFiles` singleton (pass `overrides`),
 *   2. the DOWNLOAD_*_PATH hosting env override (where one exists),
 *   3. the committed file in public/downloads.
 */
export function getDownloadAsset(
  edition: DownloadEdition,
  assetType: DownloadAssetType,
  { language, overrides }: DownloadAssetOptions = {}
): DownloadAsset {
  const def = getAssetDefinition(edition, assetType, language);
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
  const envPath =
    def.envVar && !ENV_DISABLED.has(def.envVar) ? process.env[def.envVar] : undefined;
  if (envPath) {
    return { path: envPath, filename: def.filename, mimeType: def.mimeType, source: "env" };
  }
  return { path: def.repoPath, filename: def.filename, mimeType: def.mimeType, source: "repo" };
}

export function getPublicDownloadUrl(
  edition: DownloadEdition,
  assetType: DownloadAssetType,
  options: DownloadAssetOptions = {}
): string {
  const { language } = options;
  const asset = getDownloadAsset(edition, assetType, options);
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
