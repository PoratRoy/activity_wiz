"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import styles from "./AdBar.module.css";

const AD_CLIENT = "ca-pub-9858822058074702";
/** The old app's display unit (its desktop sidebar); a fixed-size display unit fills a 320 × 50 bar. */
const AD_BAR_SLOT = "6260212628";
/**
 * AdSense only serves on the approved domain, so real ads run there and everywhere else (workers.dev,
 * localhost) keeps the placeholder. Ads start by themselves once activitywiz.com points at this app.
 */
const AD_HOSTS = ["activitywiz.com", "www.activitywiz.com"];

/** Pages that never show the ad bar: landing, terms, FAQ, admin and the generating screen. */
const EXCLUDED = ["/terms", "/faq", "/admin", "/create/generating"];

function showsAdBar(pathname: string) {
  return pathname !== "/" && !EXCLUDED.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * Fixed ad directly above the bottom tabs, sized for the smallest standard mobile banner
 * (320 × 50). While it is mounted, `--adbar-h` reserves its height for content, sticky footers
 * and toasts.
 */
export function AdBar() {
  const pathname = usePathname();
  // Decided after mount: the server render can't know the host the browser used.
  const [live, setLive] = useState(false);
  useEffect(() => setLive(AD_HOSTS.includes(window.location.hostname)), []);

  if (!showsAdBar(pathname)) return null;
  return (
    <div className={styles.bar} data-ad-bar aria-hidden={!live}>
      {live ? (
        <>
          <Script
            id="adsbygoogle"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
          {/* A new unit per page, as on the old site, where each page rendered its own ad. */}
          <AdUnit key={pathname} />
        </>
      ) : (
        <span className={styles.label}>פרסומת</span>
      )}
    </div>
  );
}

function AdUnit() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // A blocked or failed AdSense script leaves the bar empty.
    }
  }, []);
  return (
    <ins
      className={`adsbygoogle ${styles.unit}`}
      data-ad-client={AD_CLIENT}
      data-ad-slot={AD_BAR_SLOT}
    />
  );
}
