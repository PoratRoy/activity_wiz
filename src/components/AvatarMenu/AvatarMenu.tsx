"use client";

import { CircleHelp, FileText, LogIn, LogOut, Mail, Share2, Shield, UserRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useViewer } from "@/components/AppShell/viewer";
import { signInWithGoogle, signOutAction } from "@/lib/auth/actions";
import { shareSite } from "@/lib/shareSite";
import styles from "./AvatarMenu.module.css";

export function AvatarMenu() {
  const viewer = useViewer();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  return (
    <div className={styles.wrap} ref={ref}>
      <button
        type="button"
        className={styles.avatar}
        aria-label="תפריט משתמש"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {viewer.signedIn && viewer.image ? (
          // Google avatar URL; next/image would need remote config and Cloudflare Images.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={viewer.image} alt="" width={36} height={36} referrerPolicy="no-referrer" />
        ) : (
          <UserRound size={22} aria-hidden />
        )}
      </button>

      {open && (
        <div className={styles.menu} role="menu">
          <button
            type="button"
            role="menuitem"
            className={styles.item}
            onClick={() => {
              setOpen(false);
              void shareSite();
            }}
          >
            <Share2 size={18} aria-hidden />
            שתפו עם חברים
          </button>
          <Link href="/contact" role="menuitem" className={styles.item} onClick={() => setOpen(false)}>
            <Mail size={18} aria-hidden />
            צרו קשר
          </Link>
          <Link href="/faq" role="menuitem" className={styles.item} onClick={() => setOpen(false)}>
            <CircleHelp size={18} aria-hidden />
            שאלות נפוצות
          </Link>
          <Link href="/terms" role="menuitem" className={styles.item} onClick={() => setOpen(false)}>
            <FileText size={18} aria-hidden />
            תנאי שירות
          </Link>
          <hr className={styles.divider} />
          {viewer.signedIn ? (
            <>
              {viewer.isAdmin && (
                <Link href="/admin" role="menuitem" className={styles.item} onClick={() => setOpen(false)}>
                  <Shield size={18} aria-hidden />
                  ניהול
                </Link>
              )}
              <button type="button" role="menuitem" className={styles.item} onClick={() => signOutAction()}>
                <LogOut size={18} aria-hidden />
                התנתקות
              </button>
            </>
          ) : (
            <button type="button" role="menuitem" className={styles.item} onClick={() => signInWithGoogle(pathname)}>
              <LogIn size={18} aria-hidden />
              התחברות עם Google
            </button>
          )}
        </div>
      )}
    </div>
  );
}
