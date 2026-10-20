import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { ButtonLink } from "@/components/Button/Button";
import { formatDate } from "@/components/ActivityCard/ActivityCard";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { TopBar } from "@/components/TopBar/TopBar";
import { requireAdmin } from "@/lib/auth/admin";
import { getCategory, listPublicActivities } from "@/lib/db/queries";
import { removePublicActivity } from "../../actions";
import styles from "../../admin.module.css";
import { AdminRows } from "../../AdminRows";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "ניהול קטגוריה", robots: { index: false } };

export default async function AdminCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const category = await getCategory(id);
  if (!category) redirect("/admin");
  const activities = await listPublicActivities(category.id);
  return (
    <>
      <TopBar title={category.title} fallback="/admin" />
      <main className={styles.main}>
        <ButtonLink href={`/admin/activity/new?category=${category.id}`} icon={<Plus size={18} aria-hidden />}>
          פעולה
        </ButtonLink>
        {activities.length === 0 ? (
          <EmptyState text="אין עדיין פעולות בקטגוריה" />
        ) : (
          <AdminRows
            rows={activities.map((a) => ({
              id: a.id,
              title: a.title,
              subtitle: formatDate(a.createdAt),
              confirmMessage: `«${a.title}» תימחק מהמאגר. פעולות שמורות של משתמשים לא יימחקו.`,
            }))}
            confirmTitle="למחוק את הפעולה?"
            onDelete={removePublicActivity}
            deletedToast="הפעולה נמחקה"
          />
        )}
      </main>
    </>
  );
}
