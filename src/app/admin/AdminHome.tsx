"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, ButtonLink } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { TextField } from "@/components/TextField/TextField";
import { useToast } from "@/components/Toast/Toast";
import { categoryThumb, imageForKey } from "@/data/libraryImages";
import { createCategory, removeCategory, reorderCategories, setCategoryKey } from "./actions";
import styles from "./admin.module.css";
import { AdminRows } from "./AdminRows";
import { Reorderable } from "./Reorderable";

type Category = { id: string; title: string; key: string | null; count: number };

/** English-name input with a preview of the artwork it picks (or the default when none matches). */
function KeyField({ id, value, onChange }: { id: string; value: string; onChange: (key: string) => void }) {
  const image = imageForKey(value);
  return (
    <>
      <TextField
        id={id}
        label="שם באנגלית"
        placeholder="games"
        dir="ltr"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className={styles.keyPreview}>
        <Image src={categoryThumb(value)} alt="" width={72} height={52} unoptimized className={styles.thumb} />
        <span>{image ? `תמונה: ${image}` : "אין תמונה בשם הזה, תוצג תמונת ברירת המחדל"}</span>
      </div>
    </>
  );
}

export function AdminHome({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const toast = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [key, setKey] = useState("");
  // Category whose English name is being changed, with the value typed so far.
  const [editing, setEditing] = useState<{ id: string; title: string; key: string } | null>(null);
  const [editError, setEditError] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const add = async () => {
    setPending(true);
    const res = await createCategory(title, key).catch(() => ({ error: "ההוספה נכשלה, נסו שוב" }));
    setPending(false);
    if ("error" in res) {
      setError(res.error);
      return;
    }
    setOpen(false);
    setTitle("");
    setKey("");
    setError("");
    toast("הקטגוריה נוספה");
    router.refresh();
  };

  const saveKey = async () => {
    if (!editing) return;
    setPending(true);
    const res = await setCategoryKey(editing.id, editing.key).catch(() => ({ error: "העדכון נכשל, נסו שוב" }));
    setPending(false);
    if ("error" in res) {
      setEditError(res.error);
      return;
    }
    setEditing(null);
    toast("השם באנגלית עודכן");
    router.refresh();
  };

  return (
    <>
      <div className={styles.actions}>
        <Button
          icon={<Plus size={18} aria-hidden />}
          onClick={() => {
            setError("");
            setOpen(true);
          }}
          variant="secondary"
        >
          קטגוריה
        </Button>
        {categories.length > 0 && (
          <ButtonLink href="/admin/activity/new" icon={<Plus size={18} aria-hidden />}>
            פעולה
          </ButtonLink>
        )}
      </div>

      <Reorderable
        key={categories.map((c) => c.id).sort().join()}
        items={categories}
        save={reorderCategories}
        label="סדר הקטגוריות"
        raised
      >
        <AdminRows
          rows={categories.map((c) => ({
            id: c.id,
            title: c.title,
            subtitle: `${c.count} פעולות · ${c.key ?? "ללא שם באנגלית"}`,
            href: `/admin/category/${c.id}`,
            image: categoryThumb(c.key),
            confirmMessage: `למחוק את הקטגוריה וכל ${c.count} הפעולות שבה? פעולות שמורות של משתמשים לא יימחקו.`,
          }))}
          confirmTitle="למחוק את הקטגוריה?"
          onDelete={removeCategory}
          deletedToast="הקטגוריה נמחקה"
          raised
          onImageClick={(r) => {
            const c = categories.find((x) => x.id === r.id);
            if (!c) return;
            setEditError("");
            setEditing({ id: c.id, title: c.title, key: c.key ?? "" });
          }}
        />
      </Reorderable>

      <Modal open={open} onClose={() => setOpen(false)} title="קטגוריה חדשה">
        <form
          className={styles.form}
          onSubmit={(e) => {
            e.preventDefault();
            void add();
          }}
        >
          <TextField id="cat-title" label="שם הקטגוריה" value={title} autoFocus onChange={(e) => setTitle(e.target.value)} />
          <KeyField
            id="cat-key"
            value={key}
            onChange={(k) => {
              setKey(k);
              setError("");
            }}
          />
          {error && <p className={styles.error}>{error}</p>}
          <Button type="submit" disabled={pending || !title.trim() || !key.trim()}>
            {pending ? "מוסיפים…" : "הוספה"}
          </Button>
        </form>
      </Modal>

      <Modal open={!!editing} onClose={() => setEditing(null)} title={editing?.title}>
        {editing && (
          <form
            className={styles.form}
            onSubmit={(e) => {
              e.preventDefault();
              void saveKey();
            }}
          >
            <KeyField
              id="edit-key"
              value={editing.key}
              onChange={(k) => {
                setEditing({ ...editing, key: k });
                setEditError("");
              }}
            />
            {editError && <p className={styles.error}>{editError}</p>}
            <Button type="submit" disabled={pending || !editing.key.trim()}>
              {pending ? "שומרים…" : "שמירה"}
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}
