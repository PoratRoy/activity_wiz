# Design

## Direction agreed on 2026-10-19

Use the first illustrated three-screen proposal: warm ivory, forest green, sage, butter-yellow highlights, rounded Hebrew typography and expressive outdoor illustrations. The user preferred this to the later recolored group-form mockup, which felt empty and lacked life. Do not use that later mockup as the target, or return to the original neon-lime Duolingo skin.

The first proposal shows home, group setup and activity reading. It is a visual reference, not a replacement screen specification: its dropdown substitutions, sample copy, logo and omitted features are not requirements. Preserve the routes, field types, option order, content, navigation, permissions and interactions in [Screens](screens.md) and [Product](product.md). The approved `/create/group` implementation below supersedes the earlier field-type and visual guidance for that route: group size now uses a bottom-sheet picker, while composition remains tiles. Preserve all option values, order, validation and saving behavior. Other routes retain their specified field types.

Visual reference: [original three-screen preview](/Users/royporat/.codex/generated_images/01a1509a-e263-7230-8409-d918f0d21008/exec-1adc6e26-b44f-4e1c-8482-afcabb32321d.png). This local preview is not a production asset; the written specification remains usable without access to it.

Status: the landing page and `/create/group` have received local visual updates. The user approved the current group page on 2026-10-19; it is the concrete reference for the form look and feel. This does not mark the remaining screens as reskinned. The group-page measurements below describe its implementation; general tokens remain targets for the broader app.

## Principles

- **An illustrated, welcoming app.** Illustrations are part of the identity, not an optional polish pass. Color changes alone do not meet this brief.
- **Youthful, with restraint.** Design for teenage youth movement leaders. Take rounded, tactile controls and clear responsive feedback from Duolingo. The approved group controls use 2px borders and restrained 3px lower edges; avoid neon colors, exaggerated depth and constant mascot animation.
- **Warm and readable.** White controls on warm ivory, dark readable text, one visually dominant primary action. Use sage for selected states and butter yellow for warmth.
- **Preserve the existing structure.** Add artwork within existing hero, heading and empty-state regions without moving controls or introducing steps. Do not change field types without an explicit product decision. The approved exception is group size on `/create/group`, which now matches the movement and grade pickers.
- **Hebrew RTL throughout.** Keep `lang="he" dir="rtl"` and logical CSS properties. Preserve existing copy unless separately approved.
- Light mode only. Use the existing CSS Modules, shared CSS variables, Rubik and lucide-react; no new UI framework is required.

## Approved group page `/create/group` (2026-10-19)

This is the accepted form reference: expressive in the header, clean and easy to scan in the body, with tactile Duolingo-inspired controls in the app’s outdoor palette. Follow the current [page](../src/app/create/group/page.tsx), [form](../src/app/create/group/GroupForm.tsx) and [route stylesheet](../src/app/create/group/group.module.css). These route-specific decisions take precedence over older group-page descriptions in this document, [Screens](screens.md) and [Product](product.md).

### Header and illustration

