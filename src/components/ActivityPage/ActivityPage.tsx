"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./ActivityPage.module.css";

/**
 * Reading page of a personal or library activity: forest masthead (top bar + the page's ActionBar),
 * the big title and the ivory reading sheet; children render the ActionBar and the ActivityView.
 * Once the big title scrolls under the pinned bar, the bar swaps `label` for the activity's `name`
 * (`data-collapsed`, animated in CSS).
 */
export function ActivityPage({ label, fallback, name, children }: { label: string; fallback: string; name: string; children: ReactNode }) {
  const page = useRef<HTMLDivElement>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const root = page.current;
    if (!root) return;
    let watched: Element | null = null;
    const io = new IntersectionObserver(
      ([entry]) => setCollapsed(!entry.isIntersecting && entry.boundingClientRect.top < entry.rootBounds!.top + 1),
      // Ignore the area behind the pinned top bar and action bar.
      { rootMargin: "-138px 0px 0px 0px" },
    );
    // The title is replaced when switching between reading and editing: watch whichever is shown.
    const watch = () => {
      const heading = root.querySelector("[data-activity-head] h1");
      if (heading === watched) return;
      if (watched) io.unobserve(watched);
      watched = heading;
      if (heading) io.observe(heading);
      else setCollapsed(false);
    };
    watch();
    const mo = new MutationObserver(watch);
    mo.observe(root, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div ref={page} className={styles.page} data-collapsed={collapsed || undefined}>
      <TopBar
        fallback={fallback}
        tone="forest"
        title={
          <span className={styles.barTitle}>
            <span className={styles.barLabel}>{label}</span>
            <span className={styles.barName} aria-hidden>
              {name}
            </span>
          </span>
        }
      />
      {children}
    </div>
  );
}
