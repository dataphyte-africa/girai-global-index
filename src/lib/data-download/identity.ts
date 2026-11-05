import type { DataDownloadFormValues } from "./types";

/**
 * Remembers who submitted the download form so repeat downloads can skip it.
 * All access is wrapped in try/catch: localStorage is missing during SSR and
 * throws in some private-browsing modes.
 */
const STORAGE_KEY = "girai-download-identity";

export type DownloadIdentity = Omit<DataDownloadFormValues, "edition">;

type StoredDownloadIdentity = DownloadIdentity & {
  v: 1;
  savedAt: string;
};

export function loadDownloadIdentity(): DownloadIdentity | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const stored = JSON.parse(raw) as Partial<StoredDownloadIdentity> | null;
    if (
      !stored ||
      stored.v !== 1 ||
      typeof stored.fullName !== "string" ||
      typeof stored.email !== "string" ||
      !stored.fullName ||
      !stored.email
    ) {
      return null;
    }
    return {
      fullName: stored.fullName,
      email: stored.email,
      organization: stored.organization ?? "",
      role: stored.role ?? "",
      reason: stored.reason ?? "",
      consent: stored.consent === true,
    };
  } catch {
    return null;
  }
}

export function saveDownloadIdentity(values: DataDownloadFormValues): void {
  try {
    const stored: StoredDownloadIdentity = {
      v: 1,
      fullName: values.fullName,
      email: values.email,
      organization: values.organization,
      role: values.role,
      reason: values.reason,
      consent: values.consent,
      savedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
  } catch {
    // Storage unavailable — the form will simply be shown again next time.
  }
}

export function clearDownloadIdentity(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore — nothing to clear if storage is unavailable.
  }
}
