export type DownloadEdition = "first" | "second";

export type DownloadAssetType = "report" | "data" | "methodology";

/** Language of the 2026 report PDF. Only the 2026 report has translations. */
export type ReportLanguage = "en" | "es" | "fr";

export type DownloadReason =
  | "academic-research"
  | "journalism-media"
  | "policy-development"
  | "civil-society"
  | "private-sector"
  | "government"
  | "personal-interest"
  | "other";

export type DataDownloadFormValues = {
  edition: DownloadEdition;
  fullName: string;
  email: string;
  organization: string;
  role: string;
  reason: DownloadReason | "";
  consent: boolean;
};

export type DataDownloadSubmission = DataDownloadFormValues & {
  assetType: DownloadAssetType;
  source?: string;
  /** Set only for the 2026 report; undefined for every other asset. */
  language?: ReportLanguage;
};

export type DataDownloadOpenOptions = {
  assetType: DownloadAssetType;
  edition?: DownloadEdition;
  source?: string;
  /** Preselected report language (e.g. from `?lang=es` on /download pages). */
  language?: ReportLanguage;
  /** When true, the edition toggle is hidden (e.g. citation landing pages). */
  lockEdition?: boolean;
};

export type DownloadReferralEvent = {
  assetType: DownloadAssetType;
  edition?: DownloadEdition;
  source: string;
};
