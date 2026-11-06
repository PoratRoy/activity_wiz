"use client";

import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useViewer } from "@/components/AppShell/viewer";
import { acceptedInThisBrowser, dismissNotice, noticeDismissed } from "./terms";
import styles from "./TermsNotice.module.css";

/** Pages without the notice: the terms themselves, admin, and the generating screen (no tabs there). */
const HIDDEN = ["/terms", "/admin", "/create/generating"];

/**
 * A slim card above the ad bar on a guest's first visits: browsing counts as agreeing (the terms say so), and the
 * explicit acceptance comes before the first generation (TermsConsent). «הבנתי» hides it for good in this browser.
 */
export function TermsNotice() {
  const pathname = usePathname();
  const { termsAccepted } = useViewer();
  // Read after mounting: the server can't see browser storage.
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(!termsAccepted && !acceptedInThisBrowser() && !noticeDismissed());
  }, [termsAccepted]);

  if (!show || HIDDEN.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return null;

  return (
    <div className={styles.notice} role="region" aria-label="תנאי שימוש" data-terms-notice>
      <ShieldCheck size={20} className={styles.icon} aria-hidden />
      <p className={styles.text}>
        בשימוש באתר אתם מסכימים ל<Link href="/terms">תנאי השירות ומדיניות הפרטיות</Link>
      </p>
      <button
        type="button"
        className={styles.ok}
        onClick={() => {
          dismissNotice();
          setShow(false);
        }}
      >
        הבנתי
      </button>
    </div>
  );
}
