import { sanityFetch } from "../../sanity/lib/fetch";
import { downloadModalQuery } from "../../sanity/lib/queries";
import {
  downloadModalDefaults,
  type DownloadModalContent,
  type DownloadReasonOption,
} from "./downloadModal.defaults";
import { img, str, type DeepPartial } from "./_merge";

export const DOWNLOAD_MODAL_TAG = "downloadModal";

/**
 * Merge reason labels from Sanity while keeping the canonical `value` keys
 * (the backend recognises only the fixed values, so they are never overridden).
 */
function mergeReasons(
  value: DeepPartial<DownloadReasonOption[]> | undefined,
  fallback: DownloadReasonOption[]
): DownloadReasonOption[] {
  if (!Array.isArray(value) || value.length === 0) return fallback;
  const labelByValue = new Map(
    value
      .filter((r): r is DownloadReasonOption => typeof r?.value === "string")
      .map((r) => [r.value, r.label])
  );
  return fallback.map((r) => ({
    value: r.value,
    label: str(labelByValue.get(r.value), r.label),
  }));
}

export async function getDownloadModalContent(): Promise<DownloadModalContent> {
  let data: DeepPartial<DownloadModalContent> | null = null;
  try {
    data = await sanityFetch<DeepPartial<DownloadModalContent> | null>({
      query: downloadModalQuery,
      tags: [DOWNLOAD_MODAL_TAG],
    });
  } catch {
    data = null;
  }

  const d = downloadModalDefaults;
  if (!data) return d;

  return {
    title: str(data.title, d.title),
    description: str(data.description, d.description),

    editionFirstLabel: str(data.editionFirstLabel, d.editionFirstLabel),
    editionSecondLabel: str(data.editionSecondLabel, d.editionSecondLabel),
    formImage: img(data.formImage, d.formImage),
    fullNameLabel: str(data.fullNameLabel, d.fullNameLabel),
    fullNamePlaceholder: str(data.fullNamePlaceholder, d.fullNamePlaceholder),
    emailLabel: str(data.emailLabel, d.emailLabel),
    emailPlaceholder: str(data.emailPlaceholder, d.emailPlaceholder),
    organizationLabel: str(data.organizationLabel, d.organizationLabel),
    organizationPlaceholder: str(data.organizationPlaceholder, d.organizationPlaceholder),
    roleLabel: str(data.roleLabel, d.roleLabel),
    rolePlaceholder: str(data.rolePlaceholder, d.rolePlaceholder),
    reasonLabel: str(data.reasonLabel, d.reasonLabel),
    reasonPlaceholder: str(data.reasonPlaceholder, d.reasonPlaceholder),

    reasons: mergeReasons(data.reasons, d.reasons),

    licenseTextBefore: str(data.licenseTextBefore, d.licenseTextBefore),
    licenseLinkLabel: str(data.licenseLinkLabel, d.licenseLinkLabel),
    licenseLinkHref: str(data.licenseLinkHref, d.licenseLinkHref),
    submitLabel: str(data.submitLabel, d.submitLabel),
    submittingLabel: str(data.submittingLabel, d.submittingLabel),
    imageAlt: str(data.imageAlt, d.imageAlt),

    citationHeadingTemplate: str(data.citationHeadingTemplate, d.citationHeadingTemplate),
    citationBody: str(data.citationBody, d.citationBody),
    methodologyHeading: str(data.methodologyHeading, d.methodologyHeading),
    methodologyBody: str(data.methodologyBody, d.methodologyBody),
  };
}
