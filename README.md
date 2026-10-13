# Activity Wiz

Activity Wiz helps Israeli youth-movement counselors prepare an activity for their group and read it while guiding. It is free, mobile-first and Hebrew-only. A counselor can generate an activity using their group details and activity preferences, or browse a category of ready-made activities. Signed-in users keep a personal collection, edit their own texts and save independent copies of public activities. Authorized admins maintain the public library and category order.

## Read in this order

1. [Product specification](docs/product-spec.md): understand the counselor use case, product concepts, roles, exact form choices and feature rules.
2. [User flows](docs/user-flows.md): start with the overall journey diagram, then read the screen contract, detailed transitions and acceptance checks.

3. [Production architecture](docs/architecture.md): accepted stack, runtime boundaries, generation admission/cancellation, security, data consistency and deployment approval gates.

These three English documents are the authoritative specification for the current product. Exact Hebrew labels/values remain Hebrew. Explicitly labeled proposals are recommendations, not approved requirements. No chat history, prior code or archived document is needed to understand the current behavior. The concept overview and journey diagram provide orientation without a separate duplicate overview document.

## Planned documentation

The three specifications above currently exist in `docs`. The following filenames are **planned, not yet created**:

| Planned file | Responsibility |
| --- | --- |
| `design-system.md` | Components, typography, assets, global navigation/avatar placement and reorder interaction |
| `data-model.md` | Storage representation, user-owned group data, activity-only details, position and deletion constraints |
| `api-contracts.md` | Requests/responses, authorization, validation, autosave/retry and ordering contracts |
| `ai-generation.md` | Template mapping, prompt construction, provider/model evaluation and generation errors |
| `operations.md` | Local/deployed configuration, admin allowlist secret, advertising/Clarity configuration and production procedures |
| `migration-plan.md` | Data preservation, identity mapping, validation, final reconciliation, domain transition and rollback |
| `implementation-plan.md` | Sequenced implementation and verification work |

The accepted stack is one actual Next.js + TypeScript project for frontend/server/admin, Cloudflare Workers, one production D1 database, R2, and Auth.js/NextAuth with Google only. There is one production environment, without staging or cloud branch deployments. Architecture recommends OpenNext; exact versions and runtime compatibility remain to be tested. The Gemini model remains open. Admin email allowlisting uses a JSON-array string in local `.env` and a deployed Cloudflare secret; no actual configuration or secret is created here.

Development uses feature branches with one PR per branch and mandatory typecheck/build/relevant tests before merge. Documentation-only Markdown updates have standing authorization for GitHub publication through a feature branch and PR. They may merge only after required checks pass and it is verified that the merge will not deploy the application. If deployment would run or its absence is unverified, leave the published PR open. Code or mixed changes require explicit approval before GitHub publication and separate approval before merge; code merge approval includes the configured production deployment. Never direct-push main or treat documentation permission as deployment authorization.

## Migration responsibility

The planned `migration-plan.md` must preserve all existing users, group details, public content and each user's saved/edited activities, including information from products/languages not displayed in the new UI. It must verify that the same Google identity reaches the correct history without duplicate accounts or mixed ownership. The owner supplies exports and controls changes to the existing service, domain transition and shutdown. The planned `operations.md` must cover switching the same public domain only after validation, final-update reconciliation, backup/rollback and existing content URLs. These are future operational deliverables, not permissions to execute migration now.

## Historical reference

[Archived snapshot — 12 October 2026](archive/2026-10-12/README.md) preserves earlier documentation unchanged. It is non-authoritative research/history: its proposals and superseded behavior must not override the current specifications or become runtime/build dependencies. Migration research may consult it separately.

## Repository boundary

This repository contains Markdown documentation only. No application code, database, dependencies, infrastructure or migration is created by this task. Existing systems remain read-only. Private exports, credentials and real administrator email addresses do not belong in the public repository.
