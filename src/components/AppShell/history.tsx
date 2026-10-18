"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Counts in-app page views so "back" never leaves the site (e.g. a page opened from a shared link).
// Counts path changes, not effect runs (React Strict Mode runs effects twice in development).
let views = 0;
let lastPath: string | null = null;

export function NavigationTracker() {
  const pathname = usePathname();
  useEffect(() => {
    if (pathname !== lastPath) {
      lastPath = pathname;
      views += 1;
    }
  }, [pathname]);
  return null;
}

/** True when the previous history entry is a page of this app. */
export function canGoBackInApp(): boolean {
  return views > 1;
}
