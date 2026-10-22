"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import styles from "./AppShell.module.css";

/**
 * Marks <html data-scroll-end="bottom"> once the page is scrolled past its middle, so the color revealed by
 * overscroll bounce matches the edge being pulled: the green masthead at the top, the ivory sheet at the bottom.
 */
function useScrollEnd(viewport: React.RefObject<HTMLDivElement | null>, pathname: string) {
  useEffect(() => {
    const root = document.documentElement;
    const update = () => {
      const frame = viewport.current;
      // Desktop scrolls inside the frame; phones scroll the document.
      const scroller = frame && frame.scrollHeight > frame.clientHeight ? frame : document.scrollingElement;
      if (!scroller) return;
      const max = scroller.scrollHeight - scroller.clientHeight;
      const atBottom = max > 0 && scroller.scrollTop > max / 2;
      if (atBottom) root.dataset.scrollEnd = "bottom";
      else delete root.dataset.scrollEnd;
    };
    update();
    // Capture catches the frame's scroll events too, which don't bubble.
    document.addEventListener("scroll", update, { capture: true, passive: true });
    window.addEventListener("resize", update);
    return () => {
      document.removeEventListener("scroll", update, { capture: true });
      window.removeEventListener("resize", update);
      delete root.dataset.scrollEnd;
    };
  }, [viewport, pathname]);
}

/** Desktop pages scroll inside the frame; route changes start at the top. */
export function AppViewport({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const viewport = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    viewport.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  useScrollEnd(viewport, pathname);
  return <div ref={viewport} className={styles.content} data-app-viewport>{children}</div>;
}
