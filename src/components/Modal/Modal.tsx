"use client";

import { Trash2 } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import styles from "./Modal.module.css";

type Props = {
  open: boolean;
  onClose?: () => void;
  /** When true, the backdrop and Escape don't close it (trial gate). */
  blocking?: boolean;
  title?: string;
  /** Shown above the title. */
  icon?: ReactNode;
  children: ReactNode;
};

export function Modal({ open, onClose, blocking, title, icon, children }: Props) {
  useEffect(() => {
    if (!open || blocking) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, blocking, onClose]);

  if (!open) return null;
  return (
    <div className={styles.backdrop} onClick={blocking ? undefined : onClose}>
      <div className={styles.card} role="dialog" aria-modal="true" aria-label={title} onClick={(e) => e.stopPropagation()}>
        {icon && (
          <span className={styles.icon} aria-hidden>
            {icon}
          </span>
        )}
        {title && <h2 className={styles.title}>{title}</h2>}
        {children}
      </div>
    </div>
  );
}

/** Confirmation modal used by every delete action. */
export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "מחיקה",
  cancelLabel = "ביטול",
  pending,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  pending?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal open={open} onClose={onCancel} title={title} icon={<Trash2 size={26} />}>
      {message && <p className={styles.message}>{message}</p>}
      <div className={styles.actions}>
        <button type="button" className={styles.danger} disabled={pending} onClick={onConfirm}>
          {confirmLabel}
        </button>
        <button type="button" className={styles.cancel} disabled={pending} onClick={onCancel}>
          {cancelLabel}
        </button>
      </div>
    </Modal>
  );
}
