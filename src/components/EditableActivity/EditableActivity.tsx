"use client";

import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ActionBar, ActionButton } from "@/components/ActionBar/ActionBar";
import barStyles from "@/components/ActionBar/ActionBar.module.css";
import { ActivityView } from "@/components/ActivityView/ActivityView";
import viewStyles from "@/components/ActivityView/ActivityView.module.css";
import { ChipRow } from "@/components/Chip/Chip";
import { ConfirmModal } from "@/components/Modal/Modal";
import styles from "./EditableActivity.module.css";

// Tiptap only downloads when the user enters edit mode.
const ActivityEditor = dynamic(() => import("@/components/ActivityEditor/ActivityEditor"), {
  ssr: false,
  loading: () => <p className={styles.loading}>טוענים עורך…</p>,
});

export const AUTOSAVE_DELAY_MS = 2000;

type Content = { title: string; bodyMd: string };
type SaveStatus = "idle" | "saving" | "saved" | "error";

/**
 * Read / edit modes of a draft or personal activity (R15). Changes autosave AUTOSAVE_DELAY_MS after
 * typing stops via `onSave` (last write wins). `onDelete` adds the ⋯ menu with a confirmed delete.
 */
export function EditableActivity({
  initial,
  chips,
  before,
  onSave,
  onDelete,
}: {
  initial: Content;
  chips: (string | null | undefined)[];
  before?: ReactNode;
  onSave: (c: Content) => Promise<boolean>;
  onDelete?: () => Promise<boolean>;
}) {
  const [content, setContent] = useState<Content>(initial);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const pending = useRef<Content | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const saving = useRef(false);

  const flush = useCallback(async () => {
    if (saving.current || !pending.current) return;
    const next = pending.current;
    pending.current = null;
    saving.current = true;
    setStatus("saving");
    const ok = await onSave(next).catch(() => false);
    saving.current = false;
    if (pending.current) {
      // Newer edits arrived while saving: save those too.
      void flush();
      return;
    }
    setStatus(ok ? "saved" : "error");
  }, [onSave]);

  const onChange = (next: Content) => {
    setContent(next);
    if (!next.title.trim()) return; // never save an empty title
    pending.current = next;
    setStatus("saving");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void flush(), AUTOSAVE_DELAY_MS);
  };

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const finishEditing = () => {
    if (timer.current) clearTimeout(timer.current);
    void flush();
    setEditing(false);
  };

  const statusText = {
    idle: "",
    saving: "שומר…",
    saved: "נשמר ✓",
    error: "שגיאה בשמירה",
  }[status];

  if (editing) {
    return (
      <>
        <div className={viewStyles.article}>
          <ChipRow items={chips} />
          <ActivityEditor title={content.title} bodyMd={content.bodyMd} onChange={onChange} />
        </div>
        <div className={barStyles.bar}>
          <span className={`${styles.status} ${status === "error" ? styles.statusError : ""}`} role="status">
            {!content.title.trim() ? "צריך כותרת" : statusText}
          </span>
          <ActionButton icon={<Pencil size={20} aria-hidden />} label="סיום עריכה" onClick={finishEditing} accent />
        </div>
      </>
    );
  }

  return (
    <>
      <ActivityView title={content.title} bodyMd={content.bodyMd} chips={chips} before={before} />
      <ActionBar title={content.title} bodyMd={content.bodyMd}>
        <ActionButton icon={<Pencil size={20} aria-hidden />} label="עריכה" onClick={() => setEditing(true)} />
        {onDelete && (
          <div className={styles.menuWrap}>
            <ActionButton icon={<EllipsisVertical size={20} aria-hidden />} label="עוד" onClick={() => setMenuOpen((v) => !v)} />
            {menuOpen && (
              <div className={styles.menu} role="menu">
                <button
                  type="button"
                  role="menuitem"
                  className={styles.menuItem}
                  onClick={() => {
                    setMenuOpen(false);
                    setConfirmOpen(true);
                  }}
                >
                  <Trash2 size={18} aria-hidden />
                  מחיקה
                </button>
              </div>
            )}
          </div>
        )}
      </ActionBar>
      {onDelete && (
        <ConfirmModal
          open={confirmOpen}
          title="למחוק את הפעולה?"
          message="אי אפשר לבטל את זה."
          pending={deleting}
          onCancel={() => setConfirmOpen(false)}
          onConfirm={async () => {
            setDeleting(true);
            const ok = await onDelete().catch(() => false);
            setDeleting(false);
            if (!ok) setConfirmOpen(false);
          }}
        />
      )}
    </>
  );
}
