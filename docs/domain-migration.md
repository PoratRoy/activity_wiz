# Migration: activitywiz.com from Firebase Hosting to the Cloudflare Worker

Goal: serve the new app (today at `https://activitywiz.porat-roy.workers.dev`) on `https://activitywiz.com`,
301-redirect every old URL (e.g. `/he/youth`) to its closest new page, and shut down Firebase completely.
The domain's DNS is already on Cloudflare, so the move is a DNS + Worker change, not a domain transfer.
Planned downtime budget: up to 1 day. Done right, the real gap is a few minutes.

---

## Phase 1 — Inventory the old site (before touching anything)

1. **Collect every old URL that gets traffic or links:**
   - The old `https://activitywiz.com/sitemap.xml` (save a copy — it disappears at cutover).
   - Google Search Console → *Pages* (indexed) and *Performance* → export the top pages (last 12–16 months).
   - Google Analytics (if the old site had it) → landing pages.
   - `firebase.json` of the old project → its `rewrites` / `redirects` / `i18n` rules tell you the URL patterns
     (`/he/...`, `/en/...`, trailing slashes, `index.html` variants).
   - Optional: backlink list (Search Console → *Links*).
2. **Check what else Firebase is doing besides hosting** — Firestore data, Firebase Auth users, Cloud
   Functions, Storage files, a Firebase Analytics stream. Anything still used must be exported or replaced
   before the project is turned off. (If old activities live in Firestore and should exist on the new site,
   import them into D1 first, so they have real new URLs to redirect to.)
3. **Save the current DNS records** for `activitywiz.com` in the Cloudflare dashboard (DNS → Records →
   *Export*). This is your rollback.

## Phase 2 — Build the redirect map

4. Put the old URLs into a sheet with two columns: `old path` → `new path`. Rules of thumb:
   - Every old page with an equivalent → that page (`/he/youth` → the matching `/library/<category>` page,
     or `/library` if there is no 1:1 match).
   - Old language prefixes: `/he/<x>` → new `<x>` mapping; `/he` and `/` → `/`.
   - Old pages with no equivalent → the most relevant category, or `/library`. Avoid sending everything to
     the home page (Google treats mass redirects to `/` as soft 404s).
   - Normalise trailing-slash / `index.html` variants to the same target.
5. Use **permanent** redirects (301/308) and keep them **forever** (at least 1 year).
6. **Implement the map in the new app** (versioned in git, testable before cutover). Two options:
   - **Recommended:** `redirects()` in `next.config.ts` with `permanent: true` (308). Fine for tens to a few
     hundred rules; supports patterns like `/he/:path*`.
   - For a large exact-match list: a small lookup in `worker.ts` before the OpenNext handler, returning
     `Response.redirect(new URL(target, request.url), 301)`.
   - (Alternative outside the code: Cloudflare *Bulk Redirects* in the dashboard. Works too, but lives
     outside git.)
7. **Test on workers.dev:** `curl -sI https://activitywiz.porat-roy.workers.dev/he/youth` should return
   `308`/`301` with the right `Location`. Script this over the whole sheet and fix every mismatch.
   Note: new-site paths must not collide with old ones that you want redirected.

## Phase 3 — Prepare the new app for the real domain (can be done days ahead)

8. **Google OAuth** (Google Cloud Console → Credentials → the OAuth client): add
   - Authorized JavaScript origin: `https://activitywiz.com`
   - Authorized redirect URI: `https://activitywiz.com/api/auth/callback/google`
   Keep the workers.dev entries until after cutover. If the OAuth consent screen lists authorized domains,
   add `activitywiz.com`.
9. **AdSense:** make sure `activitywiz.com` is an approved site and that `public/ads.txt` contains the same
   publisher ID the old site used.
10. **Resend (contact form):** ✅ done — `support.activitywiz.com` is verified in Resend (DKIM TXT
    `resend._domainkey.support`, CNAMEs `rsend.support` / `send.support` as DNS only, `_dmarc` TXT), the
    `RESEND_API_KEY` secret is set on the Worker, and `CONTACT_FROM_EMAIL` is
    `ActivityWiz <noreply@support.activitywiz.com>`. These records are unrelated to the site cutover.
