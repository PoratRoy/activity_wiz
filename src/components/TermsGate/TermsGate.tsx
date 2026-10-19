"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/Button/Button";
import { Modal } from "@/components/Modal/Modal";
import { TERMS_TITLE } from "@/data/terms";
import { TermsText } from "./TermsText";
import styles from "./TermsGate.module.css";

const KEY = "aw.termsAccepted";

/**
 * First-visit terms popup (from the old site's TSCs). Shown until accepted; acceptance is kept in
 * this browser. Not shown on the terms page itself.
 */
export function TermsGate() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setOpen(true);
    } catch {
      // Storage blocked: don't nag on every page.
    }
  }, []);

  if (!open || pathname === "/terms") return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, new Date().toISOString());
    } catch {}
    setOpen(false);
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
