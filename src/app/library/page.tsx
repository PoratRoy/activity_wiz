import type { Metadata } from "next";
import { Fragment } from "react";
import { AdSlot } from "@/components/AdSlot/AdSlot";
import { CategoryCard } from "@/components/CategoryCard/CategoryCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { TopBar } from "@/components/TopBar/TopBar";
import { listCategoriesWithCounts } from "@/lib/db/queries";
import { categoryPath } from "@/lib/slug";
import styles from "./library.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "מאגר פעולות לתנועות נוער",
  description: "מאגר פעולות ומשחקים מוכנים למדריכים בתנועות הנוער, מחולק לפי נושאים. קוראים, מעתיקים ושומרים לפעולות שלכם.",
  alternates: { canonical: "/library" },
};

export default async function LibraryPage() {
  const categories = await listCategoriesWithCounts();
  return (
    <>
      <TopBar title="מאגר פעולות" />
      <main className={styles.main}>
        <h1 className={styles.heading}>מאגר פעולות מוכנות</h1>
        {categories.length === 0 ? (
          <EmptyState text="המאגר מתמלא בקרוב" />
        ) : (
          <div className={styles.grid}>
            {categories.map((c, i) => (
              <Fragment key={c.id}>
                <CategoryCard id={c.id} index={i} title={c.title} href={categoryPath(c)} count={c.count} />
                {i === 3 && (
                  <div className={styles.full}>
                    <AdSlot />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
