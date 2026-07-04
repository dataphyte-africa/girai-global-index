"use client";

import Image from "next/image";
import * as React from "react";
import { ChevronDown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type {
  DataDownloadFormValues,
  DataDownloadOpenOptions,
  DownloadEdition,
} from "@/lib/data-download/types";
import {
  downloadModalDefaults,
  type DownloadModalContent,
} from "@/content/downloadModal.defaults";
import { cn } from "@/lib/utils";

const EMPTY_FORM: DataDownloadFormValues = {
  edition: "second",
  fullName: "",
  email: "",
  organization: "",
  role: "",
  reason: "",
};

type DataDownloadModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: DataDownloadOpenOptions | null;
  onSubmitSuccess?: () => void;
  content?: DownloadModalContent;
};

export function DataDownloadModal({
  open,
  onOpenChange,
  options,
  onSubmitSuccess,
  content = downloadModalDefaults,
}: DataDownloadModalProps) {
  const [form, setForm] = React.useState<DataDownloadFormValues>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setForm({
      ...EMPTY_FORM,
      edition: options?.edition ?? "second",
    });
    setError(null);
    setIsSubmitting(false);
  }, [open, options?.edition]);

  const assetLabel =
    options?.assetType === "report"
      ? "Report"
      : options?.assetType === "methodology"
        ? "Methodology"
        : "Dataset";

  const setField = <K extends keyof DataDownloadFormValues>(
    key: K,
    value: DataDownloadFormValues[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!options) return;

    if (!form.reason) {
      setError("Please select a reason for download.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/data-download", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          assetType: options.assetType,
          source: options.source,
        }),
      });

      const payload = (await response.json()) as {
        ok?: boolean;
        downloadUrl?: string;
        filename?: string;
        error?: string;
      };

      if (!response.ok || !payload.ok || !payload.downloadUrl) {
        throw new Error(payload.error ?? "Something went wrong. Please try again.");
      }

      const anchor = document.createElement("a");
      anchor.href = payload.downloadUrl;
      anchor.download = payload.filename ?? "";
      anchor.rel = "noopener";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      onSubmitSuccess?.();
      onOpenChange(false);
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="max-h-[calc(100vh-2rem)] w-[min(100%-2rem,920px)] max-w-none overflow-y-auto rounded-2xl p-0 sm:max-w-none"
      >
        <div className="grid min-h-0 grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col bg-white px-6 py-8 sm:px-10 sm:py-10 dark:bg-card">
            <span className="mb-3 inline-flex w-fit items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary">
              GIRAI {assetLabel}
            </span>
            <DialogTitle className="text-[1.375rem] font-semibold leading-snug tracking-tight text-[#1a1a2e] dark:text-foreground">
              {content.title}
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed text-[#6b6b80] dark:text-muted-foreground">
              {content.description}
            </DialogDescription>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col">
              <EditionToggle
                value={form.edition}
                onChange={(edition) => setField("edition", edition)}
                locked={options?.lockEdition}
                firstLabel={content.editionFirstLabel}
                secondLabel={content.editionSecondLabel}
              />

              <div className="mt-5 space-y-4">
                <Field label={content.fullNameLabel}>
                  <Input
                    required
                    value={form.fullName}
                    onChange={(event) => setField("fullName", event.target.value)}
                    placeholder={content.fullNamePlaceholder}
                    className="h-11 rounded-lg border-[#e2e2ea] bg-white px-3.5 text-sm text-[#1a1a2e] placeholder:text-[#b8b8c8] dark:border-input dark:bg-background"
                  />
                </Field>

                <Field label={content.emailLabel}>
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setField("email", event.target.value)}
                    placeholder={content.emailPlaceholder}
                    className="h-11 rounded-lg border-[#e2e2ea] bg-white px-3.5 text-sm text-[#1a1a2e] placeholder:text-[#b8b8c8] dark:border-input dark:bg-background"
                  />
                </Field>

                <Field label={content.organizationLabel}>
                  <Input
                    value={form.organization}
                    onChange={(event) =>
                      setField("organization", event.target.value)
                    }
                    placeholder={content.organizationPlaceholder}
                    className="h-11 rounded-lg border-[#e2e2ea] bg-white px-3.5 text-sm text-[#1a1a2e] placeholder:text-[#b8b8c8] dark:border-input dark:bg-background"
                  />
                </Field>

                <Field label={content.roleLabel}>
                  <Input
                    value={form.role}
                    onChange={(event) => setField("role", event.target.value)}
                    placeholder={content.rolePlaceholder}
                    className="h-11 rounded-lg border-[#e2e2ea] bg-white px-3.5 text-sm text-[#1a1a2e] placeholder:text-[#b8b8c8] dark:border-input dark:bg-background"
                  />
                </Field>

                {/*
                  Native <select> rather than the Radix Select: inside the Radix
                  Dialog the custom popover-based trigger failed to open, so a
                  native control is used for reliability (no portal/focus-trap).
                */}
                <Field label={content.reasonLabel}>
                  <div className="relative">
                    <select
                      required
                      value={form.reason}
                      onChange={(event) =>
                        setField(
                          "reason",
                          event.target.value as DataDownloadFormValues["reason"]
                        )
                      }
                      className={cn(
                        "h-11 w-full appearance-none rounded-lg border border-[#e2e2ea] bg-white px-3.5 pr-10 text-sm text-[#1a1a2e] focus:outline-none focus:ring-2 focus:ring-primary/40 dark:border-input dark:bg-background",
                        !form.reason && "text-[#b8b8c8]"
                      )}
                    >
                      <option value="" disabled>
                        {content.reasonPlaceholder}
                      </option>
                      {content.reasons.map((reason) => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8b8b9e]"
                      aria-hidden
                    />
                  </div>
                </Field>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-[#6b6b80] dark:text-muted-foreground">
                {content.licenseTextBefore}
                <a
                  href={content.licenseLinkHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  {content.licenseLinkLabel}
                </a>
              </p>

              {error ? (
                <p className="mt-3 text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-5 h-12 w-full rounded-xl bg-primary text-base font-semibold text-primary-foreground hover:bg-primary/90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" aria-hidden />
                    {content.submittingLabel}
                  </>
                ) : (
                  content.submitLabel
                )}
              </Button>
            </form>
          </div>

          <div className="relative hidden min-h-[280px] md:block md:min-h-[640px]">
            <Image
              src={content.formImage.url ?? "/download.png"}
              alt={content.formImage.alt ?? content.imageAlt}
              fill
              className="object-cover"
              sizes="460px"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function EditionToggle({
  value,
  onChange,
  locked = false,
  firstLabel,
  secondLabel,
}: {
  value: DownloadEdition;
  onChange: (edition: DownloadEdition) => void;
  locked?: boolean;
  firstLabel: string;
  secondLabel: string;
}) {
  if (locked) {
    const label = value === "first" ? firstLabel : secondLabel;
    return (
      <p className="text-sm font-medium text-[#1a1a2e] dark:text-foreground">
        {label}
      </p>
    );
  }

  return (
    <div className="inline-flex w-full rounded-full bg-[#f3f3f7] p-1 dark:bg-muted">
      {(
        [
          { id: "second" as const, label: secondLabel },
          { id: "first" as const, label: firstLabel },
        ] as const
      ).map((edition) => {
        const isActive = value === edition.id;
        return (
          <button
            key={edition.id}
            type="button"
            onClick={() => onChange(edition.id)}
            className={cn(
              "flex-1 rounded-full px-4 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-white text-[#1a1a2e] shadow-sm dark:bg-background dark:text-foreground"
                : "text-[#8b8b9e] hover:text-[#1a1a2e] dark:text-muted-foreground dark:hover:text-foreground"
            )}
          >
            {edition.label}
          </button>
        );
      })}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-[#1a1a2e] dark:text-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}
