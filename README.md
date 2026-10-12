# Activity Wiz

Activity Wiz is a free, mobile-first Hebrew product for Israeli youth-movement counselors to generate personalized educational activities or choose prewritten public activities, then read and adapt their own content while guiding.

## Authoritative specifications

| Document | Responsibility |
| --- | --- |
| [Product specification](docs/product-spec.md) | Scope, roles, exact input choices, feature rules, content and visual constraints, acceptance boundaries and open decisions |
| [User flows](docs/user-flows.md) | Screen/access contract, end-to-end transitions, loading/empty/error states, persistence outcomes and traceable acceptance checks |

These English documents define the current product together. Hebrew strings inside them are exact product labels/values. Approved requirements are distinct from explicitly labeled proposals and open decisions. The two specifications are standalone: archived documents and prior source code are not prerequisites for understanding the current product behavior.

Only these two files belong to the active `docs` directory at this stage. Architecture, detailed data model, API contracts, design system, AI implementation, operations and implementation planning are future documentation work, not empty templates or implicit implementation tasks.

## Historical archive

[Archived documentation snapshot — 12 October 2026](archive/2026-10-12/README.md) preserves the previous README and every prior document without content changes, including Hebrew notes and English schema/migration research. The archive is **non-authoritative historical reference**. Its proposals, technical choices and links must not override the current specifications or become build/runtime dependencies.

## Repository scope

This repository currently contains Markdown documentation only. It does not contain or authorize application implementation, dependencies, database creation, infrastructure configuration or migration execution. Next.js and Cloudflare are the accepted technical direction; more specific stack choices remain unapproved proposals.

Existing service data and user ownership must be preserved. Prior systems are read-only research sources; the owner controls exports, changes to those systems, domain transition and shutdown. No private exports, credentials or personal administrator addresses belong in this public repository.
