import type { ReactNode } from "react";
import { AdSlot } from "@/components/AdSlot/AdSlot";
import { ChipRow, type ChipItem } from "@/components/Chip/Chip";
import { renderMarkdown } from "@/lib/markdown/render";
import { withoutEmptyEquipment } from "@/lib/markdown/sections";
import styles from "./ActivityView.module.css";

/**
 * Read mode of an activity (draft, personal, public): title, labeled chips, the page's `actions` (its ActionBar),
 * Markdown body, ad slot. The page may add a banner (`before`).
 * The `data-*` hooks let a page restyle the shared layout (see `ActivityPage`).
 */
export function ActivityView({
  title,
  bodyMd,
  chips,
  actions,
  before,
}: {
  title: string;
  bodyMd: string;
  chips: ChipItem[];
  actions?: ReactNode;
  before?: ReactNode;
}) {
  return (
    <article className={styles.article} data-activity>
      {before}
      <header className={styles.head} data-activity-head>
        <h1 className={styles.title}>{title}</h1>
        <ChipRow items={chips} />
        {actions}
      </header>
      {/* renderMarkdown escapes raw HTML (except <u>) and drops links/images. An equipment section with nothing in it is hidden. */}
      <div className={styles.body} data-reading dangerouslySetInnerHTML={{ __html: renderMarkdown(withoutEmptyEquipment(bodyMd)) }} />
      <AdSlot />
    </article>
  );
}
