"use client";

import { ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";
import styles from "./Collapsible.module.css";

/** Collapsed by default. Children stay mounted when closed so entered values are kept. */
export function Collapsible({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.wrap}>
      <button type="button" className={styles.header} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
        <span>{title}</span>
        <ChevronDown size={20} className={open ? styles.iconOpen : styles.icon} aria-hidden />
      </button>
      <div className={styles.body} hidden={!open}>
        {children}
      </div>
    </div>
  );
}
