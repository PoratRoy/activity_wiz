# Activity Wiz — Product specification

Status: authoritative product requirements, 12 October 2026. Audience: product, design, engineering and acceptance reviewers.

This document defines what Activity Wiz provides and the rules that govern it. [User flows](user-flows.md) defines screen states and transitions using the requirement IDs below. Together these two documents specify the product without requiring archived research or source code. Sections explicitly labeled **Proposed** or **Open** are not approved requirements. English is the documentation language; the product interface and generated activities are Hebrew.

## 1. Purpose and users

Activity Wiz helps Israeli youth-movement counselors prepare an educational activity for their group, then read and use it while guiding. The primary audience is counselors roughly in grades 9–12, with Scouts a major audience. Counselors' ages do not restrict the grades available for their participants.

The product supports two equally valid starting points: generate a personalized activity with AI, or choose a prewritten activity from a public library. The main use context is a phone, often during evening preparation and later in the field. Content must be readable during facilitation and easy to copy into WhatsApp.

**P01 — Product scope.** Provide a fast, free, mobile-first Hebrew experience with fixed right-to-left direction. There is no language selector or multilingual product infrastructure. Advertising is the only approved revenue source. No subscription or payment journey is included.

Planning context is approximately 5,000 registered accounts, 50–100 daily visitors and 100–300 AI generations per day. These estimates are not service-level objectives, quotas or permission to impose a usage limit.

## 2. Scope and exclusions

| Included | Excluded |
| --- | --- |
| Guided AI creation with one set of group defaults | Multiple groups, group switching or group management |
| Public category browsing and a popular-activities list | Free-text public search, recommendations or a new ranking system |
| Google sign-in and a fixed guest trial | Passwords, alternative login providers, sliding trials |
| Personal activities, detail editing and autosave | List-row title editing, manual save, advanced formatting |
| Independent personal copies of public activities | Source backlinks, synchronization or source-based deduplication |
| Personal deletion and operator retention | Recycle bin, archive, restore, version history or 30-day retention UI |
| Manual admin creation and deletion | AI in admin, editing existing public/category records, moderation dashboards |
| Youthful illustrated visual language | Points, streaks, gamification or tutorial mascots |
| Information pages and established advertising/measurement | Affiliated training/quiz tools, links to those tools or new analytics products |

The initial scope is these behaviors. Database fields, APIs, physical storage, deployment configuration and implementation sequencing belong to later technical specifications.

## 3. Roles and access

**P02 — Identity.** Google is the only sign-in method. Registered users retain a valid session. If a recognized account's session cannot be restored, Google sign-in is required to continue protected use; session failure does not grant a fresh guest trial. Successful authentication returns the user to the intended destination.

**P03 — Guest access.** A cookie records a 72-hour trial starting at the first visit. Later visits do not extend it. During the trial a guest may generate, browse/read public content and edit the current generated activity temporarily. A guest has no personal collection, durable personal save or public-copy Save control. The cookie is a browser-level mechanism, not a guarantee of identity across cookie clearing, devices or browsers.

Once the trial expires, Home remains accessible. The next entry into creation or public-library content requires Google sign-in. Expiry must not interrupt generation already in progress or erase current open content. Reading/editing that open guest activity remains temporary; no new generation or library entry is granted by keeping it open. Exact expiry at a boundary and transitions are specified in F02–F04.

**P04 — Ownership.** Personal activities belong to exactly one registered user and are accessible only to that owner. A guest draft does not become an ownerless personal record. Public activities each belong to exactly one public category. The four core conceptual sets are users, personal activities, public categories and public activities. Authentication may require technical storage beyond these product sets; no schema is selected here.

| Capability | Guest within trial | Guest after trial | Signed-in user | Authorized admin |
| --- | --- | --- | --- | --- |
| Home and informational pages | Yes | Yes | Yes | Yes |
| Start creation / enter public library | Yes | Sign-in required | Yes | Yes |
| Continue already open guest content | Yes, temporary | Yes, temporary | Registration transfer rules apply | Same account rules |
| Read/edit own personal content | No collection | No collection | Yes | Own content only |
| Save a public activity as personal copy | No control | No control | Yes | Yes |
| Delete personal content | No persisted personal content | No persisted personal content | Own content only | Own content only |
| Admin category/activity creation/deletion | No | No | No, unless authorized | Yes |
| Edit public original | No | No | No | Not a v1 feature |

Admin authorization does not create a product feature for browsing other users' personal activities. Operator analysis of retained deleted records is separate from the specified admin content interface.

## 4. Home, navigation and creation inputs

**P05 — Navigation.** Home's main action area shows a Google sign-in button followed by a Create button for guests. For signed-in users it shows Create without the guest sign-in button. Bottom navigation provides Home, Create and Public library; Personal library is present only when signed in. Layout may be restyled but must preserve the defined sequence and destinations.

