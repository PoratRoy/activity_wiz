import type { Metadata } from "next";
import { Suspense } from "react";
import { DraftView } from "./DraftView";

export const metadata: Metadata = { title: "הפעולה", robots: { index: false } };

export default function DraftPage() {
  // DraftView renders the activity page (with its masthead) or the full-screen saving view.
  return (
    <Suspense>
      <DraftView />
    </Suspense>
  );
}
