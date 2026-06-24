"use client";

import Image from "next/image";
import * as React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DOWNLOAD_REASONS } from "@/lib/data-download/config";
import type {
  DataDownloadFormValues,
  DataDownloadOpenOptions,
  DownloadEdition,
} from "@/lib/data-download/types";
import { cn } from "@/lib/utils";

const EMPTY_FORM: DataDownloadFormValues = {
  edition: "first",
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
};

export function DataDownloadModal({
  open,
  onOpenChange,
  options,
  onSubmitSuccess,
}: DataDownloadModalProps) {
  const [form, setForm] = React.useState<DataDownloadFormValues>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!open) return;
    setForm({
      ...EMPTY_FORM,
      edition: options?.edition ?? "first",
    });
    setError(null);
    setIsSubmitting(false);
  }, [open, options?.edition]);

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
            <DialogTitle className="text-[1.375rem] font-semibold leading-snug tracking-tight text-[#1a1a2e] dark:text-foreground">
              Thank you for your interest in GIRAI
            </DialogTitle>
            <DialogDescription className="mt-2 text-sm leading-relaxed text-[#6b6b80] dark:text-muted-foreground">
              Please fill out this form so we can better understand how the data
              is being used and improve its accessibility and impact.
            </DialogDescription>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-1 flex-col">
              <EditionToggle
                value={form.edition}
                onChange={(edition) => setField("edition", edition)}
              />

              <div className="mt-5 space-y-4">
                <Field label="Full Name">
                  <Input
                    required
                    value={form.fullName}
                    onChange={(event) => setField("fullName", event.target.value)}
                    placeholder="Input your name"
                    className="h-11 rounded-lg border-[#e2e2ea] bg-white px-3.5 text-sm text-[#1a1a2e] placeholder:text-[#b8b8c8] dark:border-input dark:bg-background"
                  />
                </Field>

                <Field label="Email">
                  <Input
                    required
                    type="email"
                    value={form.email}
                    onChange={(event) => setField("email", event.target.value)}
                    placeholder="Enter email"
                    className="h-11 rounded-lg border-[#e2e2ea] bg-white px-3.5 text-sm text-[#1a1a2e] placeholder:text-[#b8b8c8] dark:border-input dark:bg-background"
                  />
                </Field>

                <Field label="Organization (Optional)">
                  <Input
                    value={form.organization}
                    onChange={(event) =>
                      setField("organization", event.target.value)
                    }
                    placeholder="Input name"
                    className="h-11 rounded-lg border-[#e2e2ea] bg-white px-3.5 text-sm text-[#1a1a2e] placeholder:text-[#b8b8c8] dark:border-input dark:bg-background"
                  />
                </Field>

                <Field label="Current role (Optional)">
                  <Input
                    value={form.role}
                    onChange={(event) => setField("role", event.target.value)}
                    placeholder="Input role"
                    className="h-11 rounded-lg border-[#e2e2ea] bg-white px-3.5 text-sm text-[#1a1a2e] placeholder:text-[#b8b8c8] dark:border-input dark:bg-background"
                  />
                </Field>

                <Field label="Reason for download">
                  <Select
                    value={form.reason || undefined}
                    onValueChange={(value) =>
                      setField("reason", value as DataDownloadFormValues["reason"])
                    }
                  >
                    <SelectTrigger className="h-11 rounded-lg border-[#e2e2ea] bg-white px-3.5 text-sm text-[#1a1a2e] data-[placeholder]:text-[#b8b8c8] dark:border-input dark:bg-background">
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      {DOWNLOAD_REASONS.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <p className="mt-5 text-xs leading-relaxed text-[#6b6b80] dark:text-muted-foreground">
                This work is licensed under a{" "}
                <a
                  href="https://creativecommons.org/licenses/by/4.0/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline-offset-2 hover:underline"
                >
                  Creative Commons Attribution 4.0 International License.
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
                    Submitting…
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </div>

          <div className="relative hidden min-h-[280px] md:block md:min-h-[640px]">
            <Image
              src="/download.png"
              alt="Hand holding the GIRAI report"
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
}: {
  value: DownloadEdition;
  onChange: (edition: DownloadEdition) => void;
}) {
  return (
    <div className="inline-flex w-full rounded-full bg-[#f3f3f7] p-1 dark:bg-muted">
      {(
        [
          { id: "first" as const, label: "First Edition" },
          { id: "second" as const, label: "Second Edition" },
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
