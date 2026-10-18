import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar/TopBar";
import { getAccountGroup } from "@/lib/auth/session";
import { GroupForm } from "./GroupForm";

export const metadata: Metadata = { title: "הקבוצה שלי", robots: { index: false } };

export default async function GroupPage() {
  const accountGroup = await getAccountGroup();
  return (
    <>
      <TopBar title="הקבוצה שלי" />
      <GroupForm accountGroup={accountGroup} />
    </>
  );
}
