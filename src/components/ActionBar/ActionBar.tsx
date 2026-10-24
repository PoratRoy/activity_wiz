"use client";

import { Copy, Share2 } from "lucide-react";
import { createContext, useContext, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useToast } from "@/components/Toast/Toast";
import { toPlainText } from "@/lib/markdown/toPlain";
import { toWhatsApp } from "@/lib/markdown/toWhatsApp";
import styles from "./ActionBar.module.css";

const CREDIT = "נוצר בעזרת:\nhttps://activitywiz.com";

/**
 * Where a page's top bar shows the compact copy of the actions once the title block scrolls under it
 * (provided by `ActivityPage`). Without it the actions only show in the title block.
 */
export const ActionSlotContext = createContext<HTMLElement | null>(null);

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
  ariaLabel,
  onClick,
  accent,
  danger,
  disabled,
}: {
  icon: ReactNode;
  label: string;
  /** Fuller name for assistive tech when the visible label is shortened. */
  ariaLabel?: string;
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
      aria-label={ariaLabel}
      data-variant={accent ? "accent" : danger ? "danger" : undefined}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

/**
 * The activity's actions under its title: share (labeled, butter yellow), copy, then the page-specific
 * actions (`children`) as round icon buttons. The same actions are also rendered compact into the top bar's
 * `ActionSlotContext` slot, which the page reveals once this row scrolls under the bar.
 */
export function ActionBar({ title, bodyMd, children }: { title: string; bodyMd: string; children?: ReactNode }) {
  const toast = useToast();
  const slot = useContext(ActionSlotContext);

  const onCopy = async () => {
    toast((await copyText(`${toPlainText(title, bodyMd)}\n\n${CREDIT}`)) ? "הועתק!" : "לא הצלחנו להעתיק");
  };

  const onShare = async () => {
    const text = `${toWhatsApp(title, bodyMd)}\n\n${CREDIT}`;
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

  const actions = (
    <>
      <ActionButton icon={<Share2 size={19} aria-hidden />} label="שיתוף" onClick={onShare} accent />
      <ActionButton icon={<Copy size={19} aria-hidden />} label="העתקה" onClick={onCopy} />
      {children}
    </>
  );

  return (
    <>
      <div className={styles.row} data-actions>
        {actions}
      </div>
      {slot && createPortal(<div className={`${styles.row} ${styles.compact}`}>{actions}</div>, slot)}
    </>
  );
}
