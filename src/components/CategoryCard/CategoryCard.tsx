import Image from "next/image";
import Link from "next/link";
import { categoryThumb } from "@/data/libraryImages";
import styles from "./CategoryCard.module.css";

/** Full-width raised row: category name on the right, its illustration thumbnail on the left. */
export function CategoryCard({ title, image, href }: { title: string; image: string | null; href: string }) {
  return (
    <Link href={href} className={styles.card}>
      <span className={styles.title}>{title}</span>
      <Image src={categoryThumb(image)} alt="" width={72} height={52} unoptimized className={styles.thumb} />
    </Link>
  );
}
