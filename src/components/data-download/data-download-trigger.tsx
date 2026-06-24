"use client";

import * as React from "react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { useDataDownload } from "@/components/data-download/data-download-provider";
import type { DataDownloadOpenOptions } from "@/lib/data-download/types";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

type DataDownloadTriggerProps = React.ComponentProps<"button"> &
  DataDownloadOpenOptions & {
    variant?: VariantProps<typeof buttonVariants>["variant"];
    size?: VariantProps<typeof buttonVariants>["size"];
    asChild?: false;
  };

export function DataDownloadTrigger({
  assetType,
  edition,
  source,
  className,
  children,
  variant,
  size,
  onClick,
  ...props
}: DataDownloadTriggerProps) {
  const { openDataDownload } = useDataDownload();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn(className)}
      onClick={(event) => {
        onClick?.(event);
        openDataDownload({ assetType, edition, source });
      }}
      {...props}
    >
      {children}
    </Button>
  );
}

/** Opens the modal from click handlers in components that can't use DataDownloadTrigger directly. */
export function useDataDownloadHandler() {
  const { openDataDownload } = useDataDownload();

  return React.useCallback(
    (options: DataDownloadOpenOptions) => {
      openDataDownload(options);
    },
    [openDataDownload]
  );
}

/** Unstyled button for custom CTA styling (e.g. methodology page links). */
export function DataDownloadOpenButton({
  assetType,
  edition,
  source,
  className,
  children,
  ...props
}: DataDownloadOpenOptions & React.ComponentProps<"button">) {
  const { openDataDownload } = useDataDownload();

  return (
    <button
      type="button"
      className={cn(className)}
      onClick={() => openDataDownload({ assetType, edition, source })}
      {...props}
    >
      {children}
    </button>
  );
}
