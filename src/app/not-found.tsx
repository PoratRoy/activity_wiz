import type { Metadata } from "next";
import Image from "next/image";
import { ButtonLink } from "@/components/Button/Button";
import styles from "./not-found.module.css";

export const metadata: Metadata = { title: "הדף לא נמצא", robots: { index: false } };

// Same full-screen sage layout as the generating error views, without tabs or ad bar.
export default function NotFound() {
  return (
    <main className={styles.screen}>
      <Image className={styles.illustration} src="/illustrations/not-found-signpost.webp" width={600} height={398} alt="" unoptimized />
      <h1 className={styles.title}>הדף הזה לא נמצא</h1>
      <p className={styles.text}>אולי הקישור ישן, או שהפעולה כבר לא קיימת.</p>
      <div className={styles.actions}>
        <ButtonLink href="/">למסך הבית</ButtonLink>
        <ButtonLink href="/library" variant="secondary">
          לפעולות מוכנות
        </ButtonLink>
      </div>
    </main>
  );
}
