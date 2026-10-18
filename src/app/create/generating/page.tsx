import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar/TopBar";
import { PendingRequest } from "./PendingRequest";

// Placeholder until step 8 (AI generation): shows the request that will be sent.
export const metadata: Metadata = { title: "יוצרים פעולה", robots: { index: false } };

export default function GeneratingPage() {
  return (
    <>
      <TopBar title="יוצרים פעולה" back="/create/activity" />
      <PendingRequest />
    </>
  );
}
