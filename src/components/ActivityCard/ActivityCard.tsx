import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ActivityCard.module.css";

export type CardTag = { icon: ReactNode; label: string };

/** A tappable card: bold title, a muted line (date or excerpt), then a line of small tags (when `tags` is given,
 * even empty, so rows in a list keep one height). */
export function ActivityCard({ href, title, tags, subtitle }: { href: string; title: string; tags?: CardTag[]; subtitle?: string }) {
  return (
    <div className={styles.card}>
      <Link href={href} className={styles.link}>
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        {tags && (
          <span className={styles.tags}>
            {tags.map((t) => (
              <span key={t.label} className={styles.tag}>
                {t.icon}
                {t.label}
              </span>
            ))}
          </span>
        )}
      </Link>
    </div>
  );
}

/** dd.mm.yy in Israel time. */
export function formatDate(ms: number): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jerusalem",
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).formatToParts(new Date(ms));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return `${get("day")}.${get("month")}.${get("year")}`;
}
