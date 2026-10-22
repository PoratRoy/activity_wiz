"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Sheet } from "react-modal-sheet";
import type { TileOption } from "@/components/Tile/Tile";
import styles from "./PickerSheet.module.css";

type Props = {
  label: string;
  placeholder: string;
  options: TileOption[];
  value: string | null;
  onChange: (value: string) => void;
  closeDelayMs?: number;
};

/** A field button that opens a bottom sheet with a scrollable list. For long option lists. Drag down, tap outside or Escape to close. */
export function PickerSheet({ label, placeholder, options, value, onChange, closeDelayMs = 15 }: Props) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const close = () => {
    clearTimeout(closeTimer.current);
    setOpen(false);
  };

  useEffect(() => () => clearTimeout(closeTimer.current), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div>
      <span className={styles.label}>{label}</span>
      <button type="button" className={styles.field} onClick={() => setOpen(true)} aria-haspopup="listbox" aria-expanded={open} data-filled={!!current}>
        <span className={current ? "" : styles.placeholder}>{current?.label ?? placeholder}</span>
        <ChevronDown size={20} aria-hidden />
      </button>

      <Sheet className={styles.root} isOpen={open} onClose={close} detent="content" unstyled>
        <Sheet.Container className={styles.sheet} role="dialog" aria-label={label}>
          <Sheet.Header className={styles.header}>
            <div className={styles.handle} />
            <h2 className={styles.title}>{label}</h2>
          </Sheet.Header>
          <Sheet.Content scrollClassName={styles.scroll}>
            <ul className={styles.list} role="listbox">
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
                    <span>{o.label}</span>
                    {o.value === value && <Check size={20} className={styles.check} aria-hidden />}
                  </button>
                </li>
              ))}
            </ul>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop className={styles.backdrop} onTap={close} />
      </Sheet>
    </div>
  );
}
