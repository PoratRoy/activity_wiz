import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar/TopBar";
import { DraftView } from "./DraftView";

export const metadata: Metadata = { title: "הפעולה", robots: { index: false } };

export default function DraftPage() {
  return (
    <>
      <TopBar title="הפעולה" back="/create/activity" />
      <DraftView />
    </>
  );
}
