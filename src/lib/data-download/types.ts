export type DownloadEdition = "first" | "second";

export type DownloadAssetType = "report" | "data" | "methodology";

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
};

export type DataDownloadSubmission = DataDownloadFormValues & {
  assetType: DownloadAssetType;
  source?: string;
};

export type DataDownloadOpenOptions = {
  assetType: DownloadAssetType;
  edition?: DownloadEdition;
  source?: string;
};
