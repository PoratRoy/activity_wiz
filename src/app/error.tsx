"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ButtonLink } from "@/components/Button/Button";
import styles from "./not-found.module.css";

const REDIRECT_MS = 5000;

/** Any unexpected error inside a page: the 404 layout with a short note, then back to the landing page. */
export default function Error({ error }: { error: unknown }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    const t = setTimeout(() => router.replace("/"), REDIRECT_MS);
    return () => clearTimeout(t);
  }, [error, router]);

  return (
    <main className={styles.screen}>
      <Image className={styles.illustration} src="/illustrations/error-lantern.webp" width={600} height={393} alt="" unoptimized />
      <h1 className={styles.title}>משהו השתבש</h1>
      <p className={styles.text}>מחזירים אתכם למסך הבית בעוד רגע…</p>
      <div className={styles.actions}>
        <ButtonLink href="/">למסך הבית</ButtonLink>
      </div>
    </main>
  );
}
