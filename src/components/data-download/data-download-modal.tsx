"use client";

import Image from "next/image";
import * as React from "react";
import { ArrowUpRight, Check, ChevronDown, FolderOpen, Loader2, ShieldCheck } from "lucide-react";
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
  consent: false,
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
  const [showSuccess, setShowSuccess] = React.useState(false);

  React.useEffect(() => {
    if (!open) return;
    setForm({
      ...EMPTY_FORM,
      edition: options?.edition ?? "second",
    });
    setError(null);
    setIsSubmitting(false);
    setShowSuccess(false);
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

    if (!form.consent) {
      setError(content.consentErrorText);
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

      onSubmitSuccess?.();

      // Datasets live in a shared Google Drive library, so rather than pushing a
      // single file we surface a success screen linking to the full collection.
      if (options.assetType === "data") {
        setShowSuccess(true);
        return;
      }

      // Open the PDF in a new tab so the browser renders it inline rather than
      // forcing a download (no `download` attribute, target="_blank").
      const anchor = document.createElement("a");
      anchor.href = payload.downloadUrl;
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

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
          {showSuccess ? (
            <DatasetSuccessView
              content={content}
              onDone={() => onOpenChange(false)}
            />
          ) : (
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

              <label className="mt-4 flex cursor-pointer items-start gap-3">
                <span className="relative mt-0.5 flex size-5 shrink-0 items-center justify-center">
                  <input
                    type="checkbox"
                    checked={form.consent}
                    onChange={(event) =>
                      setField("consent", event.target.checked)
                    }
                    className="peer size-5 cursor-pointer appearance-none rounded-md border border-[#c9c9d6] bg-white transition-colors checked:border-primary checked:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-input dark:bg-background dark:checked:bg-primary"
                  />
                  <Check
                    className="pointer-events-none absolute size-3.5 text-primary-foreground opacity-0 peer-checked:opacity-100"
                    strokeWidth={3}
                    aria-hidden
                  />
                </span>
                <span className="text-xs leading-relaxed text-[#6b6b80] dark:text-muted-foreground">
                  {content.consentTextBefore}
                  <a
                    href={content.consentLinkHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    {content.consentLinkLabel}
                  </a>
                  {content.consentTextAfter}
                </span>
              </label>

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
          )}

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

function DatasetSuccessView({
  content,
  onDone,
}: {
  content: DownloadModalContent;
  onDone: () => void;
}) {
  return (
    <div className="relative flex flex-col justify-center overflow-hidden bg-white px-6 py-10 sm:px-10 sm:py-12 dark:bg-card">
      {/* Ambient glow echoing the GIRAI cover orb */}
      <div
        className="pointer-events-none absolute -top-20 left-1/2 size-56 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl dark:bg-primary/25"
        aria-hidden
      />

      <div className="relative">
        {/* Animated success mark */}
        <div
          className="relative mb-6 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-teal-400 text-white shadow-lg shadow-primary/30 animate-in zoom-in-50 fade-in duration-500 fill-mode-both"
          style={{ animationDelay: "40ms" }}
        >
          <span
            className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-teal-400 opacity-60 blur-md"
            aria-hidden
          />
          <Check className="relative size-8" strokeWidth={2.75} aria-hidden />
        </div>

        <span
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-emerald-600 animate-in fade-in slide-in-from-bottom-2 fill-mode-both dark:text-emerald-400"
          style={{ animationDelay: "120ms" }}
        >
          <ShieldCheck className="size-3.5" aria-hidden />
          {content.successBadge}
        </span>

        <DialogTitle
          className="mt-4 text-[1.6rem] font-semibold leading-tight tracking-tight text-[#1a1a2e] animate-in fade-in slide-in-from-bottom-2 fill-mode-both dark:text-foreground"
          style={{ animationDelay: "180ms" }}
        >
          {content.successTitle}
        </DialogTitle>

        <DialogDescription
          className="mt-3 text-sm leading-relaxed text-[#6b6b80] animate-in fade-in slide-in-from-bottom-2 fill-mode-both dark:text-muted-foreground"
          style={{ animationDelay: "240ms" }}
        >
          {content.successBody}
        </DialogDescription>

        {/* Primary action — the shared Google Drive dataset library */}
        <a
          href={content.datasetDriveUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group mt-7 flex items-center gap-4 rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/[0.07] to-primary/[0.02] p-4 transition-all animate-in fade-in slide-in-from-bottom-2 fill-mode-both hover:border-primary/45 hover:shadow-lg hover:shadow-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 dark:border-primary/25 dark:from-primary/12 dark:to-transparent"
          style={{ animationDelay: "300ms" }}
        >
          <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <FolderOpen className="size-6" aria-hidden />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold text-[#1a1a2e] dark:text-foreground">
              {content.successCtaLabel}
            </span>
            <span className="mt-0.5 block truncate text-xs text-[#6b6b80] dark:text-muted-foreground">
              {content.datasetDriveName} · Google Drive
            </span>
          </span>
          <ArrowUpRight
            className="size-5 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            aria-hidden
          />
        </a>

        <p
          className="mt-3 flex items-center gap-1.5 text-xs text-[#8b8b9e] animate-in fade-in fill-mode-both dark:text-muted-foreground"
          style={{ animationDelay: "360ms" }}
        >
          <ArrowUpRight className="size-3.5" aria-hidden />
          {content.successCtaNote}
        </p>

        <button
          type="button"
          onClick={onDone}
          className="mt-6 text-sm font-medium text-[#6b6b80] underline-offset-4 transition-colors animate-in fade-in fill-mode-both hover:text-[#1a1a2e] hover:underline dark:text-muted-foreground dark:hover:text-foreground"
          style={{ animationDelay: "420ms" }}
        >
          {content.successDoneLabel}
        </button>
      </div>
    </div>
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
