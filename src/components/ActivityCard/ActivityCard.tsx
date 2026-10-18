import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./ActivityCard.module.css";

/** A tappable card: bold title plus a muted second line (date or excerpt). `aside` sits at the end. */
export function ActivityCard({
  href,
  title,
  subtitle,
  aside,
}: {
  href: string;
  title: string;
  subtitle?: string;
  aside?: ReactNode;
}) {
  return (
    <div className={styles.card}>
      <Link href={href} className={styles.link}>
        <span className={styles.title}>{title}</span>
        {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
      </Link>
      {aside && <div className={styles.aside}>{aside}</div>}
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
