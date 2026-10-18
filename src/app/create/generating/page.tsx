import type { Metadata } from "next";
import { TopBar } from "@/components/TopBar/TopBar";
import { Generating } from "./Generating";

export const metadata: Metadata = { title: "יוצרים פעולה", robots: { index: false } };

export default function GeneratingPage() {
  return (
    <>
      <TopBar title="יוצרים פעולה" back="/create/activity" />
      <Generating />
    </>
  );
}
