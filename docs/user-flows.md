# Activity Wiz — User flows and screen behavior

Status: authoritative flows for the requirements in [Product specification](product-spec.md), 12 October 2026. Audience: designers, engineers and acceptance reviewers.

This document specifies entry conditions, screen states, transitions and observable outcomes. Requirement IDs P01–P25 and open decisions O01–O06 refer to Product specification. All UI copy is Hebrew and RTL; English action names below describe intent, not finalized button wording. Exact timers, limits and layouts are not prescribed beyond approved product rules. **Proposed** behavior is explicitly distinguished from requirements.

## Screen and route contract

The following are screen identities, not a requirement to adopt a particular URL scheme. Only `/login`, `/admin` and `/admin/activity` are fixed paths. Other paths, URL parameters and routing mechanics remain implementation decisions. Loading and editing states need not be separate routes.

| Screen | Entry/access | Main content and actions | Normal exit |
| --- | --- | --- | --- |
| Home | All visitors | Guest: Google sign-in then Create; signed-in: Create in that area. Bottom navigation per P05. | Group details, public library, personal library when signed in, or login |
| Login — `/login` | Voluntary login, trial gate, session failure, unauthorized admin entry | Google sign-in, pending/error state; preserve intended destination and available draft | Intended permitted destination after successful authentication |
| Group details | Guest with trial access or signed-in user | Four required group fields, prefilled when available | Activity details; back to Home |
| Activity details | Authorized creation flow with valid group input | Type/subject/place/duration and collapsed optional section | Generating; back to Group details |
| Generating | Valid submitted creation inputs | Clear in-progress state | Generated Read detail or input-preserving error |
| Generated guest detail | Result of guest generation, including if trial expires during it | Read mode; Edit/Finish editing; temporary-state feedback | Existing navigation subject to access gates; registration transfer |
| Personal library | Signed-in user | Owned titles/dates, newest-created first; open/delete | Personal detail or other navigation |
| Personal detail | Signed-in owner of a non-deleted activity | Read/Edit, autosave feedback, delete | Personal library or other navigation |
| Public library | Guest with trial access or signed-in user | Categories and Popular entry; no search | Category list, Popular or Home |
| Public category | Same library gate; available category | Its public activities, newest publications first | Public detail; back to Public library |
| Popular activities | Same library gate | Up to ten activities ranked by descending views | Public detail; back to Public library |
| Public detail | Same library gate; available activity/category | Read-only title/body; Save only for signed-in user | New personal Read detail after Save; back to referring listing |
| Admin browse — `/admin` | Authorized admin only | Categories/activities, Create activity, Create category, delete controls | Creation forms or available content navigation |
| Admin activity creation — `/admin/activity` | Authorized admin only | Title, existing category, pasted/typed content, explicit Add/Publish | Published activity's category after success is a proposed destination |
| Admin category creation | Authorized admin only; exact presentation/path open | Name, optional JPG, explicit creation | Admin category browsing after success is a proposed destination |
| Informational pages | All visitors | Supplied page content | Available site navigation; no ancillary-product promotion |

A direct link cannot bypass an access check. If creation input is missing on a direct entry, the proposed recovery is the earliest incomplete creation step; this is not permission to populate made-up defaults. Personal links require ownership, including after login. An unavailable or deleted item must not leak content through cached detail controls.

## Shared state rules

| State | Observable behavior |
| --- | --- |
| Loading | Indicate the requested work is in progress. Do not show an empty-state message as if an unfinished request returned no results. |
| Ready | Show actual data and permitted actions only. |
| Empty | Explain that this collection has no available entries. Keep navigation usable. A create entry can reuse existing navigation; no new onboarding workflow is required. |
| Recoverable load failure | Distinguish from empty, show a concise error and permit another load attempt or navigation. Preserve available inputs/drafts. |
| Mutation pending | Do not claim persistence/deletion has finished. Recommended: prevent accidental duplicate submissions while one deliberate operation is pending. |
| Mutation failure | State that the change did not complete or could not be confirmed; do not silently discard input or navigate to a fabricated result. |
| Not found / no longer available | Show an unavailable state and a valid route back. Do not show deleted/private content. |
| Session no longer valid | Require Google sign-in for protected continuation, retain intended destination and available unsaved content; see F02/F06. |

Proposed implementation safeguards such as duplicate-click suppression do not deduplicate separate deliberate public saves. Error wording, skeletons and retry-control styling are design choices, not fixed copy.

