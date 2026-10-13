# Activity Wiz — Product specification

Status: authoritative product requirements, 13 October 2026. Audience: product, design, engineering and acceptance reviewers.

This document defines what Activity Wiz provides and the rules that govern it. [User flows](user-flows.md) defines screen states and transitions using the requirement IDs below. [Architecture](architecture.md) defines the accepted technical direction and labeled implementation recommendations. These documents specify the product without requiring archived research or source code. Sections explicitly labeled **Proposed** or **Open** are not approved requirements. English is the documentation language; the product interface and generated activities are Hebrew.

## 1. Product concept and counselor journey

Activity Wiz is a preparation and reading tool for Israeli youth-movement counselors. A counselor leads a group of children or teenagers and needs an activity suited to that group, a topic, an available place and a duration. The counselor typically prepares on a phone in the evening, then opens the activity again while guiding. The primary audience is counselors roughly in grades 9–12, with Scouts a major audience; participant grades are selected separately.

For example, a counselor preparing a half-hour outdoor activity first identifies their movement and group, then chooses the kind of activity and its topic. Activity Wiz generates a Hebrew text they can read, edit and copy into WhatsApp. Alternatively, the counselor browses a category of ready-made activities and saves one into their own collection. That saved copy becomes their own normal activity, independent of the public text.

| Concept | Product meaning |
| --- | --- |
| Account and group details | A Google-authenticated counselor and their one reusable set of movement, participant grade, group size and gender composition. |
| Activity details | Type, subject, place, duration, equipment, grouping/competition, Sabbath adaptation and additional notes. These describe the activity, not the counselor's group. |
| Activity text and name | The instructions the counselor reads and the title identifying the activity in their collection. |
| Personal activity | An activity owned by one registered user, created by AI or copied from the public library. It stores activity details, text, name and ownership/lifecycle information, without group details. |
| Public category | An ordered browsing category containing ready-made public activities. It is different from the activity type used during creation. |
| Public activity | A manually authored activity with all normal activity-detail fields, a name/text and exactly one public category. |
| Admin | An authorized Google user who publishes/deletes public content and controls the order of categories. |

The main journey is Home → Group details → Activity details → Generate → Read. A registered user's result enters their personal collection automatically; a guest's result is temporary. The alternative journey is Home → Public categories → Public activity → Save a new personal copy → Read. Editing is an explicit mode of the personal/current activity detail screen, not another creation step.

**P01 — Product scope.** Provide a fast, free, mobile-first Hebrew experience with fixed right-to-left direction. Advertising funds the service. The product centers on AI creation, public category browsing and a personal collection for signed-in counselors.

Planning context is approximately 5,000 registered accounts, 50–100 daily visitors and 100–300 AI generations per day. These are sizing estimates, not service-level objectives or usage quotas.

## 2. Specification responsibilities

This specification owns product concepts, permissions, input choices and feature rules. [User flows](user-flows.md) owns screen behavior, transitions and acceptance checks. The product is focused on youth activities; affiliated training/quiz products and their promotional links are not part of its navigation.

[Architecture](architecture.md) covers framework/service integration. The following files are **planned and not yet created**: `data-model.md` for physical fields and storage rules, `api-contracts.md` for request/response and authorization contracts, `ai-generation.md` for templates/provider behavior, `design-system.md` for visual components and layout, `operations.md` for configuration and production procedures, `migration-plan.md` for data/domain transition, and `implementation-plan.md` for delivery sequencing. These names are planning references, not links or dependencies on missing documents.

## 3. Roles and access

**P02 — Identity.** Google is the only sign-in method. Registered users retain a valid session. If a recognized account's session cannot be restored, Google sign-in is required to continue protected use; session failure does not grant a fresh guest trial. Successful authentication returns the user to the intended destination.

**P03 — Guest access and trial clock.** Guests can browse public content and fill creation forms before starting a trial. The 72-hour cookie trial begins on the **first accepted valid attempt to generate an AI activity**: server admission of a completed, valid generation request. Visiting the site, browsing the library, opening forms or failing required-field validation does not start it. An accepted valid attempt starts the clock even if generation subsequently fails. Later requests, retries and visits do not extend or restart the clock.

