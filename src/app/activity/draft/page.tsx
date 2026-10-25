import type { Metadata } from "next";
import { Suspense } from "react";
import { ActivitySkeleton } from "@/components/Skeleton/Skeleton";
import { DraftView } from "./DraftView";

export const metadata: Metadata = { title: "הפעולה", robots: { index: false } };

export default async function DraftPage({ searchParams }: { searchParams: Promise<{ claim?: string }> }) {
  // DraftView renders the activity page (with its masthead) or the full-screen saving view. Until it can read the
  // draft, the page's empty frame; back from sign-in to save (?claim=1) nothing, so the saving view comes first.
  const claiming = (await searchParams).claim === "1";
  return (
    <Suspense fallback={claiming ? null : <ActivitySkeleton label="הפעולה" fallback="/create/activity" />}>
      <DraftView />
    </Suspense>
  );
}
