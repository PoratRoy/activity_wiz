"use client";

import { Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmModal } from "@/components/Modal/Modal";
import { useToast } from "@/components/Toast/Toast";
import styles from "./admin.module.css";

export type AdminRow = { id: string; title: string; subtitle?: string; href?: string; image?: string; confirmMessage: string };

/**
 * A list of rows, each with a trash button that always asks for confirmation first.
 * `raised` uses the library's raised-row look, with the row's thumbnail on the left;
 * with `onImageClick` the thumbnail is its own button (e.g. to change it).
 */
export function AdminRows({
  rows,
  confirmTitle,
  onDelete,
  deletedToast,
  raised = false,
  onImageClick,
}: {
  rows: AdminRow[];
  confirmTitle: string;
  onDelete: (id: string) => Promise<boolean>;
  deletedToast: string;
  raised?: boolean;
  onImageClick?: (row: AdminRow) => void;
}) {
  const router = useRouter();
  const toast = useToast();
  const [target, setTarget] = useState<AdminRow | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <>
      <ul className={`${styles.list} ${raised ? styles.raised : ""}`}>
        {rows.map((r) => {
          const content = (
            <>
              <span className={styles.rowText}>
                <span className={styles.rowTitle}>{r.title}</span>
                {r.subtitle && <span className={styles.rowSub}>{r.subtitle}</span>}
              </span>
              {r.image && !onImageClick && <Image src={r.image} alt="" width={72} height={52} unoptimized className={styles.thumb} />}
            </>
          );
          return (
          <li key={r.id} className={styles.row}>
            {r.href ? (
              <Link href={r.href} className={styles.rowLink}>
                {content}
              </Link>
            ) : (
              <div className={styles.rowLink}>{content}</div>
            )}
            {r.image && onImageClick && (
              <button type="button" className={styles.thumbBtn} aria-label={`החלפת התמונה של ${r.title}`} onClick={() => onImageClick(r)}>
                <Image src={r.image} alt="" width={72} height={52} unoptimized className={styles.thumb} />
              </button>
            )}
            <button type="button" className={styles.trash} aria-label={`מחיקת ${r.title}`} onClick={() => setTarget(r)}>
              <Trash2 size={20} aria-hidden />
            </button>
          </li>
          );
        })}
      </ul>
      <ConfirmModal
        open={!!target}
        title={confirmTitle}
        message={target?.confirmMessage}
        pending={pending}
        onCancel={() => setTarget(null)}
        onConfirm={async () => {
          if (!target) return;
          setPending(true);
          const ok = await onDelete(target.id).catch(() => false);
          setPending(false);
          setTarget(null);
          toast(ok ? deletedToast : "המחיקה נכשלה, נסו שוב");
          if (ok) router.refresh();
        }}
      />
    </>
  );
}
