import type { ReactNode } from "react";
import { ActivityPage } from "@/components/ActivityPage/ActivityPage";
import { ForestPage } from "@/components/ForestPage/ForestPage";
import { SkeletonExit } from "@/components/Transitions/Transitions";
import styles from "./Skeleton.module.css";

// Loading screens are the page's frame and its empty boxes at their real sizes: no text placeholders, shimmer or
// buttons, so when the page arrives its contents simply fade into boxes that are already in place.

/** Announces the wait once to screen readers, and fades out when the page arrives. */
export function Loading({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <SkeletonExit>
      <div className={className} role="status" aria-busy="true">
        <span className={styles.srOnly}>טוען…</span>
        {children}
      </div>
    </SkeletonExit>
  );
}

type RowKind = "category" | "activity" | "saved";

/** Empty rows the size of the real ones: library categories, a category's activities, or "my activities". */
export function RowsSkeleton({ kind, count }: { kind: RowKind; count: number }) {
  return (
    <Loading>
      <ul className={styles.list}>
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className={`${styles.row} ${styles[kind]}`} />
        ))}
      </ul>
    </Loading>
  );
}

/** A forest-masthead list page (library, a category, "my activities") while its rows load. A category's name isn't
    known yet, so its bar has no title until the page arrives. */
export function ForestListSkeleton({
  title = "",
  fallback,
  kind,
  count = 7,
}: {
  title?: string;
  fallback?: string;
  kind: RowKind;
  count?: number;
}) {
  return (
    <ForestPage title={title} fallback={fallback} trail>
      <RowsSkeleton kind={kind} count={count} />
    </ForestPage>
  );
}

/** An activity's reading page: the green title block at the real page's height (title, detail line, actions), then
    the empty reading sheet. */
export function ActivitySkeleton({ label = "", fallback }: { label?: string; fallback: string }) {
  return (
    <ActivityPage label={label} fallback={fallback}>
      <Loading className={styles.fill}>
        <article data-activity>
          <header data-activity-head>
            <span className={styles.titleLine} />
            <span className={styles.detailLine} />
            <span className={styles.actions} />
          </header>
          <div data-reading />
        </article>
      </Loading>
    </ActivityPage>
  );
}