## F01 — Enter Home and choose a path

Requirements: P01–P05, P22–P24.

1. Resolve any valid registered session. If present, show the signed-in Home and Personal library navigation.
2. For a guest, establish/read the first-visit trial cookie without extending its start time. Show Google sign-in followed by Create.
3. Create enters F03 if access permits. Public library enters F08 if access permits. When trial access has expired, both enter F02 with the intended destination retained.
4. Home and information pages remain usable after trial expiry. A recognized registered user with a failed session must sign in for protected use rather than receive a new trial.

Home must not expose points, streaks, other products or extra creation paths. A transient session-resolution state must not claim that existing personal data has disappeared. Exact session-loading visual treatment is a design decision.

## F02 — Sign in, return and transfer a registration draft

Requirements: P02–P04, P11, P18. Open: O04.

**Entry:** voluntary Google sign-in, trial gate, failed session restoration or admin authorization failure. Capture the intended permitted destination and retain currently available form/content state.

1. Show `/login` with Google as the only provider.
2. While sign-in is pending, indicate progress without claiming completion or clearing the current state.
3. On success, identify the account correctly. Existing accounts resume their own history; a new account is established once.
4. When this is registration and a current guest-generated activity is open, save that one activity with its latest available edits as owned personal content. Do not import older guest sessions or auto-copy browsed public content.
5. Return to the intended permitted destination. If that destination is the transferred activity, show its personal detail in Read mode. If registration began elsewhere, saving the current draft does not discard the intended destination.

**Cancellation, denial or provider failure:** remain in a recoverable sign-in state, retain the intended destination and available input/content, and allow another Google attempt or return to Home. An unexpired guest can still use permitted guest paths; an expired/recognized unauthenticated account cannot bypass the gate by dismissing it.

**Authentication succeeds but draft persistence fails:** do not claim the activity is in the personal collection. Proposed recovery: retain the authenticated session and available draft, show persistence error feedback, retry persistence without regenerating content or introducing a manual Save button. Transfer retry identity/concurrency is technical design work; repeated callbacks must not knowingly create unintended duplicate transfers.

**Admin destination:** recheck allowlist authorization after sign-in. An authenticated non-admin is still redirected to `/login`; signing in does not automatically grant access. Show a clear lack-of-authorization state rather than an endless automatic redirect/sign-in loop (proposed presentation safeguard).

**Open O04:** automatic guest-draft transfer on login to an existing account is not yet approved. Retain the available draft; do not silently discard it or assert that transfer has occurred. This choice must be resolved before shipping that scenario.

## F03 — Enter or edit group details

Requirements: P06–P08.

**Entry:** Create with access allowed. Display movement, participant grade, amount and gender composition, in that order, with the complete options in Product specification §4.

1. Prefill the registered user's one durable set, or currently available temporary guest values. Proposed empty-state default: with no values, leave fields unselected rather than inventing group details.
2. The user may explicitly change values. Require all four to continue.
3. Continue carries the selected group into Activity details. Registered explicit changes update that account's defaults; guest changes remain temporary.
4. Back returns to Home while preserving currently available in-progress entries. Re-entering must not unexpectedly restore obsolete cached values over the account's current defaults.

**Proposed default-persistence boundary:** persist explicit changes on successful Continue, not every select interaction. If persistence fails, retain selections and explain the failure; allow retry of Continue without erasing them. This is a recoverable account-default save failure, not permission to create multiple groups.

If the movement changes, the activity-type choices must immediately match the new movement. **Proposed selection rule:** retain the current type only if it is valid for that movement; otherwise select its first type. Keep other available entries unless the user changes them. No new demographic inputs or validation-driven option corrections are permitted.

## F04 — Describe and generate an activity

Requirements: P06, P08–P10.

**Entry:** valid group input and creation access. Display type, subject, place and duration, then the optional section, initially collapsed.

1. Populate type choices from the selected movement. Restore available in-progress activity values when valid; otherwise use the first type. Proposed empty-state default: leave other required unentered fields unfilled rather than inventing activity preferences.
2. Optional expansion reveals equipment, grouping/competition, Sabbath adaptation and free notes. Leaving the section closed does not make its fields required. Collapsing it must not imply that existing entered values were deleted.
3. Back returns to Group details with available activity entries preserved.
4. Generate requires valid required inputs. Missing input is identified in place; no request or empty activity is created.
5. Recheck access when starting generation. If trial expiry occurred while filling the form, sign-in is required before the new request, with all values preserved.
6. Show Generating and perform the single generation request defined by P09. Do not display a completed activity or “saved” state while waiting.
7. On success, follow F05. On generation error, leave the inputs available with a short error and Retry/Refresh generation action. A deliberate retry requests generation again using those inputs unless edited.

