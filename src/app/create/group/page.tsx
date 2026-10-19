import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar/TopBar";
import { getAccountGroup } from "@/lib/auth/session";
import { GroupForm } from "./GroupForm";
import styles from "./group.module.css";

export const metadata: Metadata = { title: "הקבוצה שלי", robots: { index: false } };

export default async function GroupPage() {
  const accountGroup = await getAccountGroup();
  return (
    <div className={styles.page}>
      <TopBar title="הקבוצה שלי" />
      <GroupForm accountGroup={accountGroup} />
    </div>
  );
}
