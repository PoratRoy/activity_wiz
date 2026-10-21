"use client";

import { Check, LoaderCircle, Pencil } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { ActionBar, ActionButton } from "@/components/ActionBar/ActionBar";
import barStyles from "@/components/ActionBar/ActionBar.module.css";
import { ActivityView } from "@/components/ActivityView/ActivityView";
import viewStyles from "@/components/ActivityView/ActivityView.module.css";
import { ChipRow, type ChipItem } from "@/components/Chip/Chip";
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
 * typing stops via `onSave` (last write wins).
 */
export function EditableActivity({
  initial,
  chips,
  before,
  onSave,
}: {
  initial: Content;
  chips: ChipItem[];
  before?: ReactNode;
  onSave: (c: Content) => Promise<boolean>;
}) {
  const [content, setContent] = useState<Content>(initial);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState<SaveStatus>("idle");
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

  const saveNow = () => {
    if (timer.current) clearTimeout(timer.current);
    void flush();
  };
  const saveNowRef = useRef(saveNow);
  saveNowRef.current = saveNow;

  // Leaving before the autosave delay (back, a tab, switching apps) saves right away instead of dropping the edit.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") saveNowRef.current();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      saveNowRef.current();
    };
  }, []);

  const finishEditing = () => {
    saveNow();
    setEditing(false);
  };

  const statusText = {
    idle: "",
    saving: "שומר…",
    saved: "נשמר",
    error: "שגיאה בשמירה",
  }[status];

  if (editing) {
    return (
      <>
        <div className={barStyles.bar} data-actionbar>
          <ActionButton icon={<Pencil size={20} aria-hidden />} label="סיום עריכה" onClick={finishEditing} accent />
          <span className={`${styles.status} ${status === "error" ? styles.statusError : ""}`} role="status" data-state={status}>
            {content.title.trim() && (status === "saving" || status === "saved") && (
              <span className={styles.statusIcon} aria-hidden>
                {status === "saving" ? <LoaderCircle size={16} className={styles.spinner} /> : <Check size={16} />}
              </span>
            )}
            {!content.title.trim() ? "צריך כותרת" : statusText}
          </span>
        </div>
        <div className={viewStyles.article} data-activity>
          <ActivityEditor title={content.title} bodyMd={content.bodyMd} onChange={onChange} belowTitle={<ChipRow items={chips} />} />
        </div>
      </>
    );
  }

  return (
    <>
      <ActionBar title={content.title} bodyMd={content.bodyMd}>
        <ActionButton icon={<Pencil size={20} aria-hidden />} label="עריכה" onClick={() => setEditing(true)} />
      </ActionBar>
      <ActivityView title={content.title} bodyMd={content.bodyMd} chips={chips} before={before} />
    </>
  );
}