If the trial expires after generation has started, let it finish and retain/open the result; do not redirect away or erase it. **Proposed pending-request safeguard:** ignore accidental repeated submission while the same request is pending. Cancellation, navigating away during generation and timeout behavior are not newly approved features; their detailed implementation must protect available input and must not promise background completion that it cannot provide.

## F05 — Receive and read a generated activity

Requirements: P09–P13.

**Registered user:** persist the successful result automatically and display its detail in Read mode. It appears in Personal library under its creation date, independent of whether the user considers it a good result. Provide Edit and Delete through the detail behavior; no manual Save is introduced.

**Guest:** display the current temporary result in Read mode with Edit available. Do not show Personal library or imply durable account persistence. Registration can transfer it through F02. Generating subsequent content does not establish a recoverable history of earlier guest sessions.

**Generation succeeded, personal persistence failed:** distinguish this from model failure. Preserve the available result and indicate it has not been saved. Proposed recovery: retry persistence automatically when feasible and after successful reauthentication if needed, without replacing the result with another generation or requiring manual Save. Exact retry scheduling is open. Do not claim a stored personal-detail destination exists before it does.

Reading content should not expose editing controls as active text inputs. Normal text copying must remain possible. Edit enters F06 on the same screen.

## F06 — Edit, autosave and finish editing

Requirements: P12–P14. Open: O01.

1. From an eligible activity's Read mode, select Edit. Only the detail title/body become editable, with bold, underline and list tools.
2. Changed content becomes pending. Save periodically after changes, every few seconds rather than per character. Do not write unchanged data solely because time passed.
3. Show saving while a write is pending and saved only when the relevant edits are acknowledged. If additional edits occurred meanwhile, do not mark them saved merely because an older request completed.
4. Finish editing returns the same content screen to Read mode. It is not a separate manual-save action, and save/error feedback must not disappear merely because editing ended.
5. Successful title changes appear in the personal list, without changing creation time or order. Content editing does not mutate group defaults or public originals.

For guests, updates remain temporary and feedback must reflect that distinction. No personal storage request is made before registration. When registration occurs, use the current title/body, not a stale pre-edit copy.

**Proposed loss-avoidance behavior, pending O01 approval:**

- On a deliberate in-app exit with pending changes, attempt the pending save and retain the local draft until acknowledgement. If saving fails, keep the user able to review their content and clearly warn before discarding unsaved edits. Do not add a manual Save button.
- On session expiry during editing, preserve available edits and route through Google sign-in before retrying the protected save. Never submit content under a different owner's activity after an account switch.
- Reject a stale concurrent write rather than silently overwrite newer saved text. Keep unsent text available and explain the conflict; exact resolution UI is open, with no version-history feature implied.
- A delayed save must not resurrect a deleted activity. Stop treating it as an editable personal record after deletion is confirmed.
- Browser/tab termination and cleared local storage cannot be described as guaranteed recovery. Do not claim a draft is durable before acknowledgement.

These safeguards are proposed transition behavior, not approval of a particular revision schema, cache lifetime, confirmation modal or merge algorithm.

## F07 — Open and delete personal activities

Requirements: P04, P14–P15. Open: O02.

**List:** require a valid signed-in session. Load only the user's non-deleted activities, newest-created first. Show title/date and delete control per row. Opening a row loads personal Read detail. Loading, empty and failure are distinct states; an empty collection can direct the user to the existing Create/Public navigation.

**Detail entry:** validate ownership and availability before showing content, including for direct links. Missing, deleted or inaccessible records yield an unavailable state with navigation to the user's collection, without revealing another owner's content. Reauthentication alone does not bypass ownership.

**Delete from list or detail:** the triggering control identifies the selected activity. Whether an additional confirmation precedes the operation remains open. Once deletion is applied, remove it immediately from user views, including a currently open detail, and retain the soft-deleted record for operator analysis. Do not ask for a reason, infer one or offer restore/history.

**Proposed detail destination after successful deletion:** Personal library. **Proposed failure handling:** show the deletion error and do not report success; if the UI optimistically hid the item, restore its visible state when failure is known, or reconcile uncertain status before claiming the outcome. A stale link after successful deletion remains unavailable. Pending autosave must not restore it.

