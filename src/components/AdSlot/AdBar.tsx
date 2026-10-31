"use client";

import { usePathname } from "next/navigation";
import Script from "next/script";
import { useEffect, useState } from "react";
import styles from "./AdBar.module.css";

const AD_CLIENT = "ca-pub-9858822058074702";
/**
 * One AdSense display unit per area, reusing the old app's units so AdSense reports earnings per area as
 * before. A fixed-size display unit fills the 320 × 50 bar. Pages without their own unit use the old
 * desktop sidebar unit.
 */
const AD_SLOTS = {
  library: "8738367503", // activityStaticActivities: library, «הכי פופולרי», categories
  libraryActivity: "5290759275", // activityDetails: a public activity in the library
  create: "9038432592", // activityBuild: the create forms
  generated: "7241259487", // activityAiActivity: a generated (or saved) activity
  my: "5975540586", // activityMyActivities
  fallback: "6260212628", // Desktop_Sidebar: contact and anything else
} as const;

function adSlotFor(pathname: string): string {
  const [first, , third] = pathname.split("/").filter(Boolean);
  if (first === "library") return third ? AD_SLOTS.libraryActivity : AD_SLOTS.library;
  if (first === "create") return AD_SLOTS.create;
  if (first === "activity") return AD_SLOTS.generated;
  if (first === "my") return AD_SLOTS.my;
  return AD_SLOTS.fallback;
}
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
          <AdUnit key={pathname} slot={adSlotFor(pathname)} />
        </>
      ) : (
        <span className={styles.label}>פרסומת</span>
      )}
    </div>
  );
}

function AdUnit({ slot }: { slot: string }) {
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
      data-ad-slot={slot}
    />
  );
}
