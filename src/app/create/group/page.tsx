import type { Metadata } from "next";
import Image from "next/image";
import { TopBar } from "@/components/TopBar/TopBar";
import { getAccountGroup } from "@/lib/auth/session";
import { GroupForm } from "./GroupForm";
import styles from "./group.module.css";

export const metadata: Metadata = { title: "הקבוצה שלי", robots: { index: false } };

export default async function GroupPage() {
  const accountGroup = await getAccountGroup();
  return (
    <div className={styles.page}>
      <div className={styles.masthead}>
        <TopBar title="הקבוצה שלי" tone="forest" />
        <Image className={styles.compass} src="/illustrations/group-compass.webp" width={300} height={200} alt="" unoptimized />
      </div>
      <GroupForm accountGroup={accountGroup} />
    </div>
  );
}