## F08 — Browse the public library

Requirements: P03, P16.

1. Enter Public library through bottom navigation or a direct link. Apply the trial/session access gate to library destinations, not only to the category index.
2. Load categories and the Popular entry. Show an appropriate empty state if no public content is available; a failed request is an error state with a reload attempt, not “no activities.”
3. Choose a category to see its activities. New publications appear first; category order itself remains open. An empty available category has an empty state and Back.
4. Alternatively, choose Popular to see up to ten available activities ranked by descending recorded views across categories. With fewer than ten, show those available; with none, show the empty state. No like controls or search appear.
5. Choose an activity to open read-only Public detail. Back returns to the referring category or Popular list. Proposed fallback for a direct entry with no referring list: return to its available category, otherwise Public library.

A source/category removed before or during navigation becomes unavailable; do not show a functioning Save action for it. Trial expiry does not erase already open content, but a subsequent library entry/navigation into another protected item must pass the gate. Recording popularity must not prevent reading merely because a view-count update fails; exact count event semantics remain O03.

## F09 — Save a public activity as a new personal copy

Requirements: P04, P12, P17.

**Guest:** Public detail has no Save control. It is read-only and cannot be edited as a temporary public original. The guest may sign in via available navigation, subject to the same intended-destination handling.

**Signed-in user:**

1. Select Save on an available public detail.
2. Verify current authentication and source availability. The action does not edit the public item or update group defaults.
3. Create a new independent personal copy of the displayed content with the current owner's identity and new copy-creation time. Do not retain source/category links or synthesize missing generation parameters.
4. Only after successful persistence, navigate directly to the new personal detail in Read mode.
5. Edit is a separate next action. Returning to the public item and saving again must create another distinct personal copy, never select/update the first one.

On save failure, remain on the public detail, show error feedback and allow another attempt; do not claim saved or navigate to a nonexistent record. Session failure enters F02 with destination/input preserved, and the protected action is retried only with valid authorization. Whether a failed action is automatically resumed after login is an implementation detail that must avoid accidental extra copies.

**Proposed race handling:** if source/category removal wins before copying completes, fail cleanly without a partial copy; if a valid copy completes first, later deletion does not affect it. Duplicate-click suppression during a pending operation is compatible with separate deliberate saves always creating new records. Transport retries must not become source-based deduplication or a hidden provenance relationship.

## F10 — Enter admin and create a public activity

Requirements: P18–P19.

1. Enter `/admin` or a direct admin destination. Verify Google authentication and the verified-email allowlist on the server. Unauthorized users go to `/login`; no admin content mutation is performed.
2. Browse categories/activities in a structure corresponding to the public library. Show Create activity and Create category, plus delete controls. Empty data does not hide the ability to create content.
3. Create activity opens `/admin/activity`. Enter title, select an existing category and paste/type content in the editor. There is no AI action and no edit-existing-public mode.
4. Submit Add/Publish explicitly. Missing required content/category is identified without clearing valid inputs. If no category exists, explain the prerequisite and provide access to Create category; do not invent a default category.
5. While publication is pending, show progress. On success, make the activity available first in its category. Proposed destination: the category in admin browsing.

Publication errors preserve entered title/body/category where valid. If the selected category was removed, require an available selection without discarding content. If authorization expires or is revoked, reject the write, route to `/login` and preserve available form state for authorized recovery; never retry a mutation merely because any Google login succeeded.

## F11 — Create a public category

Requirements: P18, P20.

1. From admin, select Create category. Exact path/modal placement is undecided.
2. Enter a name and optionally select a JPG from the computer. Without an upload, use the shared default image.
3. Submit explicitly. Identify missing name or invalid image without erasing other input. Numeric size limits and crop behavior are not prescribed.
4. Show pending state during upload/creation and confirm success only when the category is available. Proposed destination: admin category browsing.

On upload/storage/creation failure, keep the entered name and recoverable selection, show the error and allow retry. Do not silently downgrade a failed selected upload to the default image; the user can remove the selection intentionally. Avoid presenting a partially created category as complete. Technical cleanup of failed uploads is deferred to architecture/operations, not a new admin feature.

## F12 — Delete public content

Requirements: P18, P21. Open: O02.

An authorized admin selects Delete for an activity or category. Any optional confirmation policy remains undecided. If a confirmation is introduced for category deletion, it must accurately describe that the category's public activities will also be removed and personal copies will remain.

