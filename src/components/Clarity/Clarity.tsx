"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useViewer } from "@/components/AppShell/viewer";

// Microsoft Clarity project of activitywiz.com, the same one the old app used, so its history carries on.
// The ID is public (it is in every page's HTML), so it lives here rather than in a build-time variable.
const CLARITY_ID = "m184psh8kv";

type ClarityFn = ((...args: unknown[]) => void) & { q?: unknown[][] };
declare global {
  interface Window {
    clarity?: ClarityFn;
  }
}

/** Calls Clarity, queueing the call if the tag hasn't loaded yet (the snippet does the same). */
export function clarity(...args: unknown[]) {
  if (typeof window === "undefined") return;
  if (!window.clarity) {
    const queue: ClarityFn = (...a) => void (queue.q = queue.q ?? []).push(a);
    window.clarity = queue;
  }
  window.clarity(...args);
}

/** Loads Clarity on every page except /admin, and tags the session with role and movement (docs/analytics.md). */
export function Clarity({ movement }: { movement?: string | null }) {
  const viewer = useViewer();
  const isAdminPage = usePathname().startsWith("/admin");

  useEffect(() => {
    if (isAdminPage) return;
    clarity("set", "role", viewer.signedIn ? "user" : "guest");
    if (movement) clarity("set", "movement", movement);
  }, [isAdminPage, viewer.signedIn, movement]);

  // A page load that starts on /admin never loads the tag. Navigating from another page into /admin keeps the
  // tag that's already running; only the owner sees those pages.
  if (isAdminPage) return null;
  return (
    // Not id="clarity": an element id becomes a window property, which would shadow window.clarity.
    <Script id="clarity-tag" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","${CLARITY_ID}");`}
    </Script>
  );
}
