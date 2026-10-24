import type { ReactNode } from "react";
import { AvatarMenu } from "@/components/AvatarMenu/AvatarMenu";
import { BackButton } from "./BackButton";
import styles from "./TopBar.module.css";

export type TopBarTone = "light" | "forest";

/**
 * The one top bar every page except home uses: back arrow on the right (RTL start), title in the center, avatar
 * on the left. Back returns to the previous in-app page; `fallback` is where it goes when the page was opened
 * directly (default home). `tone="forest"` is the dark masthead of the redesigned pages. `overlay` shares the
 * title's cell (outside the heading), for a page that swaps the title for something else. `backdrop` is drawn behind
 * the bar's content (e.g. MastheadTrail).
 */
export function TopBar({
  title,
  fallback,
  tone = "light",
  overlay,
  backdrop,
}: {
  title?: ReactNode;
  fallback?: string;
  tone?: TopBarTone;
  overlay?: ReactNode;
  backdrop?: ReactNode;
}) {
  return (
    <header className={`${styles.bar} ${tone === "forest" ? styles.forest : ""}`}>
      {backdrop}
      <div className={styles.side}>
        <BackButton fallback={fallback} />
      </div>
      <h1 className={styles.title}>{title}</h1>
      {overlay}
      <div className={`${styles.side} ${styles.end}`}>
        <AvatarMenu />
      </div>
    </header>
  );
}
