import type { ReactNode } from "react";
import { AvatarMenu } from "@/components/AvatarMenu/AvatarMenu";
import { BackButton } from "./BackButton";
import styles from "./TopBar.module.css";

export type TopBarTone = "light" | "forest";

/**
 * The one top bar every page except home uses: back arrow on the right (RTL start), title in the center, avatar
 * on the left. Back returns to the previous in-app page; `fallback` is where it goes when the page was opened
 * directly (default home). `tone="forest"` is the dark masthead of the redesigned pages.
 */
export function TopBar({ title, fallback, tone = "light" }: { title?: ReactNode; fallback?: string; tone?: TopBarTone }) {
  return (
    <header className={`${styles.bar} ${tone === "forest" ? styles.forest : ""}`}>
      <div className={styles.side}>
        <BackButton fallback={fallback} />
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={`${styles.side} ${styles.end}`}>
        <AvatarMenu />
      </div>
    </header>
  );
}
