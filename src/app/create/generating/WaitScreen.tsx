"use client";

import Image from "next/image";
import type { ReactNode, Ref } from "react";
import styles from "./Generating.module.css";

/**
 * The full-screen sage wait (generating, saving after sign-in, and the activity loading after either): the animation,
 * a progress bar and a line of text. `done` shows the bar full; `fillRef` lets the screen complete it (completeBar).
 */
export function WaitScreen({
  label,
  note,
  status,
  fillSeconds = 15,
  done,
  fillRef,
}: {
  /** The progress bar's accessible name. */
  label: string;
  /** Small print under the bar (the AI notice). */
  note?: ReactNode;
  /** One short line under the bar ("שומרים את הפעולה…"). */
  status?: ReactNode;
  /** How long the bar takes to reach ~90% while waiting. */
  fillSeconds?: number;
  done?: boolean;
  fillRef?: Ref<HTMLDivElement>;
}) {
  return (
    <main className={`${styles.screen} ${styles.loading}`} aria-busy="true">
      <Image className={styles.animation} src="/animations/generating.webp" width={500} height={320} alt="" unoptimized priority />
      <div className={styles.bar} role="progressbar" aria-label={label}>
        <div ref={fillRef} className={`${styles.fill} ${done ? styles.done : ""}`} style={{ animationDuration: `${fillSeconds}s` }} />
      </div>
      {status && <p className={styles.status}>{status}</p>}
      {note && <p className={styles.notice}>{note}</p>}
    </main>
  );
}

/** Runs the bar from wherever it is to full, so the wait visibly ends before the page changes. */
export function completeBar(fill: HTMLDivElement | null): Promise<void> {
  if (!fill || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return Promise.resolve();
  const now = getComputedStyle(fill).transform;
  fill.style.animation = "none";
  fill.style.transform = now === "none" ? "" : now;
  fill.getBoundingClientRect();
  fill.style.transition = "transform 320ms cubic-bezier(0.2, 0.7, 0.3, 1)";
  fill.classList.add(styles.done);
  fill.style.transform = "";
  return new Promise((resolve) => setTimeout(resolve, 360));
}
