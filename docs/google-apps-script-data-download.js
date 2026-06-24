/**
 * Sample Google Apps Script for GOOGLE_SHEETS_WEB_APP_URL.
 *
 * 1. Create a Google Sheet with headers in row 1:
 *    Timestamp | Full Name | Email | Organization | Role | Reason | Edition | Asset Type | Source
 * 2. Extensions → Apps Script → paste this file → Deploy → New deployment → Web app
 * 3. Execute as: Me | Who has access: Anyone
 * 4. Copy the deployment URL into GOOGLE_SHEETS_WEB_APP_URL
 *
 * To swap sheets later, create a new spreadsheet (or duplicate) and redeploy,
 * or point GOOGLE_SHEETS_SPREADSHEET_ID at a different sheet when using the
 * service-account integration instead.
 */
function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Submissions") ||
    SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

  const data = JSON.parse(e.postData.contents);

  sheet.appendRow([
    data.timestamp || new Date().toISOString(),
    data.fullName || "",
    data.email || "",
    data.organization || "",
    data.role || "",
    data.reason || "",
    data.edition || "",
    data.assetType || "",
    data.source || "",
  ]);

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true })
  ).setMimeType(ContentService.MimeType.JSON);
}
