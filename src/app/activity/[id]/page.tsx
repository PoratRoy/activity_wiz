import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { TopBar } from "@/components/TopBar/TopBar";
import { activityChips, typeLabel } from "@/data/options";
import { getAccountGroup, getUserId } from "@/lib/auth/session";
import { getActivity } from "@/lib/db/queries";
import { PersonalActivity } from "./PersonalActivity";
import styles from "./activity.module.css";

export const metadata: Metadata = { title: "הפעולה שלי", robots: { index: false } };

export default async function PersonalActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getUserId();
  if (!userId) redirect("/");
  const [activity, group] = await Promise.all([getActivity(id, userId), getAccountGroup()]);
  if (!activity) redirect("/my");

  return (
    <div className={styles.page}>
      <TopBar title="הפעולה" back="/my" />
      <PersonalActivity
        id={activity.id}
        title={activity.title}
        bodyMd={activity.bodyMd}
        chips={activityChips(typeLabel(group?.movement, activity.type), activity.place, activity.duration)}
      />
    </div>
  );
}
