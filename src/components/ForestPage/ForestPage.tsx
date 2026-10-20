import type { ReactNode } from "react";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./ForestPage.module.css";

/**
 * Sticky forest masthead (title, avatar) over a rounded ivory sheet. With `backButton` the masthead also has
 * the history back arrow (previous in-app page, or home).
 */
export function ForestPage({ title, backButton = false, children }: { title: string; backButton?: boolean; children: ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.masthead}>
        <TopBar title={title} back={backButton ? undefined : false} />
      </div>
      <main className={styles.sheet}>{children}</main>
    </div>
  );
}
