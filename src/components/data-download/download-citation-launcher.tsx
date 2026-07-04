"use client";

import * as React from "react";
import { useDataDownload } from "@/components/data-download/data-download-provider";
import type { CitationDownloadTarget } from "@/lib/data-download/citation-links";
import { buildCitationSource } from "@/lib/data-download/citation-links";

type DownloadCitationLauncherProps = CitationDownloadTarget & {
  searchParams: Record<string, string | string[] | undefined>;
};

function toUrlSearchParams(
  searchParams: Record<string, string | string[] | undefined>
): URLSearchParams {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (typeof value === "string") {
      params.set(key, value);
    } else if (Array.isArray(value) && value[0]) {
      params.set(key, value[0]);
    }
  }
  return params;
}

export function DownloadCitationLauncher({
  assetType,
  edition,
  searchParams,
}: DownloadCitationLauncherProps) {
  const { openDataDownload } = useDataDownload();
  const hasOpened = React.useRef(false);

  React.useEffect(() => {
    if (hasOpened.current) return;
    hasOpened.current = true;

    const params = toUrlSearchParams(searchParams);
    const source = buildCitationSource({ assetType, edition }, params);

    void fetch("/api/data-download/referral", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        assetType,
        edition,
        source,
      }),
    }).catch(() => {
      // Referral logging is best-effort; the download form remains the source of truth.
    });

    openDataDownload({
      assetType,
      edition,
      source,
      lockEdition: Boolean(edition),
    });
  }, [assetType, edition, openDataDownload, searchParams]);

  return null;
}
