import type { ReactNode } from "react";
import { AdSlot } from "@/components/AdSlot/AdSlot";
import { ChipRow, type ChipItem } from "@/components/Chip/Chip";
import { renderMarkdown } from "@/lib/markdown/render";
import styles from "./ActivityView.module.css";

/**
 * Read mode of an activity (draft, personal, public): title, labeled chips, Markdown body, ad slot.
 * The page renders its ActionBar before this (pinned at the top) and may add a banner (`before`).
 * The `data-*` hooks let a page restyle the shared layout (see `ActivityPage`).
 */
export function ActivityView({
  title,
  bodyMd,
  chips,
  before,
}: {
  title: string;
  bodyMd: string;
  chips: ChipItem[];
  before?: ReactNode;
}) {
  return (
    <article className={styles.article} data-activity>
      {before}
      <header className={styles.head} data-activity-head>
        <h1 className={styles.title}>{title}</h1>
        <ChipRow items={chips} />
      </header>
      {/* renderMarkdown escapes raw HTML (except <u>) and drops links/images. */}
      <div className={styles.body} data-reading dangerouslySetInnerHTML={{ __html: renderMarkdown(bodyMd) }} />
      <AdSlot />
    </article>
  );
}
