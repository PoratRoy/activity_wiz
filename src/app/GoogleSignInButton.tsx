"use client";

import Image from "next/image";
import { Google_Sans } from "next/font/google";
import { useTransition } from "react";
import { signInWithGoogle } from "@/lib/auth/actions";
import styles from "./GoogleSignInButton.module.css";

const googleSans = Google_Sans({ weight: "500", subsets: ["hebrew", "latin"], display: "swap", adjustFontFallback: false });

export function GoogleSignInButton() {
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      className={`${styles.button} ${googleSans.className}`}
      disabled={pending}
      aria-busy={pending}
      onClick={() => startTransition(() => signInWithGoogle("/"))}
    >
      <Image src="/brand/google-g.png" width={20} height={20} alt="" unoptimized />
      <span>{pending ? "מעבירים ל-Google…" : "התחברות עם Google"}</span>
    </button>
  );
}
