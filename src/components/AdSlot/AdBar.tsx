"use client";

import { usePathname } from "next/navigation";
import styles from "./AdBar.module.css";

/** Pages that never show the ad bar: landing, terms, FAQ and admin. */
const EXCLUDED = ["/terms", "/faq", "/admin"];

function showsAdBar(pathname: string) {
  return pathname !== "/" && !EXCLUDED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Fixed ad placeholder directly above the bottom tabs, sized for the smallest standard
 * mobile banner (320 × 50). While it is mounted, `--adbar-h` reserves its height for content,
 * sticky footers and toasts.
 */
export function AdBar() {
  const pathname = usePathname();
  if (!showsAdBar(pathname)) return null;
  return (
    <div className={styles.bar} data-ad-bar aria-hidden>
      <span className={styles.label}>פרסומת</span>
    </div>
  );
}
