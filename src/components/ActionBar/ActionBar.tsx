"use client";

import { Copy, Share2 } from "lucide-react";
import type { ReactNode } from "react";
import { useToast } from "@/components/Toast/Toast";
import { toPlainText } from "@/lib/markdown/toPlain";
import { toWhatsApp } from "@/lib/markdown/toWhatsApp";
import styles from "./ActionBar.module.css";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / non-secure contexts.
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export function ActionButton({
  icon,
  label,
  onClick,
  accent,
  danger,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  accent?: boolean;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={`${styles.action} ${accent ? styles.accent : ""} ${danger ? styles.danger : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/** Sticky bar above the bottom tabs: copy + share, plus page-specific actions (`children`). */
export function ActionBar({ title, bodyMd, children }: { title: string; bodyMd: string; children?: ReactNode }) {
  const toast = useToast();

  const onCopy = async () => {
    toast((await copyText(toPlainText(title, bodyMd))) ? "הועתק!" : "לא הצלחנו להעתיק");
  };

  const onShare = async () => {
    const text = toWhatsApp(title, bodyMd, window.location.origin);
    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        return;
      } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") return; // user closed the sheet
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank", "noopener");
  };

  return (
    <div className={styles.bar}>
      <ActionButton icon={<Copy size={20} aria-hidden />} label="העתקה" onClick={onCopy} />
      <ActionButton icon={<Share2 size={20} aria-hidden />} label="שיתוף" onClick={onShare} accent />
      {children}
    </div>
  );
}
