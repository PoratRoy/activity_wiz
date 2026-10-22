"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { TERMS_TITLE } from "@/data/terms";
import { TermsText } from "./TermsText";
import styles from "./TermsGate.module.css";

const KEY = "aw.termsAccepted";
/** Fired on window when the terms are accepted, so popups waiting behind them (MessageGate) can open. */
export const TERMS_ACCEPTED_EVENT = "aw:terms-accepted";

/** Whether this browser accepted the terms. Blocked storage counts as accepted, like the gate itself. */
export function termsAccepted(): boolean {
  try {
    return !!localStorage.getItem(KEY);
  } catch {
    return true;
  }
}

/**
 * First-visit terms popup (from the old site's TSCs). Shown until accepted; acceptance is kept in
 * this browser. Not shown on the terms page itself.
 */
export function TermsGate() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Storage blocked counts as accepted: don't nag on every page.
    if (!termsAccepted()) setOpen(true);
  }, []);

  if (!open || pathname === "/terms") return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {}
    setOpen(false);
    window.dispatchEvent(new Event(TERMS_ACCEPTED_EVENT));
  };

  return (
    <Modal open blocking title={TERMS_TITLE}>
      <div className={styles.scroll}>
        <TermsText />
      </div>
      <Button onClick={accept}>אישור</Button>
    </Modal>
  );
}
