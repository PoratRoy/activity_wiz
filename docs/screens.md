# Screens

All screens share the app shell from [Design](design.md): a top bar (back arrow on the right, title in the center, avatar on the left) and a bottom tab bar (בית, יצירה, מאגר, הפעולות שלי). Rule numbers (R#) refer to [Product](product.md).

## Route map

| Route | Screen | Access | Indexed |
| --- | --- | --- | --- |
| `/` | Landing | Everyone | Yes |
| `/create/group` | Group page | Everyone (trial gate) | No |
| `/create/activity` | Activity page | Everyone (trial gate) | No |
| `/create/generating` | Loading page | Everyone (trial gate) | No |
| `/activity/draft` | Guest result | Guests | No |
| `/activity/[id]` | Personal activity | Owner | No |
| `/my` | My activities | Registered | No |
| `/library` | Library: categories | Everyone | Yes |
| `/library/[cat]` | Category: activity list | Everyone | Yes |
| `/library/[cat]/[act]` | Public activity | Everyone | Yes |
| `/admin` | Admin: categories | Admin | No |
| `/admin/category/[id]` | Admin: category activities | Admin | No |
| `/admin/activity/new` | Admin: new public activity | Admin | No |
| `/admin/activity/[id]` | Admin: edit public activity | Admin | No |
| `/admin/message` | Admin: message to all users | Admin | No |

`[cat]` and `[act]` are `{hebrew-slug}-{id}`, for example `משחקי-פתיחה-k3x9q2`. The page looks up the record by the ID after the last `-`. If the slug part doesn't match the current title, the page redirects to the correct URL.

## Shell behavior

- **Back arrow:** shown on every page that isn't a tab root (`/`, `/create/group`, `/my`, `/admin`); `/library` also shows it (owner request, 2026-10-20) and goes back in history, or home. It goes to the logical parent: activity page → group page, category → library, public activity → category, and so on.
- **Avatar menu (top left):**
  - Signed in: their Google photo in a circle. Tapping it opens a menu with **התנתקות** (sign out) and, for admins only, **ניהול** (admin).
  - Guest: a generic person icon. Tapping it opens a menu with **התחברות עם Google** (sign in with Google).
- **Bottom tabs:** בית `/`, יצירה `/create/group`, מאגר `/library`, הפעולות שלי `/my`. The active tab shows a green pill. Guests see הפעולות שלי with a lock icon; tapping it opens the sign-in popup instead of navigating.
- **Broadcast message:** checked once per Google sign-in. The sign-in sets `checkMessage` in the session token; on the first page load after it (and after the terms popup is accepted), `MessageGate` asks the server for the current message, if the user hasn't dismissed it. The popup shows the title and body with **אישור**, or, when the message has a form, a feedback field with **שליחה** and **סגירה**. Any dismissal (a button, tapping outside, Escape or sending feedback) saves the message ID on the user and clears `checkMessage`, so it never shows again. Feedback is emailed like the contact form, with the subject «ActivityWiz – משוב על: <title>», and the popup shows «תודה!» before closing. Guests never see it. Users who stay signed in see a new message only at their next sign-in.
- **Trial gate:** on any `/create/*` route, an expired guest sees the blocking sign-in popup (R3). The Create tab and the landing page button lead there too.

## Landing `/`

- The mascot, the name **ActivityWiz**, the headline «פחות לתכנן. יותר להדריך.» and the pitch «פעולה מוכנה בדקה, מותאמת לגיל ולקבוצה שלכם.» (the pitch avoids «שבט», which only fits some movements).
- One button for everyone: **יצירת פעולה עם AI** (owner decision, 2026-10-22). Guests keep their free trial, so it leads straight to `/create/group`; sign-in stays in the avatar menu and in the trial-ended and «הפעולות שלי» popups.
- Guests also see a quiet underlined **התחברות** link beside the avatar in the landing header (2026-10-22); it starts Google sign-in and returns to `/`. Signed-in visitors don't see it.
- No "how it works" list (owner decision, 2026-10-21: the app is simple enough without it). No library strip (owner decision, 2026-10-19); the library is reached from the bottom tabs.
- Has its own metadata for SEO.

## Group page `/create/group`

- Title: «הקבוצה שלי»
- Fields:
  - Movement: a bottom-sheet picker
  - Grade: a bottom-sheet picker
  - Group size: tiles
  - Gender: tiles
- Prefilled from the account (registered) or localStorage (guest). Empty fields start unselected.
- **המשך** (continue) stays disabled until all 4 are filled. Tapping it saves the group (R4/R5) and goes to `/create/activity`.

## Activity page `/create/activity`

- Title: «הפעולה»
- Fields:
  - Type: tiles, filtered by the movement
  - Subject: a text input (max 21 characters), placeholder «על מה הפעולה?». A ✨ button on the inline end fills in a random suggestion for the type (R26). Typing past 21 characters is blocked, and the toast «נושא קצר, עד 21 תווים» appears once.
  - Place: tiles
  - Duration: tiles
  - **עוד אפשרויות** (more options): a collapsible section with three switches (ללא ציוד, ללא קבוצות, מותאם לשמירת שבת; all off by default) and notes (textarea labelled «הערות (עד 200 מילים)»)
- If no group exists in localStorage or the account, redirect to `/create/group`.
- Values persist in sessionStorage, so going back and forth doesn't lose them.
- **יצירת הפעולה** (create the activity) is enabled when the required fields are filled. Tapping it stores the full request in sessionStorage and goes to `/create/generating`.

## Loading `/create/generating`

- If there's no request in sessionStorage, redirect to `/`.
- Calls the `generateActivity` server action once when the page mounts. While it runs, the page is a full-screen sage (`#E7EFDF`) view with no top bar, bottom tabs or ad bar (owner decision, 2026-10-22: the wait is only a few seconds). Centered, it shows only:
  - the generating animation (`public/animations/generating.webp`, 240px wide)
  - a thin 160 × 6px progress bar (`#CBDAC2` track, forest-green fill) that fills over about 15 seconds and then waits at about 90%
  - the AI notice line (R27) below it, 14px muted text
- The result views (refused, rate limited, list full, busy, errors) use the same full-screen sage layout with no top bar, tabs or ad bar (canvas option "Error A", 2026-10-22): the compass illustration, the message in forest green (24px) and full-width action buttons below it. Their buttons are the way out.
- Results:
  - **Success, registered:** clear the request, then `router.replace('/activity/[id]')`.
  - **Success, guest:** save the draft to localStorage, then `router.replace('/activity/draft')`.
  - **Refused (R11):** illustration plus «הנושא הזה לא מתאים לפעולה עם חניכים. נסו נושא אחר 🙂». The **נושא אחר** (another topic) button goes back to `/create/activity` with the values kept.
  - **Rate limited:** «רגע… אפשר ליצור פעולה חדשה בעוד X שניות», with a countdown and then **נסו שוב** (try again).
  - **List full (R8b):** «הגעתם ל-200 פעולות שמורות. מחקו פעולות ישנות כדי לשמור חדשות», with **לפעולות שלי** and **חזרה**.
  - **High demand (R28):** «יש עומס כרגע, נסו שוב בעוד רגע», with **נסו שוב**.
  - **Error/timeout (R12):** «משהו השתבש», with **נסו שוב** (calls the action again, subject to the rate limit) and **חזרה** (back to the activity page).

## Not found (404)

- `src/app/not-found.tsx` renders for any unknown URL and wherever a page calls `notFound()` (a missing library category or activity).
- Same full-screen sage layout as the generating error views (canvas option "404 A", 2026-10-22), with no top bar, tabs or ad bar: the compass illustration, «הדף הזה לא נמצא», «אולי הקישור ישן, או שהפעולה כבר לא קיימת.», then **למסך הבית** (`/`) and **לפעולות מוכנות** (`/library`). Not indexed.

## Activity view: shared layout

Used by `/activity/draft`, `/activity/[id]` and `/library/[cat]/[act]`:

1. Chips: type · place · duration.
2. Title (H1).
3. Body: rendered Markdown at reading size.
4. `<AdSlot>`.
5. A sticky action bar above the bottom tabs:
   - **העתקה** (copy): copies plain text, then shows the toast «הועתק!».
   - **שיתוף** (share): `navigator.share({ title, text })`, with the text in WhatsApp format followed by the site link. Falls back to `https://wa.me/?text=…` with the same text.
   - **עריכה** (edit): draft and personal only.
   - **⋯** menu with **מחיקה** (delete): personal only.
   - **שמירה לפעולות שלי** (save to my activities): public only, signed in only.

### Edit mode (draft and personal)
- **עריכה** turns the title into an input and the body into a Tiptap editor, with a toolbar for bold, underline, bulleted list and numbered list. The body is limited to 3000 characters (R29), with the warning «הגעתם למגבלת 3000 התווים».
- The action bar becomes **סיום עריכה** (finish editing) plus a status: «שומר…» (saving) / «נשמר» with a check (saved; a small spinner shows while saving, in the same spot) / «שגיאה בשמירה» (save error). Personal activities autosave 2 seconds after typing stops. Drafts save to localStorage.

### `/activity/draft`
- If there's no draft in localStorage, redirect to `/`.
- Shows a yellow banner: «רוצה לשמור את הפעולה? התחברו עם Google» with a sign-in button. The sign-in callback URL is `/activity/draft?claim=1`.
- With `?claim=1` and a signed-in session, the page calls `claimDraft(draft)`, removes the draft from localStorage and replaces the URL with `/activity/[newId]` (R13).
  - While it saves, the page shows the generating screen's full-screen sage view (2026-10-22): the generating animation, the thin progress bar (about 90% over 4 seconds) and «שומרים את הפעולה…», with no top bar, tabs or ad bar.

### `/activity/[id]`
- Server-checks that the viewer is the owner. If not, or if the activity doesn't exist, redirect to `/my`.
- Delete: a confirmation modal «למחוק את הפעולה?» with **מחיקה** and **ביטול** (cancel). After deleting, go to `/my` and show the toast «הפעולה נמחקה».

## My activities `/my`

- Guests are redirected to `/` (the tab itself opens the sign-in popup).
- A list of cards: title, then the date as `dd.mm.yy`. Tapping a card opens the activity. The ⋯ menu has delete, with confirmation.
- Empty state: an illustration, «עוד אין פעולות», and a **יצירת פעולה** (create an activity) button.

## Library `/library`

- Title: «מאגר פעולות»
- Back arrow (previous in-app page, or home) and one visible title in the pinned forest masthead.
- A single column of full-width category rows (name, the category's illustration thumbnail; no activity counts). In the admin-set order (R19). No in-list ad slot. See [Design](design.md) → Library.
- Empty state: «המאגר מתמלא בקרוב».

## Category `/library/[cat]`

- Title: the category title.
- A list of activity cards (title plus a 2-line excerpt), in the admin's order (new ones first). `<AdSlot>` after the 3rd card.
- Empty state: «אין עדיין פעולות בקטגוריה».

## Public activity `/library/[cat]/[act]`

- The shared activity view, read-only.
- Signed-in users see **שמירה לפעולות שלי**. Tapping it runs `copyPublicActivity`, opens `/activity/[newId]` and shows the toast «נשמר לפעולות שלי». Guests don't see the button.

## Admin `/admin`

- A non-admin is redirected to `/` by a server check.
- Looks like the library (same forest masthead, ivory sheet and raised rows with the category thumbnail), plus each row's activity count and English name, and two buttons at the top: **+ קטגוריה** (new category) and **+ פעולה** (new activity).
- **+ קטגוריה** opens a modal with **שם הקטגוריה** (Hebrew title), **שם באנגלית** (English key: letters, digits, `-`, `_`, starting with a letter; unique ignoring case) and **הוספה** (add). Under the key, a preview shows the image it matches in `public/library`, or says the default image will be used.
- Tapping a row's thumbnail opens the same English-name field and preview to change that category's key.
- Adding artwork: put `<key>.webp` in `public/library`, run `node scripts/library-thumbs.mjs` (thumbnails + `src/data/libraryImages.json`), and deploy.
- **שינוי סדר** (shown with 2+ categories) switches the list to reorder mode: each row gets up/down arrows and every move is saved immediately; **סיום** returns to the normal list. The library uses the same order.
- Each category row has a trash icon. Tapping it shows the confirmation «למחוק את הקטגוריה וכל X הפעולות שבה? פעולות שמורות של משתמשים לא יימחקו.»
- Tapping a row opens `/admin/category/[id]`.

## Admin message `/admin/message`

- Linked from `/admin` with the **הודעה למשתמשים** button.
- Shows when the current message was sent and how many users have seen it out of all users («ראו אותה X מתוך Y משתמשים»), or «עדיין לא נשלחה הודעה».
- Fields, prefilled with the current message: **כותרת** (title), **תוכן ההודעה** (body) and an **עם טופס משוב** (with feedback form) switch.
- **שליחה לכל המשתמשים** asks for confirmation, then replaces the message with a new ID: every signed-in user sees it once at their next sign-in, even if they saw the previous one.

## Admin category `/admin/category/[id]`

- A list of the category's public activities in the admin's order (new ones first). Each has a trash icon with a confirmation step.
- **שינוי סדר** (shown with 2+ activities) works like the category list: up/down arrows, each move saved immediately, **סיום** to return. The library category page uses the same order.
- Tapping an activity opens `/admin/activity/[id]` to edit it.
- A **+ פעולה** button opens `/admin/activity/new?category=[id]`.

## Admin new activity `/admin/activity/new`

- Fields:
  - category (select) and title (input)
  - type (tiles with the generic labels), subject, place and duration (tiles), all required
  - a collapsible "more options" section: equipment, teams, Shabbat and notes
  - body: a large textarea for pasting Markdown, with a live preview under it
- **פרסום** (publish) creates the activity and goes to `/admin/category/[id]` with the toast «פורסם».

## Admin edit activity `/admin/activity/[id]`

- The same form as the new-activity screen, prefilled with the activity's current values. The category can be changed too.
- **שמירה** (save) updates the activity in place and goes to `/admin/category/[id]` with the toast «השינויים נשמרו». Personal copies users already saved are unaffected.