**P06 — Creation sequence.** Home → Group details → Activity details → Generating → Activity detail in Read mode. Returning to an earlier step must preserve available entries rather than require avoidable re-entry. A type can represent one component of a movement's larger meeting; generation must not automatically expand every request into a complete meeting.

**P07 — One set of group defaults.** Each registered account has one durable set: movement, participant grade, participant amount and gender composition. It prefills creation and remains unchanged until explicitly edited by the user. Browser cache is secondary to account data. Guest defaults are temporary. Browsing, saving public content or editing an activity must not silently change group defaults. There is no separate multiple-group experience.

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

A low-cost Gemini model is intended; the exact model requires Hebrew-quality and cost evaluation. Provider integration and pedagogical templates should remain separate. No model version, usage allowance, timeout or automatic multi-call retry policy is selected by this specification.

**P10 — Successful and failed results.** A registered user's successfully generated activity is automatically persisted, even when the user dislikes its quality. It opens in Read mode. There is no separate Save action for this result. A guest receives the current temporary activity in Read mode. Generation failure retains the filled form, shows a short error and provides a retry/refresh-generation action; it must not create an empty personal activity. Poor quality alone is not generation failure.

**P11 — Registration transfer.** Registration saves the current open guest-generated activity, including its current title/body edits. It does not recover prior guest sessions or turn previously browsed public activities into personal copies. Authentication must not erase available inputs or content. Transfer failure must not be reported as successful persistence; recovery details are proposed in F02.

**Proposed, not yet approved:** preserve each generated activity's input context as a snapshot so later changes to account defaults do not reinterpret the activity. Public prose can have no generation context. Do not fabricate group data when creating a personal copy of such prose. Exact content structure and title derivation are technical/content-design decisions, not an additional model call requirement.

## 6. Reading, editing and personal library

**P12 — Read and Edit modes.** A generated or personal activity opens in Read mode. Explicit Edit switches the same detail screen into editing; Finish editing returns it to Read mode. Only title and body are editable there. Titles cannot be edited in list rows. Formatting controls are limited to bold, underline and lists, without colors or an advanced editor. Public originals are read-only; a signed-in user edits a personal copy instead.

Content must remain unobstructed and readable while guiding, and support copying into WhatsApp. No direct-message sending integration, new share workflow or prescribed clipboard button layout is approved.

**P13 — Autosave.** Changed personal content is saved automatically every few seconds, not on every keystroke. Show saving, saved and error feedback. A “saved” state must mean the relevant edits were acknowledged, not merely entered. There is no manual Save button. Guest changes remain temporary until registration and must not be presented as durable personal saves. Pending-save navigation and concurrent-edit recovery are explicitly proposed in F06, not silently treated as final decisions.

**P14 — Personal list.** List owned, non-deleted activities newest-created first. A row's informational content consists only of title and creation date; it also provides the delete action. There are no type labels, likes, manual ordering or archive controls. Changing the title updates the list without changing the creation timestamp or ordering. Editing the body also leaves creation order unchanged.

**P15 — Personal deletion.** Delete is available from both list and detail. On deletion the activity immediately leaves the user's visible collection and cannot be accessed through a stale detail link. Preserve the record with a soft-deletion boolean for operator analysis. Do not request a deletion reason or claim to infer why the user deleted it. No restoration, version history, recycle bin or retention countdown is part of the user experience. A confirmation-dialog policy has not been selected; server failure must not be hidden behind a false success state.

## 7. Public library and copies

**P16 — Discovery.** Users browse public categories, then activities, then activity detail. No free-text search is provided. The library includes a popular list of up to ten activities across categories, ordered by descending recorded view count. It uses viewing popularity, not likes or a new recommendation score. No time window, unique-view identity rule or new analytics system is introduced. Ties and the precise view-count event contract require implementation clarification; they must not be resolved by inventing a new ranking product. Category order remains open.

Newly published activities appear first in their category. Available category/activity content is managed independently of personal copies. An empty category or library is a valid state, not a load error.

**P17 — Independent copy.** Only a signed-in user sees the public activity's Save action. Every deliberate Save creates a new, fully independent personal activity with the current user's ownership, a fresh ID and a new copy-creation timestamp. Repeat saves create separate copies even when the source and content are identical. The public original is unchanged. There is no source-public identifier, foreign key, backlink, provenance relationship, synchronization or source-based deduplication retained for the copy, including for analytics. Personal copies need no public-category membership.

Copy title/body and any actual available context; preserve absent context rather than filling it from the user's defaults. After successful persistence, go directly to the new personal detail in Read mode. Editing is a subsequent explicit action. A failed copy remains on the public detail with an error and a way to try again; do not navigate to a nonexistent copy or claim it was saved.

## 8. Administration

