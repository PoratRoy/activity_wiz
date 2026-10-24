"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { OptionSheet } from "@/components/PickerSheet/PickerSheet";
import type { TypeKey } from "@/data/options";
import styles from "../create.module.css";

/** Most leaders pick one of these two; when a movement has more than three types, the rest sit behind "עוד". */
const POPULAR: TypeKey[] = ["content", "playTime"];

type Props = {
  types: { key: TypeKey; label: string }[];
  value: string;
  onChange: (value: string) => void;
};

/** The activity type as one segmented row. A type picked from "עוד" takes that segment's place until changed. */
export function TypeSelect({ types, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const collapse = types.length > 3;
  const shown = collapse ? types.filter((t) => POPULAR.includes(t.key)) : types;
  const extra = collapse ? types.find((t) => t.key === value && !POPULAR.includes(t.key)) : undefined;

  return (
    <div className={styles.segment} role="radiogroup" aria-label="סוג" data-more={collapse || undefined}>
      {shown.map((t) => (
        <button key={t.key} type="button" role="radio" aria-checked={t.key === value} onClick={() => onChange(t.key)}>
          {t.label}
        </button>
      ))}
      {collapse && (
        <>
          <button
            type="button"
            className={styles.segmentMore}
            aria-haspopup="listbox"
            aria-expanded={open}
            data-on={extra ? true : undefined}
            onClick={() => setOpen(true)}
          >
            <span>{extra?.label ?? "עוד"}</span>
            <ChevronDown size={16} aria-hidden />
          </button>
          <OptionSheet
            open={open}
            onClose={() => setOpen(false)}
            label="סוג הפעולה"
            options={types.map((t) => ({ value: t.key, label: t.label }))}
            value={value}
            onChange={onChange}
            closeDelayMs={45}
          />
        </>
      )}
    </div>
  );
}
