import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ActionBar } from "@/components/ActionBar/ActionBar";
import { ActivityView } from "@/components/ActivityView/ActivityView";
import { TopBar } from "@/components/TopBar/TopBar";
import { typeLabel } from "@/data/options";
import { getAccountGroup, getUserId } from "@/lib/auth/session";
import { getActivity } from "@/lib/db/queries";

export const metadata: Metadata = { title: "הפעולה שלי", robots: { index: false } };

export default async function PersonalActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getUserId();
  if (!userId) redirect("/");
  const [activity, group] = await Promise.all([getActivity(id, userId), getAccountGroup()]);
  if (!activity) redirect("/my");

  return (
    <>
      <TopBar title="הפעולה" back="/my" />
      <ActivityView
        title={activity.title}
        bodyMd={activity.bodyMd}
        chips={[typeLabel(group?.movement, activity.type), activity.place, activity.duration]}
      />
      <ActionBar title={activity.title} bodyMd={activity.bodyMd} />
    </>
  );
}
