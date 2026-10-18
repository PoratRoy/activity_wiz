import type { ReactNode } from "react";
import { AdSlot } from "@/components/AdSlot/AdSlot";
import { ChipRow } from "@/components/Chip/Chip";
import { renderMarkdown } from "@/lib/markdown/render";
import styles from "./ActivityView.module.css";

/**
 * Read mode of an activity (draft, personal, public): title, labeled chips, Markdown body, ad slot.
 * The page adds its own ActionBar and any banner (`before`).
 */
export function ActivityView({
  title,
  bodyMd,
  chips,
  before,
}: {
  title: string;
  bodyMd: string;
  chips: (string | null | undefined)[];
  before?: ReactNode;
}) {
  return (
    <article className={styles.article}>
      {before}
      <h1 className={styles.title}>{title}</h1>
      <ChipRow items={chips} />
      {/* renderMarkdown escapes raw HTML (except <u>) and drops links/images. */}
      <div className={styles.body} dangerouslySetInnerHTML={{ __html: renderMarkdown(bodyMd) }} />
      <AdSlot />
    </article>
  );
}
