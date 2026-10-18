import { Mascot } from "@/components/illustrations/Mascot";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./page.module.css";

// Temporary landing placeholder; the real landing page is step 14 of docs/implementation-plan.md.
export default function HomePage() {
  return (
    <>
      <TopBar />
      <main className={styles.main}>
        <Mascot size={120} />
        <h1>ActivityWiz</h1>
        <p className={styles.pitch}>פעולה מוכנה לשבט בדקה</p>
      </main>
    </>
  );
}
