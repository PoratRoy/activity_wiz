import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar/TopBar";
import { requireAdmin } from "@/lib/auth/admin";
import { listCategories } from "@/lib/db/queries";
import styles from "../../admin.module.css";
import { NewPublicActivityForm } from "./NewPublicActivityForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "פעולה חדשה", robots: { index: false } };

export default async function NewPublicActivityPage({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  await requireAdmin();
  const categories = await listCategories();
  if (categories.length === 0) redirect("/admin");
  const { category } = await searchParams;
  const initialCategory = categories.some((c) => c.id === category) ? category! : "";
  return (
    <>
      <TopBar title="פעולה חדשה" fallback={initialCategory ? `/admin/category/${initialCategory}` : "/admin"} />
      <main className={styles.main}>
        <NewPublicActivityForm categories={categories.map((c) => ({ value: c.id, label: c.title }))} initialCategory={initialCategory} />
      </main>
    </>
  );
}
