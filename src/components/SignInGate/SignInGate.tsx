"use client";

import { X } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useId, useSyncExternalStore, useTransition } from "react";
import { Sheet } from "react-modal-sheet";
import { Button } from "@/components/Button/Button";
import { WizardHat } from "@/components/illustrations/WizardHat";
import { signInWithGoogle } from "@/lib/auth/actions";
import styles from "./SignInGate.module.css";

/** "trial": the guest's trial is over; blocking, the only way out is home. "save": a soft prompt that can be dismissed. */
export type SignInReason = "trial" | "save";

const COPY: Record<SignInReason, { badge?: string; title: string; text: string; back: string }> = {
  trial: {
    badge: "3 ימי הניסיון הסתיימו",
    title: "רוצים להמשיך ליצור?",
    text: "התחברו עם חשבון Google והמשיכו בדיוק מאיפה שעצרתם",
    back: "חזרה לדף הבית",
  },
  save: {
    title: "אל תאבדו את הפעולות שלכם",
    text: "התחברו כדי לשמור כל פעולה שיצרתם ולמצוא אותה בכל מכשיר",
    back: "אולי אחר כך",
  },
};

type Props = {
  open: boolean;
  reason: SignInReason;
  /** Closes a "save" prompt (X, backdrop, drag down, Escape, "אולי אחר כך"). */
  onClose?: () => void;
  /** Where to return after Google sign-in. Defaults to the current page. */
  redirectTo?: string;
};

const noSubscribe = () => () => {};

/** Bottom sheet asking a guest to sign in with Google. */
export function SignInGate({ open, reason, onClose, redirectTo }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const titleId = useId();
  const blocking = reason === "trial";
  const copy = COPY[reason];
  const close = () => onClose?.();
  // The sheet's motion styles don't match between server and client, so it opens only once hydrated.
  const hydrated = useSyncExternalStore(noSubscribe, () => true, () => false);

  useEffect(() => {
    if (!open || blocking) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, blocking, onClose]);

  return (
    <Sheet
      className={styles.root}
      isOpen={open && hydrated}
      onClose={close}
      detent="content"
      disableDrag={blocking}
      disableDismiss={blocking}
      unstyled
    >
      <Sheet.Container className={styles.sheet} role="dialog" aria-modal="true" aria-labelledby={titleId}>
        <Sheet.Header className={`${styles.hero} ${blocking ? "" : styles.draggable}`}>
          {!blocking && <div className={styles.handle} />}
          {!blocking && (
            <button type="button" className={styles.close} onClick={close} aria-label="סגירה">
              <X size={20} strokeWidth={2.4} aria-hidden />
            </button>
          )}
          <svg className={styles.hills} viewBox="0 0 390 80" preserveAspectRatio="none" aria-hidden>
            <path d="M0 50 Q90 14 190 44 T390 34 V80 H0 Z" fill="var(--green-hill)" />
            <path d="M0 72 Q120 46 230 68 T390 62 V80 H0 Z" fill="var(--surface)" />
          </svg>
          <span className={styles.hat}>
            <WizardHat width={156} />
          </span>
        </Sheet.Header>
        <Sheet.Content scrollClassName={styles.body}>
          {copy.badge && <span className={styles.badge}>{copy.badge}</span>}
          <h2 id={titleId} className={styles.title}>
            {copy.title}
          </h2>
          <p className={styles.text}>{copy.text}</p>
          <Button
            variant="secondary"
            className={styles.google}
            disabled={pending}
            icon={<Image src="/brand/google-g.png" width={22} height={22} alt="" />}
            onClick={() => startTransition(() => signInWithGoogle(redirectTo ?? pathname))}
          >
            {pending ? "מעבירים ל-Google…" : "המשך עם Google"}
          </Button>
          <button type="button" className={styles.back} onClick={blocking ? () => router.push("/") : close}>
            {copy.back}
          </button>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop className={styles.backdrop} onTap={blocking ? undefined : close} />
    </Sheet>
  );
}
