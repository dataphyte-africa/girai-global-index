import { createSign } from "crypto";
import { DOWNLOAD_REASONS } from "@/lib/data-download/config";
import type { DataDownloadSubmission } from "@/lib/data-download/types";

type SheetsConfig = {
  spreadsheetId: string;
  sheetName: string;
  serviceAccountEmail: string;
  privateKey: string;
};

type WebAppConfig = {
  webAppUrl: string;
};

function getReasonLabel(reason: string): string {
  return (
    DOWNLOAD_REASONS.find((item) => item.value === reason)?.label ?? reason
  );
}

function getServiceAccountConfig(): SheetsConfig | null {
  const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  if (!spreadsheetId || !serviceAccountEmail || !privateKey) {
    return null;
  }

  return {
    spreadsheetId,
    sheetName: process.env.GOOGLE_SHEETS_SHEET_NAME ?? "Submissions",
    serviceAccountEmail,
    privateKey,
  };
}

function getWebAppConfig(): WebAppConfig | null {
  const webAppUrl = process.env.GOOGLE_SHEETS_WEB_APP_URL;
  if (!webAppUrl) return null;
  return { webAppUrl };
}

function base64UrlEncode(value: string | Buffer): string {
  return Buffer.from(value)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

async function getGoogleAccessToken(config: SheetsConfig): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const header = base64UrlEncode(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const claimSet = base64UrlEncode(
    JSON.stringify({
      iss: config.serviceAccountEmail,
      scope: "https://www.googleapis.com/auth/spreadsheets",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    })
  );

  const unsignedToken = `${header}.${claimSet}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsignedToken);
  signer.end();
  const signature = signer.sign(config.privateKey);
  const jwt = `${unsignedToken}.${base64UrlEncode(signature)}`;

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google auth failed: ${errorText}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("Google auth response missing access_token");
  }

  return data.access_token;
}

function submissionToRow(submission: DataDownloadSubmission): string[] {
  return [
    new Date().toISOString(),
    submission.fullName,
    submission.email,
    submission.organization || "",
    submission.role || "",
    getReasonLabel(submission.reason),
    submission.edition === "first" ? "First Edition" : "Second Edition",
    submission.assetType,
    submission.source ?? "",
  ];
}

async function appendViaServiceAccount(
  config: SheetsConfig,
  submission: DataDownloadSubmission
): Promise<void> {
  const accessToken = await getGoogleAccessToken(config);
  const range = encodeURIComponent(`${config.sheetName}!A:I`);
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED&insertDataOption=INSERT_ROWS`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      values: [submissionToRow(submission)],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Sheets append failed: ${errorText}`);
  }
}

async function appendViaWebApp(
  config: WebAppConfig,
  submission: DataDownloadSubmission
): Promise<void> {
  const response = await fetch(config.webAppUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      timestamp: new Date().toISOString(),
      fullName: submission.fullName,
      email: submission.email,
      organization: submission.organization,
      role: submission.role,
      reason: getReasonLabel(submission.reason),
      edition: submission.edition === "first" ? "First Edition" : "Second Edition",
      assetType: submission.assetType,
      source: submission.source ?? "",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google Apps Script append failed: ${errorText}`);
  }
}

export function isGoogleSheetsConfigured(): boolean {
  return Boolean(getServiceAccountConfig() || getWebAppConfig());
}

export async function appendDataDownloadSubmission(
  submission: DataDownloadSubmission
): Promise<void> {
  const serviceAccountConfig = getServiceAccountConfig();
  if (serviceAccountConfig) {
    await appendViaServiceAccount(serviceAccountConfig, submission);
    return;
  }

  const webAppConfig = getWebAppConfig();
  if (webAppConfig) {
    await appendViaWebApp(webAppConfig, submission);
    return;
  }

  if (process.env.NODE_ENV === "development") {
    console.warn(
      "[data-download] Google Sheets not configured — submission logged to console only:",
      submissionToRow(submission)
    );
    return;
  }

  throw new Error("Google Sheets is not configured");
}
