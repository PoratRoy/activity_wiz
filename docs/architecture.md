# Architecture

## Stack

| Concern | Choice |
| --- | --- |
| Framework | Next.js (latest stable, App Router), TypeScript, React Server Components |
| Styling | Plain CSS: CSS Modules per component plus `globals.css` tokens. No Tailwind. |
| Icons | `lucide-react` |
| Font | Rubik via `next/font/google` |
| Hosting | Cloudflare Workers via `@opennextjs/cloudflare` (with `nodejs_compat`) |
| Database | Cloudflare D1 + Drizzle ORM (`drizzle-orm/d1`, `drizzle-kit`) |
| Rate limit | Cloudflare Durable Object `RateLimiter` |
| Auth | Auth.js v5 (`next-auth@beta`), Google provider, **JWT sessions, no adapter** |
| AI | Gemini via `@google/genai` |
| Editor | Tiptap (`@tiptap/react`, StarterKit, Underline) with Markdown in/out (`tiptap-markdown`) |
| Markdown render | `marked` on the server, sanitized with an allowlist (headings, p, strong, em, u, ul, ol, li, br) |
| IDs | `nanoid` |
| Package manager | npm |

## Folder structure

```
src/
  app/
    layout.tsx               # <html lang="he" dir="rtl">, font, getViewer() → AppShell
    globals.css              # tokens + base
    page.tsx                 # landing
    create/
      group/page.tsx
      activity/page.tsx
      generating/page.tsx
      actions.ts             # saveGroup, generateActivity
    activity/
      draft/page.tsx
      [id]/page.tsx
      actions.ts             # updateActivity, deleteActivity, claimDraft
    my/page.tsx
    library/
      page.tsx
      [cat]/page.tsx
      [cat]/[act]/page.tsx
      actions.ts             # copyPublicActivity
    admin/
      page.tsx
      category/[id]/page.tsx
      activity/new/page.tsx
      actions.ts             # createCategory, deleteCategory, createPublicActivity, deletePublicActivity
    api/auth/[...nextauth]/route.ts
    sitemap.ts
    robots.ts
  components/                # see docs/design.md
  data/movements.json        # plus topic-suggestions.json, options.ts (grades, sizes, genders, places, durations, optional fields)
  lib/
    db/{schema.ts,client.ts,queries.ts}
    auth/{config.ts,session.ts,admin.ts}
    ai/{gemini.ts,schema.ts,generate.ts}
    guest/{cookie.ts,storage.ts}   # signed cookie (server); localStorage/sessionStorage helpers (client)
    markdown/{fromAi.ts,toWhatsApp.ts,toPlain.ts,render.ts}
    validate.ts              # option allowlists, link detection, lengths
    slug.ts                  # slugify(hebrew) + parseId
    env.ts                   # getCloudflareContext() bindings + typed env
  prompts/{system.ts,structure.ts,build.ts}
  worker/rate-limiter.ts     # Durable Object class
worker.ts                    # custom Worker entry: re-exports OpenNext handler + RateLimiter
drizzle/                     # SQL migrations
wrangler.jsonc
open-next.config.ts
drizzle.config.ts
```

## Request model

- **Reads:** Server Components call `lib/db/queries.ts` directly.
- **Writes:** Server Actions (`actions.ts` files). Every action re-checks the session, ownership and admin status on the server. Nothing from the client is trusted.
- **Bindings:** `getCloudflareContext().env` (`DB`, `RATE_LIMITER`), accessed inside request scope only.
- No middleware or proxy: auth checks happen inside pages and actions.

## Auth

- `lib/auth/config.ts`: `NextAuth({ providers: [Google], session: { strategy: 'jwt' }, callbacks })`.
  - `jwt({ token, profile })`: on sign-in, `upsertUserByGoogleSub(profile)` and put `token.uid = users.id`.
  - `session({ session, token })`: `session.user.id = token.uid`.
- `lib/auth/session.ts`: `getUserId()` → `string | null`.
- `lib/auth/admin.ts`: `isAdmin(email)` parses `ADMIN_EMAILS` (a JSON string array) on each call and compares emails lowercased. If the value is missing or invalid, nobody is an admin. `requireAdmin()` redirects to `/` when the check fails.
- The root layout reads the session on the server (`getViewer()`) and passes `{ signedIn, name, image, isAdmin }` to the client shell through `ViewerProvider`. Every page is rendered per request with no caching, so nothing leaks between users. There is no `SessionProvider`.
- Config is lazy (`NextAuth(() => config)`), with secrets read from the Cloudflare env on each request. The admin check also requires Google's `email_verified`.
- Sign-in uses `signIn('google', { redirectTo })`. The draft page passes `/activity/draft?claim=1`.

