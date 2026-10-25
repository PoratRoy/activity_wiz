import type { Metadata } from "next";
import { getAccountGroup } from "@/lib/auth/session";
import { Reveal } from "@/components/Transitions/Transitions";
import { CreateMasthead } from "../CreateMasthead";
import styles from "../create.module.css";
import { ActivityForm } from "./ActivityForm";

export const metadata: Metadata = { title: "תכנון הפעולה", robots: { index: false } };

export default async function ActivityPage() {
  const accountGroup = await getAccountGroup();
  return (
    <div className={styles.page}>
      <CreateMasthead title="תכנון הפעולה" fallback="/create/group" />
      <div className={styles.sheet}>
        <Reveal>
          <ActivityForm accountGroup={accountGroup} />
        </Reveal>
      </div>
    </div>
  );
}
