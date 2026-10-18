import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar/TopBar";
import { getAccountGroup } from "@/lib/auth/session";
import { ActivityForm } from "./ActivityForm";

export const metadata: Metadata = { title: "הפעולה", robots: { index: false } };

export default async function ActivityPage() {
  const accountGroup = await getAccountGroup();
  return (
    <>
      <TopBar title="הפעולה" back="/create/group" />
      <ActivityForm accountGroup={accountGroup} />
    </>
  );
}
