"use client";

import { Check, LoaderCircle, Pencil } from "lucide-react";
import { startTransition, useCallback, useEffect, useRef, useState, ViewTransition, type ReactNode } from "react";
import { ActionBar, ActionButton } from "@/components/ActionBar/ActionBar";
import barStyles from "@/components/ActionBar/ActionBar.module.css";
import { ActivityView } from "@/components/ActivityView/ActivityView";
import viewStyles from "@/components/ActivityView/ActivityView.module.css";
import { ChipRow, type ChipItem } from "@/components/Chip/Chip";
import styles from "./EditableActivity.module.css";

type Editor = typeof import("@/components/ActivityEditor/ActivityEditor").default;
let editorLoad: Promise<Editor> | null = null;

/** Tiptap downloads once, on its own: the page starts it soon after opening, so "עריכה" switches at once. */
function loadEditor(): Promise<Editor> {
  editorLoad ??= import("@/components/ActivityEditor/ActivityEditor").then((m) => m.default);
  // A failed download (offline) can be tried again on the next tap.
  editorLoad.catch(() => (editorLoad = null));
  return editorLoad;
}

/** How long after opening the page the editor starts downloading, so it doesn't compete with the page itself. */
const PRELOAD_DELAY_MS = 1200;

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
  const [Editor, setEditor] = useState<Editor | null>(null);
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

  useEffect(() => {
    let alive = true;
    const t = setTimeout(() => {
      loadEditor()
        .then((E) => alive && setEditor(() => E))
        .catch(() => {});
    }, PRELOAD_DELAY_MS);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, []);

  // Reading and editing cross-fade (a transition, for the <ViewTransition> below). Edit mode opens once the editor is
  // ready, so it never shows a loading line in place of the text; only an early tap waits for the download.
  const startEditing = async () => {
    const E = Editor ?? (await loadEditor().catch(() => null));
    startTransition(() => {
      if (E) setEditor(() => E);
      setEditing(true);
    });
  };

  const finishEditing = () => {
    saveNow();
    startTransition(() => setEditing(false));
  };

  const statusText = {
    idle: "",
    saving: "שומר…",
    saved: "נשמר",
    error: "שגיאה בשמירה",
  }[status];

  if (editing) {
    return (
      <ViewTransition key="edit" enter="page-in" exit="page-out" default="none">
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
          {Editor ? (
            <Editor title={content.title} bodyMd={content.bodyMd} onChange={onChange} belowTitle={<ChipRow items={chips} />} />
          ) : (
            <p className={styles.loading}>טוענים עורך…</p>
          )}
        </div>
      </ViewTransition>
    );
  }

  return (
    <ViewTransition key="read" enter="page-in" exit="page-out" default="none">
      <ActivityView
        title={content.title}
        bodyMd={content.bodyMd}
        chips={chips}
        before={before}
        actions={
          <ActionBar title={content.title} bodyMd={content.bodyMd}>
            <ActionButton icon={<Pencil size={19} aria-hidden />} label="עריכה" onClick={() => void startEditing()} />
          </ActionBar>
        }
      />
    </ViewTransition>
  );
}
