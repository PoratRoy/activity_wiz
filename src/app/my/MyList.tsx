"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { ActivityCard, formatDate } from "@/components/ActivityCard/ActivityCard";
import { ButtonLink } from "@/components/Button/Button";
import { EmptyState } from "@/components/EmptyState/EmptyState";
import { ConfirmModal } from "@/components/Modal/Modal";
import { useToast } from "@/components/Toast/Toast";
import { removeActivity } from "../activity/actions";
import styles from "./MyList.module.css";

type Item = { id: string; title: string; createdAt: number };

/** Newest first (R17). Delete via the trash icon, with confirmation (R18). */
export function MyList({ items: initial }: { items: Item[] }) {
  const toast = useToast();
  const [items, setItems] = useState(initial);
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
    <main className={styles.main}>
      <p className={styles.count}>{items.length} פעולות</p>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <ActivityCard
              href={`/activity/${item.id}`}
              title={item.title}
              subtitle={formatDate(item.createdAt)}
              aside={
                <button type="button" className={styles.trash} aria-label={`מחיקת ${item.title}`} onClick={() => setConfirm(item)}>
                  <Trash2 size={20} aria-hidden />
                </button>
              }
            />
          </li>
        ))}
      </ul>

      <ConfirmModal
        open={!!confirm}
        title="למחוק את הפעולה?"
        message={confirm ? `«${confirm.title}» תימחק ואי אפשר לבטל את זה.` : undefined}
        pending={deleting}
        onCancel={() => setConfirm(null)}
        onConfirm={async () => {
          if (!confirm) return;
          setDeleting(true);
          const ok = await removeActivity(confirm.id).catch(() => false);
          setDeleting(false);
          if (ok) {
            setItems((list) => list.filter((i) => i.id !== confirm.id));
            toast("הפעולה נמחקה");
          } else {
            toast("לא הצלחנו למחוק, נסו שוב");
          }
          setConfirm(null);
        }}
      />
    </main>
  );
}
