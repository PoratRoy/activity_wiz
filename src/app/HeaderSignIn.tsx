"use client";

import { useTransition } from "react";
import { useViewer } from "@/components/AppShell/viewer";
import { signInWithGoogle } from "@/lib/auth/actions";
import styles from "./page.module.css";

/** Guests only: a quiet "התחברות" link beside the avatar, since few open the avatar menu to sign in. */
export function HeaderSignIn() {
  const { signedIn } = useViewer();
  const [pending, startTransition] = useTransition();
  if (signedIn) return null;
  return (
    <button
      type="button"
      className={styles.signIn}
      disabled={pending}
      aria-busy={pending}
      onClick={() => startTransition(() => signInWithGoogle("/"))}
    >
      {pending ? "מעבירים…" : "התחברות"}
    </button>
  );
}
