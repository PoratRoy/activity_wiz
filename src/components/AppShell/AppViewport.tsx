"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, type ReactNode } from "react";
import styles from "./AppShell.module.css";

/** Desktop pages scroll inside the frame; route changes start at the top. */
export function AppViewport({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const viewport = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    viewport.current?.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return <div ref={viewport} className={styles.content} data-app-viewport>{children}</div>;
}
