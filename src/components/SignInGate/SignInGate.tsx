"use client";

import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";
import { canGoBackInApp } from "@/components/AppShell/history";
import { Button } from "@/components/Button/Button";
import { Mascot } from "@/components/illustrations/Mascot";
import { Modal } from "@/components/Modal/Modal";
import { signInWithGoogle } from "@/lib/auth/actions";
import styles from "./SignInGate.module.css";

type Props = {
  open: boolean;
  text: string;
  /** Blocking (trial expired): no backdrop close; the only way out is "חזרה". */
  blocking?: boolean;
  onClose?: () => void;
  /** Where to return after Google sign-in. Defaults to the current page. */
  redirectTo?: string;
};

export function SignInGate({ open, text, blocking, onClose, redirectTo }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const goBack = () => {
    if (onClose) return onClose();
    if (canGoBackInApp()) router.back();
    else router.push("/");
  };

  return (
    <Modal open={open} blocking={blocking} onClose={onClose} title="">
      <div className={styles.body}>
        <Mascot size={88} />
        <p className={styles.text}>{text}</p>
        <Button disabled={pending} onClick={() => startTransition(() => signInWithGoogle(redirectTo ?? pathname))}>
          {pending ? "מעבירים ל-Google…" : "התחברות עם Google"}
        </Button>
        <button type="button" className={styles.back} onClick={goBack}>
          {blocking ? "חזרה" : "לא עכשיו"}
        </button>
      </div>
    </Modal>
  );
}
