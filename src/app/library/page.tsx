import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryCard/CategoryCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { TopBar } from "@/components/TopBar/TopBar";
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
    <div className={styles.page}>
      <div className={styles.masthead}>
        <TopBar title="מאגר פעולות" back={false} />
      </div>
      <main className={styles.rows}>
        {categories.length === 0 ? (
          <EmptyState text="המאגר מתמלא בקרוב" />
        ) : (
          <ul className={styles.list}>
            {categories.map((c) => (
              <li key={c.id}>
                <CategoryCard id={c.id} title={c.title} href={categoryPath(c)} />
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
