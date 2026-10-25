import { Bone, Loading } from "@/components/Skeleton/Skeleton";
import skeleton from "@/components/Skeleton/Skeleton.module.css";
import { CreateMasthead } from "./CreateMasthead";
import styles from "./create.module.css";

/** A create page while it loads: the real masthead, then the card of answer rows. */
export function FormSkeleton({ title, fallback, rows }: { title: string; fallback?: string; rows: number }) {
  return (
    <div className={styles.page}>
      <CreateMasthead title={title} fallback={fallback} />
      <div className={styles.sheet}>
        <Loading>
          <div className={skeleton.card}>
            {Array.from({ length: rows }, (_, i) => (
              <div key={i} className={skeleton.field}>
                <Bone width={64} height={11} />
                <Bone width={`${40 + ((i * 19) % 30)}%`} height={16} />
              </div>
            ))}
          </div>
        </Loading>
      </div>
    </div>
  );
}
