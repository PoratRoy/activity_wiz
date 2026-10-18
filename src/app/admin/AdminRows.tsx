"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmModal } from "@/components/Modal/Modal";
import { useToast } from "@/components/Toast/Toast";
import styles from "./admin.module.css";

export type AdminRow = { id: string; title: string; subtitle?: string; href?: string; confirmMessage: string };

/** A list of rows, each with a trash button that always asks for confirmation first. */
export function AdminRows({
  rows,
  confirmTitle,
  onDelete,
  deletedToast,
}: {
  rows: AdminRow[];
  confirmTitle: string;
  onDelete: (id: string) => Promise<boolean>;
  deletedToast: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [target, setTarget] = useState<AdminRow | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <>
      <ul className={styles.list}>
        {rows.map((r) => (
          <li key={r.id} className={styles.row}>
            {r.href ? (
              <Link href={r.href} className={styles.rowLink}>
                <span className={styles.rowTitle}>{r.title}</span>
                {r.subtitle && <span className={styles.rowSub}>{r.subtitle}</span>}
              </Link>
            ) : (
              <div className={styles.rowLink}>
                <span className={styles.rowTitle}>{r.title}</span>
                {r.subtitle && <span className={styles.rowSub}>{r.subtitle}</span>}
              </div>
            )}
            <button type="button" className={styles.trash} aria-label={`מחיקת ${r.title}`} onClick={() => setTarget(r)}>
              <Trash2 size={20} aria-hidden />
            </button>
          </li>
        ))}
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
