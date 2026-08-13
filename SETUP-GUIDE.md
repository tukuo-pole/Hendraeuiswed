# Setup & Maintenance Guide — Hendra & Uis Wedding Invitation

## What I could and couldn't do

I built the full website, the Google Sheets backend code, and this guide.
I could **not** do the following myself, because they require access I
don't have:

- **Your GitHub account/repo** — I can't create repos or push commits on
  your behalf. Steps to do this yourself are below (10 minutes).
- **Your Google account** — creating the Sheet and deploying the Apps
  Script has to happen from your own Google login, since it becomes your
  database.
- **Your local files** at `D:\0. ANANTA\pic` — that's on your computer, not
  something I can browse. Add your photos/music into the `assets/` folder
  yourself (see `assets/README.txt`).

Everything else — layout, RSVP logic, countdown, calendar/maps links,
styling — is done and ready to go.

---

## 1. Photos & music

All set — your groom, bride, and couple photos, plus 60 seconds of your
chosen background track, are already in `assets/` and wired into the site.
Nothing to do here unless you want to swap something later (just replace
the file with the same name).

---

## 2. Set up the Google Sheet + Apps Script (RSVP database)

1. Go to [sheets.google.com](https://sheets.google.com) and create a new,
   blank spreadsheet. Name it something like "Wedding RSVP — Hendra & Uis".
2. In the sheet, go to **Extensions → Apps Script**.
3. Delete any starter code in the editor, then paste in the entire contents
   of `apps-script/Code.gs` from this project.
4. Click the disk icon to save.
5. In the function dropdown at the top (next to "Debug"), select **setup**,
   then click **Run**. The first time, Google will ask you to authorize —
   click through (choose your account → "Advanced" → "Go to project
   (unsafe)" → Allow). This is expected; it's your own script.
6. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Click **Deploy**, authorize again if asked, then copy the **Web app
   URL** it gives you (ends in `/exec`).
8. Open `js/main.js` in this project, find:
   ```js
   appsScriptUrl: "",
   ```
   and paste your URL between the quotes.

That's it — RSVP submissions will now append rows to your Sheet in
real time, and the Wedding Wishes section will read from the same Sheet.

**To view/export RSVPs:** just open the Google Sheet directly — every
submission is a new row (Timestamp, Name, Attendance, GuestCount, Message).
File → Download → Excel/CSV works for exporting.

---

## 3. Deploy to GitHub Pages

1. Go to [github.com/new](https://github.com/new) and create a new
   repository (e.g. `hendra-uis-wedding`). Public repos get free GitHub
   Pages hosting.
2. Upload this whole project folder into the repo. Easiest way with no
   command line:
   - On the repo page, click **Add file → Upload files**.
   - Drag in `index.html`, the `css/`, `js/`, and `assets/` folders.
   - Commit directly to the `main` branch.
   (If you're comfortable with git/terminal, `git add . && git commit -m
   "Initial site" && git push` works too.)
3. In the repo, go to **Settings → Pages**.
   - Source: **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)**
   - Save.
4. GitHub will give you a URL after a minute or two, typically:
   `https://<your-username>.github.io/<repo-name>/`

### Personalizing invitation links per guest
Add `?to=NamaTamu` to the end of the URL, e.g.:
`https://<your-username>.github.io/<repo-name>/?to=Ade%20Fitriyani`
The cover screen will greet that guest by name. (Spaces should be encoded
as `%20`.)

---

## 4. Editing wedding details later

Everything guest-facing lives in one place: the `CONFIG` object at the top
of `js/main.js` — names, parents, date/time, venue, gift/bank info, and the
Apps Script URL. Change a value there, save, and re-upload the file to
GitHub (or `git push`) — no other file needs to change.

The one exception is the literal placeholder text still in `index.html`
for the bride's parents (`.....................`), since that information
wasn't provided — fill it into `CONFIG.bride.fatherName` /
`motherName` in `js/main.js` and it will fill itself in automatically.

---

## Requirements checklist

- [x] RSVP form (name, attendance, guest count, message) syncing to Google
      Sheets in real time, one row per submission, exportable via Sheets
- [x] Wedding wishes section showing name + message, auto-refreshing
      (polls every 15s) — *goes live once you complete step 2 above*
- [x] Countdown timer — days/hours/minutes/seconds
- [x] Clickable venue address opening Google Maps
- [x] Clickable date/time opening Google Calendar with title, date, time,
      venue, and description pre-filled
- [x] All requested wedding info fields, editable in one CONFIG block
- [x] Gift section titled "Wanna give us some gifts?" with bank account and
      delivery address, copy-to-clipboard for the account number
- [x] Elegant, mobile-first, responsive, smooth-scrolling design with
      scroll-reveal animations and a floating music button
- [x] All required sections: cover, bride & groom, countdown, event
      details, map, RSVP, wishes, gift, closing
- [x] Real photos — groom, bride, and cover couple photo added
- [x] Music — assets/music.mp3 added (60s, faded, ~940KB)
- [ ] Live on GitHub Pages — ready to go the moment you finish step 3
- [ ] RSVP/Wishes connected to a live Sheet — ready once you finish step 2

## Output summary

- **Deployed URL:** not yet live — I can't create or push to a GitHub repo
  on your behalf, so this becomes real after you complete step 3 above.
- **GitHub repo:** not yet created — same reason; create it from your own
  account using step 3.
- **Google Sheet structure:** one sheet named `RSVP` with columns
  `Timestamp | Name | Attendance | GuestCount | Message`, created
  automatically by the `setup` function in step 2.
- **Apps Script code:** `apps-script/Code.gs` in this project.
- **Maintenance instructions:** this file.
