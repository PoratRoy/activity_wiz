import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar/TopBar";
import { requireAdmin } from "@/lib/auth/admin";
import { getPublicActivity, listCategories } from "@/lib/db/queries";
import styles from "../../admin.module.css";
import { PublicActivityForm } from "../PublicActivityForm";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "עריכת פעולה", robots: { index: false } };

export default async function EditPublicActivityPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [activity, categories] = await Promise.all([getPublicActivity(id), listCategories()]);
  if (!activity) redirect("/admin");
  return (
    <>
      <TopBar title="עריכת פעולה" fallback={`/admin/category/${activity.categoryId}`} />
      <main className={styles.main}>
        <PublicActivityForm
          categories={categories.map((c) => ({ value: c.id, label: c.title }))}
          activityId={activity.id}
          initial={{
            categoryId: activity.categoryId,
            title: activity.title,
            bodyMd: activity.bodyMd,
            type: activity.type,
            place: activity.place,
            duration: activity.duration,
            equipment: activity.equipment ?? "",
            teams: activity.teams ?? "",
            shabbat: activity.shabbat ?? "",
            notes: activity.notes ?? "",
            age: activity.age,
          }}
        />
      </main>
    </>
  );
}
