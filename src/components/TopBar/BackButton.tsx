"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { canGoBackInApp } from "@/components/AppShell/history";
import styles from "./TopBar.module.css";

/** Previous in-app page, or `fallback` when the page was opened directly (e.g. from a shared link). */
export function BackButton({ fallback = "/" }: { fallback?: string }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={styles.back}
      aria-label="חזרה"
      onClick={() => (canGoBackInApp() ? router.back() : router.push(fallback))}
    >
      <ChevronRight size={28} aria-hidden />
    </button>
  );
}
