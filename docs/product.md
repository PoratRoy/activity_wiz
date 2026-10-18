# Product

## Concept

ActivityWiz is a free web app for guides (מדריכים) in Israeli youth movements such as צופים and השומר הצעיר. Guides are usually teenagers aged 15–18 who lead groups of younger kids. They usually prepare on their phone, often the evening before a meeting, and open the activity again while running it.

The app does two things:

1. **Create with AI.** The guide describes their group and the activity they need. Gemini writes a complete activity they can read, edit, copy or share (for example to WhatsApp).
2. **Public library.** Ready-made activities, sorted into categories, that anyone can read and signed-in users can copy into their own list.

Everything is in Hebrew, right-to-left. The look is youthful and simple, in green and yellow, inspired by Duolingo.

## Roles

| Role | Can do |
| --- | --- |
| **Guest** (not signed in) | Browse the library. Generate activities during a 3-day trial. View, edit, copy and send the *current* generated activity. No saved list, no "save copy". |
| **Guest, trial expired** | Browse the library. Tapping Create shows a blocking sign-in popup. |
| **Registered user** (Google) | Everything, without a time limit. Generated activities are saved automatically. Has "My activities". Can save copies from the library. |
| **Admin** | Everything a registered user can do, plus the admin page: add/delete categories and add/delete public activities. |

Google is the only sign-in method.

## Rules

### Guest trial
- **R1.** The 3-day (72-hour) trial starts when a guest **first submits and generates** an activity. Visiting, browsing or filling in forms does not start it.
- **R2.** The trial start lives in a signed cookie. Clearing cookies resets it, which is an accepted limitation.
- **R3.** After the trial expires, tapping Create (anywhere) opens a popup that cannot be dismissed. It contains a short line of text and a "Sign in with Google" button. The only way out is back. The library stays open.

### Group details
- **R4.** Each user has exactly **one** group: movement, grade, group size and gender. The group page saves it every time the guide taps Continue, and it prefills the page next time.
- **R5.** Registered users: the group is stored in the `users` row, with a localStorage copy for instant prefill. Guests: localStorage only.
- **R6.** Activities do **not** store group details.

### Generation
- **R7.** There is at least **30 seconds** between generations per user, or per guest cookie. There are no daily or total quotas.
- **R8.** Every attempt that reaches Gemini counts toward the 30 seconds, including refusals and failures.
- **R9.** One Gemini call per attempt, with a 60-second timeout. The output is not streamed; a loading page shows until it finishes.
- **R10.** Registered user: the result is saved to their list automatically and opens at `/activity/[id]`. Guest: the result is kept in localStorage and opens at `/activity/draft`.
- **R11.** If the topic is unsafe or inappropriate for kids, show a friendly Hebrew refusal with a "try another topic" button.
- **R12.** On error or timeout, keep the form values and offer "try again".

### Guest → registered
- **R13.** If a guest signs in from the draft result page, the draft activity is saved to the account that signed in, whether it's new or existing. The user returns to that activity's page.

### Reading and editing
- **R14.** Every activity page (draft, personal, public) shows the activity as formatted Markdown, with **copy** (plain text) and **share**. Share opens the phone's share sheet (`navigator.share`) with the activity in WhatsApp-style formatting plus a link to the site. Where the share sheet isn't available (most desktops), it opens `wa.me` with the same text.
- **R15.** Personal and draft activities can be **edited**: title and body, using bold, underline and lists only. Personal activities autosave 2 seconds after typing stops. The draft saves to localStorage.
- **R16.** Public activities are read-only.
- **R29.** The activity body is limited to **3000 characters** in the editor. Typing stops at the limit and a short warning shows. Deleting text always works.

### Old-site features carried over
- **R26. Topic suggestions.** A ✨ button inside the subject field fills in a random topic from `src/data/topic-suggestions.json` for the selected type: lists for `content`, `survival` and `playTime`, with `pointOfView` using the `content` list. Every tap gives a new topic, and the guide can still edit it.
- **R27. AI notice.** The loading screen always shows: «שימו לב! התוכן מופק בעזרת בינה מלאכותית ויתכנו טעויות.»
- **R28. High-demand error.** When Gemini is overloaded (HTTP 503/429 or "overloaded"/"high demand"), show a separate message, «יש עומס כרגע, נסו שוב בעוד רגע», instead of the general error. The 30-second limit still applies.

### My activities
- **R17.** Lists the user's activities newest first. Each row shows title and creation date.
- **R18.** Delete is available from the list and the activity page. It always asks for confirmation, then hard-deletes.

### Public library
- **R19.** Categories are listed oldest first (creation order). Inside a category, activities are listed newest first.
- **R20.** Signed-in users see "Save to my activities" on a public activity. Each tap creates a new, independent personal copy (title, body and **all activity fields**) and opens it.
- **R21.** The library is fully server-rendered and SEO-optimized. Personal, create and admin pages are `noindex`.

### Admin
- **R22.** Admins are the emails in the `ADMIN_EMAILS` secret, a JSON string array. This is checked on the server for every admin page and admin action. A non-admin trying to open `/admin` is redirected to `/`.
- **R23.** Admins can add a category (title only) and delete a category. Deleting a category also deletes its public activities and shows a warning first. Personal copies are unaffected.
- **R24.** Admins can add a public activity and delete one. It has the same shape as an AI activity:
  - category, title, and pasted Markdown body
  - type, subject, place and duration (required)
  - equipment, teams, Shabbat and notes (optional)

  There is no editing and no AI. Type is chosen by key, with generic labels: פעולת תוכן (`content`), נקודת מבט (`pointOfView`), הישרדות (`survival`), משחק (`playTime`).

