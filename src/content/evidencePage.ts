import { sanityFetch } from "../../sanity/lib/fetch";
import { evidencePageQuery } from "../../sanity/lib/queries";
import { evidenceDefaults, type EvidenceContent } from "./evidence.defaults";
import { str, strings, type DeepPartial } from "./_merge";

export const EVIDENCE_PAGE_TAG = "evidencePage";

export async function getEvidencePageContent(): Promise<EvidenceContent> {
  let data: DeepPartial<EvidenceContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<EvidenceContent> | null>({
      query: evidencePageQuery,
      tags: [EVIDENCE_PAGE_TAG],
    });
  } catch {
    data = null;
  }

  const d = evidenceDefaults;
  if (!data) return d;

  return {
    heroTitleLead: str(data.heroTitleLead, d.heroTitleLead),
    heroTitleAccent: str(data.heroTitleAccent, d.heroTitleAccent),
    heroSubtitle: str(data.heroSubtitle, d.heroSubtitle),
    heroStatLabels: strings(data.heroStatLabels, d.heroStatLabels),
    pathwayHeading: str(data.pathwayHeading, d.pathwayHeading),
    pathwaySubtitle: str(data.pathwaySubtitle, d.pathwaySubtitle),
    seoTitle: str(data.seoTitle, d.seoTitle),
    seoDescription: str(data.seoDescription, d.seoDescription),
  };
}
