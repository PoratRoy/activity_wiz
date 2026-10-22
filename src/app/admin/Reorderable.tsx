"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { useToast } from "@/components/Toast/Toast";
import styles from "./admin.module.css";

type Item = { id: string; title: string };

/**
 * A "שינוי סדר" toggle over a list: off shows `children`; on shows the items with up/down arrows and
 * saves the full order after every move. Give it a `key` of the sorted item IDs so it resets when items are added or removed.
 */
export function Reorderable({
  items,
  save,
  label,
  raised = false,
  children,
}: {
  items: Item[];
  save: (ids: string[]) => Promise<boolean>;
  /** Accessible name of the reorder list, e.g. "סדר הקטגוריות". */
  label: string;
  raised?: boolean;
  children: ReactNode;
}) {
  const router = useRouter();
  const toast = useToast();
  // Reorder mode: a local copy of the order, saved after every move.
  const [order, setOrder] = useState<Item[] | null>(null);
  const [saving, setSaving] = useState(false);

  const move = async (index: number, delta: -1 | 1) => {
    if (!order) return;
    const next = [...order];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setOrder(next);
    setSaving(true);
    const ok = await save(next.map((c) => c.id)).catch(() => false);
    setSaving(false);
    if (!ok) {
      toast("שמירת הסדר נכשלה, נסו שוב");
      setOrder(null);
    }
    router.refresh();
  };

  return (
    <>
      {items.length > 1 && (
        <button
          type="button"
          className={styles.reorderToggle}
          aria-pressed={!!order}
          disabled={saving}
          onClick={() => setOrder(order ? null : items)}
        >
          {order ? <Check size={18} aria-hidden /> : <ArrowUpDown size={18} aria-hidden />}
          {order ? "סיום" : "שינוי סדר"}
        </button>
      )}

      {order ? (
        <ul className={`${styles.list} ${raised ? styles.raised : ""}`} aria-label={label}>
          {order.map((c, i) => (
            <li key={c.id} className={styles.row}>
              <span className={styles.rowLink}>
                <span className={styles.rowTitle}>{c.title}</span>
              </span>
              <button
                type="button"
                className={styles.moveBtn}
                aria-label={`הזזת ${c.title} למעלה`}
                disabled={saving || i === 0}
                onClick={() => void move(i, -1)}
              >
                <ArrowUp size={20} aria-hidden />
              </button>
              <button
                type="button"
                className={styles.moveBtn}
                aria-label={`הזזת ${c.title} למטה`}
                disabled={saving || i === order.length - 1}
                onClick={() => void move(i, 1)}
              >
                <ArrowDown size={20} aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        children
      )}
    </>
  );
}
