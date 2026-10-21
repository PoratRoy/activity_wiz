"use client";

import { Bookmark, House } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useViewer } from "@/components/AppShell/viewer";
import { MagicWand, Notepad } from "@/components/icons/icons";
import { SignInGate } from "@/components/SignInGate/SignInGate";
import styles from "./BottomNav.module.css";

const tabs = [
  { href: "/", label: "בית", Icon: House, match: (p: string) => p === "/" },
  { href: "/create/group", label: "יצירה", Icon: MagicWand, match: (p: string) => p.startsWith("/create") || p === "/activity/draft" },
  { href: "/library", label: "מאגר", Icon: Notepad, match: (p: string) => p.startsWith("/library") },
  { href: "/my", label: "הפעולות שלי", Icon: Bookmark, match: (p: string) => p.startsWith("/my") || (p.startsWith("/activity/") && p !== "/activity/draft") },
];

/** Fixed bottom tabs. For guests, tapping "הפעולות שלי" opens the sign-in popup. */
export function BottomNav() {
  const pathname = usePathname();
  const { signedIn } = useViewer();
  const [prompt, setPrompt] = useState(false);

  return (
    <>
    <nav className={styles.nav} aria-label="ניווט ראשי">
      {tabs.map(({ href, label, Icon, match }) => {
        const active = match(pathname);
        const locked = href === "/my" && !signedIn;
        const content = (
          <>
            <span className={styles.pill}>
              <Icon size={22} strokeWidth={1.75} aria-hidden />
            </span>
            <span className={styles.label}>{label}</span>
          </>
        );
        if (locked) {
          return (
            <button key={href} type="button" className={styles.tab} onClick={() => setPrompt(true)}>
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
    <SignInGate
      open={prompt}
      onClose={() => setPrompt(false)}
      redirectTo="/my"
      text="התחברו כדי לשמור את הפעולות שלכם"
    />
    </>
  );
}