**P18 — Admin access.** `/admin` and all administrative mutations require a Google-authenticated user whose verified email is in a server-side allowlist. Check authorization on the server for both routes and writes. Unauthorized access, including an authenticated non-admin, redirects to `/login`; rejected writes must not change content. The initial configured address will be supplied by the owner server-side, with later secret-based configuration. No personal email is part of this specification.

**P19 — Admin browsing and publication.** The admin interface mirrors public category/activity browsing, with two add actions—Create activity and Create category—and delete controls for categories and activities. It does not introduce an analytics dashboard, moderation queue, comments or version management.

At `/admin/activity`, provide a title field, an existing-category selector, an editor for manually typed/pasted content and an explicit Add/Publish action. There is no AI generation in admin. The selected category, title and content are required for a usable published activity. Publication is explicit, not autosave. On success the activity appears first in its category. V1 supports creating and deleting records, not editing existing public activities or categories.

**P20 — Category creation.** The form accepts a category name and an optional JPG uploaded from the user's computer. If no image is supplied, use a shared default image. The precise upload size limits, storage provider, crop treatment and final image asset remain undecided. Reject an invalid upload without discarding the name or falsely claiming creation.

**P21 — Public deletion.** Deleting a public activity removes it from public/admin browsing and prevents new copies. Deleting a category removes the category and its public activities. Neither operation affects any personal copy. Public/category physical deletion may be hard or soft; this is open and must not automatically inherit personal soft deletion. Confirmation behavior is also open. Partial failures must not be represented as a completed deletion.

## 9. Presentation, content and release constraints

**P22 — Visual direction.** Use green/yellow with cream and dark text, rounded youthful illustrations, consistent icons and tactile-looking buttons. Duolingo is a visual inspiration for color/buttons, not for mechanics. Keep illustration density low, with generous clear space and a compact original outdoor illustration where appropriate. Activity reading must remain the dominant task. Typography, final layout, spacing, tokens, icons and assets are still to be designed; this is not a final design system.

**P23 — Advertising and measurement.** Preserve the configured advertising provider and every established placement, size and format. Design screens to accommodate these slots. Retain Clarity, activated with the production-domain transition, and do not introduce another analytics integration. An owner-approved placement/configuration inventory is a release input still to be supplied; never invent provider identifiers or embed secrets in documentation. This outstanding configuration does not require agents to copy an archived implementation.

**P24 — Informational content.** Provide About, FAQ, Contact, Privacy and required technical/administrative pages. Their supplied page text is transferred verbatim for owner revision later. Navigation and promotional links must not introduce excluded training/quiz products. If the supplied prose itself contains such links or conflicting claims, flag the specific passage for an owner decision before release rather than silently rewriting it. The exact page-content package is a release input, not a license to author substitute legal text or implement an unrequested contact form.

**P25 — Continuity.** Preserve existing accounts, group defaults, public content and each user's saved/edited personal activities. The same Google identity must retrieve the correct history without duplicate accounts or mixed ownership. Excluding a product/language from the UI does not authorize deleting information. The new product replaces the public experience at the same domain only after verification. The owner controls exports, changes to the prior service, domain transition and shutdown. Operational migration research is not part of these product flows; no migration or infrastructure action is authorized by this document.

Next.js and Cloudflare are the accepted technology direction. TypeScript, Workers deployment details/adapter, D1, R2, auth library and exact Gemini version remain proposals or open choices. These product requirements do not select them.

## 10. Acceptance and unresolved decisions

Acceptance is behavioral. The final matrix in [User flows](user-flows.md) connects requirements to concrete checks. A product review must verify permissions, draft preservation, truthful persistence feedback, independent copies, immutable creation ordering, valid empty/error states and admin isolation, in addition to the happy paths.

| ID | Decision or input still needed | Boundary while open |
| --- | --- | --- |
| O01 | Leaving a detail screen with pending/failed autosave; concurrent edits and session expiry during a write | Follow the explicitly proposed loss-avoidance flow for review; do not claim guaranteed save or add manual Save. |
| O02 | Confirmation policy for personal, public and category deletion | Do not invent a mandatory modal or silently present a proposed policy as approved. All confirmed outcomes and failure rules remain fixed. |
| O03 | Category order; equal-view tie handling and exact count event contract | Preserve view-count ranking and the ten-item popular scope; no likes or new ranking formula. |
| O04 | Login by an already-registered account while a guest draft is open | Preserve available draft; automatic transfer is explicitly approved for registration, not yet generalized to every existing-account login. |
| O05 | Supplied informational text containing excluded-product links or conflicting statements | Escalate exact conflicts for editorial resolution; do not silently rewrite approved text. |
| O06 | Final ad-slot/content packages and visual design | Treat as release inputs; do not reconstruct missing requirements from archives or invent values. |

Proposed minor flow defaults are explicitly named in User flows. These are reviewable design recommendations, not new product approvals. None reopens the fixed form choices, single-group rule, four conceptual sets or no-source-link copying decision.
