"use client";

import { BookOpen, Home, ListChecks, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useViewer } from "@/components/AppShell/viewer";
import { signInWithGoogle } from "@/lib/auth/actions";
import styles from "./BottomNav.module.css";

const tabs = [
  { href: "/", label: "בית", Icon: Home, match: (p: string) => p === "/" },
  { href: "/create/group", label: "יצירה", Icon: Sparkles, match: (p: string) => p.startsWith("/create") || p === "/activity/draft" },
  { href: "/library", label: "מאגר", Icon: BookOpen, match: (p: string) => p.startsWith("/library") },
  { href: "/my", label: "הפעולות שלי", Icon: ListChecks, match: (p: string) => p.startsWith("/my") || (p.startsWith("/activity/") && p !== "/activity/draft") },
];

/** Fixed bottom tabs. Guests see "הפעולות שלי" locked; tapping it starts Google sign-in. */
export function BottomNav() {
  const pathname = usePathname();
  const { signedIn } = useViewer();

  return (
    <nav className={styles.nav} aria-label="ניווט ראשי">
      {tabs.map(({ href, label, Icon, match }) => {
        const active = match(pathname);
        const locked = href === "/my" && !signedIn;
        const content = (
          <>
            <span className={styles.pill}>
              <Icon size={22} aria-hidden />
              {locked && <Lock size={12} className={styles.lock} aria-hidden />}
            </span>
            <span className={styles.label}>{label}</span>
          </>
        );
        if (locked) {
          return (
            <button key={href} type="button" className={styles.tab} onClick={() => signInWithGoogle("/my")}>
              {content}
            </button>
          );
        }
        return (
          <Link key={href} href={href} className={`${styles.tab} ${active ? styles.active : ""}`} aria-current={active ? "page" : undefined}>
            {content}
          </Link>
        );
      })}
    </nav>
  );
}
