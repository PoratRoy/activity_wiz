# Implementation plan

Each step ends with `npm run typecheck && npm run build`, then a commit and push to `main`. From step 1 onward, each push deploys to production. Mark steps ☑ when done.

## ☑ 1. Scaffold and deploy a "hello world"
- Create a Next.js app (TypeScript, App Router, `src/`, no Tailwind, no ESLint prompts).
- Add `@opennextjs/cloudflare` and `wrangler`, then set up `open-next.config.ts` (no incremental cache), `wrangler.jsonc` and the npm scripts (`dev`, `build`, `typecheck`, `cf:build`, `preview`, `deploy`, `cf-typegen`). `cacheComponents` is off. The custom `worker.ts` entry comes in step 7, and the DB scripts in step 2.
- In `layout.tsx`: `lang="he" dir="rtl"`, the Rubik font, `globals.css` with all tokens from `design.md`, and the centered phone column.
- `.gitignore`, `.dev.vars.example`.
- **Owner setup:**
  1. ☑ `npx wrangler login`.
  2. ☑ Create the D1 database `activitywiz` (done in step 2).
  3. ☐ Connect Workers Builds to the repo (build `npm run cf:build`, deploy `npm run deploy`).
  4. ☐ Confirm the `*.workers.dev` URL loads.

## ☑ 2. Database
- Drizzle schema for the 4 tables (`data-model.md`), `drizzle.config.ts`, and the first migration.
- `lib/db/client.ts` (`drizzle(env.DB)`) and `queries.ts`.
- Apply the migration locally. The deploy script applies it remotely.

## ☑ 3. App shell and base components
- `AppShell`, `TopBar`, `BottomNav`, `AvatarMenu` (guest version for now), `Button`, `Tile`/`TileGroup`, `PickerSheet`, `TextField`/`TextArea`, `Collapsible`, `Chip`, `Modal`, `Toast`/`ToastHost`, `EmptyState`, `AdSlot`, and the `Mascot` plus illustrations.
- A temporary page at `/dev/ui` showing every component. Delete it in step 13.

## ☑ 4. Auth
- Auth.js v5 config with Google and JWT, upserting the user in the `jwt` callback.
- A server-side `getViewer()` in the layout feeds the shell. `AvatarMenu` signed-in/guest states with sign in, sign out and the admin link. Until step 6, the locked tab goes straight to Google sign-in.
- `lib/auth/admin.ts`.
- **Owner setup:**
  1. Create a Google OAuth client.
  2. Set `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` and `ADMIN_EMAILS` as secrets in Cloudflare and in `.dev.vars`/`.env.local`.

## ☑ 5. Create flow: group and activity pages
- `src/data/movements.json` and `options.ts`.
- `/create/group`: prefill, `saveGroup` action (registered) and localStorage (both).
- `/create/activity`: type tiles depend on the movement; the optional section; sessionStorage persistence; client validation; navigation to `/create/generating`.
- `SubjectField` with ✨ suggestions from `src/data/topic-suggestions.json` (already in the repo) and the 21-character limit.
- `lib/validate.ts`, shared by the client and server.
- `/create/generating` is a temporary page that shows the stored request until step 8.

## ☑ 6. Guest cookie and trial gate
- `lib/guest/cookie.ts` (sign/verify, HMAC).
- A server check on `/create/*` that renders `SignInGate` when the trial has expired.
- The Create tab and landing button go to the gated route.
- The locked "הפעולות שלי" tab opens the same `SignInGate` in its non-blocking form ("לא עכשיו").
- "חזרה" goes back only within the app (`canGoBackInApp`), otherwise to `/`.
- The trial *start* is written by `generateActivity` in step 8; until then no real guest reaches the gate.

## ☑ 7. Rate limiter Durable Object
- `src/worker/rate-limiter.ts`, the binding and migration in `wrangler.jsonc`, the export from `worker.ts`.
- A `hitRateLimit(key)` helper in `lib/rate-limit.ts`. Under `next dev` it uses an in-memory fallback, because Wrangler's platform proxy can't host our own DO class. `npm run preview` and production use the real DO.

