"use client";

import { Cookie, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useSyncExternalStore } from "react";
import { Sheet } from "react-modal-sheet";
import { Button } from "@/components/Button/Button";
import styles from "./TermsConsent.module.css";

const noSubscribe = () => () => {};

/**
 * «רגע לפני שיוצרים»: the explicit acceptance of the terms, asked once, at a guest's first generation (R0).
 * The main button both accepts and continues.
 */
export function TermsConsent({
  open,
  pending,
  onAccept,
  onClose,
}: {
  open: boolean;
  pending: boolean;
  onAccept: () => void;
  onClose: () => void;
}) {
  const titleId = useId();
  // The sheet's motion styles don't match between server and client, so it opens only once hydrated.
  const hydrated = useSyncExternalStore(noSubscribe, () => true, () => false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <Sheet className={styles.root} isOpen={open && hydrated} onClose={onClose} detent="content" unstyled>
      <Sheet.Container className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <Sheet.Header className={styles.header}>
          <div className={styles.handle} />
        </Sheet.Header>
        <Sheet.Content className={styles.content} scrollClassName={styles.body}>
          <h2 id={titleId} className={styles.title}>
            רגע לפני שיוצרים
          </h2>
          <ul className={styles.points}>
            <li>
              <span className={`${styles.badge} ${styles.yellow}`} aria-hidden>
                <Sparkles size={18} />
              </span>
              הפעולה נכתבת בבינה מלאכותית ויכולות להיות בה טעויות
            </li>
            <li>
              <span className={`${styles.badge} ${styles.green}`} aria-hidden>
                <ShieldCheck size={18} />
              </span>
              אתם אחראים לבדוק אותה ולהתאים לקבוצה ולכללי הבטיחות
            </li>
            <li>
              <span className={`${styles.badge} ${styles.gray}`} aria-hidden>
                <Cookie size={18} />
              </span>
              האתר משתמש ב-Cookies ובפרסומות של Google
            </li>
          </ul>
          <Link href="/terms" className={styles.link}>
            לקריאת תנאי השירות ומדיניות הפרטיות המלאים
          </Link>
          <Button disabled={pending} icon={<Sparkles size={20} aria-hidden />} onClick={onAccept}>
            {pending ? "רגע…" : "מסכימים, יוצרים את הפעולה"}
          </Button>
          <button type="button" className={styles.later} onClick={onClose}>
            לא עכשיו
          </button>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop className={styles.backdrop} onTap={onClose} />
    </Sheet>
  );
}
