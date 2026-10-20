import type { Metadata } from "next";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ForestPage } from "@/components/ForestPage/ForestPage";
import { requireAdmin } from "@/lib/auth/admin";
import { listCategoriesWithCounts } from "@/lib/db/queries";
import styles from "./admin.module.css";
import { AdminHome } from "./AdminHome";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ניהול", robots: { index: false } };

export default async function AdminPage() {
  await requireAdmin();
  const categories = await listCategoriesWithCounts();
  return (
    <ForestPage title="ניהול">
      <div className={styles.stack}>
        <AdminHome categories={categories.map((c) => ({ id: c.id, title: c.title, key: c.key, count: c.count }))} />
        {categories.length === 0 && <EmptyState text="אין עדיין קטגוריות. התחילו בהוספת קטגוריה." />}
      </div>
    </ForestPage>
  );
}
