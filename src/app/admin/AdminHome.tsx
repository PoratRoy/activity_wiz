"use client";

import { ArrowDown, ArrowUp, ArrowUpDown, Check, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/Button/Button";
import { categoryArt } from "@/components/CategoryCard/CategoryCard";
import { Modal } from "@/components/Modal/Modal";
import { TextField } from "@/components/TextField/TextField";
import { useToast } from "@/components/Toast/Toast";
import { createCategory, removeCategory, reorderCategories } from "./actions";
import styles from "./admin.module.css";
import { AdminRows } from "./AdminRows";

export function AdminHome({ categories }: { categories: { id: string; title: string; count: number }[] }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  // Reorder mode: a local copy of the order, saved after every move.
  const [order, setOrder] = useState<typeof categories | null>(null);
  const [saving, setSaving] = useState(false);

  const move = async (index: number, delta: -1 | 1) => {
    if (!order) return;
    const next = [...order];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setOrder(next);
    setSaving(true);
    const ok = await reorderCategories(next.map((c) => c.id)).catch(() => false);
    setSaving(false);
    if (!ok) {
      toast("שמירת הסדר נכשלה, נסו שוב");
      setOrder(null);
    }
    router.refresh();
  };

  const add = async () => {
    setPending(true);
    const res = await createCategory(title).catch(() => ({ error: "ההוספה נכשלה, נסו שוב" }));
    setPending(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setOpen(false);
    setOrder(null);
    setTitle("");
    setError("");
    toast("הקטגוריה נוספה");
    router.refresh();
  };

  return (
    <>
      <div className={styles.actions}>
        <Button icon={<Plus size={18} aria-hidden />} onClick={() => setOpen(true)} variant="secondary">
          קטגוריה
        </Button>
        {categories.length > 0 && (
          <ButtonLink href="/admin/activity/new" icon={<Plus size={18} aria-hidden />}>
            פעולה
          </ButtonLink>
        )}
      </div>

      {categories.length > 1 && (
        <button
          type="button"
          className={styles.reorderToggle}
          aria-pressed={!!order}
          disabled={saving}
          onClick={() => setOrder(order ? null : categories)}
        >
          {order ? <Check size={18} aria-hidden /> : <ArrowUpDown size={18} aria-hidden />}
          {order ? "סיום" : "שינוי סדר"}
        </button>
      )}

      {order ? (
        <ul className={`${styles.list} ${styles.raised}`} aria-label="סדר הקטגוריות">
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
        <AdminRows
          rows={categories.map((c) => ({
            id: c.id,
            title: c.title,
            subtitle: `${c.count} פעולות`,
            href: `/admin/category/${c.id}`,
            image: categoryArt(c.id),
            confirmMessage: `למחוק את הקטגוריה וכל ${c.count} הפעולות שבה? פעולות שמורות של משתמשים לא יימחקו.`,
          }))}
          confirmTitle="למחוק את הקטגוריה?"
          onDelete={removeCategory}
          deletedToast="הקטגוריה נמחקה"
          raised
        />
      )}

      <Modal open={open} onClose={() => setOpen(false)} title="קטגוריה חדשה">
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            void add();
          }}
        >
          <TextField id="cat-title" placeholder="שם הקטגוריה" value={title} autoFocus onChange={(e) => setTitle(e.target.value)} />
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" disabled={pending || !title.trim()}>
            {pending ? "מוסיפים…" : "הוספה"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
