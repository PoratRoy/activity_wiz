import styles from "./AdSlot.module.css";

/** Ad placeholder. Renders nothing unless NEXT_PUBLIC_ADS_ENABLED=true. */
export function AdSlot() {
  if (process.env.NEXT_PUBLIC_ADS_ENABLED !== "true") return null;
  return (
    <div className={styles.slot} aria-hidden>
      פרסומת
    </div>
  );
}
