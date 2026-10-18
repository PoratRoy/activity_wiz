# ActivityWiz

ActivityWiz helps Israeli youth-movement guides (מדריכים, usually aged 15–18) prepare an activity for their next meeting in under a minute. The guide picks their group details and the activity details, and Gemini writes a ready-to-run Hebrew activity. Guides can also browse a public library of ready-made activities and save copies to their own list.

The site is Hebrew-only, right-to-left, and built mobile-first so it feels like an app, even on desktop.

## Docs

Read in this order:

1. [Product](docs/product.md): concept, users, roles and every product rule.
2. [Screens](docs/screens.md): every route, what it shows and where it leads.
3. [Design](docs/design.md): visual language, tokens, components and layout.
4. [Data model](docs/data-model.md): the 4 D1 tables and guest browser storage.
5. [AI](docs/ai.md): generation flow, output schema, prompts, safety and rate limit.
6. [Architecture](docs/architecture.md): stack, folders, auth, env vars and deployment.
7. [Implementation plan](docs/implementation-plan.md): numbered build steps.

## Stack at a glance

Next.js (App Router, TypeScript) · plain CSS Modules · Cloudflare Workers via OpenNext · Cloudflare D1 with Drizzle · a Durable Object for the rate limit · Auth.js v5 with Google and JWT sessions · Gemini via `@google/genai`.

## Workflow

There is one production environment and no staging. Every push to `main` deploys through Cloudflare Workers Builds. Before each push, run `npm run typecheck` and `npm run build`. There is no test suite.
