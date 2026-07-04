import { sanityFetch } from "../../sanity/lib/fetch";
import { reportDownloadQuery } from "../../sanity/lib/queries";
import {
  reportDownloadDefaults,
  type ReportDownloadContent,
} from "./reportDownload.defaults";
import { img, str, type DeepPartial } from "./_merge";

export const REPORT_DOWNLOAD_TAG = "reportDownload";

/**
 * Copy for the reusable "Download the report" section (Home, Countries,
 * Regions, Takeaways). Shared singleton — edit once, applies everywhere.
 */
export async function getReportDownloadContent(): Promise<ReportDownloadContent> {
  let data: DeepPartial<ReportDownloadContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<ReportDownloadContent> | null>({
      query: reportDownloadQuery,
      tags: [REPORT_DOWNLOAD_TAG],
    });
  } catch {
    data = null;
  }

  const d = reportDownloadDefaults;
  if (!data) return d;

  return {
    badge: str(data.badge, d.badge),
    headingLead: str(data.headingLead, d.headingLead),
    headingAccent: str(data.headingAccent, d.headingAccent),
    body: str(data.body, d.body),
    coverImage: img(data.coverImage, d.coverImage),
    primaryCtaLabel: str(data.primaryCtaLabel, d.primaryCtaLabel),
    secondaryCtaLabel: str(data.secondaryCtaLabel, d.secondaryCtaLabel),
  };
}
