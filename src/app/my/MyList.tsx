"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { formatDate } from "@/components/ActivityCard/ActivityCard";
import { ButtonLink } from "@/components/Button/Button";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ConfirmModal } from "@/components/Modal/Modal";
import { useToast } from "@/components/Toast/Toast";
import { removeActivity } from "../activity/actions";
import styles from "./MyList.module.css";

type Item = { id: string; title: string; createdAt: number };

/** Raised rows like the library, newest first (R17). Delete via the small trash icon, with confirmation (R18). */
export function MyList({ items: all }: { items: Item[] }) {
  const toast = useToast();
  // Track deletions rather than copying the list, so a refresh (e.g. a title saved on the way here) shows through.
  const [deleted, setDeleted] = useState<ReadonlySet<string>>(new Set());
  const items = all.filter((i) => !deleted.has(i.id));
  const [confirm, setConfirm] = useState<Item | null>(null);
  const [deleting, setDeleting] = useState(false);

  if (items.length === 0) {
    return (
      <EmptyState
        text="עוד אין פעולות"
        action={
          <ButtonLink href="/create/group" block={false}>
            יצירת פעולה
          </ButtonLink>
        }
      />
    );
  }

  return (
    <>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id} className={styles.row}>
            <Link href={`/activity/${item.id}`} className={styles.link}>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.date}>{formatDate(item.createdAt)}</span>
            </Link>
            <button type="button" className={styles.trash} aria-label={`מחיקת ${item.title}`} onClick={() => setConfirm(item)}>
              <Trash2 size={16} aria-hidden />
            </button>
          </li>
        ))}
      </ul>

      <ConfirmModal
        open={!!confirm}
        title="למחוק את הפעולה?"
        message={
          confirm ? (
            <>
              <strong className={styles.confirmTitle}>{confirm.title}</strong> תימחק ואי אפשר לבטל את זה.
            </>
          ) : undefined
        }
        pending={deleting}
        onCancel={() => setConfirm(null)}
        onConfirm={async () => {
          if (!confirm) return;
          setDeleting(true);
          const ok = await removeActivity(confirm.id).catch(() => false);
          setDeleting(false);
          if (ok) {
            setDeleted((d) => new Set(d).add(confirm.id));
            toast("הפעולה נמחקה");
          } else {
            toast("לא הצלחנו למחוק, נסו שוב");
          }
          setConfirm(null);
        }}
      />
    </>
  );
}
