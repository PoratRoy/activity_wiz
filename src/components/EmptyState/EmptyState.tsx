import type { ReactNode } from "react";
import { EmptyBox } from "@/components/illustrations/EmptyBox";
import styles from "./EmptyState.module.css";

export function EmptyState({
  text,
  illustration = <EmptyBox />,
  action,
}: {
  text: string;
  illustration?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className={styles.wrap}>
      {illustration}
      <p className={styles.text}>{text}</p>
      {action}
    </div>
  );
}
