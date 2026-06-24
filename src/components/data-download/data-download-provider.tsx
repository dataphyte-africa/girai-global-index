"use client";

import * as React from "react";
import { DataDownloadModal } from "@/components/data-download/data-download-modal";
import type { DataDownloadOpenOptions } from "@/lib/data-download/types";

type DataDownloadContextValue = {
  openDataDownload: (options: DataDownloadOpenOptions) => void;
};

const DataDownloadContext = React.createContext<DataDownloadContextValue | null>(
  null
);

export function DataDownloadProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = React.useState(false);
  const [options, setOptions] = React.useState<DataDownloadOpenOptions | null>(
    null
  );

  const openDataDownload = React.useCallback(
    (nextOptions: DataDownloadOpenOptions) => {
      setOptions(nextOptions);
      setOpen(true);
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