For an activity, successful deletion removes it from category/Popular/admin browsing and prevents further copying or detail access. For a category, successful deletion removes the category and its public children. All personal copies remain available to their owners and editable independently.

Show pending/error state for the operation. A server rejection or partial failure is not success. Proposed recovery: reconcile and reload affected admin/public listings and keep a clear failure message if the requested outcome did not complete; do not leave apparently available public children in a missing category. Physical hard/soft deletion semantics are open. No restore or edit-existing route is added.

Proposed post-success navigation: deleting an open public activity returns to its category if available; deleting the category returns to admin category browsing. Stale public links show unavailable, not personal-copy deletion.

## F13 — Read informational pages and continue navigation

Requirements: P01, P23–P25.

About, FAQ, Contact, Privacy and required technical/administrative content remain available independently of trial expiry. Show the supplied text without silently rewriting it. Missing content is a release-input issue; do not synthesize legal terms or a contact submission feature. Excluded-product promotional navigation is absent. Specific conflicting embedded links/text require the O05 editorial decision.

The same advertising placement contracts apply where configured, without blocking readable content. Clarity activation belongs to the production-domain transition. Operational exports, domain changes and shutdown are not user-facing flows or authorizations granted by this document.

## Acceptance matrix

The following checks verify observable outcomes; they do not prescribe a test framework or database implementation.

| Check | Flows / requirements | Expected result |
| --- | --- | --- |
| A01 — Guest entry | F01–F02; P02–P05 | First-visit trial is fixed, guest Home actions ordered correctly, Personal absent, expired protected entry returns through Google to intended destination. |
| A02 — Expiry during work | F04–F05; P03, P10 | In-progress generation finishes after expiry without losing content; a new request or library entry is gated. |
| A03 — Defaults and exact options | F03–F04; P07–P08 | One durable registered set, temporary guest values, all exact choices retained, no invalid movement/type pair or added required optional field. |
| A04 — Generation outcomes | F04–F05; P09–P10 | One generation call, success opens Read, poor-quality success still persists for registered user, failure keeps inputs and creates no empty activity. |
| A05 — Authentication recovery | F02; P02, P11 | Cancel/failure retains available state; registration transfers only current open generated draft and latest edits; failed transfer never claims saved. O04 remains separately gated. |
| A06 — Detail editing | F06; P12–P13 | Explicit modes on same screen, title/body only, minimal formatting, truthful autosave feedback, no manual Save or inline list editing. |
| A07 — List and deletion | F07; P04, P14–P15 | Owner-only title/date list, creation order unchanged by edits, delete available in both locations, deleted detail unavailable, no restore/reason prompt. |
| A08 — Public browsing | F08; P16 | Categories and top-ten-by-views path, no search/likes, correct empty versus loading/error states, valid return navigation. |
| A09 — Independent repeated copies | F09; P17 | Guest has no Save; two deliberate signed-in saves create distinct personal records with fresh creation times and no source relationship; source unchanged. |
| A10 — Copy failure and independence | F09/F12; P17, P21 | Failed save stays on public detail; successful copy opens Read; public/category deletion never alters copies; missing generation context stays absent. |
| A11 — Admin authorization | F10–F12; P18 | Non-admin direct routes redirect to `/login`; unauthorized writes do nothing; valid Google login alone does not grant admin access. |
| A12 — Admin publication | F10–F11; P19–P20 | Manual explicit publish only, existing category required, new activity first, optional JPG/default image, failures preserve form state, no edit-existing feature. |
| A13 — Category removal | F12; P21 | Public children removed with category, personal copies unaffected, failure/partial outcome not reported as complete. |
| A14 — Presentation and continuity | F01/F05/F13; P01, P22–P25 | Hebrew RTL, readable mobile content, no excluded tools/gamification, configured ads retained, correct account history and supplied page text. |
| A15 — Proposed loss avoidance | F06–F07; O01 | Once approved: pending/failed save is visible, stale saves cannot resurrect deleted content, ownership remains enforced after reauthentication/account switch. |

## Review boundaries

O01–O06 in Product specification are the material unresolved choices and release inputs. Minor proposals in these flows cover default-save timing, valid type retention, direct-link recovery, post-create/delete destinations and duplicate-click handling. They do not authorize a different product flow, additional features or unapproved infrastructure. Final acceptance must distinguish checks for approved behavior from checks contingent on proposal approval.
