"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ActionSlotContext } from "@/components/ActionBar/ActionBar";
import { MastheadTrail } from "@/components/MastheadTrail/MastheadTrail";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./ActivityPage.module.css";

/**
 * Reading page of a personal or library activity: forest masthead (top bar, then the title block with the
 * page's ActionBar under the title) and the ivory reading sheet; children render the ActivityView.
 * Once the actions under the title scroll under the top bar, the bar swaps `label` for a compact copy of them
 * (`data-collapsed`, animated in CSS), so share and copy stay one tap away while reading. The masthead's trail fades
 * out on the way there, so the compact bar is plain green.
 */
export function ActivityPage({ label, fallback, children }: { label: string; fallback: string; children: ReactNode }) {
  const page = useRef<HTMLDivElement>(null);
  const [slot, setSlot] = useState<HTMLDivElement | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const root = page.current;
    if (!root) return;
    let watched: Element | null = null;
    const io = new IntersectionObserver(
      ([entry]) => setCollapsed(!entry.isIntersecting && entry.boundingClientRect.top < entry.rootBounds!.top + 1),
      // Ignore the area behind the fixed top bar.
      { rootMargin: "-64px 0px 0px 0px" },
    );
    // The actions are replaced when switching between reading and editing (edit mode has none): watch whichever is shown.
    const watch = () => {
      const row = root.querySelector("[data-activity-head] [data-actions]");
      if (row === watched) return;
      if (watched) io.unobserve(watched);
      watched = row;
      if (row) io.observe(row);
      else setCollapsed(false);
    };
    watch();
    const mo = new MutationObserver(() => {
      watch();
      fade();
    });
    mo.observe(root, { childList: true, subtree: true });
    // 1 at the top, 0 once the actions reach the bar's lower edge (where the bar collapses). The row's distance from the
    // page's top doesn't change with scrolling, so it gives the fade's full length wherever the page scrolls.
    const fade = () => {
      let opacity = 1;
      if (watched) {
        const bottom = watched.getBoundingClientRect().bottom;
        const span = bottom - root.getBoundingClientRect().top - 64;
        if (span > 0) opacity = Math.min(1, Math.max(0, (bottom - 64) / span));
      }
      root.style.setProperty("--masthead-trail-opacity", String(opacity));
    };
    fade();
    // Capture: the page scrolls inside the app shell on wide screens and the window on phones.
    document.addEventListener("scroll", fade, { capture: true, passive: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      document.removeEventListener("scroll", fade, { capture: true });
    };
  }, []);

  return (
    <div ref={page} className={styles.page} data-collapsed={collapsed || undefined}>
      <TopBar
        fallback={fallback}
        tone="forest"
        backdrop={<MastheadTrail />}
        title={<span className={styles.barLabel}>{label}</span>}
        overlay={<div ref={setSlot} className={styles.barActions} inert={!collapsed} />}
      />
      <ActionSlotContext value={slot}>{children}</ActionSlotContext>
    </div>
  );
}
