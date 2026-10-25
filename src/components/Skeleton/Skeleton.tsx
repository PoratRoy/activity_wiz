import type { CSSProperties, ReactNode } from "react";
import { ActivityPage } from "@/components/ActivityPage/ActivityPage";
import { ForestPage } from "@/components/ForestPage/ForestPage";
import { SkeletonExit } from "@/components/Transitions/Transitions";
import styles from "./Skeleton.module.css";

/** One placeholder shape; `forest` for shapes on the dark masthead, `inline` for one sitting in a line of text. */
export function Bone({
  width,
  height = 14,
  forest,
  inline,
  round,
}: {
  width: CSSProperties["width"];
  height?: number;
  forest?: boolean;
  inline?: boolean;
  round?: boolean;
}) {
  const cls = [styles.bone, forest && styles.forest, inline && styles.inline, round && styles.round].filter(Boolean).join(" ");
  return <span className={cls} style={{ width, height }} />;
}

/** Announces the wait once to screen readers (the shapes have no text), and fades out when the page arrives. */
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

/** Rows the same size as the real ones: library categories, a category's activities, or "my activities". */
export function RowsSkeleton({ kind, count }: { kind: RowKind; count: number }) {
  return (
    <Loading>
      <ul className={styles.list}>
        {Array.from({ length: count }, (_, i) => (
          <li key={i} className={`${styles.row} ${styles[kind]}`}>
            {kind === "category" && <Bone width={`${26 + ((i * 13) % 18)}%`} height={16} />}
            {kind === "activity" && (
              <>
                <Bone width={`${55 + ((i * 17) % 30)}%`} height={17} />
                <Bone width="86%" height={12} />
                <span className={styles.tags}>
                  <Bone width={58} height={22} round />
                  <Bone width={64} height={22} round />
                </span>
              </>
            )}
            {kind === "saved" && (
              <>
                <Bone width={`${50 + ((i * 17) % 30)}%`} height={17} />
                <Bone width={72} height={12} />
              </>
            )}
          </li>
        ))}
      </ul>
    </Loading>
  );
}

/** A forest-masthead list page (library, a category, "my activities") while its rows load. Without a `title`
    (a category, whose name isn't known yet) the bar shows a placeholder in its place. */
export function ForestListSkeleton({
  title,
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
    <ForestPage title={title ?? <Bone width={110} height={20} forest inline />} fallback={fallback} trail>
      <RowsSkeleton kind={kind} count={count} />
    </ForestPage>
  );
}

/** An activity's reading page: the title block (title, detail line, actions) at the real page's height, then lines
    of the reading sheet. */
export function ActivitySkeleton({ label = "", fallback }: { label?: string; fallback: string }) {
  return (
    <ActivityPage label={label} fallback={fallback}>
      <Loading className={styles.fill}>
        <article data-activity>
          <header data-activity-head>
            <span className={styles.titleLine}>
              <Bone width="70%" height={24} forest />
            </span>
            <span className={styles.detailLine}>
              <Bone width={110} height={13} forest />
            </span>
            <span className={styles.actions} data-actions>
              <Bone width="100%" height={44} forest />
              <Bone width={44} height={44} forest round />
            </span>
          </header>
          <div data-reading>
            <span className={styles.body}>
              {["100%", "92%", "96%", "58%"].map((w, i) => (
                <Bone key={i} width={w} height={15} />
              ))}
              <Bone width="34%" height={19} />
              {["100%", "88%", "94%", "70%"].map((w, i) => (
                <Bone key={i} width={w} height={15} />
              ))}
            </span>
          </div>
        </article>
      </Loading>
    </ActivityPage>
  );
}
