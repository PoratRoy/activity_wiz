# Design

This is a simple first-pass design, meant to be replaced later with a richer one (illustrations made in ChatGPT). Everything visual goes through the CSS variables in `src/app/globals.css`, so the reskin is a token change and an asset swap.

## Principles

- **App, not website.** A phone-width column, a bottom tab bar, a top bar with a back arrow, and big tap targets (at least 48px).
- **Minimal text.** One short line where a paragraph would go. Icons only where they help.
- **Youthful and friendly.** Inspired by Duolingo: chunky rounded buttons with a bottom "lip", bright green and yellow, simple shapes, small illustrations.
- **Reading comes first** on activity pages: large comfortable text and nothing covering it.
- **Hebrew RTL everywhere.** `<html lang="he" dir="rtl">`. Use logical CSS properties (`margin-inline-start`, `inset-inline-end`), never `left`/`right`.
- Light mode only.

## Tokens (`:root` in `globals.css`)

```css
--green: #58CC02;        /* primary */
--green-dark: #46A302;   /* button lip / pressed */
--green-light: #D7FFB8;  /* active tab pill, success bg */
--yellow: #FFC800;       /* accent */
--yellow-dark: #E0A800;
--yellow-light: #FFF4CC; /* banners */
--cream: #FFF8E7;        /* page background inside the column */
--backdrop: #F2EBD9;     /* desktop area outside the column */
--surface: #FFFFFF;      /* cards */
--text: #3C3C3C;
--text-muted: #777777;
--border: #E5E5E5;
--danger: #FF4B4B;
--danger-dark: #D93636;
--card-blue: #1CB0F6;  --card-orange: #FF9600;  /* category card rotation */

--radius-sm: 12px; --radius: 16px; --radius-lg: 24px; --radius-pill: 999px;
--space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px; --space-5: 24px; --space-6: 32px;
--lip: 0 4px 0;          /* used as box-shadow: var(--lip) var(--green-dark) */
--column: 480px;
--topbar-h: 56px; --tabbar-h: 64px; --actionbar-h: 64px;
--font: var(--font-rubik), system-ui, sans-serif;
```

**Font:** Rubik through `next/font/google` (`subsets: ['hebrew','latin']`, weights 400/500/700). Sizes: body 16px, reading text 18px with line-height 1.7, H1 24px/700, H2 20px/700, small 14px.

## Layout

- `body` uses `--backdrop`. `.app` is centered with `max-width: var(--column)`, `min-height: 100dvh` and the `--cream` background. On desktop it looks like a phone in the middle of the screen.
- The top bar is sticky at the top. The tab bar is fixed at the bottom, inside the column width. Content gets bottom padding equal to `--tabbar-h` (plus `--actionbar-h` on activity pages) plus `env(safe-area-inset-bottom)`.
- Side padding is `--space-4` (16px).

## Components (`src/components`, each with its own `.module.css`)

| Component | Notes |
| --- | --- |
| `AppShell` | Wraps every page: `TopBar` + content + `BottomNav` + `ToastHost`. |
| `TopBar` | Props `title`, `back?: string`. Back arrow (`ChevronRight`) on the inline start (the right side), the title centered, `AvatarMenu` on the inline end (the left side). |
| `AvatarMenu` | A 36px round avatar or a generic icon. Opens a small popover menu. Client component using `useSession`. |
| `BottomNav` | 4 tabs, each a lucide icon plus a label of 12px or less. The active tab gets a `--green-light` pill behind the icon and green text. Uses `Home`, `Sparkles`, `BookOpen`, `ListChecks`, plus `Lock` on top of the last tab for guests. |
| `Button` | Variants `primary` (green), `secondary` (white with border), `accent` (yellow), `danger`. Full width by default, 52px tall, `--radius`, bold text, and `box-shadow: var(--lip) <dark>`. When `:active`, it moves down 4px (`translateY(4px)`) and the shadow disappears. |
| `Tile` / `TileGroup` | Radio-like tiles in a wrapping grid. Unselected: white with a 2px `--border` and a gray lip. Selected: `--green-light` background with a green border and a green lip. Used for 2–6 options. |
| `PickerSheet` | A field button that shows the current value. Tapping it slides up a bottom sheet with a scrollable list (one item per row, checkmark on the selected one). Used for movement and grade. Closes when you tap the backdrop or pick an item. |
| `TextField` / `TextArea` | 2px border, `--radius`, green border on focus. |
| `Collapsible` | The "עוד אפשרויות" (more options) row with a chevron. |
| `Chip` | A small pill (`--yellow-light`, 14px) for the type, place and duration. |
| `ActivityView` | Chips, title and Markdown body, plus the sticky `ActionBar`. Switches to edit mode with `ActivityEditor` (Tiptap, loaded with `next/dynamic` so it only downloads in edit mode). |
| `ActionBar` | Sticky, sitting directly above the `BottomNav`. A row of icon+label buttons: `Copy`, `MessageCircle` (WhatsApp, green), `Pencil`, `MoreVertical`, `BookmarkPlus`. |
| `Modal` | A centered card on a dimmed backdrop, used for delete confirmations and the admin category form. `blocking` prop: the backdrop doesn't close it (used for the trial popup). |
| `SignInGate` | The blocking trial popup: mascot, «הניסיון הסתיים 🙂 התחברו כדי להמשיך ליצור פעולות», a Google button, and a "חזרה" (back) text link. |
| `Toast` / `ToastHost` | Bottom-centered above the bars. A dark pill with white text. Disappears after 2.5 seconds. |
| `CategoryCard` | Square, `--radius-lg`. Its background color comes from the rotation [green, yellow, blue, orange], picked by a hash of the ID. A white lucide icon is picked by a hash from a fixed list (`Tent`, `Sun`, `Leaf`, `Star`, `Flame`, `Compass`, `Heart`, `Users`, `Mountain`, `Snowflake`). The title is bold white text. |
| `ActivityCard` | A white card with the title (bold) and a 2-line excerpt or a date. |
| `EmptyState` | Small illustration, one line of text and an optional button. |
| `AdSlot` | Returns `null` unless `NEXT_PUBLIC_ADS_ENABLED === 'true'`. When enabled, a fixed-height (250px) box with a dashed border and «פרסומת». |
| `Mascot` | An inline SVG: a round green spark/flame character with big eyes and a yellow scarf (צעיף), a nod to the scout neckerchief. Variants: `idle` and `bounce` (CSS keyframes). |

## Illustrations

These are simple inline SVGs built from basic shapes in the palette colors, kept in `src/components/illustrations/`: `Mascot`, `EmptyBox` (empty states), `Campfire` (landing), `Oops` (error and refusal). They are placeholders until the final art arrives.

## Motion

Keep it subtle: button press (80ms), sheet slide-up (200ms ease-out), mascot bounce (1.2s loop), and a smooth progress-bar fill. Respect `prefers-reduced-motion`.

## Copy tone

Short, warm, informal plural Hebrew (נסו, התחברו). One emoji at most, and only in friendly moments.
