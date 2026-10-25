import { Loading } from "@/components/Skeleton/Skeleton";
import skeleton from "@/components/Skeleton/Skeleton.module.css";
import { CreateMasthead } from "./CreateMasthead";
import styles from "./create.module.css";

/** One empty row of the card, at its real height: a picker row, the type switch, the subject field, or the one-line
    "עוד אפשרויות" row. */
type Row = "field" | "segment" | "input" | "line";

/** A create page while it loads: the real masthead and the form's card with empty rows. The button is left out, so it
    simply appears with the form rather than flipping from a placeholder to its real state. */
export function FormSkeleton({ title, fallback, rows }: { title: string; fallback?: string; rows: Row[] }) {
  return (
    <div className={styles.page}>
      <CreateMasthead title={title} fallback={fallback} />
      <div className={styles.sheet}>
        <Loading className={styles.form}>
          <div className={styles.card}>
            {rows.map((row, i) => (
              <div key={i} className={skeleton[row]} />
            ))}
          </div>
        </Loading>
      </div>
    </div>
  );
}
