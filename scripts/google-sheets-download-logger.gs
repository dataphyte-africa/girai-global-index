/**
 * GIRAI — Download logger (Google Apps Script)
 * ------------------------------------------------------------------
 * Receives POSTs from the site's /api/data-download route (via the
 * GOOGLE_SHEETS_WEB_APP_URL env var) and appends one row to the correct
 * spreadsheet, chosen by `assetType`:
 *
 *   assetType "report"      -> Report Downloads sheet
 *   assetType "data"        -> Dataset Downloads sheet
 *   assetType "methodology" -> Methodology Downloads sheet
 *
 * HOW TO DEPLOY
 * ------------------------------------------------------------------
 * 1. Go to https://script.google.com  ->  New project.
 * 2. Delete the sample code and paste this whole file.
 * 3. Deploy  ->  New deployment  ->  type: Web app.
 *      - Description:      GIRAI download logger
 *      - Execute as:       Me  (your Google account — must own/can edit all 3 sheets)
 *      - Who has access:   Anyone
 * 4. Click Deploy, authorize when prompted, and copy the Web app URL
 *    (it ends in /exec). That URL is GOOGLE_SHEETS_WEB_APP_URL.
 * 5. Test it by opening the /exec URL in a browser — you should see
 *    {"ok":true,"status":"GIRAI download logger is running"}.
 *
 * NOTE: after any code edit you must Deploy -> Manage deployments ->
 * edit -> "New version" for the change to take effect (the /exec URL
 * stays the same).
 */

// assetType -> spreadsheet ID (from the three Google Sheets you shared)
var SHEET_IDS = {
  report: "1Ycz7kLPzqHL9lztC100gz4x5UL50F24-LkivjQPbZaE", // Report Downloads
  data: "1FSxJvt4EC3HZC3klcOaApiGzaCmXIHC_v-aJPMNgMSI", // Dataset Downloads
  methodology: "1eiAMSZ3wWSF0914hx8S-KcY7su_sVCACgD-lSxhqse8", // Methodology Downloads
};

// Tab (worksheet) name written to inside each spreadsheet.
var TAB_NAME = "Submissions";

var HEADERS = [
  "Timestamp",
  "Full Name",
  "Email",
  "Organization",
  "Role",
  "Reason",
  "Edition",
  "Asset Type",
  "Source",
];

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var spreadsheetId = SHEET_IDS[data.assetType];

    if (!spreadsheetId) {
      return jsonOut({ ok: false, error: "Unknown assetType: " + data.assetType });
    }

    var ss = SpreadsheetApp.openById(spreadsheetId);
    var sheet = ss.getSheetByName(TAB_NAME) || ss.insertSheet(TAB_NAME);

    // Add a header row the first time we write to an empty sheet.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
    }

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

    return jsonOut({ ok: true });
  } catch (err) {
    return jsonOut({ ok: false, error: String(err) });
  }
}

// Lets you sanity-check the deployment by visiting the /exec URL in a browser.
function doGet() {
  return jsonOut({ ok: true, status: "GIRAI download logger is running" });
}

function jsonOut(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}