### Ads and analytics
- **R25.** `<AdSlot>` placeholders render nothing unless `NEXT_PUBLIC_ADS_ENABLED=true`. There is no analytics.

## Form choices

### Group page (all required)

| Field | Choices |
| --- | --- |
| Movement (תנועה) | 16 movements from `src/data/movements.json` (below) |
| Grade (כיתה) | כיתה א׳, כיתה ב׳, כיתה ג׳, כיתה ד׳, כיתה ה׳, כיתה ו׳, כיתה ז׳, כיתה ח׳, כיתה ט׳, כיתה י׳, כיתה י״א, כיתה י״ב |
| Group size (מספר חניכים) | 1-5, 5-10, 10-20, 20-30, 30+ |
| Gender (הרכב) | בנים, בנות, מעורב |

### Activity page

| Field | Required | Choices |
| --- | --- | --- |
| Type (סוג) | Yes | Depends on the movement (below). Defaults to the movement's first type. |
| Subject (נושא) | Yes | Free text, up to **21 characters**, with a ✨ suggestion button (R26) |
| Place (מקום) | Yes | לא משנה, במקום סגור, במקום פתוח |
| Duration (משך) | Yes | חצי שעה, שעה, שעה וחצי |
| *Collapsed "more options" section:* | | |
| Equipment (ציוד) | No | לא משנה, ללא ציוד |
| Teams (חלוקה לקבוצות) | No | לא משנה, עם חלוקה לקבוצות, ללא חלוקה לקבוצות |
| Shabbat (שבת) | No | לא משנה, מותאם לשומרי שבת |
| Notes (הערות) | No | Free text, up to 1000 characters |

Free-text fields reject links (URLs).

### Movements and types (`src/data/movements.json`)

The type key picks the prompt template. The label is what the guide sees.

```json
[
  { "key": "scout", "label": "צופים", "types": [
    { "key": "content", "label": "פעולת תוכן" },
    { "key": "pointOfView", "label": "נקודת מבט" },
    { "key": "survival", "label": "זמן צופיות" },
    { "key": "playTime", "label": "זמן משחק" } ] },
  { "key": "oved", "label": "הנוער העובד והלומד", "types": [
    { "key": "content", "label": "מתודה מרכזית" },
    { "key": "playTime", "label": "משחק פתיחה" },
    { "key": "pointOfView", "label": "מתודת הצפה" } ] },
  { "key": "akiva", "label": "בני עקיבא", "types": [
    { "key": "content", "label": "פעולה ערכית" },
    { "key": "playTime", "label": "משחקי גיבוש" } ] },
  { "key": "maccabi", "label": "מכבי צעיר", "types": [
    { "key": "content", "label": "פעולה ערכית" },
    { "key": "playTime", "label": "משחקי גיבוש" } ] },
  { "key": "camps", "label": "המחנות העולים", "types": [
    { "key": "content", "label": "פעולה ערכית" },
    { "key": "playTime", "label": "משחקי קבוצה" } ] },
  { "key": "shomer", "label": "השומר הצעיר", "types": [
    { "key": "content", "label": "פעולה ערכית" },
    { "key": "playTime", "label": "משחק קבוצתי" } ] },
  { "key": "bitar", "label": "נוער לאומי ביתר", "types": [
    { "key": "content", "label": "פעולה ערכית" },
    { "key": "playTime", "label": "משחקי גיבוש" } ] },
  { "key": "hadasha", "label": "הנוער השומר", "types": [
    { "key": "content", "label": "פעולה ערכית" },
    { "key": "playTime", "label": "משחקי גיבוש" } ] },
  { "key": "netzach", "label": "נצח ישראל", "types": [
    { "key": "content", "label": "פעולה ערכית" },
    { "key": "playTime", "label": "משחקי גיבוש" } ] },
  { "key": "medtchim", "label": "ארגון המד״צים", "types": [
    { "key": "content", "label": "פעולה ערכית" },
    { "key": "playTime", "label": "משחקי קבוצה" } ] },
  { "key": "meshachim", "label": "מדריכי של״ח צעירים", "types": [
    { "key": "content", "label": "פעילות תוכן" },
    { "key": "playTime", "label": "משחק שטח" } ] },
  { "key": "sayarut", "label": "חוגי סיירות", "types": [
    { "key": "content", "label": "פעילות שטח" },
    { "key": "survival", "label": "הישרדות" },
    { "key": "playTime", "label": "משחק" } ] },
  { "key": "noam", "label": "נוע״ם", "types": [
    { "key": "content", "label": "פעולה ערכית" },
    { "key": "playTime", "label": "משחק קבוצתי" } ] },
  { "key": "agricultural", "label": "האיחוד החקלאי", "types": [
    { "key": "content", "label": "פעולה ערכית" },
    { "key": "playTime", "label": "משחק קבוצתי" } ] },
  { "key": "shinshin", "label": "שינשינים", "types": [
    { "key": "content", "label": "פעילות תוכן" },
    { "key": "playTime", "label": "משחק גיבוש" } ] },
  { "key": "other", "label": "אחר", "types": [
    { "key": "content", "label": "פעילות" },
    { "key": "playTime", "label": "משחק" },
    { "key": "survival", "label": "הישרדות" } ] }
]
```

When the movement changes, keep the selected type if the new movement has it; otherwise select the new movement's first type.

## Out of scope for v1

About/FAQ/contact/privacy pages (v2), analytics, real ads, dark mode, AI refinement of an activity, multiple groups, editing public activities, search.
