import Image from "next/image";
import Link from "next/link";
import { categoryThumb, imageForKey } from "@/data/libraryImages";
import styles from "./CategoryCard.module.css";

/** Full-width raised row: category name on the right, its illustration spread across the rest of the row. */
export function CategoryCard({ title, categoryKey, href }: { title: string; categoryKey: string | null; href: string }) {
  return (
    <Link href={href} className={styles.card}>
      <span className={styles.title}>{title}</span>
      <Image src={categoryThumb(categoryKey)} alt="" width={960} height={350} unoptimized className={imageForKey(categoryKey) ? styles.thumb : styles.fallback} />
    </Link>
  );
}
