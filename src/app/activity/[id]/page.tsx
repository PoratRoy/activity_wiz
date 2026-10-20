import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { typeLabel } from "@/data/options";
import { getAccountGroup, getUserId } from "@/lib/auth/session";
import { getActivity } from "@/lib/db/queries";
import { PersonalActivity } from "./PersonalActivity";

export const metadata: Metadata = { title: "הפעולה שלי", robots: { index: false } };

export default async function PersonalActivityPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const userId = await getUserId();
  if (!userId) redirect("/");
  const [activity, group] = await Promise.all([getActivity(id, userId), getAccountGroup()]);
  if (!activity) redirect("/my");

  return (
    <PersonalActivity
      id={activity.id}
      title={activity.title}
      bodyMd={activity.bodyMd}
      // Values only, in this order: the route gives each chip an icon so all three fit one row.
      chips={[typeLabel(group?.movement, activity.type), activity.place, activity.duration]}
    />
  );
}
