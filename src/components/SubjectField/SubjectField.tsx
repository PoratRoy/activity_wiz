"use client";

import { Sparkles } from "lucide-react";
import { useRef, useState } from "react";
import { TextField } from "@/components/TextField/TextField";
import { useToast } from "@/components/Toast/Toast";
import { SUBJECT_MAX, type TypeKey } from "@/data/options";
import suggestions from "@/data/topic-suggestions.json";
import styles from "./SubjectField.module.css";

const LISTS = suggestions as Record<string, string[]>;

/** pointOfView has no list of its own and uses the content list. */
function listFor(type: TypeKey | null): string[] {
  if (!type) return LISTS.content;
  return LISTS[type] ?? LISTS.content;
}

export function SubjectField({
  value,
  onChange,
  type,
}: {
  value: string;
  onChange: (v: string) => void;
  type: TypeKey | null;
}) {
  const toast = useToast();
  const warned = useRef(false);
  const [spinning, setSpinning] = useState(false);

  const suggest = () => {
    const list = listFor(type).filter((t) => t !== value);
    onChange(list[Math.floor(Math.random() * list.length)]);
    setSpinning(true);
    setTimeout(() => setSpinning(false), 300);
  };

  return (
    <TextField
      id="subject"
      label="נושא"
      placeholder="על מה הפעולה?"
      value={value}
      autoComplete="off"
      onChange={(e) => {
        const next = e.target.value;
        if ([...next].length > SUBJECT_MAX) {
          if (!warned.current) toast(`נושא קצר, עד ${SUBJECT_MAX} תווים`);
          warned.current = true;
          return;
        }
        warned.current = false;
        onChange(next);
      }}
      endSlot={
        <button type="button" className={styles.magic} onClick={suggest} aria-label="הצעה לנושא">
          <Sparkles size={22} className={spinning ? styles.spin : undefined} aria-hidden />
        </button>
      }
    />
  );
}
