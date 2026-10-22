"use client";

import { CircleHelp, FileText, LogIn, LogOut, Mail, Share2, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { useViewer } from "@/components/AppShell/viewer";
import { signInWithGoogle, signOutAction } from "@/lib/auth/actions";
import { shareSite } from "@/lib/shareSite";
import styles from "./AvatarMenu.module.css";

/** Outline ring with a solid user silhouette inside; the shoulders are cut by the ring's inner edge. */
function DefaultAvatar() {
  const clip = useId();
  return (
    <svg viewBox="0 0 36 36" width={36} height={36} aria-hidden>
      <defs>
        <clipPath id={clip}>
          <circle cx="18" cy="18" r="15" />
        </clipPath>
      </defs>
      <circle cx="18" cy="18" r="16" fill="none" stroke="currentColor" strokeWidth="2" />
      <g fill="currentColor" clipPath={`url(#${clip})`}>
        <circle cx="18" cy="14" r="5.5" />
        <ellipse cx="18" cy="32" rx="10.5" ry="9" />
      </g>
    </svg>
  );
}

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
          <DefaultAvatar />
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
