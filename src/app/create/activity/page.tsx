import type { Metadata } from "next";
import Image from "next/image";
import { TopBar } from "@/components/TopBar/TopBar";
import { getAccountGroup } from "@/lib/auth/session";
import { ActivityForm } from "./ActivityForm";
import styles from "./activity.module.css";

export const metadata: Metadata = { title: "הפעולה", robots: { index: false } };

export default async function ActivityPage() {
  const accountGroup = await getAccountGroup();
  return (
    <div className={styles.page}>
      <div className={styles.masthead}>
        <TopBar title="הפעולה" back="/create/group" />
        <Image className={styles.compass} src="/illustrations/group-compass.webp" width={300} height={200} alt="" unoptimized />
      </div>
      <ActivityForm accountGroup={accountGroup} />
    </div>
  );
}
