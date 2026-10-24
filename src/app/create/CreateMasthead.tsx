import { MastheadTrail } from "@/components/MastheadTrail/MastheadTrail";
import { TopBar } from "@/components/TopBar/TopBar";
import styles from "./create.module.css";

/** The fixed forest bar of the create pages, with the starry trail behind the title. */
export function CreateMasthead({ title, fallback }: { title: string; fallback?: string }) {
  return (
    <div className={styles.masthead}>
      <TopBar title={title} fallback={fallback} tone="forest" backdrop={<MastheadTrail />} />
    </div>
  );
}
