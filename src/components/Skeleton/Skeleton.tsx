import type { CSSProperties, ReactNode } from "react";
import { ActivityPage } from "@/components/ActivityPage/ActivityPage";
import { ForestPage } from "@/components/ForestPage/ForestPage";
import styles from "./Skeleton.module.css";

/** One shimmering placeholder shape; `forest` for shapes on the dark masthead. */
export function Bone({ width, height = 14, forest }: { width: CSSProperties["width"]; height?: number; forest?: boolean }) {
  return <span className={`${styles.bone} ${forest ? styles.forest : ""}`} style={{ width, height }} />;
}

/** Announces the wait once to screen readers; the shapes themselves are hidden from them. */
export function Loading({ children }: { children: ReactNode }) {
  return (
    <div className={styles.fade} role="status" aria-busy="true">
      <span className={styles.srOnly}>טוען…</span>
      <div aria-hidden>{children}</div>
    </div>
  );
}

/** The library's category rows ("category") or an activity list ("activity"). */
export function RowsSkeleton({ kind, count }: { kind: "category" | "activity"; count: number }) {
  return (
    <Loading>
      <ul className={styles.list}>
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className={`${styles.row} ${styles[kind]}`}>
            {kind === "category" ? (
              <Bone width={`${32 + ((i * 13) % 20)}%`} height={18} />
            ) : (
              <>
                <Bone width={`${55 + ((i * 17) % 30)}%`} height={18} />
                <Bone width="88%" height={12} />
                <Bone width="38%" height={12} />
              </>
            )}
          </li>
        ))}
      </ul>
    </Loading>
  );
}

/** A forest-masthead list page (library, a category, "my activities") while its rows load. */
export function ForestListSkeleton({
  title = "",
  fallback,
  kind,
  count = 6,
}: {
  title?: string;
  fallback?: string;
  kind: "category" | "activity";
  count?: number;
}) {
  return (
    <ForestPage title={title} fallback={fallback} trail>
      <RowsSkeleton kind={kind} count={count} />
    </ForestPage>
  );
}

/** An activity's reading page: the title block on the masthead, then lines of the reading sheet. */
export function ActivitySkeleton({ label = "", fallback }: { label?: string; fallback: string }) {
  return (
    <ActivityPage label={label} fallback={fallback}>
      <article data-activity>
        <header data-activity-head className={styles.head}>
          <Bone width="72%" height={26} forest />
          <span className={styles.chips}>
            <Bone width={70} height={12} forest />
            <Bone width={56} height={12} forest />
            <Bone width={64} height={12} forest />
          </span>
        </header>
        <div data-reading>
          <Loading>
            <div className={styles.body}>
              {["100%", "94%", "97%", "62%", "0", "45%", "100%", "91%", "78%"].map((w, i) =>
                w === "0" ? <span key={i} /> : <Bone key={i} width={w} height={i === 5 ? 20 : 15} />,
              )}
            </div>
          </Loading>
        </div>
      </article>
    </ActivityPage>
  );
}
