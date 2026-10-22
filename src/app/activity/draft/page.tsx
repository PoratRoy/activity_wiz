import type { Metadata } from "next";
import { Suspense } from "react";
import { DraftView } from "./DraftView";

export const metadata: Metadata = { title: "הפעולה", robots: { index: false } };

export default function DraftPage() {
  // DraftView renders the top bar, so the saving screen can go without it.
  return (
    <Suspense>
      <DraftView />
    </Suspense>
  );
}
