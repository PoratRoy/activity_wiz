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

## ☐ 3. App shell and base components
- `AppShell`, `TopBar`, `BottomNav`, `AvatarMenu` (guest version for now), `Button`, `Tile`/`TileGroup`, `PickerSheet`, `TextField`/`TextArea`, `Collapsible`, `Chip`, `Modal`, `Toast`/`ToastHost`, `EmptyState`, `AdSlot`, and the `Mascot` plus illustrations.
- A temporary page at `/dev/ui` showing every component. Delete it in step 13.

## ☐ 4. Auth
- Auth.js v5 config with Google and JWT, upserting the user in the `jwt` callback.
- `SessionProvider`. `AvatarMenu` signed-in/guest states with sign in, sign out and the admin link.
- `lib/auth/admin.ts`.
- **Owner setup:**
  1. Create a Google OAuth client.
  2. Set `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` and `ADMIN_EMAILS` as secrets in Cloudflare and in `.dev.vars`/`.env.local`.

## ☐ 5. Create flow: group and activity pages
- `src/data/movements.json` and `options.ts`.
- `/create/group`: prefill, `saveGroup` action (registered) and localStorage (both).
- `/create/activity`: type tiles depend on the movement; the optional section; sessionStorage persistence; client validation; navigation to `/create/generating`.
- `SubjectField` with ✨ suggestions from `src/data/topic-suggestions.json` (already in the repo) and the 21-character limit.
- `lib/validate.ts`, shared by the client and server.

## ☐ 6. Guest cookie and trial gate
- `lib/guest/cookie.ts` (sign/verify, HMAC).
- A server check on `/create/*` that renders `SignInGate` when the trial has expired.
- The Create tab and landing button go to the gated route.

## ☐ 7. Rate limiter Durable Object
- `src/worker/rate-limiter.ts`, the binding and migration in `wrangler.jsonc`, the export from `worker.ts`.
- A `rateLimit(key)` helper in `lib/`.

## ☐ 8. AI generation
- `lib/ai/schema.ts` (response schema + type guard), `lib/ai/gemini.ts` (client, safety settings, timeout).
- `src/prompts/{system,structure,build}.ts` (one shared prompt builder: English instructions, Hebrew output).
- `lib/markdown/fromAi.ts`.
- The `generateActivity` action implementing every step in `ai.md`.
- `/create/generating` with the loading animation, tips, the AI notice, and all outcome states (ok, refused, rate-limited, busy, error, trial expired).
- **Owner setup:** set `GEMINI_API_KEY` and `GEMINI_MODEL`.

## ☐ 9. Activity view, copy and share
- `lib/markdown/render.ts` (sanitized), `toWhatsApp.ts`, `toPlain.ts`, and the share button (`navigator.share` with a `wa.me` fallback).
- The `ActivityView` and `ActionBar` components.
- `/activity/[id]` (owner check) and `/activity/draft` (localStorage, sign-in banner, `?claim=1` → `claimDraft`).

## ☐ 10. Edit, autosave and delete
- `ActivityEditor` (Tiptap, dynamic import, bold/underline/lists, Markdown in/out, 3000-character limit).
- Autosave every 2 seconds through `updateActivity`, with the status indicator. Drafts save to localStorage.
- `deleteActivity` with a confirmation modal, then a redirect to `/my` and a toast.

## ☐ 11. My activities
- `/my` list, newest first, with date format, delete from the ⋯ menu, empty state, and the guest redirect and tab lock.

## ☐ 12. Public library and SEO
- `lib/slug.ts`.
- `/library`, `/library/[cat]` and `/library/[cat]/[act]`, with `CategoryCard`, `ActivityCard`, `AdSlot` placement, canonical redirects, `generateMetadata` and JSON-LD.
- `copyPublicActivity` and the "save to my activities" button.
- `sitemap.ts`, `robots.ts`, and `noindex` on private routes.

## ☐ 13. Admin
- `/admin` (category list, + category modal, delete with a cascade warning and count).
- `/admin/category/[id]` (activities, delete).
- `/admin/activity/new` (category select, title, Markdown textarea with live preview, publish).
- Every page and action calls `requireAdmin()`.
- Remove `/dev/ui`.

## ☐ 14. Landing page and polish
- `/` hero, mascot, buttons (by sign-in state), library strip, metadata.
- Go through every screen at 360px and 480px widths and on desktop: RTL details, safe-area padding, focus states, reduced motion, Hebrew copy review.

## ☐ 15. Production check
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
