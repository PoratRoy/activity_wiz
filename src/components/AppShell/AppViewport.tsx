"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import styles from "./AppShell.module.css";

/** How long a restored position keeps being re-applied while the page it belongs to is still filling in. */
const RESTORE_MS = 600;

/**
 * Desktop pages scroll inside the frame. A new page starts at the top; going back or forward returns to where that page
 * was left, as the browser does for the window on phones (it doesn't know about this frame).
 */
export function AppViewport({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const viewport = useRef<HTMLDivElement>(null);
  const positions = useRef(new Map<string, number>());
  const current = useRef(pathname);
  const traversing = useRef(false);

  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const onScroll = () => positions.current.set(current.current, el.scrollTop);
    const onPop = () => (traversing.current = true);
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("popstate", onPop);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("popstate", onPop);
    };
  }, []);

  useLayoutEffect(() => {
    const el = viewport.current;
    current.current = pathname;
    const saved = traversing.current ? positions.current.get(pathname) : undefined;
    traversing.current = false;
    if (!el || !saved) {
      el?.scrollTo({ top: 0, left: 0, behavior: "instant" });
      return;
    }
    // The page may still be growing (images, a list arriving): keep the position until it fits or the user scrolls.
    const until = performance.now() + RESTORE_MS;
    let frame = 0;
    const apply = () => {
      el.scrollTop = saved;
      if (Math.abs(el.scrollTop - saved) > 1 && performance.now() < until) frame = requestAnimationFrame(apply);
    };
    const stop = () => cancelAnimationFrame(frame);
    apply();
    el.addEventListener("wheel", stop, { once: true, passive: true });
    el.addEventListener("touchstart", stop, { once: true, passive: true });
    return () => {
      stop();
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchstart", stop);
    };
  }, [pathname]);

  return <div ref={viewport} className={styles.content} data-app-viewport>{children}</div>;
}