Before the clock starts and while it remains active, a guest may generate, browse/read public content and temporarily edit the current generated activity. Guests have no personal collection or public-copy Save control. The cookie is browser-bound; it cannot guarantee recognition after cookie clearing or on another device.

After expiry, only further generation requires Google sign-in. Home, informational pages and every public library/category/activity page remain readable, including direct links and visits with an invalid session. An already accepted generation may finish within its original 60-second deadline if its page remains open; trial expiry alone does not cancel it. A recognized registered account with an invalid session must sign in for generation and private actions, never silently receive a fresh guest trial.

**P04 — Ownership.** Personal activities belong to exactly one registered user and are accessible only to that owner. A guest draft does not become an ownerless personal record. Public activities each belong to exactly one public category. The four core conceptual sets are users, personal activities, public categories and public activities. Authentication may require technical storage beyond these product sets; no schema is selected here.

| Role/state | Available work |
| --- | --- |
| Guest before first generation or within the trial | Browse public categories, create an AI activity and temporarily edit the current result. |
| Guest after trial expiry | Public browsing and informational pages remain accessible; Google sign-in is required for further generation. |
| Signed-in counselor | Generate and automatically retain activities, manage their personal collection, and save independent public copies. |
| Authorized admin | Counselor capabilities plus public publication/deletion, category creation/deletion and category reordering. |

Personal content remains owner-only. Retention of soft-deleted personal activities for operator analysis is not a public-content admin screen.

## 4. Home, navigation and creation inputs

**P05 — Navigation.** Home's main action area shows a Google sign-in button followed by a Create button for guests. For signed-in users it shows Create without the guest sign-in button. Bottom navigation provides Home, Create and Public library; Personal library is present only when signed in. Every screen includes the global navigation bar. For signed-in users it contains their Google profile photo displayed as a circle. The placement of the avatar and navigation items is defined in the planned `design-system.md`; this does not prescribe a second bar. Proposed guest/fallback appearance: a neutral avatar when no signed-in photo is available, without implying extra avatar actions.

**P06 — Creation sequence.** Home → Group details → Activity details → Generating → Activity detail in Read mode. Returning to an earlier step must preserve available entries rather than require avoidable re-entry. A type can represent one component of a movement's larger meeting; generation must not automatically expand every request into a complete meeting.

**P07 — One set of group defaults.** Each registered account has one durable set: movement, participant grade, participant amount and gender composition. It prefills creation and remains unchanged until explicitly edited by the user. Browser cache is secondary to account data. Guest defaults are temporary. Browsing, saving public content or editing an activity must not silently change group defaults. Group details belong to the user account and are not copied into personal or public activities. During generation, combine the current account group details (or temporary guest group details) with the current activity request. Activities do not retain a group snapshot.

**P08 — Input contract.** Use the exact ordered choices below, including overlapping amount ranges and the gap before `60+`. Do not “correct” labels, add values, translate stored choices into different meanings or replace range choices with exact-number inputs. All four group fields are required. Activity type, subject, place and duration are required; a valid first type is selected for the chosen movement when no current valid selection exists. The optional section begins collapsed and contains equipment, grouping/competition, Sabbath adaptation and free notes. Optional fields can remain unselected; an absent choice is not necessarily an explicit “no preference.” No additional questions are required for generation.

### 4.1 Movement and activity type

The table is the full movement order and the ordered type choices for each movement. Parenthesized keys distinguish meanings and are not additional UI labels. “Activity type” is independent of a public-library category.