- Dark forest-green header (`#255B46`) with the ivory title **הקבוצה שלי** centered in the top bar. Keep the back control on the right in butter yellow and the avatar on the left.
- The top bar is at least 64px high; the title is 24px, reduced to 22px below 360px viewport width. The masthead stays sticky.
- The ivory form overlaps the header by 24px and has 32px rounded top corners. This transition is the main visual feature.
- Use the existing transparent [compass illustration](../public/illustrations/group-compass.webp), overlapping the green/ivory seam on the left. It is 132 × 88px, rotated −9°, inset 28px from the inline end, with its bottom extending 30px below the masthead. At viewport heights of 740px or less it becomes 120 × 80px. Keep it decorative (`alt=""`, no pointer interaction) and clear of controls.
- The header row sits above the compass, so the avatar menu always opens over the artwork. The back control's pressed state is a soft translucent ivory circle, not a light-gray one.
- Pulling past the top (phone bounce or the desktop frame's scroll bounce) shows the same forest green, so the header never reveals the light backdrop. This applies to both create pages.
- Do not revert to the rejected alternative with a separate, right-aligned title row and the compass beside it on a lighter green header. Do not return to a detached, centered illustration above the fields.

### Fields and tactile feedback

Keep this order and these control types:

| Field | Approved control |
| --- | --- |
| תנועה | Bottom-sheet picker; placeholder בחרו תנועה |
| כיתה | Bottom-sheet picker; placeholder בחרו כיתה |
| מספר חניכים | Bottom-sheet picker; placeholder בחרו מספר חניכים; preserve all five existing size ranges |
| הרכב | Three single-selection tiles: מעורב, בנים, בנות (מעורב first, owner decision 2026-10-19) |

All three pickers share the same styling and state rules. A populated size picker is not a distinct variant.

- **Labels:** visible above every field, 16px/500, dark text, with 6px spacing below.
- **Empty pickers:** white surface, at least 52px high, 18px corners, a 2px `#CED7C9` border and a 3px lower edge in the same color. Text is 16px/500.
- **Chevron:** forest green on a small pale-butter (`#FBF2CF`) rounded backing, 30 × 30px with 10px corners. Rotate it when the sheet is open.
- **Filled pickers:** the current approved implementation uses a pale sage surface (`#F1F6EC`), `#9EB79B` border/lower edge, dark-green text and a sage chevron backing. A suggestion to keep filled pickers white was discussed but was not implemented; do not treat it as an approved change.
- **Composition tiles:** white unselected surfaces, at least 48px high, 16px corners, 2px borders and 3px lower edges. Keep the three-column layout with 8px gaps. Selected tiles use sage (`#E7EFDF`), a forest-green border/lower edge, dark-green text and weight 700.
- **No checkmark on composition tiles.** Selection is conveyed through the fill, border and bolder label. Keep the selected-item checkmark inside picker sheets; its removal was not requested.
- **Feedback:** hover adds a sage fill and green border. Pressing a picker or tile moves it down 3px and removes its lower shadow. Use brief 100–120ms transitions and respect reduced motion. Retain visible keyboard focus and programmatic selection/expanded states.
- **Sheets:** retain their existing bottom-sheet interaction, 24px rounded top corners, selected-row highlight and checkmark. Overlays must appear above the header, artwork and bottom navigation.

### Spacing, action and navigation

- Compact rhythm (2026-10-19, to fit short phones): the form uses 24px horizontal padding and 16px vertical gaps, with 52px top padding to clear the overlapping artwork. Below 360px, horizontal padding is 16px. Keep natural scrolling on short screens.
- **המשך** is full-width forest green, at least 50px high, with 16px corners, 18px/500 text and a yellow left arrow. Its subtle 2px lower edge depresses by 2px on press. The footer uses available space above it to place the action toward the bottom and is sticky above the ad bar and navigation, so it stays visible on short screens.
- Continue stays disabled until all four fields are valid, and during saving. Disabled styling is a quiet flat placeholder with no raised edge: `#EEF0EA` fill, 2px `#E2E6DD` border and `#87918A` text and arrow. Preserve prefill, persistence, error handling and navigation to `/create/activity`.
- Bottom navigation is ivory with a fine top border, rounded upper corners and a sage active state. Keep the current navigation labels and behavior.
- These styles are scoped to the group route (including its shell palette while mounted). Reuse this visual language deliberately on future forms; do not claim shared components or other routes have already been reskinned.

## Activity page `/create/activity` (2026-10-19, awaiting review)

Restyled to follow the approved group page; see [page](../src/app/create/activity/page.tsx) and [route stylesheet](../src/app/create/activity/activity.module.css). Fields, option order, validation and navigation are unchanged.

- Same forest masthead, centered ivory title **הפעולה**, yellow back control and compass illustration (reused for now; dedicated artwork can replace it later).
- Because this form scrolls, the 32px rounded ivory seam belongs to the sticky masthead, so fields slide under it instead of showing behind the compass.
- Only the type tiles have no visible label (owner decision, 2026-10-19); they keep a screen-reader-only legend. All other fields keep visible labels. Place reads במקום סגור, במקום פתוח, לא משנה.
- Compact rhythm so every required field and the "more options" row are visible at 375 × 667: 16px gaps between fields, 6px under labels, 38px top padding (just clears the compass), 48px tiles, 52px subject field and "more options" header, and a 50px create button in a 10/12px sticky footer.
- Type tiles fill one row when the movement has up to 3 types and use a 2 × 2 grid for 4, so no tile sits alone on a second row.
- Tiles, labels, borders and press feedback match the group composition tiles; tile inline padding is 8px so three-column labels fit on one line where possible.
- Subject and notes fields use the picker look: white, 2px `#CED7C9` border, 3px lower edge, 18px corners; sage once filled and white with a green edge while focused. The suggestion button is a pale-butter rounded square with a small yellow lower edge.
- **עוד אפשרויות** sits 28px below the duration tiles (16px gap plus 12px), separating optional settings from required fields. It is a raised white card whose header matches a picker (chevron on pale butter, sage when open) with a dashed divider above its contents.
- Inside it, equipment, teams and Shabbat are switch rows ([Switch](../src/components/Switch/Switch.tsx)): label at the start, a 52 × 32px pill switch at the end, thin dividers between rows. The track is `#CED7C9` off and forest green on; the white knob has a small lower edge and slides toward the inline end. Tapping the label also toggles it; motion is off under reduced motion.
- **יצירת הפעולה** keeps the group button styling with a yellow sparkles icon and stays sticky above the bottom navigation on a soft ivory fade.

## Personal activity `/activity/[id]` (2026-10-20, deployed for user feedback)

Restyled in the group-page language with the content first; see [page](../src/app/activity/[id]/page.tsx) and [route stylesheet](../src/app/activity/[id]/activity.module.css). No illustrations or background shapes: every accent helps scan the text while guiding. Actions, Markdown, editing and autosave are unchanged. Draft and public activity views share the components but are not reskinned; the route styles them through `data-*` hooks (`data-activity`, `data-activity-head`, `data-reading`, `data-actionbar`).

- **Masthead:** forest-green top bar (64px, centered ivory **הפעולה**, yellow back) with the action bar below it, sticky together. Actions are horizontal icon + label buttons, 44px high, 14px corners: **שיתוף** is butter yellow with dark-green text and a 2px lower edge; the others are translucent ivory outlines. The bar's 24px rounded lower corners blend into the title block at the top and frame the text once it scrolls under.
- **Collapsing title:** once the big title scrolls under the pinned bar, **הפעולה** in the top bar slides out and the activity's name slides in (200ms fade and 10px slide, ellipsis when long), and the action bar gains a soft shadow. Scrolling back up reverses it. In edit mode the bar keeps **הפעולה**.
- **Title block:** the activity title in ivory, 26–32px/700, balanced, on forest green, with translucent ivory chips. The chips show values only (type, place, duration) with a tag, pin and clock icon in place of the "סוג:/מקום:/זמן:" labels, so all three fit one row (down to 320px). This deviates from the labeled chips in [Screens](screens.md) for this route. The ivory reading sheet overlaps it by 24px with 28px rounded top corners (the group-page seam).
- **Reading:** 18px with 1.75 line height. The opening **מטרה** paragraph is a pale-butter note with a 4px yellow inline-start bar. Section headings are forest green, 21px, with a short yellow pill marker instead of an underline. Steps are separated by dashed dividers, and their length shows as a sage time badge with a clock (`renderMarkdown` wraps the trailing "(N דק׳)" of a step heading in `data-minutes`; elsewhere it shows as muted small text). Equipment (first section) is a white card with dashed dividers; tips (last section) are a sage card. Bold text is forest green; underline is a thick yellow line.
- **Edit mode:** the green bar keeps **סיום עריכה** in yellow and the save status in ivory. Title input and toolbar use the picker look (2px `#CED7C9` border, 3px lower edge, 18px corners); the body editor keeps its dashed frame, solid green on focus, and uses the same reading styles.
- Bottom navigation uses the ivory home treatment. Like the create pages, pulling past the top shows forest green, and the back control presses to a soft translucent circle.
- The reading accents come from the Markdown that `aiToMarkdown` builds from the AI JSON (goal paragraph, `##` sections, `### N. name (M דק׳)` steps). Activities whose text was edited into another shape fall back to plain headings, lists and paragraphs.

## Visual tokens

Target values for `src/app/globals.css`; these are specifications, not a claim about current code:

```css
--green: #32765B;
--green-dark: #255B46;
--green-light: #E7EFDF;
--yellow: #F4D675;
--yellow-dark: #A98225;
--yellow-light: #FBF2CF;
--cream: #FAF8F1;
--backdrop: #EEEFE8;
--surface: #FFFFFF;
--text: #303A34;
--text-muted: #626D65;
--border: #DDE1D8;
--danger: #B8453B;
--danger-dark: #92342D;
--card-blue: #DFEAF0;
--card-orange: #F7E3CC;

--radius-sm: 12px;
--radius: 16px;
--radius-lg: 24px;
--radius-pill: 999px;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 24px;
--space-6: 32px;
--lip: 0 2px 0;
--column: 480px;
--topbar-h: 56px;
--tabbar-h: 64px;
--actionbar-h: 64px;
--font: var(--font-rubik), system-ui, sans-serif;
```

Rubik 400/500/700: body 16px, reading 18px with 1.7 line height, H1 24px/700, H2 20px/700, supporting text 14px. Home display type can scale fluidly from 30–36px. Keep headings strong and labels quieter; avoid making every text element bold. Validate actual foreground/background pairs for readable contrast, including disabled, error and selected states. Yellow is decorative or paired with dark text, never small yellow text on white.

## Responsive shell

- All mobile widths must work fluidly. Use width 100% with max-width 480px, not a fixed 480px canvas scaled down. Start validation at 320px and include 360, 375, 390, 414, 430 and 480px; layouts must also work between these samples.
- At desktop widths (768px and above), use a centered 480px maximum-width panel with 32px rounded corners and 32px outer padding on a soft background. Its height is capped at 900px and the viewport height minus 64px. Content scrolls inside the panel; navigation, action bars, sheets and dialogs stay anchored within it. Route changes reset the inner scroll position. No desktop sidebar or expanded columns.
- On phones the app fills the available width without a device frame or outer gutters. Keep current content padding; allow labels to wrap and grids to reflow only as needed to prevent clipping. Preserve logical order and control types.
- On mobile use `min-height: 100dvh` and natural document scrolling; desktop uses the bounded frame above. Support short screens, landscape, browser chrome changes and the software keyboard. A page may scroll; its primary action must remain reachable.
- Top bar remains sticky. Bottom navigation remains fixed and aligned to the app column on every viewport. Activity action bars remain directly above it. Sheets, dialogs and toasts must fit the viewport and align with the centered column.
- Reserve bottom content clearance for the actual navigation/action bar heights plus `env(safe-area-inset-bottom)`. Allow bar height to grow if text enlargement needs it. Neither content nor the ad placeholder may sit behind these bars.
- No horizontal page overflow. Keep 48px primary control targets, visible keyboard focus, sensible focus order and usable 200% text enlargement. Artwork scales with its container, with intrinsic dimensions reserved to avoid layout shifts.

## Illustrations and icons

The visual reference is the original proposal's woodland landscape and small compass illustration: rounded organic shapes, layered sage hills, forest-green foliage, a butter-yellow sun, cream paths and small tents. Use a cohesive illustrated family with subtle texture in artwork only. Avoid generic geometric placeholders, stock-photo collages and busy thumbnails.

- **Home:** a substantial outdoor scene in the existing hero region gives the app its most memorable visual. Keep all specified buttons. Do not add a library preview or category section to the landing page; access remains in bottom navigation (owner clarification, 2026-10-19). The scene scales/crops without covering content or navigation.
- **Group and activity forms:** a compact compass, leaves, trail marker or similar vignette in the existing heading region adds character. For the approved group page, use the placement and dimensions above. For other forms, a 64–96px-high vignette is a starting point; reduce as needed rather than moving fields. Do not add a large blank illustration panel.
- **Library:** "Raised rows" (approved 2026-10-20, reference `design-references/library-raised-rows.png`). A compact forest masthead with the single title «מאגר פעולות» and no back arrow; an ivory sheet (24px top corners, overlapping the masthead by 16px) holding one column of full-width white rows with 12px gaps. Each row: 76px min height, 2px `#CED7C9` border, 16px radius, `0 2px 0 #CED7C9` lower edge, category name 16px/500 on the right and a 72 × 52px, 10px-radius thumbnail on the left; it presses down 2px. No counts, subtitles, chevrons or random colors/icons. Each category shows its own artwork (the set in `public/library`, same flat forest/sage style as the landing art); a category without one shows the landing `home-trail.webp`. Rows use 216 × 156 thumbnails from `public/library/thumbs`.
- **My activities and empty/error states:** use a small backpack, folded map, campfire or other relevant scene with the existing message and action.
- **Loading:** use a small illustrated companion or camp scene with restrained progress feedback. Match the same palette; retain existing tips, AI notice and outcome behavior.
- **Activity reading/editing:** keep the body quiet and unobstructed. Any decorative detail is confined to the heading; no artwork behind reading text or editor controls.
- **Admin:** use the same surfaces, type and controls. Keep illustration minimal around dense management content.

Use one consistent rounded lucide icon family for functional actions, with text labels where already present. Retain existing icon meanings; the generated mockup's generic database/person icons are not required replacements. Decorative illustrations have empty alt text; meaningful images receive useful alternatives. Existing mascot SVGs are placeholders, not the finished art direction. No new mascot identity or logo is mandated.

## Component treatment

| Component | Target treatment; existing behavior stays intact |
| --- | --- |
| AppShell | Shared mobile column, soft desktop surround, ad bar, navigation and toast layer. |
| TopBar / AvatarMenu | Quiet ivory by default; the approved group route uses a dark forest header, centered ivory title and yellow back control. Preserve real user photos. |
| BottomNav | Light surface, subtle upper separation, sage active pill and forest-green icon/label. No deep shadow or thick border. |
| Button | Forest primary with white text, 52px minimum height, 16px corners and subtle 2px lower edge. Secondary white with a restrained border; yellow accent uses dark text. Press movement matches edge depth. Avoid deep plastic-like lips. |
| Tile / TileGroup | Preserve all choices and grids. White unselected surface; selected sage fill, forest border and stronger text. Group composition uses the tactile 2px border/3px edge treatment above, without checkmarks. Avoid exaggerated depth. Selection must be apparent without relying on color alone. |
| PickerSheet | Use the approved group treatment as the form reference: rounded raised fields, distinct empty/filled states and a small chevron backing. Sheet retains selection/checkmark behavior. Keep field labels visible. |
| TextField / TextArea / SubjectField | White surface, restrained border and forest focus treatment; preserve limits, suggestions and validation. |
| Collapsible | Quiet row and consistent chevron; preserve expansion behavior. |
| Chip | Pale sage or butter tint with dark text and compact rounded shape. |
| ActivityView / Editor | Clear heading hierarchy and comfortable paragraph spacing. Preserve Markdown, editing, autosave and all actions. |
| ActionBar | Light surface, subtle divider, clear icon/label pairs. Preserve existing actions and visibility rules. |
| CategoryCard / ActivityCard | Quiet surfaces, dark titles and meaningful illustration where appropriate; preserve shape, grid/list structure and metadata. |
| Modal / SignInGate | Rounded white/ivory surface, restrained backdrop, existing actions and blocking behavior; illustration where already provided. |
| Toast | Readable charcoal surface, placed above fixed controls; preserve announcement and dismissal behavior. |
| EmptyState | Finished thematic illustration, existing brief copy and action. |
| AdSlot / AdBar | In-content `AdSlot` stays a no-op. `AdBar` is the single fixed ad placeholder above the bottom tabs (see below). |

## Ad bar (2026-10-19)

Owner requirement, superseding the earlier "ads paused" rule: every page except landing (`/`), terms (`/terms`), FAQ (`/faq`) and admin (`/admin/*`) shows one ad placeholder fixed directly above the bottom tabs ([AdBar](../src/components/AdSlot/AdBar.tsx)).

- A gray (`#E8EAE4`) strip with a 1px `#D9DCD5` top border and a small muted "פרסומת" label, aligned with the app column on phones and inside the desktop frame. It is decorative for now (`aria-hidden`) and ignores taps.
- Its height is the minimum for a real ad: 50px, the smallest standard mobile banner (320 × 50). It extends behind the tabs so rounded tab bars show gray in their corners.
- While it is shown, `--adbar-h` (otherwise `0px`) adds its height to content bottom padding, sticky footers, toasts and full-height layouts, so nothing sits behind it. The create-flow continue/create buttons are sticky just above it.
- In-content `AdSlot` placements (category list, activity view) stay no-ops; no other ad space is reserved.

## Motion and copy

Brief button feedback (80–120ms), sheet transitions (about 200ms) and existing progress feedback. No continuous decorative bouncing. Respect reduced-motion preferences and retain status text when animation is disabled. Keep the existing short, warm plural Hebrew copy; artwork should add life without extra explanatory text.

## Implementation acceptance

- Original illustrated direction is recognizable: finished hero/heading/empty-state assets, not merely recolored controls. Reject a sparse form-only result like the later mockup.
- Existing flows, option order and business rules remain intact. Apply the approved group field types: three pickers and composition tiles, without tile checkmarks.
- The ad bar appears only on the pages listed above and never covers content or actions; fixed controls stay within the desktop frame.
- Review representative home, forms, loading/error, reading/editing, library, saved and admin screens across the mobile widths above, landscape/short heights, and 768/1280/1440px desktop widths.
- Verify RTL, long Hebrew labels, keyboard focus, enlarged text, reduced motion, safe-area insets, keyboard-open inputs and no horizontal overflow.
- Desktop remains one centered mobile-width column with soft surroundings; mobile fills the viewport naturally.
- The group page described above is implemented and approved; do not infer completion of the remaining redesign. Track broader implementation separately in [Implementation plan](implementation-plan.md).
