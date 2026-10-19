"use client";

import { Check, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import type { TileOption } from "@/components/Tile/Tile";
import styles from "./PickerSheet.module.css";

type Props = {
  label: string;
  placeholder: string;
  options: TileOption[];
  value: string | null;
  onChange: (value: string) => void;
};

/** A field button that opens a bottom sheet with a scrollable list. For long option lists. */
export function PickerSheet({ label, placeholder, options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const current = options.find((o) => o.value === value);

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

      {open && (
        <div className={styles.backdrop} onClick={() => setOpen(false)}>
          <div className={styles.sheet} role="dialog" aria-label={label} onClick={(e) => e.stopPropagation()}>
            <div className={styles.handle} />
            <h2 className={styles.title}>{label}</h2>
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
                      setOpen(false);
                    }}
                  >
                    <span>{o.label}</span>
                    {o.value === value && <Check size={20} className={styles.check} aria-hidden />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
