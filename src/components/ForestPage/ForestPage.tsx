import type { ReactNode } from "react";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./ForestPage.module.css";

/** Tab-root layout: sticky forest masthead (title, avatar, no back arrow) over a rounded ivory sheet. */
export function ForestPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className={styles.page}>
      <div className={styles.masthead}>
        <TopBar title={title} back={false} />
      </div>
      <main className={styles.sheet}>{children}</main>
    </div>
  );
}