| Movement label | Movement key | Type labels and keys, in display order |
| --- | --- | --- |
| צופים | `scout` | פעולת תוכן (`content`); נקודת מבט (`pointOfView`); זמן צופיות (`survival`); זמן משחק (`playTime`) |
| הנוער העובד והלומד | `oved` | מתודה מרכזית (`content`); משחק פתיחה (`playTime`); מתודת הצפה (`pointOfView`) |
| בני עקיבא | `akiva` | פעולה ערכית (`content`); משחקי גיבוש (`playTime`) |
| מכבי צעיר | `maccabi` | פעולה ערכית (`content`); משחקי גיבוש (`playTime`) |
| המחנות העולים | `camps` | פעולה ערכית (`content`); משחקי קבוצה (`playTime`) |
| השומר הצעיר | `shomer` | פעולה ערכית (`content`); משחק קבוצתי (`playTime`) |
| נוער לאומי ביתר | `bitar` | פעולה ערכית (`content`); משחקי גיבוש (`playTime`) |
| הנוער השומר | `hadasha` | פעולה ערכית (`content`); משחקי גיבוש (`playTime`) |
| נצח ישראל | `netzach` | פעולה ערכית (`content`); משחקי גיבוש (`playTime`) |
| ארגון המד״צים | `medtchim` | פעולה ערכית (`content`); משחקי קבוצה (`playTime`) |
| מדריכי של״ח צעירים | `meshachim` | פעילות תוכן (`content`); משחק שטח (`playTime`) |
| חוגי סיירות | `sayarut` | פעילות שטח (`content`); הישרדות (`survival`); משחק (`playTime`) |
| נוע״ם | `noam` | פעולה ערכית (`content`); משחק קבוצתי (`playTime`) |
| האיחוד החקלאי | `agricultural` | פעולה ערכית (`content`); משחק קבוצתי (`playTime`) |
| שינשינים | `shinshin` | פעילות תוכן (`content`); משחק גיבוש (`playTime`) |
| אחר | `other` | פעילות (`content`); משחק (`playTime`); הישרדות (`survival`) |

### 4.2 Remaining fields

Unless a label/value distinction is listed, each displayed option is also its exact value. Options are ordered left to right within each table cell as a sequence, regardless of rendering direction.

| Field | Required? | Exact choices or input |
| --- | --- | --- |
| Participant grade | Yes | `כיתה א`, `כיתה ב`, `כיתה ג`, `כיתה ד`, `כיתה ה`, `כיתה ו`, `כיתה ז`, `כיתה ח`, `כיתה ט`, `כיתה י`, `כיתה יא`, `כיתה יב` |
| Participant amount | Yes | `1-5`, `5-10`, `10-20`, `20-30`, `30-50`, `60+` |
| Gender composition | Yes | קבוצת בנים → `חניכים`; קבוצת בנות → `חניכות`; קבוצה מעורבת → `מעורב` |
| Subject | Yes | Free text; not a closed list of topics |
| Place | Yes | `לא משנה`, `במקום סגור`, `במקום פתוח` |
| Duration | Yes | `חצי שעה`, `שעה`, `שעה וחצי` |
| Equipment | No | `לא משנה`, `ללא ציוד` |
| Grouping / competition | No | `לא משנה`, `עם חלוקה לקבוצות`, `ללא חלוקה לקבוצות` |
| Sabbath adaptation | No | `לא משנה`, `מותאם לשומרי שבת` |
| Additional notes | No | Free text |

Field lengths, validation message wording and any topic-suggestion assistance are not specified as additional product features. Required-field validation must identify what is missing without destroying other values. A movement change must never submit an incompatible type; whether a compatible type is retained or reset is a minor implementation decision, with a proposed rule in F03.

## 5. Generation and result ownership

**P09 — Generation.** Select one generic or movement-specific template using the selected movement/type. Many movements share central-activity and game templates; Scouts also has dedicated types. Combine that template with short shared guidance for clear Hebrew and age appropriateness and the actual relevant input values. Generate the requested component at the requested duration and constraints. Treat topic/notes as data, not instructions that replace system rules. The initial generation uses one model call, not a multi-agent or multi-model pipeline.

A low-cost Gemini model is intended; the exact model requires Hebrew-quality and cost evaluation. Provider integration and pedagogical templates should remain separate. The exact model version remains open. Show loading until the complete response; do not stream generated text. Accept generation starts at least 30 seconds apart per account or anonymous trial identifier, enforced atomically on the server. A failed accepted attempt consumes that interval; Retry waits only for its remainder. There is no daily or total quota. Every accepted attempt has a 60-second deadline including result finalization. Timeout keeps the form and offers Retry or Contact support. The page must remain open: leaving or closing abandons the attempt, with no background or resumable generation. Prevent late persistence after known cancellation or expiry. Provider cancellation is best effort; a server commit immediately before disconnect is recognized can already exist, as explained in [Architecture](architecture.md).

