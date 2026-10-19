"use client";

import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { canGoBackInApp } from "@/components/AppShell/history";
import styles from "./TopBar.module.css";

/** Back without a fixed parent: previous in-app page, or home when the page was opened directly. */
export function BackButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      className={styles.back}
      aria-label="חזרה"
      onClick={() => (canGoBackInApp() ? router.back() : router.push("/"))}
    >
      <ChevronRight size={28} aria-hidden />
    </button>
  );
}
