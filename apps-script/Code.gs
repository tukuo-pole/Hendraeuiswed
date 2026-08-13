/**
 * Wedding RSVP backend.
 *
 * SETUP (see SETUP-GUIDE.md for the full walkthrough):
 * 1. Create a Google Sheet.
 * 2. Extensions > Apps Script, paste this file in, save.
 * 3. Run `setup` once from the Apps Script editor (top toolbar ▶) to create
 *    the header row. The first run will ask you to authorize the script.
 * 4. Deploy > New deployment > type "Web app".
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 5. Copy the Web App URL into CONFIG.appsScriptUrl in js/main.js.
 */

const SHEET_NAME = "RSVP";
const HEADERS = ["Timestamp", "Name", "Attendance", "GuestCount", "Message"];

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  return sheet;
}

/** Run this once manually from the Apps Script editor to create headers. */
function setup() {
  const sheet = getSheet_();
  if (sheet.getRange(1, 1).getValue() !== HEADERS[0]) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }
}

function jsonResponse_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON
  );
}

/**
 * GET  ?action=list   -> { ok: true, items: [{name, attendance, guestCount, message, timestamp}] }
 */
function doGet(e) {
  try {
    const action = e.parameter.action || "list";
    if (action === "list") {
      const sheet = getSheet_();
      const rows = sheet.getDataRange().getValues();
      const items = rows.slice(1).map((r) => ({
        timestamp: r[0],
        name: r[1],
        attendance: r[2],
        guestCount: r[3],
        message: r[4]
      }));
      return jsonResponse_({ ok: true, items });
    }
    return jsonResponse_({ ok: false, error: "Unknown action" });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}

/**
 * POST { action: "rsvp", name, attendance, guestCount, message }
 * Content-Type is sent as text/plain from the frontend to avoid a CORS
 * preflight; the body is still JSON, so we parse it manually below.
 */
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);

    if (payload.action !== "rsvp") {
      return jsonResponse_({ ok: false, error: "Unknown action" });
    }

    const name = (payload.name || "").toString().trim();
    if (!name) {
      return jsonResponse_({ ok: false, error: "Name is required" });
    }

    const sheet = getSheet_();
    sheet.appendRow([
      new Date(),
      name,
      payload.attendance || "",
      payload.guestCount || "",
      (payload.message || "").toString().trim()
    ]);

    return jsonResponse_({ ok: true });
  } catch (err) {
    return jsonResponse_({ ok: false, error: String(err) });
  }
}
