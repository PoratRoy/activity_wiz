"use client";

import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/Button/Button";
import { categoryArt } from "@/components/CategoryCard/CategoryCard";
import { Modal } from "@/components/Modal/Modal";
import { TextField } from "@/components/TextField/TextField";
import { useToast } from "@/components/Toast/Toast";
import { createCategory, removeCategory } from "./actions";
import styles from "./admin.module.css";
import { AdminRows } from "./AdminRows";

export function AdminHome({ categories }: { categories: { id: string; title: string; count: number }[] }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const add = async () => {
    setPending(true);
    const res = await createCategory(title).catch(() => ({ error: "ההוספה נכשלה, נסו שוב" }));
    setPending(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setOpen(false);
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
