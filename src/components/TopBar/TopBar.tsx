import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { AvatarMenu } from "@/components/AvatarMenu/AvatarMenu";
import styles from "./TopBar.module.css";

/** Sticky top bar: back arrow on the right (RTL start), title in the center, avatar on the left. */
export function TopBar({ title, back }: { title?: string; back?: string }) {
  return (
    <header className={styles.bar}>
      <div className={styles.side}>
        {back && (
          <Link href={back} className={styles.back} aria-label="חזרה">
            <ChevronRight size={28} aria-hidden />
          </Link>
        )}
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={`${styles.side} ${styles.end}`}>
        <AvatarMenu />
      </div>
    </header>
  );
}
