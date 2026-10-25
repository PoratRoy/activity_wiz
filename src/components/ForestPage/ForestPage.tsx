import type { ReactNode } from "react";
import { MastheadTrail } from "@/components/MastheadTrail/MastheadTrail";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./ForestPage.module.css";

/** Sticky forest masthead (back, title, avatar) over a rounded ivory sheet; `trail` draws the starry trail behind it. */
export function ForestPage({
  title,
  fallback,
  trail,
  children,
}: {
  title: ReactNode;
  fallback?: string;
  trail?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <div className={styles.masthead} data-masthead>
        <TopBar title={title} fallback={fallback} tone="forest" backdrop={trail && <MastheadTrail />} />
      </div>
      <main className={styles.sheet}>{children}</main>
    </div>
  );
}
