import type { Metadata } from "next";
import { CategoryCard } from "@/components/CategoryCard/CategoryCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ForestPage } from "@/components/ForestPage/ForestPage";
import { LIBRARY_DESCRIPTION, OPEN_GRAPH } from "@/data/seo";
import { TOP_ROW } from "@/data/topActivities";
import { listCategories } from "@/lib/db/queries";
import { categoryPath } from "@/lib/slug";
import styles from "./library.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "פעולות מוכנות לתנועות נוער – מאגר פעולות למדריכים",
  description: LIBRARY_DESCRIPTION,
  alternates: { canonical: "/library" },
  openGraph: { ...OPEN_GRAPH, url: "/library" },
};

export default async function LibraryPage() {
  const categories = await listCategories();
  return (
    <ForestPage title="מאגר פעולות" trail>
      {categories.length === 0 ? (
        <EmptyState text="המאגר מתמלא בקרוב" />
      ) : (
        <ul className={`${styles.list} ${styles.rows}`}>
          <li>
            <CategoryCard title={TOP_ROW.title} categoryKey={TOP_ROW.imageKey} href={TOP_ROW.href} />
          </li>
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
