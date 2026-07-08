"use client";

import * as React from "react";
import { DataDownloadModal } from "@/components/data-download/data-download-modal";
import type { DataDownloadOpenOptions } from "@/lib/data-download/types";
import {
  downloadModalDefaults,
  type DownloadModalContent,
} from "@/content/downloadModal.defaults";
import { track } from "@/lib/analytics/client";
import { EVENTS } from "@/lib/analytics/events";

type DataDownloadContextValue = {
  openDataDownload: (options: DataDownloadOpenOptions) => void;
};

const DataDownloadContext = React.createContext<DataDownloadContextValue | null>(
  null
);

export function DataDownloadProvider({
  children,
  content = downloadModalDefaults,
}: {
  children: React.ReactNode;
  content?: DownloadModalContent;
}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<DataDownloadOpenOptions | null>(
    null
  );

  const openDataDownload = React.useCallback(
    (nextOptions: DataDownloadOpenOptions) => {
      setOptions(nextOptions);
      setOpen(true);
      track(EVENTS.DOWNLOAD_MODAL_OPENED, {
        asset_type: nextOptions.assetType,
        edition: nextOptions.edition,
        source: nextOptions.source,
      });
    },
    []
  );

  return (
    <DataDownloadContext.Provider value={{ openDataDownload }}>
      {children}
      <DataDownloadModal
        open={open}
        onOpenChange={setOpen}
        options={options}
        content={content}
      />
    </DataDownloadContext.Provider>
  );
}

export function useDataDownload() {
  const context = React.useContext(DataDownloadContext);
  if (!context) {
    throw new Error("useDataDownload must be used within DataDownloadProvider");
  }
  return context;
}