11. **Search engines:** make sure you own a Search Console *Domain* property for `activitywiz.com`
    (DNS TXT verification survives the move). `public/BingSiteAuth.xml` is already in place for Bing.
12. **Prepare the config change** (commit, but don't merge until the cutover window):
    - `wrangler.jsonc` → `"SITE_URL": "https://activitywiz.com"` (canonicals, Open Graph, sitemap, robots
      all read it).
    - Optionally add the domain to `wrangler.jsonc` so it's in git:
      `"routes": [{ "pattern": "activitywiz.com", "custom_domain": true }]`
      (or add it in the dashboard in step 16 — pick one place, not both).
13. **CAA records:** the zone has CAA records allowing only globalsign, comodoca, letsencrypt and digicert.
    If the Worker custom domain's certificate stays *pending* at cutover, add `0 issue "pki.goog"` and
    `0 issue "ssl.com"` (Cloudflare's other CAs).
14. **HSTS heads-up:** `next.config.ts` sends `Strict-Transport-Security ... includeSubDomains`. Once served
    on the apex, browsers will force HTTPS on every subdomain of activitywiz.com. Make sure no subdomain
    needs plain HTTP.

## Phase 4 — Cutover (the downtime window)

15. **Remove the Firebase DNS records** in Cloudflare DNS: the `A` record for `activitywiz.com`
    (`199.36.158.100`), the `www` CNAME to `activity-wizard.web.app`, and the
    Firebase verification `TXT` record. Keep MX, email (SPF/DKIM/DMARC) and other unrelated records.
    A Worker custom domain cannot be added while a conflicting record exists.
16. **Attach the domain to the Worker:** Cloudflare dashboard → Workers & Pages → `activitywiz` →
    Settings → Domains & Routes → *Add* → Custom domain → `activitywiz.com` (and `www.activitywiz.com`).
    Cloudflare creates the DNS record and issues the certificate (usually a few minutes).
    Or merge the commit from step 12 with the `routes` entry and let Workers Builds deploy it.
17. **Merge/deploy the `SITE_URL` change** (step 12) so canonicals and the sitemap point to the new domain.
18. **www → apex:** Rules → Redirect Rules → `www.activitywiz.com/*` → `https://activitywiz.com/${1}`,
    301, preserve query string.
19. **workers.dev:** stop it from serving a duplicate site — set `"workers_dev": false` (and
    `"preview_urls": false`) in `wrangler.jsonc`, or redirect it to the apex. Do this after the custom
    domain works.

## Phase 5 — Verify (same day)

20. Smoke test on `https://activitywiz.com`: home, library, a category, an activity, create flow,
    Google sign-in, contact form, admin, ads loading (browser console: no CSP errors).
21. Re-run the redirect test script from step 7 against `https://activitywiz.com`.
22. Check `https://activitywiz.com/robots.txt` and `/sitemap.xml` show `https://activitywiz.com` URLs.
23. Search Console: submit the new `sitemap.xml`; URL-inspect a few old URLs (should show *redirect*) and
    new ones (*indexable*). No "Change of address" is needed — the domain stays the same.

## Phase 6 — After cutover (2–4 weeks)

24. Watch Search Console *Pages* → "Not found (404)" and the Worker logs (Observability is enabled) for
    old URLs you missed; add redirects for them.
25. Remove the workers.dev OAuth origin/redirect URI once nothing uses it.
26. **Shut down Firebase** once traffic is stable:
    - Firebase console → Hosting → remove the custom domain `activitywiz.com`.
    - Export anything you still want (Firestore, Auth users, Storage).
    - `firebase hosting:disable` (the `*.web.app` / `*.firebaseapp.com` URLs stop serving), then
      optionally delete the Firebase/GCP project and billing.
    - Optional: before disabling, deploy one last Firebase Hosting release whose `firebase.json` 301s
      everything to `https://activitywiz.com` if the `web.app` URL was ever shared or indexed; disable it
      a few months later.

## Rollback

Until Firebase is disabled, rollback is: remove the Worker custom domain, re-create the DNS records
exported in step 3, and revert `SITE_URL`. That's why Firebase stays alive for a few weeks after cutover.
