"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import styles from "./Collapsible.module.css";

/** Collapsed by default. Children stay mounted when closed so entered values are kept. */
export function Collapsible({ title, children }: { title: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);

  // Opening near the bottom of a form would otherwise leave the new fields below the fold.
  // Honors the wrapper's scroll-margin, so pages can keep it clear of sticky headers and footers.
  useEffect(() => {
    if (!open) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    wrap.current?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  }, [open]);

  return (
    <div ref={wrap} className={styles.wrap}>
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
