import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryCard/CategoryCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ForestPage } from "@/components/ForestPage/ForestPage";
import { listCategories } from "@/lib/db/queries";
import { categoryPath } from "@/lib/slug";
import styles from "./library.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "מאגר פעולות לתנועות נוער",
  description: "מאגר פעולות ומשחקים מוכנים למדריכים בתנועות הנוער, מחולק לפי נושאים. קוראים, מעתיקים ושומרים לפעולות שלכם.",
  alternates: { canonical: "/library" },
};

export default async function LibraryPage() {
  const categories = await listCategories();
  return (
    <ForestPage title="מאגר פעולות">
      {categories.length === 0 ? (
        <EmptyState text="המאגר מתמלא בקרוב" />
      ) : (
        <ul className={`${styles.list} ${styles.rows}`}>
          {categories.map((c) => (
            <li key={c.id}>
              <CategoryCard title={c.title} categoryKey={c.key} href={categoryPath(c)} />
            </li>
          ))}
        </ul>
      )}
    </ForestPage>
  );
}
