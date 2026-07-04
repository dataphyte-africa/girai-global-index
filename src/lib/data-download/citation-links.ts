import type { DownloadAssetType, DownloadEdition } from "./types";

const EDITION_YEARS: Record<DownloadEdition, string> = {
  first: "2024",
  second: "2026",
};

const YEAR_TO_EDITION: Record<string, DownloadEdition> = {
  "2024": "first",
  "2026": "second",
};

export type CitationDownloadTarget = {
  assetType: DownloadAssetType;
  edition?: DownloadEdition;
};

export type CitationLinkOptions = {
  /** Optional tag for tracking (e.g. paper id, campaign name). */
  ref?: string;
  /** Overrides the default source label sent to download analytics. */
  source?: string;
  /** Site origin, e.g. https://global.responsible.ai */
  origin?: string;
};

export function editionToYear(edition: DownloadEdition): string {
  return EDITION_YEARS[edition];
}

export function yearToEdition(year: string): DownloadEdition | null {
  return YEAR_TO_EDITION[year] ?? null;
}

export function getCitationDownloadPath(
  assetType: DownloadAssetType,
  edition?: DownloadEdition
): string {
  if (assetType === "methodology") {
    return "/download/methodology";
  }

  if (!edition) {
    throw new Error("Edition is required for report and data downloads");
  }

  return `/download/${assetType}/${editionToYear(edition)}`;
}

export function getCitationDownloadUrl(
  assetType: DownloadAssetType,
  edition?: DownloadEdition,
  options: CitationLinkOptions = {}
): string {
  const path = getCitationDownloadPath(assetType, edition);
  const params = new URLSearchParams();

  if (options.ref) {
    params.set("ref", options.ref);
  }
  if (options.source) {
    params.set("source", options.source);
  }

  const query = params.toString();
  const origin =
    options.origin ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
      : "");

  return `${origin}${path}${query ? `?${query}` : ""}`;
}

/** Builds a stable analytics source string from a citation landing URL. */
export function buildCitationSource(
  target: CitationDownloadTarget,
  searchParams: URLSearchParams
): string {
  const path =
    target.assetType === "methodology"
      ? "methodology"
      : `${target.assetType}/${target.edition ? editionToYear(target.edition) : "unknown"}`;

  const ref = searchParams.get("ref")?.trim();
  const source = searchParams.get("source")?.trim();
  const utmSource = searchParams.get("utm_source")?.trim();
  const utmCampaign = searchParams.get("utm_campaign")?.trim();

  const parts = ["citation", path];

  if (ref) parts.push(`ref:${ref}`);
  if (source) parts.push(`source:${source}`);
  if (utmSource) parts.push(`utm:${utmSource}`);
  if (utmCampaign) parts.push(`campaign:${utmCampaign}`);

  return parts.join(":");
}

export function parseDownloadRoute(
  assetType: string,
  year?: string
): CitationDownloadTarget | null {
  if (assetType === "methodology" && !year) {
    return { assetType: "methodology" };
  }

  if (assetType !== "report" && assetType !== "data") {
    return null;
  }

  if (!year) return null;

  const edition = yearToEdition(year);
  if (!edition) return null;

  return { assetType, edition };
}

export const CITATION_DOWNLOAD_TARGETS: Array<{
  label: string;
  assetType: DownloadAssetType;
  edition?: DownloadEdition;
}> = [
  { label: "2026 Report", assetType: "report", edition: "second" },
  { label: "2024 Report", assetType: "report", edition: "first" },
  { label: "2026 Dataset", assetType: "data", edition: "second" },
  { label: "2024 Dataset", assetType: "data", edition: "first" },
  { label: "Methodology", assetType: "methodology" },
];