**P10 — Successful and failed results.** A registered user's successfully generated activity is automatically persisted, even when the user dislikes its quality. It opens in Read mode. There is no separate Save action for this result. A guest receives the current temporary activity in Read mode. Generation failure retains the filled form, shows a short error and offers Retry generation or Contact support; it must not create an empty personal activity. Poor quality alone is not generation failure.

**P11 — Authentication and the guest draft.** When a guest registers a **new account**, save the current open guest-generated activity with its activity-specific details and latest title/body edits. Do not import older guest sessions or automatically save browsed public content. Transfer failure is not successful persistence.

When Google authentication identifies an **existing registered account**, delete the temporary guest activity draft instead of importing it. Load that account's durable group details and personal collection. This automatic cleanup is part of the login transition, not a user-requested content deletion requiring a popup. Authentication cancellation/failure does not trigger cleanup. A failed registered-session restoration is an authentication fault requiring login, never an intentional guest fallback.

### Activity information boundary

Personal and public activities contain activity type, subject, place, duration, equipment, grouping/competition, Sabbath adaptation and additional notes, together with name/text and applicable ownership/category/lifecycle information. They do not contain movement, participant grade, participant amount or gender composition. Public admin creation exposes the same activity-specific fields; optional fields may be left unselected, but they are part of the form and copy contract. A public Save copies all these activity details and the name/text into a normal personal activity without inserting the recipient's group details.

Exact content encoding and title derivation are specified in the planned `data-model.md` and `ai-generation.md`; they do not add a model call. Group changes affect subsequent requests, not a stored group snapshot, because no such snapshot exists.

## 6. Reading, editing and personal library

**P12 — Read and Edit modes.** A generated or personal activity opens in Read mode. Explicit Edit switches the same detail screen into editing; Finish editing returns it to Read mode. Only title and body are editable there. Titles cannot be edited in list rows. Formatting controls are limited to bold, underline and lists, without colors or an advanced editor. Public originals are read-only; a signed-in user edits a personal copy instead.

Content must remain unobstructed and readable while guiding, and support copying into WhatsApp. No direct-message sending integration, new share workflow or prescribed clipboard button layout is approved.

**P13 — Autosave.** Changed personal content is saved automatically every few seconds, not on every keystroke. Show saving, saved and error feedback. A “saved” state must mean the relevant edits were acknowledged, not merely entered. There is no manual Save button. Guest changes remain temporary until registration and must not be presented as durable personal saves. Leaving or closing personal detail never triggers a forced save or blocks navigation: locally unsent personal edits are discarded. The current temporary guest activity follows P11 during an intentional Google registration/login handoff; preserve it until authentication resolves, then transfer or discard according to account status. This is not a personal-autosave exit flush. Switching browser tabs while this page remains open retains the draft. A write already sent may finish. Finish editing changes mode without forcing a save; periodic autosave continues while the detail remains open. F06 and [Architecture](architecture.md) specify the boundary; revision/concurrency mechanics are labeled recommendations.

**P14 — Personal list.** List owned, non-deleted activities newest-created first. A row's informational content consists only of title and creation date; it also provides the delete action. The list is ordered by creation, not by edits or user-defined positions. Changing the title updates the list without changing the creation timestamp or ordering. Editing the body also leaves creation order unchanged.

**P15 — Personal deletion.** Delete is available from both list and detail. On deletion the activity immediately leaves the user's visible collection and cannot be accessed through a stale detail link. Preserve the record with a soft-deletion boolean for operator analysis only; this retention provides no user-facing archive, recovery or version-history interface. Do not request a deletion reason or claim to infer why the user deleted it. Every user-initiated deletion first displays a simple confirmation popup. Cancel leaves the activity unchanged; Confirm performs soft deletion. Server failure must not be hidden behind a false success state.

## 7. Public library and copies

