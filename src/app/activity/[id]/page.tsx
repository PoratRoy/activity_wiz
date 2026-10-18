import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { PlainActivity } from "@/components/PlainActivity/PlainActivity";
import { TopBar } from "@/components/TopBar/TopBar";
import { typeLabel } from "@/data/options";
import { getUserId } from "@/lib/auth/session";
import { getActivity } from "@/lib/db/queries";

export const metadata: Metadata = { title: "הפעולה שלי", robots: { index: false } };

export default async function PersonalActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getUserId();
  if (!userId) redirect("/");
  const activity = await getActivity(id, userId);
  if (!activity) redirect("/my");
  return (
    <>
      <TopBar title="הפעולה" back="/my" />
      <PlainActivity
        title={activity.title}
        bodyMd={activity.bodyMd}
        chips={[typeLabel(null, activity.type), activity.place, activity.duration]}
      />
    </>
  );
}
