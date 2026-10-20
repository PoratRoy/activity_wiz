import type { ReactNode } from "react";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./ForestPage.module.css";

/** Sticky forest masthead (back, title, avatar) over a rounded ivory sheet. */
export function ForestPage({ title, fallback, children }: { title: string; fallback?: string; children: ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.masthead}>
        <TopBar title={title} fallback={fallback} tone="forest" />
      </div>
      <main className={styles.sheet}>{children}</main>
    </div>
  );
}
