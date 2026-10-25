import type { ReactNode } from "react";
import { Button } from "@/components/Button/Button";
import { Bone, Loading } from "@/components/Skeleton/Skeleton";
import skeleton from "@/components/Skeleton/Skeleton.module.css";
import { CreateMasthead } from "./CreateMasthead";
import styles from "./create.module.css";

/** One row of the card, at its real height: a picker row (label and value), the type switch, the subject field, or a
    one-line row ("עוד אפשרויות"). */
type Row = "picker" | "segment" | "input" | "line";

function RowBones({ row, i }: { row: Row; i: number }) {
  if (row === "picker") {
    return (
      <div className={skeleton.field}>
        <Bone width={56} height={11} />
        <Bone width={`${34 + ((i * 19) % 24)}%`} height={16} />
      </div>
    );
  }
  if (row === "line") {
    return (
      <div className={`${skeleton.field} ${skeleton.lineRow}`}>
        <Bone width="42%" height={16} />
      </div>
    );
  }
  return (
    <div className={styles.block}>
      <Bone width="100%" height={row === "segment" ? 52 : 53} />
    </div>
  );
}

/** A create page while it loads: the real masthead, the card of answer rows, and the form's own (disabled) button
    pinned at the bottom, so only the rows' contents change when the form arrives. */
export function FormSkeleton({
  title,
  fallback,
  rows,
  submit,
  icon,
}: {
  title: string;
  fallback?: string;
  rows: Row[];
  submit: string;
  icon: ReactNode;
}) {
  return (
    <div className={styles.page}>
      <CreateMasthead title={title} fallback={fallback} />
      <div className={styles.sheet}>
        <Loading className={styles.form}>
          <div className={styles.card}>
            {rows.map((row, i) => (
              <RowBones key={i} row={row} i={i} />
            ))}
          </div>
          <div className={styles.footer}>
            <Button disabled icon={icon}>
              {submit}
            </Button>
          </div>
        </Loading>
      </div>
    </div>
  );
}