**P16 — Public browsing and order.** Browse public categories, then their activities, then an activity detail. Each category has an explicit numeric position, and both the public library and admin overview show categories in that order. Admins can reorder categories. New activities appear first within their category; admins do not reorder activities within a category. Discovery uses category browsing without search, popularity ranking, like counters or view counters. Clarity remains the site-level integration described in P23.

An empty category/library is a valid state, distinct from a loading error. Public content is managed independently of personal copies.

**P17 — Independent copy.** Only a signed-in user sees the public activity's Save action. Every deliberate Save creates a new, fully independent personal activity with the current user's ownership, a fresh ID and a new copy-creation timestamp. Repeat saves create separate copies even when the source and content are identical. The public original is unchanged. There is no source-public identifier, foreign key, backlink, provenance relationship, synchronization or source-based deduplication retained for the copy, including for analytics. Personal copies need no public-category membership.

Copy the name/text and every activity-specific field listed in P11, including unselected optional values. Never add group details from the recipient's account. After successful persistence, go directly to the new personal detail in Read mode. Editing is a subsequent explicit action. A copy-storage/network failure remains on an available public detail with an error and a way to try again; do not navigate to a nonexistent copy or claim it was saved.

## 8. Administration

**P18 — Admin authorization and configuration.** `/admin` and every administrative mutation require Google authentication and a verified email in the configured allowlist. The allowlist is a string containing a valid JSON array of email addresses, stored in local `.env` configuration for development and as a Cloudflare secret in deployment. It supports multiple admins and is not hardcoded in source. A syntactic example using non-user addresses is `["admin-one@example.com","admin-two@example.com"]`. The exact variable name belongs in [Architecture](architecture.md) and the planned `operations.md`; no environment file or secret is created by this specification.

Check authorization server-side on routes and writes. Unauthorized access, including a signed-in non-admin, redirects to `/login`; unauthorized mutations change nothing. Missing, malformed or invalid allowlist configuration grants nobody access (fail closed), rather than bypassing the check.

**P19 — Admin browsing and publication.** The admin overview mirrors the public category/activity structure and its numeric category order. It provides Create activity, Create category, category reorder controls and Delete for categories/activities. Reordering categories updates their numeric positions and the public display order; it must not move activities between categories or change the newest-first activity order. The exact reorder gesture and persistence UI belong in `design-system.md` and `api-contracts.md` (planned).

At `/admin/activity`, enter a name/title, choose an existing public category, enter all normal activity-specific details from P11 and type/paste the activity text. Name/title, text, category, type, subject, place and duration are required; equipment, grouping/competition, Sabbath adaptation and notes remain optional with the exact choices in §4. No group fields are collected. Activity type and public category are separate selections. Publication uses an explicit Add/Publish action and does not use AI. A new activity appears first in its category. V1 public-content operations are creation/deletion and category reordering; title/content editing of existing public entries is not an admin operation.

**P20 — Category creation.** Enter a category name and optionally upload a JPG from the computer; otherwise use a shared default image. Each category receives a numeric position and can subsequently be reordered. Proposed default for a new category: append it after current categories. Upload limits, storage and image treatment belong in [Architecture](architecture.md) and the planned `design-system.md` and `api-contracts.md`. Invalid upload feedback preserves the entered name and does not falsely claim creation.

**P21 — Public deletion.** Every Delete action shows a simple confirmation popup. Cancel changes nothing. Confirm hard-deletes the selected public activity, or hard-deletes the selected category together with all its public activities. The category popup states the child-activity consequence and that personal copies remain unaffected. Completed deletion removes public content from browsing and prevents further copies; personal copies remain intact. Partial failures must not be shown as completion. These hard-deletion rules do not change personal soft deletion.

## 9. Presentation, content and release constraints

**P22 — Visual direction.** Use green/yellow with cream and dark text, rounded youthful illustrations, consistent icons and tactile-looking buttons. Duolingo is a visual inspiration for color/buttons, not for mechanics. Keep illustration density low, with generous clear space and a compact original outdoor illustration where appropriate. Activity reading must remain the dominant task. Typography, final layout, spacing, tokens, icons and assets are still to be designed; this is not a final design system.

