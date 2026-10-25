"use client";

import { CircleHelp, FileText, LogIn, LogOut, Mail, Share2, Shield } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
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
  // Stays true while the menu plays its closing animation after `open` turns false.
  const [shown, setShown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    // Keyboard users land on the first item; arrows move between items from there.
    menu.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus();
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const toggle = () => {
    if (!open) setShown(true);
    setOpen(!open);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (!open) return;
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      button.current?.focus();
      return;
    }
    // Tabbing away leaves the menu, so it closes rather than hanging open behind the focus.
    if (e.key === "Tab") return setOpen(false);
    const items = [...(menu.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? [])];
    const at = items.indexOf(document.activeElement as HTMLElement);
    const next = { ArrowDown: at + 1, ArrowUp: at - 1, Home: 0, End: items.length - 1 }[e.key];
    if (next === undefined || items.length === 0) return;
    e.preventDefault();
    items[(next + items.length) % items.length].focus();
  };

  return (
    <div className={styles.wrap} ref={ref} onKeyDown={onKeyDown}>
      <button
        ref={button}
        type="button"
        className={styles.avatar}
        aria-label="תפריט משתמש"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
      >
        {viewer.signedIn && viewer.image ? (
          // Google avatar URL; next/image would need remote config and Cloudflare Images.
          // eslint-disable-next-line @next/next/no-img-element
          <img src={viewer.image} alt="" width={36} height={36} referrerPolicy="no-referrer" />
        ) : (
          <DefaultAvatar />
        )}
      </button>

      {shown && (
        <div
          ref={menu}
          className={styles.menu}
          role="menu"
          data-closing={!open || undefined}
          inert={!open}
          onAnimationEnd={(e) => e.target === e.currentTarget && !open && setShown(false)}
        >
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
