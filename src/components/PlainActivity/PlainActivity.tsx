import { ChipRow } from "@/components/Chip/Chip";
import styles from "./PlainActivity.module.css";

/** Temporary result view until step 9 (Markdown rendering, copy, share, edit). */
export function PlainActivity({ title, bodyMd, chips }: { title: string; bodyMd: string; chips: (string | null | undefined)[] }) {
  return (
    <article className={styles.article}>
      <ChipRow items={chips} />
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.body}>{bodyMd}</div>
    </article>
  );
}