## ☑ 8. AI generation
- `lib/ai/schema.ts` (response schema + type guard), `lib/ai/gemini.ts` (client, safety settings, timeout).
- `src/prompts/{system,structure,build}.ts` (one shared prompt builder: English instructions, Hebrew output).
- `lib/markdown/fromAi.ts`.
- The `generateActivity` action implementing every step in `ai.md`.
- `/create/generating` with the loading animation, tips, the AI notice, and all outcome states (ok, refused, rate-limited, busy, error, trial expired).
- **Owner setup:** set `GEMINI_API_KEY` (done). `GEMINI_MODEL` is `gemini-3.5-flash-lite` in `wrangler.jsonc`, because Google no longer offers `gemini-2.5-flash-lite` to new users.
- The SDK's default 5 retries are disabled (`retryOptions.attempts: 1`) so each attempt is one call (R9).


## ☑ 9. Activity view, copy and share
- `lib/markdown/render.ts` (sanitized), `toWhatsApp.ts`, `toPlain.ts`, and the share button (`navigator.share` with a `wa.me` fallback).
- The `ActivityView` and `ActionBar` components.
- `/activity/[id]` (owner check) and `/activity/draft` (localStorage, sign-in banner, `?claim=1` → `claimDraft`).

## ☑ 10. Edit, autosave and delete
- `ActivityEditor`: Tiptap v3 + `@tiptap/markdown`, dynamic import, bold/underline/lists, and a 6000-character limit via `CharacterCount` (an over-limit paste is trimmed to fit, with a warning). Underline is stored as `++text++`, and render/copy/share handle it.
- Autosave every 2 seconds through `updateActivity`, with the status indicator. Drafts save to localStorage.
- `deleteActivity` with a confirmation modal, then a redirect to `/my` and a toast.

## ☑ 11. My activities
- `/my` list, newest first, with date format, delete from the ⋯ menu, empty state, and the guest redirect and tab lock.

## ☑ 12. Public library and SEO
- `lib/slug.ts`.
- `/library`, `/library/[cat]` and `/library/[cat]/[act]`, with `CategoryCard`, `ActivityCard`, `AdSlot` placement, canonical redirects, `generateMetadata` and JSON-LD.
- `copyPublicActivity` and the "save to my activities" button.
- `sitemap.ts`, `robots.ts`, and `noindex` on private routes.

## ☑ 13. Admin
- `/admin` (category list, + category modal, delete with a cascade warning and count).
- `/admin/category/[id]` (activities, delete).
- `/admin/activity/new` (category select, title, Markdown textarea with live preview, publish).
- Every page and action calls `requireAdmin()`.
- Remove `/dev/ui`.

## ☑ 14. Landing page and polish
- `/` hero, mascot, buttons (by sign-in state), library strip, metadata.
- Go through every screen at 360px and 480px widths and on desktop: RTL details, safe-area padding, focus states, reduced motion, Hebrew copy review.

## ☑ 15. Production check
- Done 2026-10-19 as a guest on the live URL (19/19): full create flow, 90-minute generation, copy, draft edit, rate limit, trial cookie, guards, 404s, sitemap and robots. Signed-in flows (draft claim, autosave/delete, library copy, admin) were verified locally with test sessions; the owner confirms them once on production with a real Google login.
- Run through it on the live URL:
  1. Guest generation.
  2. Draft claim through sign-in.
  3. Autosave and delete.
  4. Library copy.
  5. Admin add/delete.
  6. Rate-limit message.
  7. Trial expiry: temporarily shorten it locally to confirm the gate.
  8. Check `sitemap.xml` and `robots.txt`.
- Update the docs with anything that changed during the build.

## ☑ 16. Message to all users
- Migration `0009`: the `broadcast_message` table (one row, new ID on every send) and `users.last_seen_message_id`.
- `/admin/message`: title, body and "with feedback form", sent to everyone after a confirmation, with sent date and seen count.
- `MessageGate` in the shell: checked once per Google sign-in (`checkMessage` in the session token, cleared with `unstable_update`), shown after the terms popup, dismissed for good by any close. The feedback form emails through the shared `src/lib/email.ts` helper, which the contact form uses too.

## ☑ 17. Reorder public activities
- Migration `0010`: `public_activity.position`, backfilled newest first per category. New and moved activities go first.
- `/admin/category/[id]` gets the same **שינוי סדר** mode as `/admin`, through the shared `Reorderable` component; the library follows the order.

## ☑ 18. Most popular row
- Migration `0011`: `public_activity.view_count` with an index on (`view_count`, `created_at`).
- `ViewCounter` on the public activity page counts a view after it opens, once a day per browser per activity (no IP check; low stakes).
- A fixed **הכי פופולרי** row first in `/library` (artwork `TopTen.webp`), opening `/library/top` with the top 10; also in the sitemap.
