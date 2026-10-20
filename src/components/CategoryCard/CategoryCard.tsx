import Image from "next/image";
import Link from "next/link";
import styles from "./CategoryCard.module.css";

// Shared landing artwork until approved category art exists. Map it here by category id
// (only games, new year and holidays may get their own); never by hash or position.
const FALLBACK_ART = "/illustrations/home-trail.webp";
const ART: Record<string, string> = {};

/** Thumbnail for a category; new categories get the shared default. */
export function categoryArt(id: string) {
  return ART[id] ?? FALLBACK_ART;
}

/** Full-width raised row: category name on the right, a small illustration thumbnail on the left. */
export function CategoryCard({ id, title, href }: { id: string; title: string; href: string }) {
  return (
    <Link href={href} className={styles.card}>
      <span className={styles.title}>{title}</span>
      <Image src={categoryArt(id)} alt="" width={72} height={52} unoptimized className={styles.thumb} />
    </Link>
  );
}