## Guest identity

`lib/guest/cookie.ts` signs `{ id, trialStart? }` with HMAC-SHA256 (Web Crypto, `GUEST_COOKIE_SECRET`). The cookie is `aw_guest`: HttpOnly, Secure, SameSite=Lax, 1-year max-age. It's created on the first generation attempt. Pages under `/create/*` read it on the server to decide whether to show `SignInGate`.

## Public pages and SEO

- `/`, `/library`, `/library/[cat]` and `/library/[cat]/[act]` are server-rendered dynamically (`export const dynamic = 'force-dynamic'`), with no caching, so admin changes show immediately.
- Each has `generateMetadata`: a Hebrew title (`{title} | ActivityWiz`), a description (an excerpt), `alternates.canonical`, and Open Graph in the `he_IL` locale.
- Public activity pages include JSON-LD of type `Article` (`headline`, `inLanguage: "he"`, `datePublished`).
- `sitemap.ts` is generated dynamically from D1: `/`, `/library`, every category and every activity.
- `robots.ts` allows everything except `/create`, `/activity`, `/my`, `/admin` and `/api`. Those pages also set `robots: { index: false }`.
- A URL whose slug doesn't match redirects to the canonical one. A missing ID shows `notFound()`.

## Environment

| Name | Kind | Purpose |
| --- | --- | --- |
| `DB` | D1 binding | Database |
| `RATE_LIMITER` | Durable Object binding | `RateLimiter` class |
| `AUTH_SECRET` | secret | Auth.js |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | secret | Google OAuth |
| `AUTH_TRUST_HOST` | var `true` | Needed behind Workers |
| `ADMIN_EMAILS` | secret | e.g. `["someone@gmail.com"]` |
| `GEMINI_API_KEY` | secret | Paid key |
| `GEMINI_MODEL` | var | Flash-Lite model ID |
| `GUEST_COOKIE_SECRET` | secret | Guest cookie HMAC |
| `NEXT_PUBLIC_SITE_URL` | var | Canonical URLs and sitemap (`https://<app>.workers.dev` until there's a domain) |
| `NEXT_PUBLIC_ADS_ENABLED` | var | `true` shows `AdSlot` placeholders |

Locally, use `.dev.vars` for Wrangler and `.env.local` for `next dev`. `initOpenNextCloudflareForDev()` in `next.config.ts` exposes the local D1 and Durable Object bindings to `next dev`. Both files are gitignored, and `.dev.vars.example` lists the names.

## Wrangler config (`wrangler.jsonc`) essentials

- `main: "worker.ts"`, `compatibility_flags: ["nodejs_compat"]`, and a current pinned `compatibility_date`.
- `assets: { directory: ".open-next/assets", binding: "ASSETS" }`
- `d1_databases: [{ binding: "DB", database_name: "activitywiz", database_id: "…", migrations_dir: "drizzle" }]`
- `durable_objects.bindings: [{ name: "RATE_LIMITER", class_name: "RateLimiter" }]`, plus a `migrations` entry with `new_sqlite_classes: ["RateLimiter"]`.

`worker.ts`:
```ts
export { default } from './.open-next/worker.js';
export { RateLimiter } from './src/worker/rate-limiter';
```

## Deployment

- Cloudflare **Workers Builds** is connected to `PoratRoy/activity_wiz`, branch `main`.
- Build command: `npm run cf:build`. Deploy command: `npm run deploy`, which runs `wrangler d1 migrations apply DB --remote && opennextjs-cloudflare deploy`. The D1 database `activitywiz` (`c31527e6-0a23-4229-a7ed-2872df3884e1`, region WEUR) exists, and migration `0000` is applied.
- After changing `wrangler.jsonc`, run `npm run cf-typegen` to regenerate `cloudflare-env.d.ts`. It's committed so builds can typecheck.
- One production environment. No previews or staging.
- Before each push, run `npm run typecheck` and `npm run build` locally. There is no test suite.
- One-time setup (done by the owner, steps in the implementation plan):
  1. Create the D1 database.
  2. Set the secrets.
  3. Create a Google OAuth client with the redirect URI `{SITE_URL}/api/auth/callback/google`.
  4. Connect Workers Builds.
