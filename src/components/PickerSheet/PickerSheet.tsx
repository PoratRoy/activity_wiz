"use client";

import { ChevronDown, ChevronLeft, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Sheet } from "react-modal-sheet";
import type { TileOption } from "@/components/Tile/Tile";
import styles from "./PickerSheet.module.css";

/** Labels without Hebrew ("30+", "1-5") render LTR so the sign stays in place. */
const dirOf = (label: string) => (/[֐-׿]/.test(label) ? undefined : "ltr");

type SheetProps = {
  open: boolean;
  onClose: () => void;
  label: string;
  options: TileOption[];
  value: string | null;
  onChange: (value: string) => void;
  closeDelayMs?: number;
};

/** The half-height bottom sheet behind every select: one tap picks an option and closes it. Drag down, tap outside,
 * the close button or Escape also close it. */
export function OptionSheet({ open, onClose, label, options, value, onChange, closeDelayMs = 15 }: SheetProps) {
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const close = () => {
    clearTimeout(closeTimer.current);
    onClose();
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <Sheet className={styles.root} isOpen={open} onClose={close} detent="content" unstyled>
      <Sheet.Container className={styles.sheet} role="dialog" aria-label={label}>
        <Sheet.Header className={styles.header}>
          <div className={styles.handle} />
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{label}</h2>
            <button type="button" className={styles.close} onClick={close} aria-label="סגירה">
              <X size={18} aria-hidden />
            </button>
          </div>
        </Sheet.Header>
        <Sheet.Content scrollClassName={styles.scroll}>
          <ul className={styles.list} role="listbox" aria-label={label}>
            {options.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.value === value}
                  className={styles.item}
                  onClick={() => {
                    onChange(o.value);
                    clearTimeout(closeTimer.current);
                    closeTimer.current = setTimeout(close, closeDelayMs);
                  }}
                >
                  <span dir={dirOf(o.label)}>{o.label}</span>
                  <span className={styles.radio} aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        </Sheet.Content>
      </Sheet.Container>
      <Sheet.Backdrop className={styles.backdrop} onTap={close} />
    </Sheet>
  );
}

type Props = {
  label: string;
  placeholder: string;
  options: TileOption[];
  value: string | null;
  onChange: (value: string) => void;
  closeDelayMs?: number;
  /** "row": a card row (small label over the answer, arrow at the end) for forms built as one card. */
  variant?: "field" | "row";
};

/** A field button that opens the option sheet. For option lists too long or too many to show inline. */
export function PickerSheet({ label, placeholder, options, value, onChange, closeDelayMs, variant = "field" }: Props) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  const sheet = (
    <OptionSheet
      open={open}
      onClose={() => setOpen(false)}
      label={label}
      options={options}
      value={value}
      onChange={onChange}
      closeDelayMs={closeDelayMs}
    />
  );

  if (variant === "row") {
    return (
      <>
        <button type="button" className={styles.row} onClick={() => setOpen(true)} aria-haspopup="listbox" aria-expanded={open} data-filled={!!current}>
          <span className={styles.rowText}>
            <span className={styles.rowLabel}>{label}</span>
            <span className={current ? styles.rowValue : styles.rowPlaceholder} dir={current ? dirOf(current.label) : undefined}>
              {current?.label ?? placeholder}
            </span>
          </span>
          <ChevronLeft size={20} className={styles.rowArrow} aria-hidden />
        </button>
        {sheet}
      </>
    );
  }

  return (
    <div>
      <span className={styles.label}>{label}</span>
      <button type="button" className={styles.field} onClick={() => setOpen(true)} aria-haspopup="listbox" aria-expanded={open} data-filled={!!current}>
        <span className={current ? "" : styles.placeholder}>{current?.label ?? placeholder}</span>
        <ChevronDown size={20} aria-hidden />
      </button>
      {sheet}
    </div>
  );
}
