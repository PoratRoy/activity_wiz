import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { AvatarMenu } from "@/components/AvatarMenu/AvatarMenu";
import { BackButton } from "./BackButton";
import styles from "./TopBar.module.css";

/**
 * Sticky top bar: back arrow on the right (RTL start), title in the center, avatar on the left.
 * `back` links to a fixed parent; without it the arrow goes back in history; `false` hides it (a tab root).
 */
export function TopBar({ title, back }: { title?: ReactNode; back?: string | false }) {
  return (
    <header className={styles.bar}>
      <div className={styles.side}>
        {back === false ? null : back ? (
          <Link href={back} className={styles.back} aria-label="חזרה">
            <ChevronRight size={28} aria-hidden />
          </Link>
        ) : (
          <BackButton />
        )}
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={`${styles.side} ${styles.end}`}>
        <AvatarMenu />
      </div>
    </header>
  );
}
