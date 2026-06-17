# Waitlist → Google Sheet setup

Both the **pricing waitlist** and the **"monitor this page" opt-in** POST to
`/api/v1/waitlist`, which forwards each lead as JSON to whatever URL is in the
`WAITLIST_WEBHOOK_URL` env var. This guide points that webhook at a Google Sheet
you own — free, no API keys, ~2 minutes.

The route sends this JSON body:

```json
{ "email": "...", "plan": "Pro", "note": "", "url": null, "source": "pricing", "referer": "...", "at": "ISO-8601" }
```

Distinguish the two lead types by `source`:
- `source: "pricing"` → a pricing-page waitlist signup (`plan` = Free/Pro/Agency).
- `source: "monitor"` → a "monitor this page" opt-in; `url` holds the page they want watched, `plan` = `"monitor"`.

## Steps

1. Create a new Google Sheet (sheets.new). Name it anything, e.g. "A11y Beast — Waitlist".
2. In the Sheet: **Extensions → Apps Script**.
3. Delete the starter code and paste the script below. **Save** (disk icon).
4. **Deploy → New deployment**.
   - Click the gear → **Web app**.
   - **Execute as:** Me.
   - **Who has access:** **Anyone**. (Required — our server calls it unauthenticated.)
   - **Deploy**. Authorize when prompted (it's your own script).
5. Copy the **Web app URL** — it ends in `/exec`.
6. In Vercel → your project → **Settings → Environment Variables**, add:
   - **Name:** `WAITLIST_WEBHOOK_URL`
   - **Value:** the `/exec` URL
   - Apply to Production (and Preview if you want).
   - **Redeploy** so the new env var is picked up.

That's it. Every signup now appends a row: Received · Email · Plan · Note · URL · Source · Referer.

## The script

```js
/**
 * A11y Beast — waitlist receiver.
 * Appends each signup POSTed by /api/v1/waitlist to a "Waitlist" tab.
 */
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Waitlist') || ss.insertSheet('Waitlist');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Received', 'Email', 'Plan', 'Note', 'URL', 'Source', 'Referer']);
    }
    sheet.appendRow([
      data.at || new Date().toISOString(),
      data.email || '',
      data.plan || '',
      data.note || '',
      data.url || '',
      data.source || '',
      data.referer || ''
    ]);
    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## Local testing (optional)

To test before deploying to Vercel, run the dev server with the env var set:

```bash
WAITLIST_WEBHOOK_URL="https://script.google.com/macros/s/XXXX/exec" npm run dev
```

Then submit a signup on `/pricing` — a row should appear in the Sheet within a second.

## Notes

- If `WAITLIST_WEBHOOK_URL` is unset, signups still succeed for the user and are
  written to the server logs (Vercel → Logs) as a fallback, so no lead is lost.
- The Apps Script URL is a write-only sink (it only appends); it never exposes
  the sheet contents.
