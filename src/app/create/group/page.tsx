import type { Metadata } from "next";
import { getAccountGroup } from "@/lib/auth/session";
import { CreateMasthead } from "../CreateMasthead";
import styles from "../create.module.css";
import { GroupForm } from "./GroupForm";

export const metadata: Metadata = { title: "הקבוצה שלי", robots: { index: false } };

export default async function GroupPage() {
  const accountGroup = await getAccountGroup();
  return (
    <div className={styles.page}>
      <CreateMasthead title="הקבוצה שלי" />
      <div className={styles.sheet}>
        <GroupForm accountGroup={accountGroup} />
      </div>
    </div>
  );
}