**P23 — Advertising and measurement.** Preserve the configured advertising provider and every established placement, size and format. Design screens to accommodate these slots. Retain Clarity, activated with the production-domain transition, and do not introduce another analytics integration. An owner-approved placement/configuration inventory is a release input still to be supplied; never invent provider identifiers or embed secrets in documentation. This outstanding configuration does not require agents to copy an archived implementation.

**P24 — Informational content.** Provide About, FAQ, Contact, Privacy and required technical/administrative pages. These pages receive a new visual design consistent with the product. Only their supplied text is preserved verbatim for owner revision later; prior layout and styling are not retained. Navigation and promotional links must not introduce excluded training/quiz products. If the supplied prose itself contains such links or conflicting claims, flag the specific passage for an owner decision before release rather than silently rewriting it. The exact page-content package is a release input, not a license to author substitute legal text or implement an unrequested contact form.

The accepted stack is one actual Next.js + TypeScript project for frontend/server/admin on Cloudflare Workers, D1 and R2, with Auth.js/NextAuth and Google only. There is one production environment and database, without staging or cloud branch deployments. Local/CI fixtures are allowed. [Architecture](architecture.md) recommends OpenNext and documents untested compatibility gates; exact dependency versions and Gemini model remain open. Feature branches have one PR each, with mandatory typecheck, build and relevant tests. Documentation-only Markdown updates have standing authorization for GitHub publication through a feature branch and PR. They may merge only after required checks pass and it is verified that the merge will not deploy the application. If deployment would run or its absence is unverified, leave the published PR open. Code or mixed changes require explicit approval before GitHub publication and separate approval before merge; code merge approval includes the configured production deployment. Never direct-push main or treat documentation permission as deployment authorization.


**P27 — Public SEO.** Public catalog, category and activity pages render meaningful indexable server-side content, with appropriate metadata, canonical URLs, sitemap and robots rules. Public reading never requires login. Private, generation and admin routes are excluded from indexing, with server authorization where required. Publication, ordering and hard deletion must be reflected by subsequent public reads; personalized navigation must not leak through shared caches.

**P28 — AI input validation.** Validate every AI-bound free-text field server-side as plain text without links, including normalized/disguised URL variants. Normalize Unicode for validation and apply a manually maintained blacklist, initially empty; do not invent forbidden terms. Separate untrusted values from trusted prompt instructions, disable model tools/external URL retrieval, and render output safely. No filter guarantees perfect prompt-injection prevention. Concrete length bounds and matching rules in [Architecture](architecture.md) are proposals requiring review, not extra required questions.

## 10. Error handling and acceptance

**P26 — Missing data and generation errors.** If a screen cannot function because required route/creation-flow state or its requested activity/category is missing, redirect to Home with appropriate feedback. Do not substitute invented data. Invalid or expired authentication follows P02 to `/login`, rather than this missing-flow-data redirect. This is also distinct from an incomplete visible form: required-field validation remains on that form and preserves entered values. A generation failure keeps the filled form and offers Retry generation or Contact support, without creating an empty personal activity. The support destination uses the configured contact channel; it does not introduce a support-ticket system.

The [User flows](user-flows.md) acceptance matrix covers the trial-start event, exact inputs, account/group separation, sign-in draft handling, copy independence, mandatory deletion confirmations, category ordering and admin authorization. Loading failures are not empty collections; save/delete failures are not success.

### Remaining design inputs

- Choose the admin presentation of activity-type labels without asking for a group or movement. The underlying types remain `content`, `pointOfView`, `survival` and `playTime`; the movement-dependent counselor labels in §4 are unchanged. This label presentation belongs in the planned `design-system.md`.
- Finalize revision/conflict handling and retries while the page remains open in the planned `api-contracts.md`; the non-blocking exit without forced saving is already decided.
- Supply final advertising placements, support destination and informational text. Any embedded link/statement that conflicts with the youth-activity scope needs a focused editorial decision before release. Only text, not prior styling, is preserved.
- Finalize typography, assets and component geometry in the planned `design-system.md`. Proposed new-category placement and minor flow defaults remain labeled recommendations.

The migration/domain transition is outside this product specification; the README assigns it explicitly to the planned `migration-plan.md` and `operations.md` without making archived implementation a prerequisite for these behaviors.
