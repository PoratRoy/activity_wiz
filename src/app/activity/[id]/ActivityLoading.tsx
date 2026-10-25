"use client";

import { useState } from "react";
import { WaitScreen } from "@/app/create/generating/WaitScreen";
import { appMounted } from "@/components/AppShell/history";
import { ActivitySkeleton } from "@/components/Skeleton/Skeleton";
import { SkeletonExit } from "@/components/Transitions/Transitions";
import { AI_DISCLAIMER } from "@/lib/draft";
import { peekReveal } from "@/lib/reveal";

/**
 * While a saved activity loads: its empty frame, or, right after generating or saving it, the same wait screen with the
 * bar full, so the wait hands over to the finished page in one cross-fade instead of passing through a frame first.
 * (Browser storage is read only for in-app visits; a fresh load matches the server's HTML.)
 */
export function ActivityLoading() {
  const [from] = useState(() => (appMounted() ? peekReveal() : null));
  if (!from) return <ActivitySkeleton label="הפעולה" fallback="/my" />;
  return (
    <SkeletonExit>
      {from === "saving" ? (
        <WaitScreen label="שומרים את הפעולה" status="שומרים את הפעולה…" done />
      ) : (
        <WaitScreen label="יוצרים את הפעולה" note={AI_DISCLAIMER} done />
      )}
    </SkeletonExit>
  );
}
